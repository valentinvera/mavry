import { expo } from "@better-auth/expo"
import { createDb } from "@mavry/db"
import {
  account,
  accountRelations,
  session,
  sessionRelations,
  user,
  userRelations,
  verification,
} from "@mavry/db/schema/auth"
import { env } from "@mavry/env/api"
import { checkout, polar, portal } from "@polar-sh/better-auth"
import { type BetterAuthPlugin, betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { createPolarClient } from "./lib/payments"

const MOBILE_AUTH_ORIGIN = "mavry://"

const getAuthTrustedOrigins = (): string[] => [
  ...new Set([
    ...env.CORS_ORIGIN.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
    MOBILE_AUTH_ORIGIN,
  ]),
]

const authSchema = {
  account,
  accountRelations,
  session,
  sessionRelations,
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

const getAuthPlugins = (): BetterAuthPlugin[] => [
  expo(),
  ...(env.POLAR_ACCESS_TOKEN
    ? [
        polar({
          client: createPolarClient(env.POLAR_ACCESS_TOKEN),
          createCustomerOnSignUp: true,
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
    },
    appName: "Mavry",
    baseURL: env.BETTER_AUTH_URL,
    database: drizzleAdapter(db, {
      provider: "pg",

      schema: authSchema,
    }),
    emailAndPassword: {
      enabled: true,
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
    verification: {
      storeIdentifier: "hashed",
    },
  })
}

export const auth = createAuth()
