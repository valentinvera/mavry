import { Injectable } from "@nestjs/common"
import { TRPCError } from "@trpc/server"
import type {
  MiddlewareOptions,
  MiddlewareResponse,
  TRPCMiddleware,
} from "nestjs-trpc"
import type { Context } from "../context"

@Injectable()
export class ProtectedMiddleware implements TRPCMiddleware {
  use({ ctx, next }: MiddlewareOptions): MiddlewareResponse {
    const context = ctx as Context

    if (!context.session) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Authentication required",
        cause: "No session",
      })
    }

    return next({
      ctx: {
        ...context,
        session: context.session,
      },
    })
  }
}
