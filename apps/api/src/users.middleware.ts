import { auth, createPasskeySignupContext } from "@mavry/auth"
import { db } from "@mavry/db"
import { user } from "@mavry/db/schema/auth"
import type { INestApplication } from "@nestjs/common"
import { fromNodeHeaders } from "better-auth/node"
import { eq } from "drizzle-orm"
import type { Express, Request, Response } from "express"
import { z } from "zod"

const USERS_ME_ROUTE = "/api/users/me"
const PASSKEY_SIGNUP_CONTEXT_ROUTE = "/api/users/passkey-signup-context"

const passkeySignupContextSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(320),
  name: z.string().trim().min(1).max(100),
})

export const registerUsersRoute = (app: INestApplication): void => {
  const express: Express = app.getHttpAdapter().getInstance()

  express.get(
    USERS_ME_ROUTE,
    async (request: Request, response: Response): Promise<void> => {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(request.headers),
      })

      if (!session) {
        response.status(401).json({ message: "Authentication required" })
        return
      }

      response.status(200).json({
        session: {
          expiresAt: session.session.expiresAt,
          id: session.session.id,
        },
        user: session.user,
      })
    }
  )

  express.post(
    PASSKEY_SIGNUP_CONTEXT_ROUTE,
    async (request: Request, response: Response): Promise<void> => {
      const input = passkeySignupContextSchema.safeParse(request.body)

      if (!input.success) {
        response.status(400).json({ message: "Invalid input" })
        return
      }

      const existingUser = await db.query.user.findFirst({
        columns: { id: true },
        where: eq(user.email, input.data.email),
      })

      if (existingUser) {
        response.status(409).json({
          message: "An account already exists for this email.",
        })
        return
      }

      response.status(200).json({
        context: createPasskeySignupContext(input.data),
      })
    }
  )
}
