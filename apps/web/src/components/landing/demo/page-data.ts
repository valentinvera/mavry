import type { LucideIcon } from "lucide-react"
import {
  CalendarCheckIcon,
  CheckCircle2Icon,
  CircleAlertIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  InboxIcon,
  ListChecksIcon,
  MessageSquareTextIcon,
  RouteIcon,
  ScissorsIcon,
  SearchIcon,
  SmartphoneIcon,
} from "lucide-react"
import type { PageId } from "@/components/landing/demo/data"

export interface ActivityItem {
  actor: string
  description: string
  icon: LucideIcon
  id: string
  time: string
  title: string
}

export interface Content {
  activities: ActivityItem[]
  chips: string[]
  code: string
  context: string
  description: string
  reviewPrompt: string
  title: string
}

export const contentByPage = {
  archive: {
    activities: [
      {
        actor: "Mavry",
        description:
          "The full hub stays out because beta only needs a lightweight feedback path.",
        icon: ScissorsIcon,
        id: "archive-feedback",
        time: "1 hr ago",
        title: "Archived full feedback hub",
      },
      {
        actor: "Founder",
        description:
          "The public roadmap can return after real users complete MVP reviews.",
        icon: ScissorsIcon,
        id: "archive-public",
        time: "1 hr ago",
        title: "Archived public roadmap",
      },
    ],
    chips: ["9 archived", "0 in Core", "3 reconsider later", "6 parked"],
    code: "AR-009",
    context: "Archive",
    description:
      "Archived ideas remain searchable and reviewable without being counted as active MVP scope.",
    reviewPrompt: "Ask what should stay archived...",
    title: "Archive ideas without turning them into obligations",
  },
  "cut-list": {
    activities: [
      {
        actor: "Mavry",
        description:
          "The integration does not reduce launch risk before beta and can be reconsidered after manual export hurts.",
        icon: ScissorsIcon,
        id: "cut-github",
        time: "31 min ago",
        title: "GitHub sync cut from MVP",
      },
      {
        actor: "Founder",
        description:
          "The marketplace can return after builders complete real MVP reviews and ask for reusable templates.",
        icon: ScissorsIcon,
        id: "cut-template",
        time: "34 min ago",
        title: "Template marketplace cut from launch",
      },
    ],
    chips: ["2 cuts", "2 reasons", "0 reopened", "Later condition set"],
    code: "CL-002",
    context: "Cuts",
    description:
      "The cut list stores each removed feature with the reason, date, and condition for reconsidering it later.",
    reviewPrompt: "Ask why this was cut...",
    title: "Keep cut decisions visible after review",
  },
  "decision-log": {
    activities: [
      {
        actor: "Decision log",
        description:
          "The scope board became Core because it is the main way builders understand what belongs in the MVP.",
        icon: MessageSquareTextIcon,
        id: "log-scope",
        time: "12 min ago",
        title: "Scope board moved from Support to Core",
      },
      {
        actor: "Launch review",
        description:
          "Launch waits on feedback ownership, not on building a larger feedback product.",
        icon: CircleAlertIcon,
        id: "log-launch",
        time: "21 min ago",
        title: "Beta feedback route logged as blocker",
      },
    ],
    chips: ["18 notes", "5 scope", "4 cuts", "3 launch"],
    code: "DL-018",
    context: "Log",
    description:
      "The decision log records what moved, who changed it, and why the product direction changed.",
    reviewPrompt: "Ask what changed and why...",
    title: "Keep the reasoning behind every scope change",
  },
  "feature-backlog": {
    activities: [
      {
        actor: "Mavry",
        description:
          "The scope board directly supports the product promise; the feedback hub is useful after beta.",
        icon: ListChecksIcon,
        id: "backlog-score",
        time: "3 min ago",
        title: "Kept scope board above feedback hub",
      },
      {
        actor: "Review",
        description:
          "Launch can move once one feedback channel and one responsible owner are assigned.",
        icon: CircleAlertIcon,
        id: "backlog-confidence",
        time: "15 min ago",
        title: "Beta feedback lacks ownership",
      },
      {
        actor: "Founder",
        description:
          "The marketplace creates more product area before the core workflow has demand.",
        icon: ScissorsIcon,
        id: "backlog-cut",
        time: "26 min ago",
        title: "Cut template marketplace",
      },
    ],
    chips: ["6 build now", "1 support", "2 later", "2 cut"],
    code: "FB-017",
    context: "Clarify",
    description:
      "The backlog is where feature candidates get a product question, impact, effort, confidence, and decision reason before they can move into the MVP.",
    reviewPrompt: "Ask which feature lacks enough context...",
    title: "Clarify feature risk before scope is decided",
  },
  home: {
    activities: [
      {
        actor: "Mavry",
        description:
          "The scope board, quick capture, and decision log were grouped as the first version of the product.",
        icon: CircleDashedIcon,
        id: "home-intake",
        time: "2 min ago",
        title: "Pulled inbox ideas into scope review",
      },
      {
        actor: "Weekly review",
        description:
          "The full feedback hub stays visible, but beta only needs one manual feedback route.",
        icon: CircleDotDashedIcon,
        id: "home-review",
        time: "4 min ago",
        title: "Moved feedback hub to Later",
      },
      {
        actor: "Founder",
        description:
          "The current release should not include integrations, templates, or a public roadmap before beta.",
        icon: MessageSquareTextIcon,
        id: "home-comment",
        time: "8 min ago",
        title: "Flagged launch pressure",
      },
      {
        actor: "Mavry",
        description:
          "GitHub sync and templates remain outside the MVP with reconsider conditions.",
        icon: ScissorsIcon,
        id: "home-cut",
        time: "12 min ago",
        title: "Saved 2 cut decisions",
      },
    ],
    chips: ["2 build now", "2 cuts", "1 blocker", "Now lane active"],
    code: "MV-104",
    context: "Launch review",
    description:
      "The home view summarizes the current product decision: what stays in the MVP, what has been cut, what still blocks launch, and what should happen next.",
    reviewPrompt: "Ask what still blocks the MVP...",
    title: "Review the scope before opening beta",
  },
  "idea-inbox": {
    activities: [
      {
        actor: "Mobile capture",
        description:
          "The note stays in capture until it has enough context to become a feature.",
        icon: InboxIcon,
        id: "inbox-quick-capture",
        time: "1 min ago",
        title: "Captured checkout reminder",
      },
      {
        actor: "Mavry",
        description:
          "Ideas without a named user problem should not enter the MVP scope.",
        icon: CircleDashedIcon,
        id: "inbox-clarify",
        time: "7 min ago",
        title: "Marked 4 ideas as unclear",
      },
      {
        actor: "Founder",
        description:
          "Quick capture supports the first workflow and has an owner for launch.",
        icon: CheckCircle2Icon,
        id: "inbox-convert",
        time: "18 min ago",
        title: "Promoted quick capture",
      },
    ],
    chips: ["12 captured", "4 need clarity", "3 can wait", "1 rejected"],
    code: "IN-028",
    context: "Capture",
    description:
      "The inbox keeps raw product thoughts separate from committed work until each idea has a user problem, launch impact, and reason to enter scope.",
    reviewPrompt: "Ask which idea should enter scope...",
    title: "Capture ideas before they become backlog items",
  },
  "launch-review": {
    activities: [
      {
        actor: "Mavry",
        description:
          "Assign one feedback route before adding integrations, analytics, or a larger feedback hub.",
        icon: CircleAlertIcon,
        id: "launch-owner",
        time: "4 min ago",
        title: "Feedback ownership blocks launch",
      },
      {
        actor: "Founder",
        description:
          "The MVP scope is ready to show once feedback ownership is explicit.",
        icon: CheckCircle2Icon,
        id: "launch-ready",
        time: "13 min ago",
        title: "Core scope is ready for beta",
      },
    ],
    chips: ["1 blocker", "74 readiness", "Ready after owner", "No full hub"],
    code: "LR-001",
    context: "Launch",
    description:
      "Launch review shows the MVP is almost ready, but beta should wait until the feedback route has a clear owner.",
    reviewPrompt: "Ask what launch can skip...",
    title: "Resolve the last launch blocker",
  },
  "mobile-capture": {
    activities: [
      {
        actor: "Mobile",
        description:
          "The idea syncs to the web inbox without becoming committed work.",
        icon: SmartphoneIcon,
        id: "mobile-capture",
        time: "just now",
        title: "Captured onboarding idea",
      },
      {
        actor: "Quick decision",
        description:
          "A short cut reason is saved so the decision can be reviewed later.",
        icon: ListChecksIcon,
        id: "mobile-classify",
        time: "5 min ago",
        title: "Classified GitHub sync as No for now",
      },
    ],
    chips: ["15 sec capture", "Quick classify", "Next action", "Sync to web"],
    code: "MO-015",
    context: "Mobile",
    description:
      "The mobile surface is for quick capture, lightweight classification, next actions, and checking launch readiness away from the main workspace.",
    reviewPrompt: "Ask what to capture on mobile...",
    title: "Capture and classify from mobile",
  },
  projects: {
    activities: [
      {
        actor: "Mavry",
        description:
          "Readiness is close, but feedback ownership still needs a decision before beta.",
        icon: CheckCircle2Icon,
        id: "projects-mavry",
        time: "now",
        title: "Mavry needs launch review",
      },
      {
        actor: "Signal kit",
        description:
          "The product hypothesis should be written before features enter backlog review.",
        icon: CircleDashedIcon,
        id: "projects-signal",
        time: "today",
        title: "Project still needs intake",
      },
    ],
    chips: ["3 projects", "1 needs review", "1 beta blocker", "2 active"],
    code: "PJ-003",
    context: "Projects",
    description:
      "The projects view shows stage, clarity status, readiness, and the latest product decision for each project.",
    reviewPrompt: "Ask which project needs attention...",
    title: "Choose the project that needs attention",
  },
  readiness: {
    activities: [
      {
        actor: "Mavry",
        description:
          "Scope and cut decisions are clear; feedback ownership is the remaining launch risk.",
        icon: CheckCircle2Icon,
        id: "readiness-score",
        time: "just now",
        title: "Readiness moved to 74",
      },
      {
        actor: "Launch review",
        description:
          "A lightweight feedback path is enough for beta if one person owns it.",
        icon: CircleAlertIcon,
        id: "readiness-blocker",
        time: "9 min ago",
        title: "Feedback route needs an owner",
      },
      {
        actor: "Weekly review",
        description:
          "The next actions are to assign feedback, review cuts, and ship the scope board.",
        icon: CalendarCheckIcon,
        id: "readiness-action",
        time: "16 min ago",
        title: "Next 3 actions are locked",
      },
    ],
    chips: ["74/100", "Almost ready", "1 blocker", "3 next actions"],
    code: "LR-074",
    context: "Readiness",
    description:
      "Readiness is based on whether the hypothesis, Core scope, cuts, roadmap, feedback route, and next actions are clear enough for beta.",
    reviewPrompt: "Ask what blocks beta...",
    title: "Measure whether the MVP is ready enough",
  },
  roadmap: {
    activities: [
      {
        actor: "Mavry",
        description:
          "Scope, capture, and decision history make the first product review usable.",
        icon: RouteIcon,
        id: "roadmap-now",
        time: "5 min ago",
        title: "Moved three essentials into Now",
      },
      {
        actor: "Review",
        description:
          "The launch blocker is ownership, not the absence of a full feedback product.",
        icon: CircleAlertIcon,
        id: "roadmap-next",
        time: "17 min ago",
        title: "Beta feedback stays in Next",
      },
      {
        actor: "Founder",
        description:
          "A public roadmap creates expectations before the first product review has traction.",
        icon: ScissorsIcon,
        id: "roadmap-not-doing",
        time: "22 min ago",
        title: "Public roadmap moved out",
      },
    ],
    chips: ["Now: 3", "Next: 1", "Later: 2", "Not doing: 2"],
    code: "RD-006",
    context: "Roadmap",
    description:
      "The roadmap turns scope decisions into lanes for Now, Next, Later, and Not doing without hiding cut work from future reviews.",
    reviewPrompt: "Ask what should move out of Now...",
    title: "Sequence what ships now and what waits",
  },
  scope: {
    activities: [
      {
        actor: "Mavry",
        description:
          "It is the main surface for deciding what belongs in the first shippable version.",
        icon: CheckCircle2Icon,
        id: "scope-core",
        time: "2 min ago",
        title: "Scope board remains in Core",
      },
      {
        actor: "Founder",
        description:
          "The log protects clarity, but the MVP can still prove value without making it the main feature.",
        icon: ListChecksIcon,
        id: "scope-support",
        time: "11 min ago",
        title: "Decision log moved to Support",
      },
      {
        actor: "Mavry",
        description: "Integration work waits until builders ask for it.",
        icon: ScissorsIcon,
        id: "scope-cut",
        time: "31 min ago",
        title: "GitHub sync moved to No for now",
      },
    ],
    chips: ["Core: 2", "Support: 1", "Later: 1", "No for now: 2"],
    code: "SC-011",
    context: "Classify",
    description:
      "The scope board keeps Core, Support, Later, and No for now visible so the first version can stay focused without losing context.",
    reviewPrompt: "Ask what should leave Core...",
    title: "Separate Core scope from supporting work",
  },
  search: {
    activities: [
      {
        actor: "Project search",
        description:
          "The same blocker appears in Idea inbox, Roadmap, Launch review, and Weekly review with matching context.",
        icon: SearchIcon,
        id: "search-feedback",
        time: "now",
        title: "Found feedback route in 4 places",
      },
      {
        actor: "Cut list",
        description:
          "The cut reason appears with the search result so the feature does not return as hidden launch scope.",
        icon: ScissorsIcon,
        id: "search-cut",
        time: "31 min ago",
        title: "GitHub sync is not doing",
      },
    ],
    chips: ["Ideas", "Features", "Cuts", "Decisions"],
    code: "SR-021",
    context: "Search",
    description:
      "Project search returns the work and the product context behind it, including why it moved, where it lives, and what decision it belongs to.",
    reviewPrompt: "Search decisions, cuts, and next actions...",
    title: "Search across ideas, features, cuts, and decisions",
  },
  "weekly-review": {
    activities: [
      {
        actor: "Mavry",
        description:
          "None should enter Core until the user problem and MVP impact are clear.",
        icon: InboxIcon,
        id: "weekly-new",
        time: "today",
        title: "Found 9 new ideas",
      },
      {
        actor: "Review",
        description:
          "The hub should move to Later while beta uses one smaller feedback route.",
        icon: CircleAlertIcon,
        id: "weekly-heavy",
        time: "today",
        title: "Feedback hub widened launch",
      },
      {
        actor: "Founder",
        description:
          "The review records what changed so older scope pressure does not return unnoticed.",
        icon: CalendarCheckIcon,
        id: "weekly-save",
        time: "today",
        title: "Saved review actions",
      },
    ],
    chips: ["9 new ideas", "3 moved", "2 cuts", "3 next actions"],
    code: "WR-005",
    context: "Review",
    description:
      "Weekly review compares new ideas, moved features, cuts, launch blockers, and next actions so the product does not expand without a decision.",
    reviewPrompt: "Ask what should stay out this week...",
    title: "Review new pressure before it changes scope",
  },
} as const satisfies Record<PageId, Content>
