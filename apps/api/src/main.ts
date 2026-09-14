import "reflect-metadata"
import { env } from "@mavry/env/api"
import { NestFactory } from "@nestjs/core"
import type { NestExpressApplication } from "@nestjs/platform-express"
import { AppModule } from "./app.module"
import { registerAuthRoute } from "./auth.middleware"
import { registerWaitlistConfirmationRoute } from "./waitlist-confirmation.middleware"

const corsOrigins = env.CORS_ORIGIN.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  })

  app.setGlobalPrefix("api")

  app.enableCors({
    origin: corsOrigins,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "expo-origin",
      "x-skip-oauth-proxy",
    ],
    exposedHeaders: ["X-Retry-After"],
    credentials: true,
  })

  registerAuthRoute(app)

  // biome-ignore lint/correctness/useHookAtTopLevel: NestJS parser registration is not a React hook.
  app.useBodyParser("json")
  // biome-ignore lint/correctness/useHookAtTopLevel: NestJS parser registration is not a React hook.
  app.useBodyParser("urlencoded", { extended: true })

  registerWaitlistConfirmationRoute(app)

  await app.listen(env.PORT, env.HOST)
}

await bootstrap()
