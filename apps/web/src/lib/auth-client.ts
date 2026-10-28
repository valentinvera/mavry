import { passkeyClient } from "@better-auth/passkey/client"
import { env } from "@mavry/env/web"
import { polarClient } from "@polar-sh/better-auth/client"
import {
  emailOTPClient,
  magicLinkClient,
  twoFactorClient,
} from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: env.VITE_API_URL,
  fetchOptions: {
    credentials: "include",
  },
  plugins: [
    polarClient(),
    emailOTPClient(),
    magicLinkClient(),
    twoFactorClient({ twoFactorPage: "/two-factor" }),
    passkeyClient(),
  ],
})

export type AuthSession = typeof authClient.$Infer.Session

export const isCaptchaEnabled = Boolean(env.VITE_TURNSTILE_SITE_KEY)

export const captchaHeaders = (
  token: string | null | undefined
): { headers: Record<string, string> } | undefined =>
  token ? { headers: { "x-captcha-response": token } } : undefined
