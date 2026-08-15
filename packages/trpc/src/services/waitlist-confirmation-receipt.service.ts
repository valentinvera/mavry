import { createHmac, randomUUID, timingSafeEqual } from "node:crypto"
import { z } from "zod"
import {
  type WaitlistConfirmationStatus,
  waitlistConfirmationStatusSchema,
} from "../contracts/waitlist"

const CLOCK_SKEW_SECONDS = 30
const RECEIPT_LIFETIME_SECONDS = 5 * 60
const RECEIPT_PURPOSE = "waitlist-confirmation-result"
const RECEIPT_VERSION = 1
const SIGNING_KEY_CONTEXT = "mavry:waitlist-confirmation-result:v1"

const receiptPayloadSchema = z.object({
  expiresAt: z.number().int().positive(),
  issuedAt: z.number().int().positive(),
  nonce: z.uuid(),
  purpose: z.literal(RECEIPT_PURPOSE),
  status: waitlistConfirmationStatusSchema,
  version: z.literal(RECEIPT_VERSION),
})

const deriveSigningKey = (secret: string): Buffer =>
  createHmac("sha256", secret).update(SIGNING_KEY_CONTEXT).digest()

const signPayload = (payload: string, signingKey: Buffer): Buffer =>
  createHmac("sha256", signingKey).update(payload).digest()

export class WaitlistConfirmationReceiptService {
  private readonly signingKey: Buffer

  constructor(secret: string) {
    this.signingKey = deriveSigningKey(secret)
  }

  issue(status: WaitlistConfirmationStatus, now = new Date()): string {
    const issuedAt = Math.floor(now.getTime() / 1000)
    const payload = Buffer.from(
      JSON.stringify({
        expiresAt: issuedAt + RECEIPT_LIFETIME_SECONDS,
        issuedAt,
        nonce: randomUUID(),
        purpose: RECEIPT_PURPOSE,
        status,
        version: RECEIPT_VERSION,
      })
    ).toString("base64url")
    const signature = signPayload(payload, this.signingKey).toString(
      "base64url"
    )

    return `${payload}.${signature}`
  }

  verify(receipt: string, now = new Date()): WaitlistConfirmationStatus | null {
    const segments = receipt.split(".")

    if (segments.length !== 2) {
      return null
    }

    const [payloadSegment, signatureSegment] = segments

    if (!(payloadSegment && signatureSegment)) {
      return null
    }

    try {
      const actualSignature = Buffer.from(signatureSegment, "base64url")
      const expectedSignature = signPayload(payloadSegment, this.signingKey)

      if (
        actualSignature.length !== expectedSignature.length ||
        !timingSafeEqual(actualSignature, expectedSignature)
      ) {
        return null
      }

      const payload = receiptPayloadSchema.safeParse(
        JSON.parse(Buffer.from(payloadSegment, "base64url").toString("utf8"))
      )

      if (!payload.success) {
        return null
      }

      const nowInSeconds = Math.floor(now.getTime() / 1000)
      const wasIssuedInFuture =
        payload.data.issuedAt > nowInSeconds + CLOCK_SKEW_SECONDS
      const hasExpired = payload.data.expiresAt <= nowInSeconds

      if (wasIssuedInFuture || hasExpired) {
        return null
      }

      return payload.data.status
    } catch {
      return null
    }
  }
}

export const createWaitlistConfirmationReceiptService = (
  secret: string
): WaitlistConfirmationReceiptService =>
  new WaitlistConfirmationReceiptService(secret)
