import type { ProjectStage } from "@mavry/trpc"

export const PROJECT_STAGE_LABELS: Record<ProjectStage, string> = {
  beta: "Beta",
  building: "Building",
  discovery: "Discovery",
  growing: "Growing",
  idea: "Idea",
  launched: "Launched",
  mvp_scope: "MVP scope",
}

export const PROJECT_STAGES: ProjectStage[] = [
  "idea",
  "discovery",
  "mvp_scope",
  "building",
  "beta",
  "launched",
  "growing",
]
