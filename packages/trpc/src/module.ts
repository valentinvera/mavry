import { env } from "@mavry/env/api"
import { Module } from "@nestjs/common"
import { TRPCModule } from "nestjs-trpc"
import { AppContext } from "./context"
import { ProtectedMiddleware } from "./middleware/protected"
import { TrpcRouter } from "./routers/app.router"
import { WaitlistRouter } from "./routers/waitlist.router"
import { WaitlistService } from "./services/waitlist.service"
import {
  createWaitlistConfirmationReceiptService,
  WaitlistConfirmationReceiptService,
} from "./services/waitlist-confirmation-receipt.service"
import {
  createWaitlistEmailService,
  WaitlistEmailService,
} from "./services/waitlist-email.service"
import { WaitlistRateLimitService } from "./services/waitlist-rate-limit.service"
import { WaitlistStore } from "./services/waitlist-store.service"

@Module({
  imports: [
    TRPCModule.forRoot({
      basePath: "/api/trpc",
      context: AppContext,
    }),
  ],
  providers: [
    AppContext,
    ProtectedMiddleware,
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
  exports: [
    AppContext,
    ProtectedMiddleware,
    TrpcRouter,
    WaitlistConfirmationReceiptService,
    WaitlistEmailService,
    WaitlistRouter,
    WaitlistRateLimitService,
    WaitlistService,
    WaitlistStore,
  ],
})
export class TrpcModule {}
