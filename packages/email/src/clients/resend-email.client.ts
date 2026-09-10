export interface ResendEmailAttachment {
  content: string
  contentId: string
  contentType: string
  filename: string
}

export const createGmailNonThreadingHeaders = (
  entityReferenceId: string
): Record<string, string> => ({
  "X-Entity-Ref-ID": entityReferenceId,
})

export interface ResendSendEmailPayload {
  attachments?: ResendEmailAttachment[]
  from: string
  headers?: Record<string, string>
  html: string
  replyTo?: string
  subject: string
  tags: Array<{ name: string; value: string }>
  text: string
  to: string
}

export interface ResendEmailError {
  cause?: ResendEmailErrorCause
  message: string
  name: string
  statusCode: number | null
}

export interface ResendEmailErrorCause {
  code?: string
  message: string
  name: string
}

export type ResendTransportResponse =
  | {
      data: { id: string }
      error: null
      headers?: Record<string, string> | null
    }
  | {
      data: null
      error: ResendEmailError
      headers?: Record<string, string> | null
    }

export interface ResendEmailTransport {
  send(
    payload: ResendSendEmailPayload,
    options: { idempotencyKey: string }
  ): Promise<ResendTransportResponse>
}

export type ResendEmailClientResponse = ResendTransportResponse & {
  attempts: number
}

export interface ResendEmailClient {
  send(
    payload: ResendSendEmailPayload,
    options: { idempotencyKey: string }
  ): Promise<ResendEmailClientResponse>
}

interface ReliableResendEmailClientOptions {
  maxAttempts?: number
  random?: () => number
  sleep?: (milliseconds: number) => Promise<void>
}

const DEFAULT_MAX_ATTEMPTS = 3
const INITIAL_RETRY_DELAY_MILLISECONDS = 1000
const MAX_RETRY_DELAY_MILLISECONDS = 30_000
const RETRY_JITTER_MILLISECONDS = 250

const retryableErrorNames = new Set([
  "application_error",
  "concurrent_idempotent_requests",
  "internal_server_error",
  "network_error",
  "rate_limit_exceeded",
])

const defaultSleep = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds)
  })

const getErrorCode = (error: Error): string | undefined => {
  const code = Reflect.get(error, "code")

  if (typeof code === "string" || typeof code === "number") {
    return String(code)
  }

  return
}

const getErrorCause = (error: unknown): ResendEmailErrorCause => {
  if (error instanceof Error) {
    return {
      code: getErrorCode(error),
      message: error.message,
      name: error.name,
    }
  }

  return {
    message: "A non-Error value was thrown",
    name: "UnknownError",
  }
}

const createNetworkError = (cause?: unknown): ResendEmailError => ({
  cause: cause === undefined ? undefined : getErrorCause(cause),
  message: "The Resend request failed before receiving a response",
  name: "network_error",
  statusCode: null,
})

export const isRetryableResendError = (error: ResendEmailError): boolean =>
  error.statusCode === 429 ||
  (error.statusCode !== null && error.statusCode >= 500) ||
  retryableErrorNames.has(error.name)

const getRetryDelay = (attempt: number, random: () => number): number => {
  const exponentialDelay = Math.min(
    INITIAL_RETRY_DELAY_MILLISECONDS * 2 ** (attempt - 1),
    MAX_RETRY_DELAY_MILLISECONDS
  )
  const jitter = Math.floor(random() * RETRY_JITTER_MILLISECONDS)

  return exponentialDelay + jitter
}

export class ReliableResendEmailClient implements ResendEmailClient {
  private readonly maxAttempts: number
  private readonly random: () => number
  private readonly sleep: (milliseconds: number) => Promise<void>
  private readonly transport: ResendEmailTransport

  constructor(
    transport: ResendEmailTransport,
    {
      maxAttempts = DEFAULT_MAX_ATTEMPTS,
      random = Math.random,
      sleep = defaultSleep,
    }: ReliableResendEmailClientOptions = {}
  ) {
    this.maxAttempts = Math.max(1, Math.floor(maxAttempts))
    this.random = random
    this.sleep = sleep
    this.transport = transport
  }

  async send(
    payload: ResendSendEmailPayload,
    options: { idempotencyKey: string }
  ): Promise<ResendEmailClientResponse> {
    for (let attempt = 1; attempt <= this.maxAttempts; attempt += 1) {
      const response = await this.attemptSend(payload, options)
      const shouldRetry =
        response.error !== null &&
        isRetryableResendError(response.error) &&
        attempt < this.maxAttempts

      if (!shouldRetry) {
        return { ...response, attempts: attempt }
      }

      await this.sleep(getRetryDelay(attempt, this.random))
    }

    return {
      attempts: this.maxAttempts,
      data: null,
      error: createNetworkError(),
    }
  }

  private async attemptSend(
    payload: ResendSendEmailPayload,
    options: { idempotencyKey: string }
  ): Promise<ResendTransportResponse> {
    try {
      return await this.transport.send(payload, options)
    } catch (error) {
      return { data: null, error: createNetworkError(error) }
    }
  }
}
