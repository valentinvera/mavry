import { Inject, Injectable } from "@nestjs/common"
import type {
  ConfirmWaitlistOutput,
  JoinWaitlistInput,
  JoinWaitlistOutput,
  WaitlistConfirmedCountOutput,
} from "../contracts/waitlist"
import {
  WAITLIST_CONFIRMATION_EXPIRATION_HOURS,
  WAITLIST_CONFIRMATION_RESEND_COOLDOWN_MINUTES,
} from "./waitlist.constants"
import {
  createWaitlistConfirmationToken,
  hashWaitlistConfirmationToken,
} from "./waitlist-confirmation-token"
import { WaitlistEmailService } from "./waitlist-email.service"
import { WaitlistStore } from "./waitlist-store.service"

const MILLISECONDS_PER_HOUR = 60 * 60 * 1000
const MILLISECONDS_PER_MINUTE = 60 * 1000

interface PendingConfirmation {
  email: string
  id: string
  token: string
  tokenHash: string
}

const createConfirmationExpiration = (now: Date): Date =>
  new Date(
    now.getTime() +
      WAITLIST_CONFIRMATION_EXPIRATION_HOURS * MILLISECONDS_PER_HOUR
  )

const createConfirmationResendThreshold = (now: Date): Date =>
  new Date(
    now.getTime() -
      WAITLIST_CONFIRMATION_RESEND_COOLDOWN_MINUTES * MILLISECONDS_PER_MINUTE
  )

@Injectable()
export class WaitlistService {
  private readonly emailService: WaitlistEmailService
  private readonly store: WaitlistStore

  constructor(
    @Inject(WaitlistEmailService) emailService: WaitlistEmailService,
    @Inject(WaitlistStore) store: WaitlistStore
  ) {
    this.emailService = emailService
    this.store = store
  }

  async getConfirmedCount(): Promise<WaitlistConfirmedCountOutput> {
    return { count: await this.store.countConfirmed() }
  }

  async join(input: JoinWaitlistInput): Promise<JoinWaitlistOutput> {
    const now = new Date()
    const token = createWaitlistConfirmationToken()
    const tokenHash = hashWaitlistConfirmationToken(token)
    const confirmationExpiresAt = createConfirmationExpiration(now)

    const insertedEntry = await this.store.createPending({
      confirmationExpiresAt,
      confirmationTokenHash: tokenHash,
      waitlist: input,
    })

    if (insertedEntry) {
      await this.sendConfirmation({
        ...insertedEntry,
        token,
        tokenHash,
      })

      return { success: true, status: "joined" }
    }

    const existingEntry = await this.store.findByEmail(input.email)

    if (!existingEntry || existingEntry.confirmedAt) {
      return { success: true, status: "already_joined" }
    }

    const resendThreshold = createConfirmationResendThreshold(now)
    const wasConfirmationSentRecently =
      existingEntry.confirmationSentAt !== null &&
      existingEntry.confirmationSentAt > resendThreshold

    if (wasConfirmationSentRecently) {
      return { success: true, status: "already_joined" }
    }

    const refreshedEntry = await this.store.refreshPending({
      confirmationExpiresAt,
      confirmationTokenHash: tokenHash,
      currentTokenHash: existingEntry.confirmationTokenHash,
      id: existingEntry.id,
    })

    if (refreshedEntry) {
      await this.sendConfirmation({
        ...refreshedEntry,
        token,
        tokenHash,
      })

      return { success: true, status: "joined" }
    }

    return { success: true, status: "already_joined" }
  }

  async confirm(token: string): Promise<ConfirmWaitlistOutput> {
    const tokenHash = hashWaitlistConfirmationToken(token)
    const entry = await this.store.findByTokenHash(tokenHash)

    if (!entry) {
      return { success: false, status: "invalid_or_expired" }
    }

    if (entry.confirmedAt) {
      return { success: true, status: "already_confirmed" }
    }

    if (
      !entry.confirmationExpiresAt ||
      entry.confirmationExpiresAt <= new Date()
    ) {
      return { success: false, status: "invalid_or_expired" }
    }

    const didConfirm = await this.store.confirm({
      confirmationTokenHash: tokenHash,
      confirmedAt: new Date(),
      id: entry.id,
    })

    if (didConfirm) {
      return { success: true, status: "confirmed" }
    }

    const concurrentlyConfirmedEntry = await this.store.findById(entry.id)

    if (concurrentlyConfirmedEntry?.confirmedAt) {
      return { success: true, status: "already_confirmed" }
    }

    return { success: false, status: "invalid_or_expired" }
  }

  private async sendConfirmation({
    email,
    id,
    token,
    tokenHash,
  }: PendingConfirmation): Promise<void> {
    const delivery = await this.emailService.sendWaitlistConfirmationEmail({
      confirmationToken: token,
      email,
      idempotencyKey: `waitlist-confirmation-${id}-${tokenHash.slice(0, 16)}`,
    })

    if (delivery.status !== "sent") {
      throw new Error("Unable to send the waitlist confirmation email")
    }

    await this.store.markConfirmationSent({
      confirmationSentAt: new Date(),
      confirmationTokenHash: tokenHash,
      id,
    })
  }
}
