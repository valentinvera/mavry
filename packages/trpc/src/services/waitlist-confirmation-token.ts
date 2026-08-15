import { createHash, randomBytes } from "node:crypto"

const TOKEN_BYTES = 32

export const createWaitlistConfirmationToken = (): string =>
  randomBytes(TOKEN_BYTES).toString("base64url")

export const hashWaitlistConfirmationToken = (token: string): string =>
  createHash("sha256").update(token).digest("hex")
