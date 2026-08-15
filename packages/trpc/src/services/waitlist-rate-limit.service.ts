import { createHash } from "node:crypto"
import { Injectable } from "@nestjs/common"

export const WAITLIST_EMAIL_ATTEMPT_LIMIT = 5
export const WAITLIST_IP_ATTEMPT_LIMIT = 20
export const WAITLIST_RATE_LIMIT_WINDOW_MILLISECONDS = 10 * 60 * 1000

const MAX_TRACKED_SUBJECTS = 10_000

interface RateLimitBucket {
  attempts: number
  expiresAt: number
}

interface JoinRateLimitInput {
  clientAddress: string
  email: string
}

interface RateLimitRule {
  key: string
  limit: number
}

const createSubjectKey = (kind: "email" | "ip", value: string): string =>
  `${kind}:${createHash("sha256").update(value).digest("base64url")}`

export class WaitlistRateLimitExceededError extends Error {
  readonly retryAfterSeconds: number

  constructor(retryAfterSeconds: number) {
    super("Waitlist request rate limit exceeded")
    this.name = "WaitlistRateLimitExceededError"
    this.retryAfterSeconds = retryAfterSeconds
  }
}

@Injectable()
export class WaitlistRateLimitService {
  private readonly buckets = new Map<string, RateLimitBucket>()

  assertJoinAllowed(
    { clientAddress, email }: JoinRateLimitInput,
    now = Date.now()
  ): void {
    const rules: RateLimitRule[] = [
      {
        key: createSubjectKey("ip", clientAddress),
        limit: WAITLIST_IP_ATTEMPT_LIMIT,
      },
      {
        key: createSubjectKey("email", email),
        limit: WAITLIST_EMAIL_ATTEMPT_LIMIT,
      },
    ]

    this.pruneExpiredBuckets(now)

    for (const rule of rules) {
      const bucket = this.buckets.get(rule.key)

      if (bucket && bucket.expiresAt > now && bucket.attempts >= rule.limit) {
        throw new WaitlistRateLimitExceededError(
          Math.max(1, Math.ceil((bucket.expiresAt - now) / 1000))
        )
      }
    }

    for (const rule of rules) {
      const bucket = this.buckets.get(rule.key)

      if (!bucket || bucket.expiresAt <= now) {
        this.buckets.set(rule.key, {
          attempts: 1,
          expiresAt: now + WAITLIST_RATE_LIMIT_WINDOW_MILLISECONDS,
        })
        continue
      }

      bucket.attempts += 1
    }

    this.trimBuckets()
  }

  private pruneExpiredBuckets(now: number): void {
    for (const [key, bucket] of this.buckets) {
      if (bucket.expiresAt <= now) {
        this.buckets.delete(key)
      }
    }
  }

  private trimBuckets(): void {
    while (this.buckets.size > MAX_TRACKED_SUBJECTS) {
      const oldestKey = this.buckets.keys().next().value

      if (typeof oldestKey !== "string") {
        return
      }

      this.buckets.delete(oldestKey)
    }
  }
}
