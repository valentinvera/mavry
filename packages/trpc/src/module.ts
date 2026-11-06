import { createWaitlistEmailService, WaitlistEmailService } from "@mavry/email"
import { env } from "@mavry/env/api"
import { Module } from "@nestjs/common"
import { TRPCModule } from "nestjs-trpc"
import { AppContext } from "./context"
import { ProtectedMiddleware } from "./middleware/protected"
import { TrpcRouter } from "./routers/app.router"
import { CutsRouter } from "./routers/cuts.router"
import { FeaturesRouter } from "./routers/features.router"
import { IdeasRouter } from "./routers/ideas.router"
import { ProjectsRouter } from "./routers/projects.router"
import { WaitlistRouter } from "./routers/waitlist.router"
import { FeaturesService } from "./services/features.service"
import { IdeasService } from "./services/ideas.service"
import { ProjectsService } from "./services/projects.service"
import { WaitlistService } from "./services/waitlist.service"
import {
  createWaitlistConfirmationReceiptService,
  WaitlistConfirmationReceiptService,
} from "./services/waitlist-confirmation-receipt.service"
import { WaitlistRateLimitService } from "./services/waitlist-rate-limit.service"
import { WaitlistStore } from "./services/waitlist-store.service"

@Module({
  exports: [
    AppContext,
    CutsRouter,
    FeaturesRouter,
    FeaturesService,
    IdeasRouter,
    IdeasService,
    ProtectedMiddleware,
    ProjectsRouter,
    ProjectsService,
    TrpcRouter,
    WaitlistConfirmationReceiptService,
    WaitlistEmailService,
    WaitlistRouter,
    WaitlistRateLimitService,
    WaitlistService,
    WaitlistStore,
  ],
  imports: [
    TRPCModule.forRoot({
      basePath: "/api/trpc",
      context: AppContext,
    }),
  ],
  providers: [
    AppContext,
    CutsRouter,
    FeaturesRouter,
    FeaturesService,
    IdeasRouter,
    IdeasService,
    ProtectedMiddleware,
    ProjectsRouter,
    ProjectsService,
    TrpcRouter,
    {
      provide: WaitlistEmailService,
      useFactory: createWaitlistEmailService,
    },
    {
      provide: WaitlistConfirmationReceiptService,
      useFactory: () =>
        createWaitlistConfirmationReceiptService(env.BETTER_AUTH_SECRET),
    },
    WaitlistRouter,
    WaitlistRateLimitService,
    WaitlistService,
    WaitlistStore,
  ],
})
export class TrpcModule {}
