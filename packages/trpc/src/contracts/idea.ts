import { z } from "zod"

const TITLE_MAX_LENGTH = 160
const NOTE_MAX_LENGTH = 2000

export const ideaStatusSchema = z.enum([
  "new",
  "needs_clarity",
  "candidate",
  "later",
  "rejected",
  "converted",
])

export const ideaSourceSchema = z.enum([
  "web",
  "mobile",
  "user_feedback",
  "competitor",
  "personal_note",
  "other",
])

export const ideaSchema = z.object({
  convertedFeatureId: z.uuid().nullable(),
  createdAt: z.iso.datetime(),
  id: z.uuid(),
  note: z.string().nullable(),
  projectId: z.uuid(),
  source: ideaSourceSchema,
  status: ideaStatusSchema,
  title: z.string(),
  updatedAt: z.iso.datetime(),
})

export const ideaSummarySchema = z.object({
  createdAt: z.iso.datetime(),
  id: z.uuid(),
  note: z.string().nullable(),
  source: ideaSourceSchema,
  status: ideaStatusSchema,
  title: z.string(),
  updatedAt: z.iso.datetime(),
})

export const listIdeasInputSchema = z.object({
  projectId: z.uuid(),
  status: ideaStatusSchema.optional(),
})

export const createIdeaInputSchema = z.object({
  note: z.string().trim().max(NOTE_MAX_LENGTH).optional(),
  projectId: z.uuid(),
  source: ideaSourceSchema.default("web"),
  title: z.string().trim().min(1).max(TITLE_MAX_LENGTH),
})

export const updateIdeaStatusInputSchema = z.object({
  id: z.uuid(),
  status: z.enum(["new", "needs_clarity", "candidate", "later", "rejected"]),
})

export type CreateIdeaInput = z.infer<typeof createIdeaInputSchema>
export type Idea = z.infer<typeof ideaSchema>
export type IdeaSource = z.infer<typeof ideaSourceSchema>
export type IdeaStatus = z.infer<typeof ideaStatusSchema>
export type IdeaSummary = z.infer<typeof ideaSummarySchema>
export type ListIdeasInput = z.infer<typeof listIdeasInputSchema>
export type UpdateIdeaStatusInput = z.infer<typeof updateIdeaStatusInputSchema>
