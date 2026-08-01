import type { AppRouter } from "@mavry/trpc/generated/server"
import { createTRPCContext } from "@trpc/tanstack-react-query"

export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppRouter>()
