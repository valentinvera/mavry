import {
  WAITLIST_EMAIL_MAX_LENGTH,
  WAITLIST_SOURCE_MAX_LENGTH,
} from "@mavry/db/schema/waitlist.constants"
import { z } from "zod"

const MAX_RESULT_RECEIPT_LENGTH = 1024
const MAX_TOKEN_LENGTH = 200
const MIN_TOKEN_LENGTH = 32

export const waitlistConfirmationStatusSchema = z.enum([
  "confirmed",
  "already_confirmed",
  "invalid_or_expired",
])

export const joinWaitlistInputSchema = z.object({
  email: z.string().trim().toLowerCase().max(WAITLIST_EMAIL_MAX_LENGTH).email(),
  source: z.string().trim().min(1).max(WAITLIST_SOURCE_MAX_LENGTH).optional(),
})

export const joinWaitlistOutputSchema = z.object({
  success: z.literal(true),
  status: z.enum(["joined", "already_joined"]),
})

export const waitlistConfirmedCountOutputSchema = z.object({
  count: z.number().int().nonnegative(),
})

export const confirmWaitlistInputSchema = z.object({
  token: z.string().min(MIN_TOKEN_LENGTH).max(MAX_TOKEN_LENGTH),
})

export const confirmWaitlistOutputSchema = z.object({
  success: z.boolean(),
  status: waitlistConfirmationStatusSchema,
})

export const verifyWaitlistConfirmationResultInputSchema = z.object({
  receipt: z.string().min(1).max(MAX_RESULT_RECEIPT_LENGTH),
})

export const verifyWaitlistConfirmationResultOutputSchema = z.object({
  status: waitlistConfirmationStatusSchema,
})

export type JoinWaitlistInput = z.infer<typeof joinWaitlistInputSchema>
export type JoinWaitlistOutput = z.infer<typeof joinWaitlistOutputSchema>
export type WaitlistConfirmedCountOutput = z.infer<
  typeof waitlistConfirmedCountOutputSchema
>
export type ConfirmWaitlistInput = z.infer<typeof confirmWaitlistInputSchema>
export type ConfirmWaitlistOutput = z.infer<typeof confirmWaitlistOutputSchema>
export type WaitlistConfirmationStatus = z.infer<
  typeof waitlistConfirmationStatusSchema
>
export type VerifyWaitlistConfirmationResultInput = z.infer<
  typeof verifyWaitlistConfirmationResultInputSchema
>
export type VerifyWaitlistConfirmationResultOutput = z.infer<
  typeof verifyWaitlistConfirmationResultOutputSchema
>
