import { db } from "@mavry/db"
import { project } from "@mavry/db/schema/projects"
import { Injectable } from "@nestjs/common"
import { and, desc, eq, isNull } from "drizzle-orm"
import type {
  CreateProjectInput,
  Project,
  ProjectSummary,
} from "../contracts/project"

type ProjectRow = typeof project.$inferSelect

const toProject = (row: ProjectRow): Project => ({
  alreadyBuilt: row.alreadyBuilt ?? undefined,
  alreadyStarted: row.alreadyStarted,
  archivedAt: row.archivedAt?.toISOString() ?? null,
  createdAt: row.createdAt.toISOString(),
  description: row.description,
  goal30Days: row.goal30Days,
  hypothesis: row.hypothesis,
  id: row.id,
  launchBlocker: row.launchBlocker ?? undefined,
  mainProblem: row.mainProblem,
  name: row.name,
  ownerId: row.ownerId,
  scopeCreepConcern: row.scopeCreepConcern ?? undefined,
  stage: row.stage,
  targetUser: row.targetUser,
  updatedAt: row.updatedAt.toISOString(),
})

const toProjectSummary = (row: ProjectRow): ProjectSummary => ({
  createdAt: row.createdAt.toISOString(),
  description: row.description,
  id: row.id,
  name: row.name,
  stage: row.stage,
  updatedAt: row.updatedAt.toISOString(),
})

@Injectable()
export class ProjectsService {
  async listForOwner(ownerId: string): Promise<ProjectSummary[]> {
    const rows = await db
      .select()
      .from(project)
      .where(and(eq(project.ownerId, ownerId), isNull(project.archivedAt)))
      .orderBy(desc(project.updatedAt))

    return rows.map(toProjectSummary)
  }

  async createForOwner(
    ownerId: string,
    input: CreateProjectInput
  ): Promise<Project> {
    const [row] = await db
      .insert(project)
      .values({
        alreadyBuilt: input.alreadyBuilt,
        alreadyStarted: input.alreadyStarted,
        description: input.description,
        goal30Days: input.goal30Days,
        hypothesis: input.hypothesis,
        launchBlocker: input.launchBlocker,
        mainProblem: input.mainProblem,
        name: input.name,
        ownerId,
        scopeCreepConcern: input.scopeCreepConcern,
        stage: input.stage,
        targetUser: input.targetUser,
      })
      .returning()

    if (!row) {
      throw new Error("Project insert returned no row")
    }

    return toProject(row)
  }

  async findForOwner(ownerId: string, id: string): Promise<Project | null> {
    const [row] = await db
      .select()
      .from(project)
      .where(and(eq(project.id, id), eq(project.ownerId, ownerId)))
      .limit(1)

    return row ? toProject(row) : null
  }
}
