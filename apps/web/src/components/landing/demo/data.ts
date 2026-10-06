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
    icon: HomeIcon,
    id: "home",
    title: "Home",
  },
  {
    icon: InboxIcon,
    id: "idea-inbox",
    title: "Idea inbox",
  },
  {
    icon: ListTodoIcon,
    id: "feature-backlog",
    title: "Feature backlog",
  },
  {
    icon: ListChecksIcon,
    id: "scope",
    title: "MVP scope",
  },
  {
    icon: RouteIcon,
    id: "roadmap",
    title: "Roadmap",
  },
  {
    icon: CircleGaugeIcon,
    id: "readiness",
    title: "Readiness",
  },
  {
    icon: CalendarCheckIcon,
    id: "weekly-review",
    title: "Weekly review",
  },
] as const

export const documents = [
  {
    icon: ScissorsIcon,
    id: "cut-list",
    title: "Cut list",
    value: "2 decisions",
  },
  {
    icon: NotebookTabsIcon,
    id: "decision-log",
    title: "Decision log",
    value: "18 notes",
  },
  {
    icon: ClipboardCheckIcon,
    id: "launch-review",
    title: "Launch review",
    value: "1 blocker",
  },
] as const

export const secondaryNav = [
  { icon: SearchIcon, id: "search", title: "Project search" },
  { icon: ArchiveIcon, id: "archive", title: "Archived ideas" },
  { icon: LayoutDashboardIcon, id: "projects", title: "Projects" },
  { icon: SmartphoneIcon, id: "mobile-capture", title: "Mobile capture" },
] as const

export type MainPageId = (typeof navMain)[number]["id"]
export type DocumentPageId = (typeof documents)[number]["id"]
export type SecondaryPageId = (typeof secondaryNav)[number]["id"]
export type PageId = MainPageId | DocumentPageId | SecondaryPageId

export const cards = [
  {
    badge: "+8",
    description:
      "Scope and cuts are clear; feedback ownership still blocks beta.",
    id: "readiness",
    label: "MVP readiness",
    suffix: "/100",
    value: "74",
  },
  {
    badge: "Core",
    description: "Features that belong in the first shippable version.",
    id: "build-now",
    label: "Build now",
    suffix: "features",
    value: "6",
  },
  {
    badge: "Saved",
    description: "Ideas removed from launch with a saved reason.",
    id: "cut",
    label: "Cut from MVP",
    suffix: "ideas",
    value: "2",
  },
  {
    badge: "Review",
    description: "The beta needs one owner for the feedback route.",
    id: "blocker",
    label: "Launch blocker",
    suffix: "open",
    value: "1",
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
    detail: "The first release needs intake, scope, and saved decisions.",
    id: "now",
    label: "Now",
    summary: "Scope board, intake, decision log",
  },
  {
    detail: "Resolve the feedback route before adding more product surface.",
    id: "next",
    label: "Next",
    summary: "Readiness review and beta feedback",
  },
  {
    detail: "These are useful after the MVP proves the review workflow.",
    id: "later",
    label: "Later",
    summary: "Feedback hub, integrations, templates",
  },
] as const

export const scopeRows = [
  {
    decision: "Build now",
    feature: "Quick capture",
    id: "quick-capture",
    lane: "Now",
    owner: "Founder",
    question: "Can founders save ideas without turning them into tasks?",
    readiness: "Ready",
  },
  {
    decision: "Build now",
    feature: "MVP scope board",
    id: "scope-board",
    lane: "Now",
    owner: "Product",
    question: "Can the first version stay small enough to ship?",
    readiness: "Ready",
  },
  {
    decision: "Support",
    feature: "Decision log",
    id: "decision-log",
    lane: "Now",
    owner: "Product",
    question: "Can old reasons stay visible when pressure returns?",
    readiness: "Ready",
  },
  {
    decision: "Later",
    feature: "Feedback hub",
    id: "feedback-hub",
    lane: "Next",
    owner: "Founder",
    question: "Does the first beta need a complete feedback system?",
    readiness: "Blocked",
  },
  {
    decision: "Cut",
    feature: "GitHub sync",
    id: "github-sync",
    lane: "Not doing",
    owner: "Later",
    question: "Does integration work reduce launch risk before beta?",
    readiness: "Not needed",
  },
  {
    decision: "Cut",
    feature: "Template marketplace",
    id: "templates",
    lane: "Not doing",
    owner: "Later",
    question: "Does a marketplace validate the product hypothesis?",
    readiness: "Not needed",
  },
] as const

export type ScopeRowId = (typeof scopeRows)[number]["id"]
export type RoadmapLaneId = (typeof roadmapLanes)[number]["id"]
export type ScopeRow = (typeof scopeRows)[number]

export const defaultRowId: ScopeRowId = "scope-board"
export const defaultLaneId: RoadmapLaneId = "now"

export const decisionClassNames = {
  "Build now": "bg-success text-success-foreground",
  Cut: "bg-destructive text-destructive-foreground",
  Later: "bg-warning text-warning-foreground",
  Support: "bg-info text-info-foreground",
} as const

export const readinessClassNames = {
  Blocked: "bg-warning/20 text-warning-foreground",
  "Not needed": "bg-muted text-muted-foreground",
  Ready: "bg-success/20 text-success-foreground",
} as const

export const ProjectIcon = GitPullRequestArrowIcon
