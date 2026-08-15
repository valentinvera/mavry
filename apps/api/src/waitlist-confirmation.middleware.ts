import { env } from "@mavry/env/api"
import {
  confirmWaitlistInputSchema,
  verifyWaitlistConfirmationResultInputSchema,
  WaitlistConfirmationReceiptService,
  WaitlistService,
} from "@mavry/trpc"
import type { INestApplication } from "@nestjs/common"
import type { Express, Request, Response } from "express"

const INVALID_CONFIRMATION_STATUS = "invalid_or_expired"
const BEARER_PREFIX = "Bearer "

const setConfirmationResponseHeaders = (response: Response): void => {
  response.set({
    "Cache-Control": "no-store",
    "Referrer-Policy": "no-referrer",
    "X-Robots-Tag": "noindex, nofollow",
  })
}

const createConfirmationRedirectUrl = (receipt: string): string => {
  const destination = new URL(env.WAITLIST_CONFIRMATION_REDIRECT_URL)
  destination.searchParams.set("result", receipt)

  return destination.toString()
}

export const registerWaitlistConfirmationRoute = (
  app: INestApplication
): void => {
  const express: Express = app.getHttpAdapter().getInstance()
  const receiptService = app.get(WaitlistConfirmationReceiptService)
  const waitlistService = app.get(WaitlistService)

  express.get(
    "/api/waitlist/confirm",
    async (request: Request, response: Response): Promise<void> => {
      const input = confirmWaitlistInputSchema.safeParse(request.query)
      const status = input.success
        ? (await waitlistService.confirm(input.data.token)).status
        : INVALID_CONFIRMATION_STATUS
      const receipt = receiptService.issue(status)

      setConfirmationResponseHeaders(response)
      response.redirect(303, createConfirmationRedirectUrl(receipt))
    }
  )

  express.post(
    "/api/waitlist/confirmation-result",
    (request: Request, response: Response): void => {
      const authorization = request.get("authorization")
      const receipt = authorization?.startsWith(BEARER_PREFIX)
        ? authorization.slice(BEARER_PREFIX.length)
        : undefined
      const input = verifyWaitlistConfirmationResultInputSchema.safeParse({
        receipt,
      })
      const status = input.success
        ? (receiptService.verify(input.data.receipt) ??
          INVALID_CONFIRMATION_STATUS)
        : INVALID_CONFIRMATION_STATUS

      setConfirmationResponseHeaders(response)
      response.status(200).json({ status })
    }
  )
}
