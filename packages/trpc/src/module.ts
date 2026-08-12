import { Module } from "@nestjs/common"
import { TRPCModule } from "nestjs-trpc"
import { AppContext } from "./context"
import { ProtectedMiddleware } from "./middleware/protected"
import { TrpcRouter } from "./routers/app.router"
import { WaitlistRouter } from "./routers/waitlist.router"

@Module({
  imports: [
    TRPCModule.forRoot({
      basePath: "/api/trpc",
      context: AppContext,
    }),
  ],
  providers: [AppContext, ProtectedMiddleware, TrpcRouter, WaitlistRouter],
  exports: [AppContext, ProtectedMiddleware, TrpcRouter, WaitlistRouter],
})
export class TrpcModule {}
