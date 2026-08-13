import { z } from "zod"

const MAX_EMAIL_LENGTH = 320
const MAX_SOURCE_LENGTH = 100

export const joinWaitlistInputSchema = z.object({
  email: z.string().trim().toLowerCase().max(MAX_EMAIL_LENGTH).email(),
  source: z.string().trim().min(1).max(MAX_SOURCE_LENGTH).optional(),
})

export const joinWaitlistOutputSchema = z.object({
  success: z.literal(true),
  status: z.enum(["joined", "already_joined"]),
})

export type JoinWaitlistInput = z.infer<typeof joinWaitlistInputSchema>
export type JoinWaitlistOutput = z.infer<typeof joinWaitlistOutputSchema>
