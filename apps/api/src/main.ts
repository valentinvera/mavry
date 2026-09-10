import "reflect-metadata"
import { env, getCorsOrigins } from "@mavry/env/api"
import { NestFactory } from "@nestjs/core"
import { AppModule } from "#api/app.module"
import { registerWaitlistConfirmationRoute } from "#api/waitlist-confirmation.middleware"

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix("api")

  app.enableCors({
    origin: getCorsOrigins(),
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })

  registerWaitlistConfirmationRoute(app)

  await app.listen(env.PORT, env.HOST)
}

await bootstrap()
