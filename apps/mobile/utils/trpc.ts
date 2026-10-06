import { env } from "@mavry/env/mobile"
import type { AppRouter } from "@mavry/trpc/generated/server"
import { QueryClient } from "@tanstack/react-query"
import { createTRPCClient, httpBatchLink } from "@trpc/client"
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query"

import { authClient } from "@/lib/auth-client"

async function withAuthCookie(
  headers: HeadersInit | undefined
): Promise<Headers> {
  const nextHeaders = new Headers(headers)
  const cookie = await authClient.getCookie()

  if (cookie) {
    nextHeaders.set("cookie", cookie)
  }

  return nextHeaders
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
})

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      fetch: async (url, options) => {
        const headers = await withAuthCookie(options?.headers)
        return fetch(url, {
          ...options,
          credentials: "include",
          headers,
        })
      },
      url: `${env.EXPO_PUBLIC_API_URL}/api/trpc`,
    }),
  ],
})

export const trpc = createTRPCOptionsProxy({
  client: trpcClient,
  queryClient,
})
