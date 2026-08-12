import { scopeRows } from "@/components/demo/data"

export const inboxItems = [
  {
    id: "mobile-capture",
    title: "Mobile capture stays lightweight",
    source: "Voice note",
    status: "Needs clarity",
    detail: "Can this capture an idea without committing it to build?",
  },
  {
    id: "feedback-route",
    title: "One beta feedback route",
    source: "Founder note",
    status: "Convert",
    detail: "One owner and one channel are enough to unblock beta.",
  },
  {
    id: "public-roadmap",
    title: "Public roadmap after launch",
    source: "Customer call",
    status: "Later",
    detail: "Useful after beta, but too early before the MVP has users.",
  },
  {
    id: "templates",
    title: "Template marketplace",
    source: "Backlog import",
    status: "Reject",
    detail: "It does not help the first version answer its core question.",
  },
] as const

export const scopeColumns = [
  {
    id: "core",
    title: "Core",
    description: "Must validate the product hypothesis",
    rows: scopeRows.filter((row) => row.decision === "Build now"),
  },
  {
    id: "support",
    title: "Support",
    description: "Helps the release without becoming the product",
    rows: scopeRows.filter((row) => row.decision === "Support"),
  },
  {
    id: "later",
    title: "Later",
    description: "Useful after the first release is working",
    rows: scopeRows.filter((row) => row.decision === "Later"),
  },
  {
    id: "cut",
    title: "No for now",
    description: "Visible cuts with reasons",
    rows: scopeRows.filter((row) => row.decision === "Cut"),
  },
] as const

export const checks = [
  ["Hypothesis", "Clear enough for beta", "Done"],
  ["Core scope", "Two build-now features remain in scope", "Done"],
  ["Cuts", "Two cut ideas have reconsider rules", "Done"],
  ["Feedback route", "Owner missing", "Blocked"],
  ["Next action", "Review blocker before more scope", "Review"],
] as const

export const weeklyReviewChanges = [
  {
    id: "feedback-hub",
    title: "Feedback hub requested again",
    from: "Scope pressure",
    to: "Later",
    reason:
      "Useful after beta, but the first release only needs one feedback route.",
    status: "Moved",
  },
  {
    id: "decision-log",
    title: "Decision log moved out of Core",
    from: "Core",
    to: "Support",
    reason:
      "Helpful for clarity, but not required as the main proof of the product.",
    status: "Reduced",
  },
  {
    id: "github-sync",
    title: "GitHub sync stayed cut",
    from: "Reopened",
    to: "No for now",
    reason: "Integration work should wait until manual export becomes painful.",
    status: "Cut",
  },
] as const

export const projectRows = [
  ["Mavry", "Beta MVP", "74", "Feedback owner blocks beta"],
  ["Founder OS", "Idea review", "61", "Scope needs a first pass"],
  ["Launch Notes", "Archive", "88", "No launch blocker"],
] as const

export const archivedIdeas = [
  [
    "Public roadmap",
    "Creates external expectations before beta users finish the first review",
    "Revisit after 20 active users",
  ],
  [
    "GitHub sync",
    "Adds integration work before manual export becomes a real blocker",
    "Revisit after manual export repeats",
  ],
  [
    "Template marketplace",
    "Does not test whether builders can finish an MVP review",
    "Revisit after first launch",
  ],
] as const

export const searchResults = [
  {
    id: "feedback-route",
    title: "One beta feedback route",
    area: "Launch review",
    status: "Blocker",
    detail: "Also appears in Roadmap, Weekly review, and Idea inbox.",
  },
  {
    id: "github-sync",
    title: "GitHub sync cut from MVP",
    area: "Cut list",
    status: "Cut",
    detail: "Reconsider only after manual export becomes a repeated problem.",
  },
  {
    id: "scope-board",
    title: "MVP scope board",
    area: "MVP scope",
    status: "Build now",
    detail: "The core view where builders decide what belongs in the MVP.",
  },
  {
    id: "next-actions",
    title: "Assign feedback owner",
    area: "Next actions",
    status: "Review",
    detail: "The smallest launch action needed before opening beta.",
  },
] as const

export const statusClassNames = {
  Blocker: "bg-warning text-warning-foreground",
  "Build now": "bg-success text-success-foreground",
  Cut: "bg-destructive text-destructive-foreground",
  Review: "border-border/80 bg-background/70 text-foreground",
} as const

export const launchPath = [
  {
    id: "shape",
    label: "Shape",
    title: "Capture the messy starting point",
    detail:
      "Ideas enter the workspace as product context before they become scope.",
  },
  {
    id: "protect",
    label: "Protect",
    title: "Lock beta scope",
    detail:
      "Core stays small while Later and No for now remain easy to revisit.",
  },
  {
    id: "open",
    label: "Open",
    title: "Ship a beta with one feedback route",
    detail:
      "The beta can launch with ownership and one feedback path instead of a larger system.",
  },
  {
    id: "learn",
    label: "Learn",
    title: "Review what users ask for",
    detail:
      "New requests pass through review before they change the product direction.",
  },
] as const

export const qrGridSize = 13
export const qrActiveCells = new Set([
  "0-5",
  "0-7",
  "1-4",
  "1-8",
  "2-5",
  "2-7",
  "3-3",
  "3-6",
  "3-9",
  "4-1",
  "4-4",
  "4-7",
  "4-10",
  "5-0",
  "5-2",
  "5-5",
  "5-8",
  "5-11",
  "6-3",
  "6-6",
  "6-9",
  "6-12",
  "7-0",
  "7-4",
  "7-7",
  "7-10",
  "8-2",
  "8-5",
  "8-8",
  "8-11",
  "9-4",
  "9-7",
  "9-12",
  "10-5",
  "10-9",
  "11-4",
  "11-6",
  "11-10",
  "12-5",
  "12-8",
  "12-11",
])
export const qrCells = Array.from(
  { length: qrGridSize * qrGridSize },
  (_, index) => ({
    column: index % qrGridSize,
    row: Math.floor(index / qrGridSize),
  })
)

export const homeDecisionSignals = [
  {
    id: "scope",
    label: "Scope pressure",
    value: "low",
    detail: "Core stayed limited to the features that define the MVP.",
    className: "border-success/40 bg-success/10 text-success-foreground",
  },
  {
    id: "launch",
    label: "Launch risk",
    value: "open",
    detail: "The feedback route still needs a responsible owner.",
    className: "border-warning/40 bg-warning/10 text-warning-foreground",
  },
  {
    id: "cuts",
    label: "Cut debt",
    value: "saved",
    detail: "Two removed ideas keep their reason and return condition.",
    className:
      "border-destructive/40 bg-destructive/10 text-destructive-foreground",
  },
] as const

export const backlogRiskLenses = [
  ["Impact", "High", "Quick capture, MVP scope board"],
  ["Effort", "Medium", "Decision log needs polish, not automation"],
  ["Confidence", "Mixed", "Feedback route needs owner"],
  ["Risk", "Cut", "Integrations widen the MVP"],
] as const

export const weeklyReviewSignals = [
  ["New ideas", "+9"],
  ["Moved", "3"],
  ["Cuts kept", "2"],
  ["Next actions", "3"],
] as const

export const cutConditions = [
  ["GitHub sync", "Integration work before product proof", "Manual export"],
  [
    "Template marketplace",
    "Does not validate decision clarity",
    "After launch",
  ],
] as const

export const launchGates = [
  ["Scope locked", "Ready"],
  ["Cuts visible", "Ready"],
  ["Roadmap ordered", "Ready"],
  ["Feedback owner", "Blocked"],
] as const

export const projectSignals = [
  ["Mavry", "current", "74", "Launch review"],
  ["Founder OS", "needs intake", "61", "Scope needs review"],
  ["Launch Notes", "parked", "88", "No launch blocker"],
] as const
