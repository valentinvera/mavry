import { Inject } from "@nestjs/common"
import { TRPCError } from "@trpc/server"
import {
  Ctx,
  Input,
  Mutation,
  Query,
  Router,
  UseMiddlewares,
} from "nestjs-trpc"
import { z } from "zod"
import type { Context } from "../context"
import {
  type ClassifyFeatureInput,
  type CreateFeatureInput,
  classifyFeatureInputSchema,
  createFeatureInputSchema,
  type Feature,
  featureSchema,
  type ListFeaturesInput,
  listFeaturesInputSchema,
} from "../contracts/feature"
import { ProtectedMiddleware } from "../middleware/protected"
import {
  FeatureNotFoundError,
  FeatureProjectNotAccessibleError,
  FeaturesService,
} from "../services/features.service"

type FeatureErrorCode = "INTERNAL_SERVER_ERROR" | "NOT_FOUND" | "UNAUTHORIZED"

const createFeatureError = (
  code: FeatureErrorCode,
  message: string,
  cause: unknown
): TRPCError => new TRPCError({ cause, code, message })

const mapFeatureError = (error: unknown): TRPCError => {
  if (error instanceof FeatureProjectNotAccessibleError) {
    return createFeatureError("NOT_FOUND", "Project not found", error)
  }

  if (error instanceof FeatureNotFoundError) {
    return createFeatureError("NOT_FOUND", "Feature not found", error)
  }

  return createFeatureError(
    "INTERNAL_SERVER_ERROR",
    "Unable to complete the request",
    error
  )
}

const getOwnerId = (ctx: Context): string => {
  if (!ctx.session) {
    throw createFeatureError(
      "UNAUTHORIZED",
      "Authentication required",
      new Error("Missing session")
    )
  }

  return ctx.session.user.id
}

@Router({ alias: "features" })
export class FeaturesRouter {
  private readonly featuresService: FeaturesService

  constructor(@Inject(FeaturesService) featuresService: FeaturesService) {
    this.featuresService = featuresService
  }

  @UseMiddlewares(ProtectedMiddleware)
  @Query({ input: listFeaturesInputSchema, output: z.array(featureSchema) })
  async list(
    @Input() input: ListFeaturesInput,
    @Ctx() context: Context
  ): Promise<Feature[]> {
    try {
      return await this.featuresService.listForProject(
        getOwnerId(context),
        input
      )
    } catch (error) {
      throw mapFeatureError(error)
    }
  }

  @UseMiddlewares(ProtectedMiddleware)
  @Mutation({ input: createFeatureInputSchema, output: featureSchema })
  async create(
    @Input() input: CreateFeatureInput,
    @Ctx() context: Context
  ): Promise<Feature> {
    try {
      return await this.featuresService.createForProject(
        getOwnerId(context),
        input
      )
    } catch (error) {
      throw mapFeatureError(error)
    }
  }

  @UseMiddlewares(ProtectedMiddleware)
  @Mutation({ input: classifyFeatureInputSchema, output: featureSchema })
  async classify(
    @Input() input: ClassifyFeatureInput,
    @Ctx() context: Context
  ): Promise<Feature> {
    try {
      return await this.featuresService.classify(getOwnerId(context), input)
    } catch (error) {
      throw mapFeatureError(error)
    }
  }
}
