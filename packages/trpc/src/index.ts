// biome-ignore lint/performance/noBarrelFile: This file is the public package entrypoint.
export { AppContext, type Context } from "./context"
export {
  type CreateIdeaInput,
  createIdeaInputSchema,
  type Idea,
  type IdeaSource,
  type IdeaStatus,
  type IdeaSummary,
  ideaSchema,
  ideaSourceSchema,
  ideaStatusSchema,
  ideaSummarySchema,
  type ListIdeasInput,
  listIdeasInputSchema,
  type UpdateIdeaStatusInput,
  updateIdeaStatusInputSchema,
} from "./contracts/idea"
export {
  type CreateProjectInput,
  createProjectInputSchema,
  type Project,
  type ProjectStage,
  type ProjectSummary,
  projectByIdInputSchema,
  projectSchema,
  projectStageSchema,
  projectSummarySchema,
} from "./contracts/project"
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
export { IdeasRouter } from "./routers/ideas.router"
export { ProjectsRouter } from "./routers/projects.router"
export { WaitlistRouter } from "./routers/waitlist.router"
export {
  IdeaNotFoundError,
  IdeasService,
  ProjectNotAccessibleError,
} from "./services/ideas.service"
export { ProjectsService } from "./services/projects.service"
export { WaitlistService } from "./services/waitlist.service"
export {
  createWaitlistConfirmationReceiptService,
  WaitlistConfirmationReceiptService,
} from "./services/waitlist-confirmation-receipt.service"
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
