import { relations } from "drizzle-orm"
import {
  boolean,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"
import { user } from "./auth"

export const projectStage = pgEnum("project_stage", [
  "idea",
  "discovery",
  "mvp_scope",
  "building",
  "beta",
  "launched",
  "growing",
])

export const project = pgTable(
  "project",
  {
    alreadyBuilt: text("already_built"),
    alreadyStarted: boolean("already_started").default(false).notNull(),
    archivedAt: timestamp("archived_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    description: text("description").notNull(),
    goal30Days: text("goal_30_days").notNull(),
    hypothesis: text("hypothesis").notNull(),
    id: uuid("id").defaultRandom().primaryKey(),
    launchBlocker: text("launch_blocker"),
    mainProblem: text("main_problem").notNull(),
    name: text("name").notNull(),
    ownerId: text("owner_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    scopeCreepConcern: text("scope_creep_concern"),
    stage: projectStage("stage").default("idea").notNull(),
    targetUser: text("target_user").notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("project_owner_id_idx").on(table.ownerId)]
)

export const projectRelations = relations(project, ({ one }) => ({
  owner: one(user, {
    fields: [project.ownerId],
    references: [user.id],
  }),
}))
