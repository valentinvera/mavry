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
  type CreateIdeaInput,
  createIdeaInputSchema,
  type Idea,
  type IdeaStatus,
  type IdeaSummary,
  ideaSchema,
  ideaSummarySchema,
  type ListIdeasInput,
  listIdeasInputSchema,
  type UpdateIdeaStatusInput,
  updateIdeaStatusInputSchema,
} from "../contracts/idea"
import { ProtectedMiddleware } from "../middleware/protected"
import {
  IdeaNotFoundError,
  IdeasService,
  ProjectNotAccessibleError,
} from "../services/ideas.service"

type IdeasErrorCode = "INTERNAL_SERVER_ERROR" | "NOT_FOUND" | "UNAUTHORIZED"

const createIdeasError = (
  code: IdeasErrorCode,
  message: string,
  cause: unknown
): TRPCError => new TRPCError({ cause, code, message })

const mapIdeasError = (error: unknown): TRPCError => {
  if (error instanceof ProjectNotAccessibleError) {
    return createIdeasError("NOT_FOUND", "Project not found", error)
  }

  if (error instanceof IdeaNotFoundError) {
    return createIdeasError("NOT_FOUND", "Idea not found", error)
  }

  return createIdeasError(
    "INTERNAL_SERVER_ERROR",
    "Unable to complete the request",
    error
  )
}

const getOwnerId = (ctx: Context): string => {
  if (!ctx.session) {
    throw createIdeasError(
      "UNAUTHORIZED",
      "Authentication required",
      new Error("Missing session")
    )
  }

  return ctx.session.user.id
}

@Router({ alias: "ideas" })
export class IdeasRouter {
  private readonly ideasService: IdeasService

  constructor(@Inject(IdeasService) ideasService: IdeasService) {
    this.ideasService = ideasService
  }

  @UseMiddlewares(ProtectedMiddleware)
  @Query({ input: listIdeasInputSchema, output: z.array(ideaSummarySchema) })
  async list(
    @Input() input: ListIdeasInput,
    @Ctx() context: Context
  ): Promise<IdeaSummary[]> {
    try {
      return await this.ideasService.listForProject(
        getOwnerId(context),
        input.projectId,
        input.status
      )
    } catch (error) {
      throw mapIdeasError(error)
    }
  }

  @UseMiddlewares(ProtectedMiddleware)
  @Mutation({ input: createIdeaInputSchema, output: ideaSchema })
  async create(
    @Input() input: CreateIdeaInput,
    @Ctx() context: Context
  ): Promise<Idea> {
    try {
      return await this.ideasService.createForProject(
        getOwnerId(context),
        input
      )
    } catch (error) {
      throw mapIdeasError(error)
    }
  }

  @UseMiddlewares(ProtectedMiddleware)
  @Mutation({ input: updateIdeaStatusInputSchema, output: ideaSchema })
  async updateStatus(
    @Input() input: UpdateIdeaStatusInput,
    @Ctx() context: Context
  ): Promise<Idea> {
    try {
      return await this.ideasService.updateStatus(
        getOwnerId(context),
        input.id,
        input.status as IdeaStatus
      )
    } catch (error) {
      throw mapIdeasError(error)
    }
  }
}
