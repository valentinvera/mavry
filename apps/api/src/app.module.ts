import { auth } from "@mavry/auth"
import { TrpcModule } from "@mavry/trpc"
import {
  type MiddlewareConsumer,
  Module,
  type NestModule,
  RequestMethod,
} from "@nestjs/common"
import { toNodeHandler } from "better-auth/node"

@Module({
  imports: [TrpcModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(toNodeHandler(auth)).forRoutes({
      path: "auth/{*splat}",
      method: RequestMethod.ALL,
    })
  }
}
