import { db } from "@mavry/db"
import { cut, feature } from "@mavry/db/schema/features"
import { project } from "@mavry/db/schema/projects"
import { Injectable } from "@nestjs/common"
import { and, desc, eq } from "drizzle-orm"
import type {
  ClassifyFeatureInput,
  CreateFeatureInput,
  CutSummary,
  Feature,
  FeatureStatus,
  ListCutsInput,
  ListFeaturesInput,
} from "../contracts/feature"

type FeatureRow = typeof feature.$inferSelect

export class FeatureProjectNotAccessibleError extends Error {
  constructor() {
    super("Project not found")
    this.name = "FeatureProjectNotAccessibleError"
  }
}

export class FeatureNotFoundError extends Error {
  constructor() {
    super("Feature not found")
    this.name = "FeatureNotFoundError"
  }
}

const toFeature = (row: FeatureRow): Feature => ({
  classification: row.classification,
  confidence: row.confidence,
  createdAt: row.createdAt.toISOString(),
  createdFromIdeaId: row.createdFromIdeaId,
  dependenciesNote: row.dependenciesNote,
  description: row.description,
  effort: row.effort,
  hypothesisFit: row.hypothesisFit,
  id: row.id,
  impact: row.impact,
  priorityReason: row.priorityReason,
  priorityScore: row.priorityScore,
  problem: row.problem,
  projectId: row.projectId,
  risk: row.risk,
  stageFit: row.stageFit,
  status: row.status,
  title: row.title,
  updatedAt: row.updatedAt.toISOString(),
  userSegment: row.userSegment,
})

const getClassifiedStatus = (
  classification: ClassifyFeatureInput["classification"],
  currentStatus: FeatureStatus
): FeatureStatus => {
  if (classification === "no_for_now") {
    return "cut"
  }

  return currentStatus === "cut" ? "candidate" : currentStatus
}

@Injectable()
export class FeaturesService {
  async listForProject(
    ownerId: string,
    input: ListFeaturesInput
  ): Promise<Feature[]> {
    await this.assertProjectAccess(ownerId, input.projectId)

    const conditions = [eq(feature.projectId, input.projectId)]

    if (input.classification) {
      conditions.push(eq(feature.classification, input.classification))
    }

    if (input.status) {
      conditions.push(eq(feature.status, input.status))
    }

    const rows = await db
      .select()
      .from(feature)
      .where(and(...conditions))
      .orderBy(desc(feature.updatedAt))

    return rows.map(toFeature)
  }

  async createForProject(
    ownerId: string,
    input: CreateFeatureInput
  ): Promise<Feature> {
    await this.assertProjectAccess(ownerId, input.projectId)

    const [row] = await db
      .insert(feature)
      .values({
        createdFromIdeaId: input.createdFromIdeaId,
        description: input.description,
        problem: input.problem,
        projectId: input.projectId,
        title: input.title,
        userSegment: input.userSegment,
      })
      .returning()

    if (!row) {
      throw new Error("Feature insert returned no row")
    }

    return toFeature(row)
  }

  async classify(
    ownerId: string,
    input: ClassifyFeatureInput
  ): Promise<Feature> {
    const [existing] = await db
      .select()
      .from(feature)
      .where(eq(feature.id, input.id))
      .limit(1)

    if (!existing) {
      throw new FeatureNotFoundError()
    }

    await this.assertProjectAccess(ownerId, existing.projectId)

    if (input.classification === "no_for_now" && input.reason) {
      await db
        .insert(cut)
        .values({
          featureId: existing.id,
          projectId: existing.projectId,
          reason: input.reason,
          reconsiderWhen: input.reconsiderWhen,
        })
        .onConflictDoUpdate({
          set: {
            reason: input.reason,
            reconsiderWhen: input.reconsiderWhen,
          },
          target: cut.featureId,
        })
    }

    const [row] = await db
      .update(feature)
      .set({
        classification: input.classification,
        priorityReason: input.reason ?? existing.priorityReason,
        status: getClassifiedStatus(input.classification, existing.status),
      })
      .where(eq(feature.id, existing.id))
      .returning()

    if (!row) {
      throw new FeatureNotFoundError()
    }

    return toFeature(row)
  }

  async listCuts(ownerId: string, input: ListCutsInput): Promise<CutSummary[]> {
    await this.assertProjectAccess(ownerId, input.projectId)

    const rows = await db
      .select({
        createdAt: cut.createdAt,
        featureId: cut.featureId,
        featureTitle: feature.title,
        id: cut.id,
        reason: cut.reason,
        reconsiderWhen: cut.reconsiderWhen,
      })
      .from(cut)
      .innerJoin(feature, eq(cut.featureId, feature.id))
      .where(
        and(
          eq(cut.projectId, input.projectId),
          eq(feature.classification, "no_for_now")
        )
      )
      .orderBy(desc(cut.createdAt))

    return rows.map((row) => ({
      ...row,
      createdAt: row.createdAt.toISOString(),
    }))
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
      throw new FeatureProjectNotAccessibleError()
    }
  }
}
