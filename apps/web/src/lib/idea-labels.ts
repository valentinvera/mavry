import type { IdeaSource, IdeaStatus } from "@mavry/trpc/contracts/idea"

export const IDEA_STATUS_LABELS: Record<IdeaStatus, string> = {
  candidate: "Candidate",
  converted: "Converted",
  later: "Later",
  needs_clarity: "Needs clarity",
  new: "New",
  rejected: "Rejected",
}

export const IDEA_SOURCE_LABELS: Record<IdeaSource, string> = {
  competitor: "Competitor",
  mobile: "Mobile",
  other: "Other",
  personal_note: "Personal note",
  user_feedback: "User feedback",
  web: "Web",
}

export type EditableIdeaStatus = Exclude<IdeaStatus, "converted">

export const EDITABLE_IDEA_STATUSES: EditableIdeaStatus[] = [
  "new",
  "needs_clarity",
  "candidate",
  "later",
  "rejected",
]
