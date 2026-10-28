import { createHmac, timingSafeEqual } from "node:crypto"
import { env } from "@mavry/env/api"

const CONTEXT_TTL_SECONDS = 10 * 60
const TOKEN_SEPARATOR = "."

export interface PasskeySignupContextPayload {
  email: string
  exp: number
  name: string
}

const base64UrlEncode = (value: string): string =>
  Buffer.from(value, "utf8").toString("base64url")

const base64UrlDecode = (value: string): string =>
  Buffer.from(value, "base64url").toString("utf8")

const sign = (payload: string): string =>
  createHmac("sha256", env.BETTER_AUTH_SECRET)
    .update(payload)
    .digest("base64url")

export const createPasskeySignupContext = (input: {
  email: string
  name: string
}): string => {
  const payload: PasskeySignupContextPayload = {
    email: input.email,
    exp: Math.floor(Date.now() / 1000) + CONTEXT_TTL_SECONDS,
    name: input.name,
  }
  const encoded = base64UrlEncode(JSON.stringify(payload))

  return `${encoded}${TOKEN_SEPARATOR}${sign(encoded)}`
}

export const verifyPasskeySignupContext = (
  token: string | null | undefined
): PasskeySignupContextPayload | null => {
  if (!token) {
    return null
  }

  const [encoded, signature] = token.split(TOKEN_SEPARATOR)

  if (!(encoded && signature)) {
    return null
  }

  const expectedSignature = sign(encoded)
  const provided = Buffer.from(signature)
  const expected = Buffer.from(expectedSignature)

  if (
    provided.length !== expected.length ||
    !timingSafeEqual(provided, expected)
  ) {
    return null
  }

  try {
    const payload = JSON.parse(
      base64UrlDecode(encoded)
    ) as PasskeySignupContextPayload

    if (
      typeof payload.email !== "string" ||
      typeof payload.name !== "string" ||
      typeof payload.exp !== "number"
    ) {
      return null
    }

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return payload
  } catch {
    return null
  }
}
