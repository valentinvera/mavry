// biome-ignore lint/performance/noBarrelFile: This file is the public package entrypoint.
export {
  MAVRY_EMAIL_LOGO_ATTACHMENT,
  MAVRY_EMAIL_LOGO_CONTENT_ID,
} from "./assets/mavry-email-assets"
export {
  createGmailNonThreadingHeaders,
  isRetryableResendError,
  ReliableResendEmailClient,
  type ResendEmailAttachment,
  type ResendEmailClient,
  type ResendEmailClientResponse,
  type ResendEmailError,
  type ResendEmailTransport,
  type ResendSendEmailPayload,
  type ResendTransportResponse,
} from "./clients/resend-email.client"
export {
  type AuthEmailConfiguration,
  type AuthEmailMessage,
  type AuthEmailResult,
  AuthEmailService,
  type AuthLinkEmailRequest,
  type AuthOtpEmailRequest,
  buildAuthLinkEmail,
  buildAuthOtpEmail,
  createAuthEmailService,
  NoopAuthEmailService,
  ResendAuthEmailService,
} from "./services/auth-email.service"
export {
  buildWaitlistConfirmationEmail,
  createWaitlistEmailService,
  NoopWaitlistEmailService,
  ResendWaitlistEmailService,
  type WaitlistConfirmationEmailInput,
  type WaitlistConfirmationEmailMessage,
  type WaitlistConfirmationEmailResult,
  type WaitlistEmailConfiguration,
  WaitlistEmailService,
} from "./services/waitlist-email.service"
export {
  AuthLinkEmail,
  type AuthLinkEmailProps,
  type AuthLinkPurpose,
  getAuthLinkEmailSubject,
  renderAuthLinkEmail,
} from "./templates/auth-link"
export {
  AuthOtpEmail,
  type AuthOtpEmailProps,
  type AuthOtpPurpose,
  getAuthOtpEmailSubject,
  renderAuthOtpEmail,
} from "./templates/auth-otp"
export {
  type RenderedWaitlistConfirmationEmail,
  renderWaitlistConfirmationEmail,
  WAITLIST_CONFIRMATION_EMAIL_PREVIEW,
  WAITLIST_CONFIRMATION_EMAIL_SUBJECT,
  WaitlistConfirmationEmail,
  type WaitlistConfirmationEmailProps,
} from "./templates/waitlist-confirmation"
