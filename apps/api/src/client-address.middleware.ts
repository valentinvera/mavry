import type { INestApplication } from "@nestjs/common"
import type { NextFunction, Request, Response } from "express"

const FORWARDED_HEADERS = ["x-forwarded-for", "x-real-ip"] as const

/**
 * Ensures every request carries a resolvable client address for Better Auth
 * rate limiting. When a reverse proxy already forwards one of the headers, it
 * is left untouched; otherwise the socket address is used. Runs identically in
 * every environment.
 */
export const registerClientAddressFallback = (app: INestApplication): void => {
  const express: import("express").Express = app.getHttpAdapter().getInstance()

  express.use((request: Request, _response: Response, next: NextFunction) => {
    const hasForwardedAddress = FORWARDED_HEADERS.some((header) =>
      Boolean(request.headers[header])
    )

    if (!hasForwardedAddress) {
      const address = request.socket.remoteAddress
      if (address) {
        request.headers["x-forwarded-for"] = address
      }
    }

    next()
  })
}
