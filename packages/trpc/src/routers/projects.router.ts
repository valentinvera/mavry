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
  type CreateProjectInput,
  createProjectInputSchema,
  type Project,
  type ProjectSummary,
  projectByIdInputSchema,
  projectSchema,
  projectSummarySchema,
} from "../contracts/project"
import { ProtectedMiddleware } from "../middleware/protected"
import { ProjectsService } from "../services/projects.service"

type ProjectErrorCode = "INTERNAL_SERVER_ERROR" | "NOT_FOUND" | "UNAUTHORIZED"

const createProjectError = (
  code: ProjectErrorCode,
  message: string,
  cause: unknown
): TRPCError => new TRPCError({ cause, code, message })

const getOwnerId = (ctx: Context): string => {
  if (!ctx.session) {
    throw createProjectError(
      "UNAUTHORIZED",
      "Authentication required",
      new Error("Missing session")
    )
  }

  return ctx.session.user.id
}

@Router({ alias: "projects" })
export class ProjectsRouter {
  private readonly projectsService: ProjectsService

  constructor(@Inject(ProjectsService) projectsService: ProjectsService) {
    this.projectsService = projectsService
  }

  @UseMiddlewares(ProtectedMiddleware)
  @Query({ output: z.array(projectSummarySchema) })
  async list(@Ctx() context: Context): Promise<ProjectSummary[]> {
    try {
      return await this.projectsService.listForOwner(getOwnerId(context))
    } catch (error) {
      throw createProjectError(
        "INTERNAL_SERVER_ERROR",
        "Unable to load projects",
        error
      )
    }
  }

  @UseMiddlewares(ProtectedMiddleware)
  @Mutation({
    input: createProjectInputSchema,
    output: projectSchema,
  })
  async create(
    @Input() input: CreateProjectInput,
    @Ctx() context: Context
  ): Promise<Project> {
    try {
      return await this.projectsService.createForOwner(
        getOwnerId(context),
        input
      )
    } catch (error) {
      throw createProjectError(
        "INTERNAL_SERVER_ERROR",
        "Unable to create the project",
        error
      )
    }
  }

  @UseMiddlewares(ProtectedMiddleware)
  @Query({ input: projectByIdInputSchema, output: projectSchema })
  async byId(
    @Input() input: { id: string },
    @Ctx() context: Context
  ): Promise<Project> {
    try {
      const found = await this.projectsService.findForOwner(
        getOwnerId(context),
        input.id
      )

      if (!found) {
        throw createProjectError(
          "NOT_FOUND",
          "Project not found",
          new Error("Project not found")
        )
      }

      return found
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error
      }

      throw createProjectError(
        "INTERNAL_SERVER_ERROR",
        "Unable to load the project",
        error
      )
    }
  }
}
