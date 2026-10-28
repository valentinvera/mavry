import { expo } from "@better-auth/expo"
import { passkey } from "@better-auth/passkey"
import { createDb } from "@mavry/db"
import {
  account,
  accountRelations,
  passkeyRelations,
  passkey as passkeyTable,
  session,
  sessionRelations,
  twoFactorRelations,
  twoFactor as twoFactorTable,
  user,
  userRelations,
  verification,
} from "@mavry/db/schema/auth"
import { createAuthEmailService } from "@mavry/email"
import { env } from "@mavry/env/api"
import { Logger } from "@nestjs/common"
import { checkout, polar, portal } from "@polar-sh/better-auth"
import { type BetterAuthPlugin, betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { APIError } from "better-auth/api"
import { captcha } from "better-auth/plugins"
import { emailOTP } from "better-auth/plugins/email-otp"
import { magicLink } from "better-auth/plugins/magic-link"
import { twoFactor } from "better-auth/plugins/two-factor"
import { verifyPasskeySignupContext } from "./lib/passkey-signup"
import { createPolarClient } from "./lib/payments"

const MOBILE_AUTH_ORIGIN = "mavry://"
const AUTH_OTP_EXPIRES_IN_SECONDS = 300
const MAGIC_LINK_EXPIRES_IN_SECONDS = 300
const PASSWORD_RESET_EXPIRES_IN_SECONDS = 3600

const authLogger = new Logger("BetterAuth")
const authEmailService = createAuthEmailService()

const schedule = (label: string, task: Promise<unknown>): Promise<void> => {
  task.catch((error: unknown) => {
    authLogger.error(
      `${label} failed: ${error instanceof Error ? error.message : String(error)}`
    )
  })

  return Promise.resolve()
}

const getAuthTrustedOrigins = (): string[] => {
  const extraOrigins = (env.TRUSTED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)

  return [
    ...new Set([
      ...env.CORS_ORIGIN.split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
      ...extraOrigins,
      MOBILE_AUTH_ORIGIN,
    ]),
  ]
}

const getHttpTrustedOrigins = (): string[] =>
  getAuthTrustedOrigins().filter((origin) => origin.startsWith("http"))

const getTrustedProxies = (): string[] =>
  (env.TRUSTED_PROXIES ?? "")
    .split(",")
    .map((proxy) => proxy.trim())
    .filter(Boolean)

const authSchema = {
  account,
  accountRelations,
  passkey: passkeyTable,
  passkeyRelations,
  session,
  sessionRelations,
  twoFactor: twoFactorTable,
  twoFactorRelations,
  user,
  userRelations,
  verification,
}

const getSocialProviders = () => {
  const googleIsConfigured = Boolean(
    env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
  )
  const githubIsConfigured = Boolean(
    env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET
  )
  const hasPartialGoogleConfiguration =
    Boolean(env.GOOGLE_CLIENT_ID) !== Boolean(env.GOOGLE_CLIENT_SECRET)
  const hasPartialGithubConfiguration =
    Boolean(env.GITHUB_CLIENT_ID) !== Boolean(env.GITHUB_CLIENT_SECRET)

  if (hasPartialGoogleConfiguration) {
    throw new Error(
      "Google auth requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET"
    )
  }

  if (hasPartialGithubConfiguration) {
    throw new Error(
      "GitHub auth requires GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET"
    )
  }

  return {
    ...(githubIsConfigured
      ? {
          github: {
            clientId: env.GITHUB_CLIENT_ID ?? "",
            clientSecret: env.GITHUB_CLIENT_SECRET ?? "",
          },
        }
      : {}),
    ...(googleIsConfigured
      ? {
          google: {
            clientId: env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: env.GOOGLE_CLIENT_SECRET ?? "",
          },
        }
      : {}),
  }
}

const getPasskeyPlugin = (): BetterAuthPlugin =>
  passkey({
    origin: getHttpTrustedOrigins(),
    registration: {
      requireSession: false,
      async resolveUser({ context, ctx }) {
        const payload = verifyPasskeySignupContext(context)

        if (!payload) {
          throw new APIError("BAD_REQUEST", {
            message: "Invalid or expired passkey sign-up context",
          })
        }

        const existing = await ctx.context.internalAdapter.findUserByEmail(
          payload.email
        )

        if (existing) {
          return { id: existing.user.id, name: existing.user.name }
        }

        const created = await ctx.context.internalAdapter.createUser(
          {
            email: payload.email,
            emailVerified: true,
            name: payload.name,
          },
          { method: "passkey" }
        )

        return { id: created.id, name: created.name }
      },
    },
    rpID: env.PASSKEY_RP_ID ?? new URL(env.BETTER_AUTH_URL).hostname,
    rpName: env.PASSKEY_RP_NAME,
  })

const CAPTCHA_ENDPOINTS = [
  "/email-otp/request-password-reset",
  "/email-otp/reset-password",
  "/email-otp/send-verification-otp",
  "/sign-in/email",
  "/sign-in/magic-link",
  "/sign-up/email",
]

const getCaptchaPlugin = (): BetterAuthPlugin[] =>
  env.TURNSTILE_SECRET_KEY
    ? [
        captcha({
          endpoints: CAPTCHA_ENDPOINTS,
          provider: "cloudflare-turnstile",
          secretKey: env.TURNSTILE_SECRET_KEY,
        }),
      ]
    : []

const getAuthPlugins = (): BetterAuthPlugin[] => [
  expo(),
  emailOTP({
    allowedAttempts: 5,
    changeEmail: {
      enabled: true,
    },
    expiresIn: AUTH_OTP_EXPIRES_IN_SECONDS,
    overrideDefaultEmailVerification: true,
    sendVerificationOTP({ email, otp, type }) {
      return schedule(
        `auth OTP email (${type})`,
        authEmailService.sendOtp({
          email,
          expiresInMinutes: AUTH_OTP_EXPIRES_IN_SECONDS / 60,
          otp,
          purpose: type,
        })
      )
    },
  }),
  magicLink({
    expiresIn: MAGIC_LINK_EXPIRES_IN_SECONDS,
    sendMagicLink({ email, url }) {
      return schedule(
        "auth magic link email",
        authEmailService.sendLink({
          email,
          expiresInMinutes: MAGIC_LINK_EXPIRES_IN_SECONDS / 60,
          purpose: "magic-link",
          url,
        })
      )
    },
  }),
  twoFactor({ issuer: "Mavry" }),
  getPasskeyPlugin(),
  ...getCaptchaPlugin(),
  ...(env.POLAR_ACCESS_TOKEN
    ? [
        polar({
          client: createPolarClient(env.POLAR_ACCESS_TOKEN),
          // Billing is out of MVP scope. Keeping this false prevents Polar
          // customer creation from failing sign-up (for example with a 409
          // CONFLICT when a customer already exists for the same email).
          createCustomerOnSignUp: false,
          enableCustomerPortal: true,
          use: [
            checkout({
              authenticatedUsersOnly: true,
              products: [
                {
                  productId: "your-product-id",
                  slug: "pro",
                },
              ],
              successUrl: env.POLAR_SUCCESS_URL,
            }),
            portal(),
          ],
        }),
      ]
    : []),
]

export function createAuth() {
  const db = createDb()
  const secureCookiesAreRequired =
    new URL(env.BETTER_AUTH_URL).protocol === "https:"

  return betterAuth({
    account: {
      encryptOAuthTokens: true,
    },
    advanced: {
      defaultCookieAttributes: {
        httpOnly: true,
        sameSite: secureCookiesAreRequired ? "none" : "lax",
        secure: secureCookiesAreRequired,
      },
      ipAddress: {
        ipAddressHeaders: ["x-forwarded-for", "x-real-ip"],
        trustedProxies: getTrustedProxies(),
      },
    },
    appName: "Mavry",
    baseURL: env.BETTER_AUTH_URL,
    database: drizzleAdapter(db, {
      provider: "pg",

      schema: authSchema,
    }),
    emailAndPassword: {
      enabled: true,
      maxPasswordLength: 128,
      minPasswordLength: 8,
      resetPasswordTokenExpiresIn: PASSWORD_RESET_EXPIRES_IN_SECONDS,
      sendResetPassword({ url, user: accountUser }) {
        return schedule(
          "auth password reset email",
          authEmailService.sendLink({
            email: accountUser.email,
            expiresInMinutes: PASSWORD_RESET_EXPIRES_IN_SECONDS / 60,
            purpose: "password-reset",
            url,
          })
        )
      },
    },
    emailVerification: {
      autoSignInAfterVerification: true,
      sendOnSignUp: true,
    },
    plugins: getAuthPlugins(),
    rateLimit: {
      customRules: {
        "/ok": false,
      },
      enabled: true,
      storage: "memory",
    },
    secret: env.BETTER_AUTH_SECRET,
    socialProviders: getSocialProviders(),
    trustedOrigins: getAuthTrustedOrigins(),
    user: {
      changeEmail: {
        enabled: true,
      },
    },
    verification: {
      storeIdentifier: "hashed",
    },
  })
}

// biome-ignore lint/performance/noBarrelFile: This file is the public package entrypoint.
export { createPasskeySignupContext } from "./lib/passkey-signup"
export const auth = createAuth()
