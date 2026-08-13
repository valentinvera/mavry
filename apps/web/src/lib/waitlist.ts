import {
  type JoinWaitlistInput,
  type JoinWaitlistOutput,
  joinWaitlistInputSchema,
} from "@mavry/trpc/contracts/waitlist"

const WAITLIST_SOURCE = "landing"

export type WaitlistSubmit = (
  input: JoinWaitlistInput
) => Promise<JoinWaitlistOutput>

export const validateWaitlistInput = (email: string) =>
  joinWaitlistInputSchema.safeParseAsync({
    email,
    source: WAITLIST_SOURCE,
  })
