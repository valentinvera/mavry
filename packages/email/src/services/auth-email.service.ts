import { randomUUID } from "node:crypto"
import { env } from "@mavry/env/api"
import { Injectable, Logger } from "@nestjs/common"
import { Resend } from "resend"
import { MAVRY_EMAIL_LOGO_ATTACHMENT } from "../assets/mavry-email-assets"
import {
  createGmailNonThreadingHeaders,
  ReliableResendEmailClient,
  type ResendEmailClient,
  type ResendSendEmailPayload,
} from "../clients/resend-email.client"
import {
  getAuthLinkEmailSubject,
  renderAuthLinkEmail,
} from "../templates/auth-link"
import {
  getAuthOtpEmailSubject,
  renderAuthOtpEmail,
} from "../templates/auth-otp"

export interface AuthOtpEmailRequest {
  email: string
  expiresInMinutes: number
  otp: string
  purpose: "change-email" | "email-verification" | "forget-password" | "sign-in"
}

export interface AuthLinkEmailRequest {
  email: string
  expiresInMinutes: number
  purpose: "magic-link" | "password-reset"
  url: string
}

export type AuthEmailResult =
  | { providerMessageId: string; status: "sent" }
  | { status: "failed" }
  | { status: "skipped" }

export interface AuthEmailConfiguration {
  fromEmail?: string
  provider: "noop" | "resend"
  replyToEmail?: string
  resendApiKey?: string
}

export interface AuthEmailMessage {
  html: string
  subject: string
  tags: Array<{ name: string; value: string }>
  text: string
  to: string
}

export abstract class AuthEmailService {
  abstract sendOtp(request: AuthOtpEmailRequest): Promise<AuthEmailResult>
  abstract sendLink(request: AuthLinkEmailRequest): Promise<AuthEmailResult>
}

@Injectable()
export class NoopAuthEmailService implements AuthEmailService {
  sendOtp(_request: AuthOtpEmailRequest): Promise<AuthEmailResult> {
    return Promise.resolve({ status: "skipped" })
  }

  sendLink(_request: AuthLinkEmailRequest): Promise<AuthEmailResult> {
    return Promise.resolve({ status: "skipped" })
  }
}

export const buildAuthOtpEmail = async ({
  email,
  expiresInMinutes,
  otp,
  purpose,
}: AuthOtpEmailRequest): Promise<AuthEmailMessage> => {
  const rendered = await renderAuthOtpEmail({
    code: otp,
    expiresInMinutes,
    purpose,
  })

  return {
    ...rendered,
    subject: getAuthOtpEmailSubject(purpose),
    tags: [
      { name: "email_type", value: "auth_otp" },
      { name: "auth_purpose", value: purpose },
    ],
    to: email,
  }
}

export const buildAuthLinkEmail = async ({
  email,
  expiresInMinutes,
  purpose,
  url,
}: AuthLinkEmailRequest): Promise<AuthEmailMessage> => {
  const rendered = await renderAuthLinkEmail({
    expiresInMinutes,
    purpose,
    url,
  })

  return {
    ...rendered,
    subject: getAuthLinkEmailSubject(purpose),
    tags: [
      { name: "email_type", value: "auth_link" },
      { name: "auth_purpose", value: purpose },
    ],
    to: email,
  }
}

interface ResendAuthEmailServiceConfiguration {
  fromEmail: string
  replyToEmail?: string
  resendEmails: ResendEmailClient
}

export class ResendAuthEmailService implements AuthEmailService {
  private readonly fromEmail: string
  private readonly logger = new Logger(ResendAuthEmailService.name)
  private readonly replyToEmail?: string
  private readonly resendEmails: ResendEmailClient

  constructor({
    fromEmail,
    replyToEmail,
    resendEmails,
  }: ResendAuthEmailServiceConfiguration) {
    this.fromEmail = fromEmail
    this.replyToEmail = replyToEmail
    this.resendEmails = resendEmails
  }

  sendOtp(request: AuthOtpEmailRequest): Promise<AuthEmailResult> {
    return this.deliver(() => buildAuthOtpEmail(request))
  }

  sendLink(request: AuthLinkEmailRequest): Promise<AuthEmailResult> {
    return this.deliver(() => buildAuthLinkEmail(request))
  }

  private async deliver(
    build: () => Promise<AuthEmailMessage>
  ): Promise<AuthEmailResult> {
    const message = await build()
    const idempotencyKey = randomUUID()

    const payload: ResendSendEmailPayload = {
      attachments: [MAVRY_EMAIL_LOGO_ATTACHMENT],
      from: `Mavry <${this.fromEmail}>`,
      headers: createGmailNonThreadingHeaders(idempotencyKey),
      html: message.html,
      subject: message.subject,
      tags: message.tags,
      text: message.text,
      to: message.to,
    }

    if (this.replyToEmail) {
      payload.replyTo = this.replyToEmail
    }

    const { attempts, data, error } = await this.resendEmails.send(payload, {
      idempotencyKey,
    })

    if (error) {
      this.logger.warn(
        `Resend auth email failed after ${attempts} attempt(s): ${error.name} (${error.statusCode ?? "network"})`
      )
      return { status: "failed" }
    }

    return { providerMessageId: data.id, status: "sent" }
  }
}

const getAuthEmailConfiguration = (): AuthEmailConfiguration => ({
  fromEmail: env.AUTH_FROM_EMAIL ?? env.WAITLIST_FROM_EMAIL,
  provider: env.AUTH_EMAIL_PROVIDER,
  replyToEmail: env.AUTH_REPLY_TO_EMAIL ?? env.WAITLIST_REPLY_TO_EMAIL,
  resendApiKey: env.RESEND_API_KEY,
})

export const createAuthEmailService = (
  configuration: AuthEmailConfiguration = getAuthEmailConfiguration()
): AuthEmailService => {
  if (configuration.provider === "noop") {
    return new NoopAuthEmailService()
  }

  const { fromEmail, replyToEmail, resendApiKey } = configuration
  const missingVariables = [
    resendApiKey ? null : "RESEND_API_KEY",
    fromEmail ? null : "AUTH_FROM_EMAIL",
  ].filter((variable): variable is string => variable !== null)

  if (!(resendApiKey && fromEmail)) {
    throw new Error(
      `Resend auth email provider is missing: ${missingVariables.join(", ")}`
    )
  }

  return new ResendAuthEmailService({
    fromEmail,
    replyToEmail,
    resendEmails: new ReliableResendEmailClient(
      new Resend(resendApiKey).emails
    ),
  })
}
