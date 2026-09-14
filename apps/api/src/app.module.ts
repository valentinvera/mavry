import { TrpcModule } from "@mavry/trpc"
import { Module } from "@nestjs/common"

@Module({
  imports: [TrpcModule],
})
export class AppModule {}
