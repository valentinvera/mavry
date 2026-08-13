// biome-ignore lint/performance/noBarrelFile: This file is the public package entrypoint.
export { AppContext, type Context } from "./context"
export {
  type JoinWaitlistInput,
  type JoinWaitlistOutput,
  joinWaitlistInputSchema,
  joinWaitlistOutputSchema,
} from "./contracts/waitlist"
export { ProtectedMiddleware } from "./middleware/protected"
export { TrpcModule } from "./module"
export { TrpcRouter } from "./routers/app.router"
export { WaitlistRouter } from "./routers/waitlist.router"
