import "dotenv/config"
import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    POLAR_ACCESS_TOKEN: z.string().min(1).optional(),
    POLAR_SUCCESS_URL: z.url(),
    CORS_ORIGIN: z.string().min(1),
    HOST: z.string().min(1).default("0.0.0.0"),
    PORT: z.coerce.number().int().positive(),
    PLUNK_SECRET_KEY: z.string().trim().startsWith("sk_").optional(),
    WAITLIST_CONFIRMATION_REDIRECT_URL: z.url(),
    WAITLIST_CONFIRMATION_URL: z.url().optional(),
    WAITLIST_EMAIL_PROVIDER: z.enum(["noop", "plunk"]).default("noop"),
    WAITLIST_FROM_EMAIL: z.string().trim().email().max(320).optional(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})

export function getCorsOrigins(): string[] {
  return env.CORS_ORIGIN.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
}
