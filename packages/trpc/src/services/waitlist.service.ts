import { WaitlistEmailService } from "@mavry/email"
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

      return { status: "joined", success: true }
    }

    const existingEntry = await this.store.findByEmail(input.email)

    if (!existingEntry || existingEntry.confirmedAt) {
      return { status: "already_joined", success: true }
    }

    const resendThreshold = createConfirmationResendThreshold(now)
    const wasConfirmationSentRecently =
      existingEntry.confirmationSentAt !== null &&
      existingEntry.confirmationSentAt > resendThreshold

    if (wasConfirmationSentRecently) {
      return { status: "already_joined", success: true }
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

      return { status: "joined", success: true }
    }

    return { status: "already_joined", success: true }
  }

  async confirm(token: string): Promise<ConfirmWaitlistOutput> {
    const tokenHash = hashWaitlistConfirmationToken(token)
    const entry = await this.store.findByTokenHash(tokenHash)

    if (!entry) {
      return { status: "invalid_or_expired", success: false }
    }

    if (entry.confirmedAt) {
      return { status: "already_confirmed", success: true }
    }

    if (
      !entry.confirmationExpiresAt ||
      entry.confirmationExpiresAt <= new Date()
    ) {
      return { status: "invalid_or_expired", success: false }
    }

    const didConfirm = await this.store.confirm({
      confirmationTokenHash: tokenHash,
      confirmedAt: new Date(),
      id: entry.id,
    })

    if (didConfirm) {
      return { status: "confirmed", success: true }
    }

    const concurrentlyConfirmedEntry = await this.store.findById(entry.id)

    if (concurrentlyConfirmedEntry?.confirmedAt) {
      return { status: "already_confirmed", success: true }
    }

    return { status: "invalid_or_expired", success: false }
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
      expirationHours: WAITLIST_CONFIRMATION_EXPIRATION_HOURS,
      idempotencyKey: `waitlist-confirmation/${id}/${tokenHash.slice(0, 16)}`,
      waitlistEntryId: id,
    })

    if (delivery.status === "failed") {
      throw new Error("Unable to send the waitlist confirmation email")
    }

    if (delivery.status === "skipped") {
      return
    }

    await this.store.markConfirmationSent({
      confirmationEmailId: delivery.providerMessageId,
      confirmationSentAt: new Date(),
      confirmationTokenHash: tokenHash,
      id,
    })
  }
}
