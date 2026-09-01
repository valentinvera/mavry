import { env } from "@mavry/env/web"
import { polarClient } from "@polar-sh/better-auth/client"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: env.VITE_API_URL,
  plugins: [polarClient()],
})

export type AuthSession = typeof authClient.$Infer.Session
