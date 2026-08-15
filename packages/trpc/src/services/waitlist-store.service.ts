import { db } from "@mavry/db"
import { waitlistEntry } from "@mavry/db/schema/waitlist"
import { Injectable } from "@nestjs/common"
import { and, count, eq, isNotNull, isNull } from "drizzle-orm"
import type { JoinWaitlistInput } from "../contracts/waitlist"

export interface WaitlistEntryConfirmationState {
  confirmationExpiresAt: Date | null
  confirmationSentAt: Date | null
  confirmationTokenHash: string | null
  confirmedAt: Date | null
  email: string
  id: string
}

interface CreatePendingWaitlistEntryInput {
  confirmationExpiresAt: Date
  confirmationTokenHash: string
  waitlist: JoinWaitlistInput
}

interface RefreshPendingWaitlistEntryInput {
  confirmationExpiresAt: Date
  confirmationTokenHash: string
  currentTokenHash: string | null
  id: string
}

interface MarkConfirmationSentInput {
  confirmationSentAt: Date
  confirmationTokenHash: string
  id: string
}

interface ConfirmWaitlistEntryInput {
  confirmationTokenHash: string
  confirmedAt: Date
  id: string
}

type WaitlistEntryIdentity = Pick<
  WaitlistEntryConfirmationState,
  "email" | "id"
>

@Injectable()
export class WaitlistStore {
  async countConfirmed(): Promise<number> {
    const confirmedCounts = await db
      .select({ value: count() })
      .from(waitlistEntry)
      .where(isNotNull(waitlistEntry.confirmedAt))

    return confirmedCounts[0]?.value ?? 0
  }

  async createPending({
    confirmationExpiresAt,
    confirmationTokenHash,
    waitlist,
  }: CreatePendingWaitlistEntryInput): Promise<WaitlistEntryIdentity | null> {
    const insertedEntries = await db
      .insert(waitlistEntry)
      .values({
        ...waitlist,
        confirmationExpiresAt,
        confirmationTokenHash,
      })
      .onConflictDoNothing({ target: waitlistEntry.email })
      .returning({ email: waitlistEntry.email, id: waitlistEntry.id })

    return insertedEntries[0] ?? null
  }

  async findByEmail(
    email: string
  ): Promise<WaitlistEntryConfirmationState | null> {
    const entry = await db.query.waitlistEntry.findFirst({
      columns: {
        confirmationExpiresAt: true,
        confirmationSentAt: true,
        confirmationTokenHash: true,
        confirmedAt: true,
        email: true,
        id: true,
      },
      where: eq(waitlistEntry.email, email),
    })

    return entry ?? null
  }

  async refreshPending({
    confirmationExpiresAt,
    confirmationTokenHash,
    currentTokenHash,
    id,
  }: RefreshPendingWaitlistEntryInput): Promise<WaitlistEntryIdentity | null> {
    const currentTokenCondition = currentTokenHash
      ? eq(waitlistEntry.confirmationTokenHash, currentTokenHash)
      : isNull(waitlistEntry.confirmationTokenHash)

    const refreshedEntries = await db
      .update(waitlistEntry)
      .set({
        confirmationExpiresAt,
        confirmationSentAt: null,
        confirmationTokenHash,
      })
      .where(
        and(
          eq(waitlistEntry.id, id),
          currentTokenCondition,
          isNull(waitlistEntry.confirmedAt)
        )
      )
      .returning({ email: waitlistEntry.email, id: waitlistEntry.id })

    return refreshedEntries[0] ?? null
  }

  async markConfirmationSent({
    confirmationSentAt,
    confirmationTokenHash,
    id,
  }: MarkConfirmationSentInput): Promise<void> {
    await db
      .update(waitlistEntry)
      .set({ confirmationSentAt })
      .where(
        and(
          eq(waitlistEntry.id, id),
          eq(waitlistEntry.confirmationTokenHash, confirmationTokenHash),
          isNull(waitlistEntry.confirmedAt)
        )
      )
  }

  async findByTokenHash(
    confirmationTokenHash: string
  ): Promise<WaitlistEntryConfirmationState | null> {
    const entry = await db.query.waitlistEntry.findFirst({
      columns: {
        confirmationExpiresAt: true,
        confirmationSentAt: true,
        confirmationTokenHash: true,
        confirmedAt: true,
        email: true,
        id: true,
      },
      where: and(
        eq(waitlistEntry.confirmationTokenHash, confirmationTokenHash),
        isNull(waitlistEntry.confirmedAt)
      ),
    })

    return entry ?? null
  }

  async confirm({
    confirmationTokenHash,
    confirmedAt,
    id,
  }: ConfirmWaitlistEntryInput): Promise<boolean> {
    const confirmedEntries = await db
      .update(waitlistEntry)
      .set({
        confirmationExpiresAt: null,
        confirmationTokenHash: null,
        confirmedAt,
      })
      .where(
        and(
          eq(waitlistEntry.id, id),
          eq(waitlistEntry.confirmationTokenHash, confirmationTokenHash),
          isNull(waitlistEntry.confirmedAt)
        )
      )
      .returning({ id: waitlistEntry.id })

    return confirmedEntries.length > 0
  }

  async findById(id: string): Promise<WaitlistEntryConfirmationState | null> {
    const entry = await db.query.waitlistEntry.findFirst({
      columns: {
        confirmationExpiresAt: true,
        confirmationSentAt: true,
        confirmationTokenHash: true,
        confirmedAt: true,
        email: true,
        id: true,
      },
      where: eq(waitlistEntry.id, id),
    })

    return entry ?? null
  }
}
