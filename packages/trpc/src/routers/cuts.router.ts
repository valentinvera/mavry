import { Inject } from "@nestjs/common"
import { TRPCError } from "@trpc/server"
import { Ctx, Input, Query, Router, UseMiddlewares } from "nestjs-trpc"
import { z } from "zod"
import type { Context } from "../context"
import {
  type CutSummary,
  cutSummarySchema,
  type ListCutsInput,
  listCutsInputSchema,
} from "../contracts/feature"
import { ProtectedMiddleware } from "../middleware/protected"
import {
  FeatureProjectNotAccessibleError,
  FeaturesService,
} from "../services/features.service"

type CutsErrorCode = "INTERNAL_SERVER_ERROR" | "NOT_FOUND" | "UNAUTHORIZED"

const createCutsError = (
  code: CutsErrorCode,
  message: string,
  cause: unknown
): TRPCError => new TRPCError({ cause, code, message })

const getOwnerId = (ctx: Context): string => {
  if (!ctx.session) {
    throw createCutsError(
      "UNAUTHORIZED",
      "Authentication required",
      new Error("Missing session")
    )
  }

  return ctx.session.user.id
}

@Router({ alias: "cuts" })
export class CutsRouter {
  private readonly featuresService: FeaturesService

  constructor(@Inject(FeaturesService) featuresService: FeaturesService) {
    this.featuresService = featuresService
  }

  @UseMiddlewares(ProtectedMiddleware)
  @Query({ input: listCutsInputSchema, output: z.array(cutSummarySchema) })
  async list(
    @Input() input: ListCutsInput,
    @Ctx() context: Context
  ): Promise<CutSummary[]> {
    try {
      return await this.featuresService.listCuts(getOwnerId(context), input)
    } catch (error) {
      if (error instanceof FeatureProjectNotAccessibleError) {
        throw createCutsError("NOT_FOUND", "Project not found", error)
      }

      throw createCutsError(
        "INTERNAL_SERVER_ERROR",
        "Unable to load cuts",
        error
      )
    }
  }
}
