import { z } from "zod"

const NAME_MAX_LENGTH = 80
const DESCRIPTION_MAX_LENGTH = 280
const TARGET_USER_MAX_LENGTH = 200
const PROBLEM_MAX_LENGTH = 1000
const HYPOTHESIS_MAX_LENGTH = 1000
const GOAL_MAX_LENGTH = 500
const DETAIL_MAX_LENGTH = 1000

export const projectStageSchema = z.enum([
  "idea",
  "discovery",
  "mvp_scope",
  "building",
  "beta",
  "launched",
  "growing",
])

const projectDetailsSchema = z.object({
  alreadyBuilt: z.string().trim().max(DETAIL_MAX_LENGTH).optional(),
  alreadyStarted: z.boolean(),
  description: z.string().trim().min(1).max(DESCRIPTION_MAX_LENGTH),
  goal30Days: z.string().trim().min(1).max(GOAL_MAX_LENGTH),
  hypothesis: z.string().trim().min(1).max(HYPOTHESIS_MAX_LENGTH),
  launchBlocker: z.string().trim().max(DETAIL_MAX_LENGTH).optional(),
  mainProblem: z.string().trim().min(1).max(PROBLEM_MAX_LENGTH),
  name: z.string().trim().min(1).max(NAME_MAX_LENGTH),
  scopeCreepConcern: z.string().trim().max(DETAIL_MAX_LENGTH).optional(),
  stage: projectStageSchema,
  targetUser: z.string().trim().min(1).max(TARGET_USER_MAX_LENGTH),
})

export const createProjectInputSchema = projectDetailsSchema.superRefine(
  (value, ctx) => {
    if (!value.alreadyStarted) {
      return
    }

    if (!value.alreadyBuilt) {
      ctx.addIssue({
        code: "custom",
        message: "Describe what is already built",
        path: ["alreadyBuilt"],
      })
    }

    if (!value.launchBlocker) {
      ctx.addIssue({
        code: "custom",
        message: "Describe what is blocking launch",
        path: ["launchBlocker"],
      })
    }
  }
)

export const projectSchema = projectDetailsSchema.extend({
  archivedAt: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
  id: z.uuid(),
  ownerId: z.string().min(1),
  updatedAt: z.iso.datetime(),
})

export const projectSummarySchema = z.object({
  createdAt: z.iso.datetime(),
  description: z.string(),
  id: z.uuid(),
  name: z.string(),
  stage: projectStageSchema,
  updatedAt: z.iso.datetime(),
})

export const projectByIdInputSchema = z.object({
  id: z.uuid(),
})

export type CreateProjectInput = z.infer<typeof createProjectInputSchema>
export type Project = z.infer<typeof projectSchema>
export type ProjectSummary = z.infer<typeof projectSummarySchema>
export type ProjectStage = z.infer<typeof projectStageSchema>
