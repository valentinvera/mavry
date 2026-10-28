import "dotenv/config"
import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
  emptyStringAsUndefined: true,
  runtimeEnv: process.env,
  server: {
    AUTH_EMAIL_PROVIDER: z.enum(["noop", "resend"]).default("noop"),
    AUTH_FROM_EMAIL: z.string().trim().email().max(320).optional(),
    AUTH_REPLY_TO_EMAIL: z.string().trim().email().max(320).optional(),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    CORS_ORIGIN: z.string().min(1),
    DATABASE_URL: z.string().min(1),
    GITHUB_CLIENT_ID: z.string().trim().min(1).optional(),
    GITHUB_CLIENT_SECRET: z.string().trim().min(1).optional(),
    GOOGLE_CLIENT_ID: z.string().trim().min(1).optional(),
    GOOGLE_CLIENT_SECRET: z.string().trim().min(1).optional(),
    HOST: z.string().min(1).default("0.0.0.0"),
    PASSKEY_RP_ID: z.string().trim().min(1).optional(),
    PASSKEY_RP_NAME: z.string().trim().min(1).default("Mavry"),
    POLAR_ACCESS_TOKEN: z.string().min(1).optional(),
    POLAR_SUCCESS_URL: z.url(),
    PORT: z.coerce.number().int().positive(),
    RESEND_API_KEY: z.string().trim().startsWith("re_").optional(),
    TRUSTED_ORIGINS: z.string().trim().optional(),
    TRUSTED_PROXIES: z.string().trim().optional(),
    TURNSTILE_SECRET_KEY: z.string().trim().min(1).optional(),
    WAITLIST_CONFIRMATION_REDIRECT_URL: z.url(),
    WAITLIST_CONFIRMATION_URL: z.url().optional(),
    WAITLIST_EMAIL_PROVIDER: z.enum(["noop", "resend"]).default("noop"),
    WAITLIST_FROM_EMAIL: z.string().trim().email().max(320).optional(),
    WAITLIST_REPLY_TO_EMAIL: z.string().trim().email().max(320).optional(),
  },
})

export function getCorsOrigins(): string[] {
  return env.CORS_ORIGIN.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
}
