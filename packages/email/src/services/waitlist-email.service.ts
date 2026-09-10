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
  renderWaitlistConfirmationEmail,
  WAITLIST_CONFIRMATION_EMAIL_SUBJECT,
} from "../templates/waitlist-confirmation"

export interface WaitlistConfirmationEmailInput {
  confirmationToken: string
  email: string
  expirationHours: number
  idempotencyKey: string
  waitlistEntryId: string
}

export interface WaitlistConfirmationEmailMessage {
  html: string
  subject: string
  text: string
  to: string
}

export type WaitlistConfirmationEmailResult =
  | { providerMessageId: string; status: "sent" }
  | { status: "failed" }
  | { status: "skipped" }

export interface WaitlistEmailConfiguration {
  confirmationUrl?: string
  fromEmail?: string
  provider: "noop" | "resend"
  replyToEmail?: string
  resendApiKey?: string
}

interface BuildWaitlistConfirmationEmailInput {
  confirmationUrl: string
  email: string
  expirationHours: number
}

export const buildWaitlistConfirmationEmail = async ({
  confirmationUrl,
  email,
  expirationHours,
}: BuildWaitlistConfirmationEmailInput): Promise<WaitlistConfirmationEmailMessage> => {
  const rendered = await renderWaitlistConfirmationEmail({
    confirmationUrl,
    expirationHours,
  })

  return {
    ...rendered,
    subject: WAITLIST_CONFIRMATION_EMAIL_SUBJECT,
    to: email,
  }
}

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

interface ResendWaitlistEmailServiceConfiguration {
  confirmationUrl: string
  fromEmail: string
  replyToEmail?: string
  resendEmails: ResendEmailClient
}

export class ResendWaitlistEmailService implements WaitlistEmailService {
  private readonly confirmationUrl: string
  private readonly fromEmail: string
  private readonly logger = new Logger(ResendWaitlistEmailService.name)
  private readonly replyToEmail?: string
  private readonly resendEmails: ResendEmailClient

  constructor({
    confirmationUrl,
    fromEmail,
    replyToEmail,
    resendEmails,
  }: ResendWaitlistEmailServiceConfiguration) {
    this.confirmationUrl = confirmationUrl
    this.fromEmail = fromEmail
    this.replyToEmail = replyToEmail
    this.resendEmails = resendEmails
  }

  async sendWaitlistConfirmationEmail({
    confirmationToken,
    email,
    expirationHours,
    idempotencyKey,
    waitlistEntryId,
  }: WaitlistConfirmationEmailInput): Promise<WaitlistConfirmationEmailResult> {
    const confirmationUrl = new URL(this.confirmationUrl)
    confirmationUrl.searchParams.set("token", confirmationToken)
    const message = await buildWaitlistConfirmationEmail({
      confirmationUrl: confirmationUrl.toString(),
      email,
      expirationHours,
    })

    const payload: ResendSendEmailPayload = {
      attachments: [MAVRY_EMAIL_LOGO_ATTACHMENT],
      from: `Mavry <${this.fromEmail}>`,
      headers: createGmailNonThreadingHeaders(idempotencyKey),
      html: message.html,
      subject: message.subject,
      tags: [
        { name: "email_type", value: "waitlist_confirmation" },
        { name: "waitlist_entry", value: waitlistEntryId },
      ],
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
        `Resend waitlist confirmation failed after ${attempts} attempt(s): ${error.name} (${error.statusCode ?? "network"})`
      )
      return { status: "failed" }
    }

    return { providerMessageId: data.id, status: "sent" }
  }
}

const getWaitlistEmailConfiguration = (): WaitlistEmailConfiguration => ({
  confirmationUrl: env.WAITLIST_CONFIRMATION_URL,
  fromEmail: env.WAITLIST_FROM_EMAIL,
  provider: env.WAITLIST_EMAIL_PROVIDER,
  replyToEmail: env.WAITLIST_REPLY_TO_EMAIL,
  resendApiKey: env.RESEND_API_KEY,
})

export const createWaitlistEmailService = (
  configuration: WaitlistEmailConfiguration = getWaitlistEmailConfiguration()
): WaitlistEmailService => {
  if (configuration.provider === "noop") {
    return new NoopWaitlistEmailService()
  }

  const { confirmationUrl, fromEmail, replyToEmail, resendApiKey } =
    configuration
  const missingVariables = [
    resendApiKey ? null : "RESEND_API_KEY",
    fromEmail ? null : "WAITLIST_FROM_EMAIL",
    confirmationUrl ? null : "WAITLIST_CONFIRMATION_URL",
  ].filter((variable): variable is string => variable !== null)

  if (!(resendApiKey && fromEmail && confirmationUrl)) {
    throw new Error(
      `Resend waitlist email provider is missing: ${missingVariables.join(", ")}`
    )
  }

  return new ResendWaitlistEmailService({
    confirmationUrl,
    fromEmail,
    replyToEmail,
    resendEmails: new ReliableResendEmailClient(
      new Resend(resendApiKey).emails
    ),
  })
}
