import { env } from "@mavry/env/api"
import { Injectable } from "@nestjs/common"
import { WAITLIST_CONFIRMATION_EXPIRATION_HOURS } from "./waitlist.constants"

const CONFIRMATION_EMAIL_SUBJECT = "Confirm your Mavry waitlist spot"
const PLUNK_SEND_EMAIL_URL = "https://next-api.useplunk.com/v1/send"

export interface WaitlistConfirmationEmailInput {
  confirmationToken: string
  email: string
  idempotencyKey: string
}

export interface WaitlistConfirmationEmailMessage {
  html: string
  subject: string
  text: string
  to: string
}

export interface WaitlistConfirmationEmailResult {
  status: "failed" | "sent" | "skipped"
}

export interface PlunkSendEmailPayload {
  body: string
  from: {
    email: string
    name: string
  }
  subject: string
  to: string
}

export interface PlunkEmailClient {
  send(
    payload: PlunkSendEmailPayload,
    idempotencyKey: string
  ): Promise<{ success: boolean }>
}

export interface WaitlistEmailConfiguration {
  confirmationUrl?: string
  fromEmail?: string
  plunkSecretKey?: string
  provider: "noop" | "plunk"
}

interface BuildWaitlistConfirmationEmailInput {
  confirmationUrl: string
  email: string
}

export const buildWaitlistConfirmationEmail = ({
  confirmationUrl,
  email,
}: BuildWaitlistConfirmationEmailInput): WaitlistConfirmationEmailMessage => ({
  html: `<p>Confirm your email to finish joining the Mavry waitlist.</p><p>Mavry helps builders decide what to build now, what to leave for later, and what to cut.</p><p><a href="${confirmationUrl}">Confirm email</a></p><p>This link expires in ${WAITLIST_CONFIRMATION_EXPIRATION_HOURS} hours. If you didn’t request it, you can ignore this email.</p>`,
  subject: CONFIRMATION_EMAIL_SUBJECT,
  text: `Confirm your email to finish joining the Mavry waitlist.\n\nMavry helps builders decide what to build now, what to leave for later, and what to cut.\n\nConfirm email: ${confirmationUrl}\n\nThis link expires in ${WAITLIST_CONFIRMATION_EXPIRATION_HOURS} hours. If you didn’t request it, you can ignore this email.`,
  to: email,
})

export abstract class WaitlistEmailService {
  abstract sendWaitlistConfirmationEmail(
    input: WaitlistConfirmationEmailInput
  ): Promise<WaitlistConfirmationEmailResult>
}

@Injectable()
export class NoopWaitlistEmailService implements WaitlistEmailService {
  sendWaitlistConfirmationEmail(
    _input: WaitlistConfirmationEmailInput
  ): Promise<WaitlistConfirmationEmailResult> {
    return Promise.resolve({ status: "skipped" })
  }
}

export class PlunkHttpEmailClient implements PlunkEmailClient {
  private readonly request: typeof fetch
  private readonly secretKey: string

  constructor(secretKey: string, request: typeof fetch = fetch) {
    this.request = request
    this.secretKey = secretKey
  }

  async send(
    payload: PlunkSendEmailPayload,
    idempotencyKey: string
  ): Promise<{ success: boolean }> {
    const response = await this.request(PLUNK_SEND_EMAIL_URL, {
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      method: "POST",
    })

    await response.body?.cancel()

    return { success: response.ok }
  }
}

interface PlunkWaitlistEmailServiceConfiguration {
  confirmationUrl: string
  fromEmail: string
  plunkEmails: PlunkEmailClient
}

export class PlunkWaitlistEmailService implements WaitlistEmailService {
  private readonly confirmationUrl: string
  private readonly fromEmail: string
  private readonly plunkEmails: PlunkEmailClient

  constructor({
    confirmationUrl,
    fromEmail,
    plunkEmails,
  }: PlunkWaitlistEmailServiceConfiguration) {
    this.confirmationUrl = confirmationUrl
    this.fromEmail = fromEmail
    this.plunkEmails = plunkEmails
  }

  async sendWaitlistConfirmationEmail({
    confirmationToken,
    email,
    idempotencyKey,
  }: WaitlistConfirmationEmailInput): Promise<WaitlistConfirmationEmailResult> {
    const confirmationUrl = new URL(this.confirmationUrl)
    confirmationUrl.searchParams.set("token", confirmationToken)
    const message = buildWaitlistConfirmationEmail({
      confirmationUrl: confirmationUrl.toString(),
      email,
    })

    const result = await this.plunkEmails.send(
      {
        body: message.html,
        from: {
          email: this.fromEmail,
          name: "Mavry",
        },
        subject: message.subject,
        to: message.to,
      },
      idempotencyKey
    )

    return { status: result.success ? "sent" : "failed" }
  }
}

const getWaitlistEmailConfiguration = (): WaitlistEmailConfiguration => ({
  confirmationUrl: env.WAITLIST_CONFIRMATION_URL,
  fromEmail: env.WAITLIST_FROM_EMAIL,
  plunkSecretKey: env.PLUNK_SECRET_KEY,
  provider: env.WAITLIST_EMAIL_PROVIDER,
})

export const createWaitlistEmailService = (
  configuration: WaitlistEmailConfiguration = getWaitlistEmailConfiguration()
): WaitlistEmailService => {
  if (configuration.provider === "noop") {
    return new NoopWaitlistEmailService()
  }

  const { confirmationUrl, fromEmail, plunkSecretKey } = configuration
  const missingVariables = [
    plunkSecretKey ? null : "PLUNK_SECRET_KEY",
    fromEmail ? null : "WAITLIST_FROM_EMAIL",
    confirmationUrl ? null : "WAITLIST_CONFIRMATION_URL",
  ].filter((variable): variable is string => variable !== null)

  if (!(plunkSecretKey && fromEmail && confirmationUrl)) {
    throw new Error(
      `Plunk waitlist email provider is missing: ${missingVariables.join(", ")}`
    )
  }

  return new PlunkWaitlistEmailService({
    confirmationUrl,
    fromEmail,
    plunkEmails: new PlunkHttpEmailClient(plunkSecretKey),
  })
}
