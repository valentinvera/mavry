import { relations } from "drizzle-orm"
import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"
import { project } from "./projects"

export const ideaStatus = pgEnum("idea_status", [
  "new",
  "needs_clarity",
  "candidate",
  "later",
  "rejected",
  "converted",
])

export const ideaSource = pgEnum("idea_source", [
  "web",
  "mobile",
  "user_feedback",
  "competitor",
  "personal_note",
  "other",
])

export const idea = pgTable(
  "idea",
  {
    convertedFeatureId: uuid("converted_feature_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    id: uuid("id").defaultRandom().primaryKey(),
    note: text("note"),
    projectId: uuid("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    source: ideaSource("source").default("web").notNull(),
    status: ideaStatus("status").default("new").notNull(),
    title: text("title").notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("idea_project_id_idx").on(table.projectId),
    index("idea_project_status_idx").on(table.projectId, table.status),
  ]
)

export const ideaRelations = relations(idea, ({ one }) => ({
  project: one(project, {
    fields: [idea.projectId],
    references: [project.id],
  }),
}))
