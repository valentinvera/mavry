import { auth } from "@mavry/auth"
import type { INestApplication } from "@nestjs/common"
import { toNodeHandler } from "better-auth/node"
import type { Express } from "express"

const AUTH_ROUTE_PATTERN = /^\/api\/auth(?:\/.*)?$/

export type AuthNodeHandler = ReturnType<typeof toNodeHandler>

export const registerAuthRoute = (
  app: INestApplication,
  handler: AuthNodeHandler = toNodeHandler(auth)
): void => {
  const express: Express = app.getHttpAdapter().getInstance()

  express.all(AUTH_ROUTE_PATTERN, handler)
}
