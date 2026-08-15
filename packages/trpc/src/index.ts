// biome-ignore lint/performance/noBarrelFile: This file is the public package entrypoint.
export { AppContext, type Context } from "./context"
export {
  type ConfirmWaitlistInput,
  type ConfirmWaitlistOutput,
  confirmWaitlistInputSchema,
  confirmWaitlistOutputSchema,
  type JoinWaitlistInput,
  type JoinWaitlistOutput,
  joinWaitlistInputSchema,
  joinWaitlistOutputSchema,
  type VerifyWaitlistConfirmationResultInput,
  type VerifyWaitlistConfirmationResultOutput,
  verifyWaitlistConfirmationResultInputSchema,
  verifyWaitlistConfirmationResultOutputSchema,
  type WaitlistConfirmationStatus,
  type WaitlistConfirmedCountOutput,
  waitlistConfirmationStatusSchema,
  waitlistConfirmedCountOutputSchema,
} from "./contracts/waitlist"
export { ProtectedMiddleware } from "./middleware/protected"
export { TrpcModule } from "./module"
export { TrpcRouter } from "./routers/app.router"
export { WaitlistRouter } from "./routers/waitlist.router"
export { WaitlistService } from "./services/waitlist.service"
export {
  createWaitlistConfirmationReceiptService,
  WaitlistConfirmationReceiptService,
} from "./services/waitlist-confirmation-receipt.service"
export {
  buildWaitlistConfirmationEmail,
  createWaitlistEmailService,
  NoopWaitlistEmailService,
  type PlunkEmailClient,
  PlunkHttpEmailClient,
  type PlunkSendEmailPayload,
  PlunkWaitlistEmailService,
  type WaitlistConfirmationEmailInput,
  type WaitlistConfirmationEmailMessage,
  type WaitlistConfirmationEmailResult,
  type WaitlistEmailConfiguration,
  WaitlistEmailService,
} from "./services/waitlist-email.service"
export {
  WAITLIST_EMAIL_ATTEMPT_LIMIT,
  WAITLIST_IP_ATTEMPT_LIMIT,
  WAITLIST_RATE_LIMIT_WINDOW_MILLISECONDS,
  WaitlistRateLimitExceededError,
  WaitlistRateLimitService,
} from "./services/waitlist-rate-limit.service"
export {
  type WaitlistEntryConfirmationState,
  WaitlistStore,
} from "./services/waitlist-store.service"
