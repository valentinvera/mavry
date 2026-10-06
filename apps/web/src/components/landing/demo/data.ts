import {
  ArchiveIcon,
  CalendarCheckIcon,
  CircleGaugeIcon,
  ClipboardCheckIcon,
  GitPullRequestArrowIcon,
  HomeIcon,
  InboxIcon,
  LayoutDashboardIcon,
  ListChecksIcon,
  ListTodoIcon,
  NotebookTabsIcon,
  RouteIcon,
  ScissorsIcon,
  SearchIcon,
  SmartphoneIcon,
} from "lucide-react"

export const navMain = [
  {
    id: "home",
    title: "Home",
    icon: HomeIcon,
  },
  {
    id: "idea-inbox",
    title: "Idea inbox",
    icon: InboxIcon,
  },
  {
    id: "feature-backlog",
    title: "Feature backlog",
    icon: ListTodoIcon,
  },
  {
    id: "scope",
    title: "MVP scope",
    icon: ListChecksIcon,
  },
  {
    id: "roadmap",
    title: "Roadmap",
    icon: RouteIcon,
  },
  {
    id: "readiness",
    title: "Readiness",
    icon: CircleGaugeIcon,
  },
  {
    id: "weekly-review",
    title: "Weekly review",
    icon: CalendarCheckIcon,
  },
] as const

export const documents = [
  {
    id: "cut-list",
    title: "Cut list",
    value: "2 decisions",
    icon: ScissorsIcon,
  },
  {
    id: "decision-log",
    title: "Decision log",
    value: "18 notes",
    icon: NotebookTabsIcon,
  },
  {
    id: "launch-review",
    title: "Launch review",
    value: "1 blocker",
    icon: ClipboardCheckIcon,
  },
] as const

export const secondaryNav = [
  { id: "search", title: "Project search", icon: SearchIcon },
  { id: "archive", title: "Archived ideas", icon: ArchiveIcon },
  { id: "projects", title: "Projects", icon: LayoutDashboardIcon },
  { id: "mobile-capture", title: "Mobile capture", icon: SmartphoneIcon },
] as const

export type MainPageId = (typeof navMain)[number]["id"]
export type DocumentPageId = (typeof documents)[number]["id"]
export type SecondaryPageId = (typeof secondaryNav)[number]["id"]
export type PageId = MainPageId | DocumentPageId | SecondaryPageId

export const cards = [
  {
    id: "readiness",
    label: "MVP readiness",
    value: "74",
    suffix: "/100",
    badge: "+8",
    description:
      "Scope and cuts are clear; feedback ownership still blocks beta.",
  },
  {
    id: "build-now",
    label: "Build now",
    value: "6",
    suffix: "features",
    badge: "Core",
    description: "Features that belong in the first shippable version.",
  },
  {
    id: "cut",
    label: "Cut from MVP",
    value: "2",
    suffix: "ideas",
    badge: "Saved",
    description: "Ideas removed from launch with a saved reason.",
  },
  {
    id: "blocker",
    label: "Launch blocker",
    value: "1",
    suffix: "open",
    badge: "Review",
    description: "The beta needs one owner for the feedback route.",
  },
] as const

export const readinessSeries = [
  { id: "intake", label: "Intake", score: 42 },
  { id: "scope", label: "Scope", score: 58 },
  { id: "cuts", label: "Cuts", score: 68 },
  { id: "review", label: "Review", score: 74 },
  { id: "launch", label: "Launch", score: 80 },
] as const

export const roadmapLanes = [
  {
    id: "now",
    label: "Now",
    summary: "Scope board, intake, decision log",
    detail: "The first release needs intake, scope, and saved decisions.",
  },
  {
    id: "next",
    label: "Next",
    summary: "Readiness review and beta feedback",
    detail: "Resolve the feedback route before adding more product surface.",
  },
  {
    id: "later",
    label: "Later",
    summary: "Feedback hub, integrations, templates",
    detail: "These are useful after the MVP proves the review workflow.",
  },
] as const

export const scopeRows = [
  {
    id: "quick-capture",
    feature: "Quick capture",
    question: "Can founders save ideas without turning them into tasks?",
    decision: "Build now",
    lane: "Now",
    readiness: "Ready",
    owner: "Founder",
  },
  {
    id: "scope-board",
    feature: "MVP scope board",
    question: "Can the first version stay small enough to ship?",
    decision: "Build now",
    lane: "Now",
    readiness: "Ready",
    owner: "Product",
  },
  {
    id: "decision-log",
    feature: "Decision log",
    question: "Can old reasons stay visible when pressure returns?",
    decision: "Support",
    lane: "Now",
    readiness: "Ready",
    owner: "Product",
  },
  {
    id: "feedback-hub",
    feature: "Feedback hub",
    question: "Does the first beta need a complete feedback system?",
    decision: "Later",
    lane: "Next",
    readiness: "Blocked",
    owner: "Founder",
  },
  {
    id: "github-sync",
    feature: "GitHub sync",
    question: "Does integration work reduce launch risk before beta?",
    decision: "Cut",
    lane: "Not doing",
    readiness: "Not needed",
    owner: "Later",
  },
  {
    id: "templates",
    feature: "Template marketplace",
    question: "Does a marketplace validate the product hypothesis?",
    decision: "Cut",
    lane: "Not doing",
    readiness: "Not needed",
    owner: "Later",
  },
] as const

export type ScopeRowId = (typeof scopeRows)[number]["id"]
export type RoadmapLaneId = (typeof roadmapLanes)[number]["id"]
export type ScopeRow = (typeof scopeRows)[number]

export const defaultRowId: ScopeRowId = "scope-board"
export const defaultLaneId: RoadmapLaneId = "now"

export const decisionClassNames = {
  "Build now": "bg-success text-success-foreground",
  Support: "bg-info text-info-foreground",
  Later: "bg-warning text-warning-foreground",
  Cut: "bg-destructive text-destructive-foreground",
} as const

export const readinessClassNames = {
  Ready: "bg-success/20 text-success-foreground",
  Blocked: "bg-warning/20 text-warning-foreground",
  "Not needed": "bg-muted text-muted-foreground",
} as const

export const ProjectIcon = GitPullRequestArrowIcon
