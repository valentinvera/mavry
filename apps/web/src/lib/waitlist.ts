import {
  type JoinWaitlistInput,
  type JoinWaitlistOutput,
  joinWaitlistInputSchema,
} from "@mavry/trpc/contracts/waitlist"
import type { AppRouter } from "@mavry/trpc/generated/server"
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query"

const WAITLIST_SOURCE = "landing"

export type WaitlistSubmit = (
  input: JoinWaitlistInput
) => Promise<JoinWaitlistOutput>

export const getWaitlistConfirmedCountQueryOptions = (
  trpc: TRPCOptionsProxy<AppRouter>
) => ({
  ...trpc.waitlist.confirmedCount.queryOptions(),
  meta: { suppressGlobalError: true },
  retry: false,
  staleTime: 0,
})

export const validateWaitlistInput = (email: string) =>
  joinWaitlistInputSchema.safeParse({
    email,
    source: WAITLIST_SOURCE,
  })
