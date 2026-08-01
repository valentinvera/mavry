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
import { env, getCorsOrigins } from "@mavry/env/api"
import { checkout, polar, portal } from "@polar-sh/better-auth"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { createPolarClient } from "./lib/payments"

const authSchema = {
  account,
  accountRelations,
  session,
  sessionRelations,
  user,
  userRelations,
  verification,
}

export function createAuth() {
  const db = createDb()

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",

      schema: authSchema,
    }),
    trustedOrigins: getCorsOrigins(),
    emailAndPassword: {
      enabled: true,
    },
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    advanced: {
      defaultCookieAttributes: {
        sameSite: "none",
        secure: true,
        httpOnly: true,
      },
    },
    plugins: env.POLAR_ACCESS_TOKEN
      ? [
          polar({
            client: createPolarClient(env.POLAR_ACCESS_TOKEN),
            createCustomerOnSignUp: true,
            enableCustomerPortal: true,
            use: [
              checkout({
                products: [
                  {
                    productId: "your-product-id",
                    slug: "pro",
                  },
                ],
                successUrl: env.POLAR_SUCCESS_URL,
                authenticatedUsersOnly: true,
              }),
              portal(),
            ],
          }),
        ]
      : [],
  })
}

export const auth = createAuth()
