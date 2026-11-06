import { z } from "zod"

const TITLE_MAX_LENGTH = 160
const TEXT_MAX_LENGTH = 2000
const REASON_MAX_LENGTH = 1000
const SEGMENT_MAX_LENGTH = 200

export const featureClassificationSchema = z.enum([
  "core",
  "support",
  "later",
  "no_for_now",
  "unclassified",
])

export const featureStatusSchema = z.enum([
  "needs_clarity",
  "candidate",
  "planned",
  "in_progress",
  "cooked",
  "ready",
  "shipped",
  "cut",
])

const scoreSchema = z.number().int().min(1).max(5).nullable()

export const featureSchema = z.object({
  classification: featureClassificationSchema,
  confidence: scoreSchema,
  createdAt: z.iso.datetime(),
  createdFromIdeaId: z.uuid().nullable(),
  dependenciesNote: z.string().nullable(),
  description: z.string().nullable(),
  effort: scoreSchema,
  hypothesisFit: scoreSchema,
  id: z.uuid(),
  impact: scoreSchema,
  priorityReason: z.string().nullable(),
  priorityScore: z.number().int().nullable(),
  problem: z.string().nullable(),
  projectId: z.uuid(),
  risk: scoreSchema,
  stageFit: scoreSchema,
  status: featureStatusSchema,
  title: z.string(),
  updatedAt: z.iso.datetime(),
  userSegment: z.string().nullable(),
})

export const listFeaturesInputSchema = z.object({
  classification: featureClassificationSchema.optional(),
  projectId: z.uuid(),
  status: featureStatusSchema.optional(),
})

export const createFeatureInputSchema = z.object({
  createdFromIdeaId: z.uuid().optional(),
  description: z.string().trim().max(TEXT_MAX_LENGTH).optional(),
  problem: z.string().trim().max(TEXT_MAX_LENGTH).optional(),
  projectId: z.uuid(),
  title: z.string().trim().min(1).max(TITLE_MAX_LENGTH),
  userSegment: z.string().trim().max(SEGMENT_MAX_LENGTH).optional(),
})

export const classifyFeatureInputSchema = z
  .object({
    classification: featureClassificationSchema,
    id: z.uuid(),
    reason: z.string().trim().max(REASON_MAX_LENGTH).optional(),
    reconsiderWhen: z.string().trim().max(REASON_MAX_LENGTH).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.classification === "no_for_now" && !value.reason) {
      ctx.addIssue({
        code: "custom",
        message: "A cut needs a reason",
        path: ["reason"],
      })
    }

    if (value.classification === "core" && !value.reason) {
      ctx.addIssue({
        code: "custom",
        message: "Core features need a reason",
        path: ["reason"],
      })
    }
  })

export const cutSummarySchema = z.object({
  createdAt: z.iso.datetime(),
  featureId: z.uuid(),
  featureTitle: z.string(),
  id: z.uuid(),
  reason: z.string(),
  reconsiderWhen: z.string().nullable(),
})

export const listCutsInputSchema = z.object({
  projectId: z.uuid(),
})

export type ClassifyFeatureInput = z.infer<typeof classifyFeatureInputSchema>
export type CreateFeatureInput = z.infer<typeof createFeatureInputSchema>
export type CutSummary = z.infer<typeof cutSummarySchema>
export type Feature = z.infer<typeof featureSchema>
export type FeatureClassification = z.infer<typeof featureClassificationSchema>
export type FeatureStatus = z.infer<typeof featureStatusSchema>
export type ListCutsInput = z.infer<typeof listCutsInputSchema>
export type ListFeaturesInput = z.infer<typeof listFeaturesInputSchema>
