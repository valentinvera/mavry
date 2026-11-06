import { db } from "@mavry/db"
import { idea } from "@mavry/db/schema/ideas"
import { project } from "@mavry/db/schema/projects"
import { Injectable } from "@nestjs/common"
import { and, desc, eq } from "drizzle-orm"
import type {
  CreateIdeaInput,
  Idea,
  IdeaStatus,
  IdeaSummary,
} from "../contracts/idea"

type IdeaRow = typeof idea.$inferSelect

export class ProjectNotAccessibleError extends Error {
  constructor() {
    super("Project not found")
    this.name = "ProjectNotAccessibleError"
  }
}

export class IdeaNotFoundError extends Error {
  constructor() {
    super("Idea not found")
    this.name = "IdeaNotFoundError"
  }
}

const toIdea = (row: IdeaRow): Idea => ({
  convertedFeatureId: row.convertedFeatureId,
  createdAt: row.createdAt.toISOString(),
  id: row.id,
  note: row.note,
  projectId: row.projectId,
  source: row.source,
  status: row.status,
  title: row.title,
  updatedAt: row.updatedAt.toISOString(),
})

const toIdeaSummary = (row: IdeaRow): IdeaSummary => ({
  createdAt: row.createdAt.toISOString(),
  id: row.id,
  note: row.note,
  source: row.source,
  status: row.status,
  title: row.title,
  updatedAt: row.updatedAt.toISOString(),
})

@Injectable()
export class IdeasService {
  async listForProject(
    ownerId: string,
    projectId: string,
    status?: IdeaStatus
  ): Promise<IdeaSummary[]> {
    await this.assertProjectAccess(ownerId, projectId)

    const rows = await db
      .select()
      .from(idea)
      .where(
        status
          ? and(eq(idea.projectId, projectId), eq(idea.status, status))
          : eq(idea.projectId, projectId)
      )
      .orderBy(desc(idea.updatedAt))

    return rows.map(toIdeaSummary)
  }

  async createForProject(
    ownerId: string,
    input: CreateIdeaInput
  ): Promise<Idea> {
    await this.assertProjectAccess(ownerId, input.projectId)

    const [row] = await db
      .insert(idea)
      .values({
        note: input.note,
        projectId: input.projectId,
        source: input.source,
        title: input.title,
      })
      .returning()

    if (!row) {
      throw new Error("Idea insert returned no row")
    }

    return toIdea(row)
  }

  async updateStatus(
    ownerId: string,
    id: string,
    status: IdeaStatus
  ): Promise<Idea> {
    const [existing] = await db
      .select({ projectId: idea.projectId })
      .from(idea)
      .where(eq(idea.id, id))
      .limit(1)

    if (!existing) {
      throw new IdeaNotFoundError()
    }

    await this.assertProjectAccess(ownerId, existing.projectId)

    const [row] = await db
      .update(idea)
      .set({ status })
      .where(eq(idea.id, id))
      .returning()

    if (!row) {
      throw new IdeaNotFoundError()
    }

    return toIdea(row)
  }

  private async assertProjectAccess(
    ownerId: string,
    projectId: string
  ): Promise<void> {
    const [row] = await db
      .select({ id: project.id })
      .from(project)
      .where(and(eq(project.id, projectId), eq(project.ownerId, ownerId)))
      .limit(1)

    if (!row) {
      throw new ProjectNotAccessibleError()
    }
  }
}
