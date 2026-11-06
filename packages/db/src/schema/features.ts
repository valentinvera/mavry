import { relations, sql } from "drizzle-orm"
import {
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core"
import { idea } from "./ideas"
import { project } from "./projects"

export const featureClassification = pgEnum("feature_classification", [
  "core",
  "support",
  "later",
  "no_for_now",
  "unclassified",
])

export const featureStatus = pgEnum("feature_status", [
  "needs_clarity",
  "candidate",
  "planned",
  "in_progress",
  "cooked",
  "ready",
  "shipped",
  "cut",
])

export const feature = pgTable(
  "feature",
  {
    classification: featureClassification("classification")
      .default("unclassified")
      .notNull(),
    confidence: integer("confidence"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    createdFromIdeaId: uuid("created_from_idea_id").references(() => idea.id, {
      onDelete: "set null",
    }),
    dependenciesNote: text("dependencies_note"),
    description: text("description"),
    effort: integer("effort"),
    hypothesisFit: integer("hypothesis_fit"),
    id: uuid("id").defaultRandom().primaryKey(),
    impact: integer("impact"),
    priorityReason: text("priority_reason"),
    priorityScore: integer("priority_score"),
    problem: text("problem"),
    projectId: uuid("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    risk: integer("risk"),
    stageFit: integer("stage_fit"),
    status: featureStatus("status").default("needs_clarity").notNull(),
    title: text("title").notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    userSegment: text("user_segment"),
  },
  (table) => [
    index("feature_project_id_idx").on(table.projectId),
    index("feature_project_classification_idx").on(
      table.projectId,
      table.classification
    ),
    check(
      "feature_confidence_check",
      sql`${table.confidence} is null or ${table.confidence} between 1 and 5`
    ),
    check(
      "feature_effort_check",
      sql`${table.effort} is null or ${table.effort} between 1 and 5`
    ),
    check(
      "feature_hypothesis_fit_check",
      sql`${table.hypothesisFit} is null or ${table.hypothesisFit} between 1 and 5`
    ),
    check(
      "feature_impact_check",
      sql`${table.impact} is null or ${table.impact} between 1 and 5`
    ),
    check(
      "feature_risk_check",
      sql`${table.risk} is null or ${table.risk} between 1 and 5`
    ),
    check(
      "feature_stage_fit_check",
      sql`${table.stageFit} is null or ${table.stageFit} between 1 and 5`
    ),
  ]
)

export const cut = pgTable(
  "cut",
  {
    createdAt: timestamp("created_at").defaultNow().notNull(),
    featureId: uuid("feature_id")
      .notNull()
      .references(() => feature.id, { onDelete: "cascade" }),
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    reason: text("reason").notNull(),
    reconsiderWhen: text("reconsider_when"),
  },
  (table) => [
    uniqueIndex("cut_feature_id_idx").on(table.featureId),
    index("cut_project_id_idx").on(table.projectId),
  ]
)

export const featureRelations = relations(feature, ({ one }) => ({
  project: one(project, {
    fields: [feature.projectId],
    references: [project.id],
  }),
}))

export const cutRelations = relations(cut, ({ one }) => ({
  feature: one(feature, {
    fields: [cut.featureId],
    references: [feature.id],
  }),
  project: one(project, {
    fields: [cut.projectId],
    references: [project.id],
  }),
}))
