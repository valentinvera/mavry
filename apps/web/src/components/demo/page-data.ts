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
import type { PageId } from "@/components/demo/data"

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
  home: {
    code: "MV-104",
    context: "Launch review",
    title: "Review the scope before opening beta",
    description:
      "The home view summarizes the current product decision: what stays in the MVP, what has been cut, what still blocks launch, and what should happen next.",
    chips: ["2 build now", "2 cuts", "1 blocker", "Now lane active"],
    reviewPrompt: "Ask what still blocks the MVP...",
    activities: [
      {
        id: "home-intake",
        icon: CircleDashedIcon,
        actor: "Mavry",
        title: "Pulled inbox ideas into scope review",
        description:
          "The scope board, quick capture, and decision log were grouped as the first version of the product.",
        time: "2 min ago",
      },
      {
        id: "home-review",
        icon: CircleDotDashedIcon,
        actor: "Weekly review",
        title: "Moved feedback hub to Later",
        description:
          "The full feedback hub stays visible, but beta only needs one manual feedback route.",
        time: "4 min ago",
      },
      {
        id: "home-comment",
        icon: MessageSquareTextIcon,
        actor: "Founder",
        title: "Flagged launch pressure",
        description:
          "The current release should not include integrations, templates, or a public roadmap before beta.",
        time: "8 min ago",
      },
      {
        id: "home-cut",
        icon: ScissorsIcon,
        actor: "Mavry",
        title: "Saved 2 cut decisions",
        description:
          "GitHub sync and templates remain outside the MVP with reconsider conditions.",
        time: "12 min ago",
      },
    ],
  },
  "idea-inbox": {
    code: "IN-028",
    context: "Capture",
    title: "Capture ideas before they become backlog items",
    description:
      "The inbox keeps raw product thoughts separate from committed work until each idea has a user problem, launch impact, and reason to enter scope.",
    chips: ["12 captured", "4 need clarity", "3 can wait", "1 rejected"],
    reviewPrompt: "Ask which idea should enter scope...",
    activities: [
      {
        id: "inbox-quick-capture",
        icon: InboxIcon,
        actor: "Mobile capture",
        title: "Captured checkout reminder",
        description:
          "The note stays in capture until it has enough context to become a feature.",
        time: "1 min ago",
      },
      {
        id: "inbox-clarify",
        icon: CircleDashedIcon,
        actor: "Mavry",
        title: "Marked 4 ideas as unclear",
        description:
          "Ideas without a named user problem should not enter the MVP scope.",
        time: "7 min ago",
      },
      {
        id: "inbox-convert",
        icon: CheckCircle2Icon,
        actor: "Founder",
        title: "Promoted quick capture",
        description:
          "Quick capture supports the first workflow and has an owner for launch.",
        time: "18 min ago",
      },
    ],
  },
  "feature-backlog": {
    code: "FB-017",
    context: "Clarify",
    title: "Clarify feature risk before scope is decided",
    description:
      "The backlog is where feature candidates get a product question, impact, effort, confidence, and decision reason before they can move into the MVP.",
    chips: ["6 build now", "1 support", "2 later", "2 cut"],
    reviewPrompt: "Ask which feature lacks enough context...",
    activities: [
      {
        id: "backlog-score",
        icon: ListChecksIcon,
        actor: "Mavry",
        title: "Kept scope board above feedback hub",
        description:
          "The scope board directly supports the product promise; the feedback hub is useful after beta.",
        time: "3 min ago",
      },
      {
        id: "backlog-confidence",
        icon: CircleAlertIcon,
        actor: "Review",
        title: "Beta feedback lacks ownership",
        description:
          "Launch can move once one feedback channel and one responsible owner are assigned.",
        time: "15 min ago",
      },
      {
        id: "backlog-cut",
        icon: ScissorsIcon,
        actor: "Founder",
        title: "Cut template marketplace",
        description:
          "The marketplace creates more product area before the core workflow has demand.",
        time: "26 min ago",
      },
    ],
  },
  scope: {
    code: "SC-011",
    context: "Classify",
    title: "Separate Core scope from supporting work",
    description:
      "The scope board keeps Core, Support, Later, and No for now visible so the first version can stay focused without losing context.",
    chips: ["Core: 2", "Support: 1", "Later: 1", "No for now: 2"],
    reviewPrompt: "Ask what should leave Core...",
    activities: [
      {
        id: "scope-core",
        icon: CheckCircle2Icon,
        actor: "Mavry",
        title: "Scope board remains in Core",
        description:
          "It is the main surface for deciding what belongs in the first shippable version.",
        time: "2 min ago",
      },
      {
        id: "scope-support",
        icon: ListChecksIcon,
        actor: "Founder",
        title: "Decision log moved to Support",
        description:
          "The log protects clarity, but the MVP can still prove value without making it the main feature.",
        time: "11 min ago",
      },
      {
        id: "scope-cut",
        icon: ScissorsIcon,
        actor: "Mavry",
        title: "GitHub sync moved to No for now",
        description: "Integration work waits until builders ask for it.",
        time: "31 min ago",
      },
    ],
  },
  roadmap: {
    code: "RD-006",
    context: "Roadmap",
    title: "Sequence what ships now and what waits",
    description:
      "The roadmap turns scope decisions into lanes for Now, Next, Later, and Not doing without hiding cut work from future reviews.",
    chips: ["Now: 3", "Next: 1", "Later: 2", "Not doing: 2"],
    reviewPrompt: "Ask what should move out of Now...",
    activities: [
      {
        id: "roadmap-now",
        icon: RouteIcon,
        actor: "Mavry",
        title: "Moved three essentials into Now",
        description:
          "Scope, capture, and decision history make the first product review usable.",
        time: "5 min ago",
      },
      {
        id: "roadmap-next",
        icon: CircleAlertIcon,
        actor: "Review",
        title: "Beta feedback stays in Next",
        description:
          "The launch blocker is ownership, not the absence of a full feedback product.",
        time: "17 min ago",
      },
      {
        id: "roadmap-not-doing",
        icon: ScissorsIcon,
        actor: "Founder",
        title: "Public roadmap moved out",
        description:
          "A public roadmap creates expectations before the first product review has traction.",
        time: "22 min ago",
      },
    ],
  },
  readiness: {
    code: "LR-074",
    context: "Readiness",
    title: "Measure whether the MVP is ready enough",
    description:
      "Readiness is based on whether the hypothesis, Core scope, cuts, roadmap, feedback route, and next actions are clear enough for beta.",
    chips: ["74/100", "Almost ready", "1 blocker", "3 next actions"],
    reviewPrompt: "Ask what blocks beta...",
    activities: [
      {
        id: "readiness-score",
        icon: CheckCircle2Icon,
        actor: "Mavry",
        title: "Readiness moved to 74",
        description:
          "Scope and cut decisions are clear; feedback ownership is the remaining launch risk.",
        time: "just now",
      },
      {
        id: "readiness-blocker",
        icon: CircleAlertIcon,
        actor: "Launch review",
        title: "Feedback route needs an owner",
        description:
          "A lightweight feedback path is enough for beta if one person owns it.",
        time: "9 min ago",
      },
      {
        id: "readiness-action",
        icon: CalendarCheckIcon,
        actor: "Weekly review",
        title: "Next 3 actions are locked",
        description:
          "The next actions are to assign feedback, review cuts, and ship the scope board.",
        time: "16 min ago",
      },
    ],
  },
  "weekly-review": {
    code: "WR-005",
    context: "Review",
    title: "Review new pressure before it changes scope",
    description:
      "Weekly review compares new ideas, moved features, cuts, launch blockers, and next actions so the product does not expand without a decision.",
    chips: ["9 new ideas", "3 moved", "2 cuts", "3 next actions"],
    reviewPrompt: "Ask what should stay out this week...",
    activities: [
      {
        id: "weekly-new",
        icon: InboxIcon,
        actor: "Mavry",
        title: "Found 9 new ideas",
        description:
          "None should enter Core until the user problem and MVP impact are clear.",
        time: "today",
      },
      {
        id: "weekly-heavy",
        icon: CircleAlertIcon,
        actor: "Review",
        title: "Feedback hub widened launch",
        description:
          "The hub should move to Later while beta uses one smaller feedback route.",
        time: "today",
      },
      {
        id: "weekly-save",
        icon: CalendarCheckIcon,
        actor: "Founder",
        title: "Saved review actions",
        description:
          "The review records what changed so older scope pressure does not return unnoticed.",
        time: "today",
      },
    ],
  },
  "cut-list": {
    code: "CL-002",
    context: "Cuts",
    title: "Keep cut decisions visible after review",
    description:
      "The cut list stores each removed feature with the reason, date, and condition for reconsidering it later.",
    chips: ["2 cuts", "2 reasons", "0 reopened", "Later condition set"],
    reviewPrompt: "Ask why this was cut...",
    activities: [
      {
        id: "cut-github",
        icon: ScissorsIcon,
        actor: "Mavry",
        title: "GitHub sync cut from MVP",
        description:
          "The integration does not reduce launch risk before beta and can be reconsidered after manual export hurts.",
        time: "31 min ago",
      },
      {
        id: "cut-template",
        icon: ScissorsIcon,
        actor: "Founder",
        title: "Template marketplace cut from launch",
        description:
          "The marketplace can return after builders complete real MVP reviews and ask for reusable templates.",
        time: "34 min ago",
      },
    ],
  },
  "decision-log": {
    code: "DL-018",
    context: "Log",
    title: "Keep the reasoning behind every scope change",
    description:
      "The decision log records what moved, who changed it, and why the product direction changed.",
    chips: ["18 notes", "5 scope", "4 cuts", "3 launch"],
    reviewPrompt: "Ask what changed and why...",
    activities: [
      {
        id: "log-scope",
        icon: MessageSquareTextIcon,
        actor: "Decision log",
        title: "Scope board moved from Support to Core",
        description:
          "The scope board became Core because it is the main way builders understand what belongs in the MVP.",
        time: "12 min ago",
      },
      {
        id: "log-launch",
        icon: CircleAlertIcon,
        actor: "Launch review",
        title: "Beta feedback route logged as blocker",
        description:
          "Launch waits on feedback ownership, not on building a larger feedback product.",
        time: "21 min ago",
      },
    ],
  },
  "launch-review": {
    code: "LR-001",
    context: "Launch",
    title: "Resolve the last launch blocker",
    description:
      "Launch review shows the MVP is almost ready, but beta should wait until the feedback route has a clear owner.",
    chips: ["1 blocker", "74 readiness", "Ready after owner", "No full hub"],
    reviewPrompt: "Ask what launch can skip...",
    activities: [
      {
        id: "launch-owner",
        icon: CircleAlertIcon,
        actor: "Mavry",
        title: "Feedback ownership blocks launch",
        description:
          "Assign one feedback route before adding integrations, analytics, or a larger feedback hub.",
        time: "4 min ago",
      },
      {
        id: "launch-ready",
        icon: CheckCircle2Icon,
        actor: "Founder",
        title: "Core scope is ready for beta",
        description:
          "The MVP scope is ready to show once feedback ownership is explicit.",
        time: "13 min ago",
      },
    ],
  },
  search: {
    code: "SR-021",
    context: "Search",
    title: "Search across ideas, features, cuts, and decisions",
    description:
      "Project search returns the work and the product context behind it, including why it moved, where it lives, and what decision it belongs to.",
    chips: ["Ideas", "Features", "Cuts", "Decisions"],
    reviewPrompt: "Search decisions, cuts, and next actions...",
    activities: [
      {
        id: "search-feedback",
        icon: SearchIcon,
        actor: "Project search",
        title: "Found feedback route in 4 places",
        description:
          "The same blocker appears in Idea inbox, Roadmap, Launch review, and Weekly review with matching context.",
        time: "now",
      },
      {
        id: "search-cut",
        icon: ScissorsIcon,
        actor: "Cut list",
        title: "GitHub sync is not doing",
        description:
          "The cut reason appears with the search result so the feature does not return as hidden launch scope.",
        time: "31 min ago",
      },
    ],
  },
  archive: {
    code: "AR-009",
    context: "Archive",
    title: "Archive ideas without turning them into obligations",
    description:
      "Archived ideas remain searchable and reviewable without being counted as active MVP scope.",
    chips: ["9 archived", "0 in Core", "3 reconsider later", "6 parked"],
    reviewPrompt: "Ask what should stay archived...",
    activities: [
      {
        id: "archive-feedback",
        icon: ScissorsIcon,
        actor: "Mavry",
        title: "Archived full feedback hub",
        description:
          "The full hub stays out because beta only needs a lightweight feedback path.",
        time: "1 hr ago",
      },
      {
        id: "archive-public",
        icon: ScissorsIcon,
        actor: "Founder",
        title: "Archived public roadmap",
        description:
          "The public roadmap can return after real users complete MVP reviews.",
        time: "1 hr ago",
      },
    ],
  },
  projects: {
    code: "PJ-003",
    context: "Projects",
    title: "Choose the project that needs attention",
    description:
      "The projects view shows stage, clarity status, readiness, and the latest product decision for each project.",
    chips: ["3 projects", "1 needs review", "1 beta blocker", "2 active"],
    reviewPrompt: "Ask which project needs attention...",
    activities: [
      {
        id: "projects-mavry",
        icon: CheckCircle2Icon,
        actor: "Mavry",
        title: "Mavry needs launch review",
        description:
          "Readiness is close, but feedback ownership still needs a decision before beta.",
        time: "now",
      },
      {
        id: "projects-signal",
        icon: CircleDashedIcon,
        actor: "Signal kit",
        title: "Project still needs intake",
        description:
          "The product hypothesis should be written before features enter backlog review.",
        time: "today",
      },
    ],
  },
  "mobile-capture": {
    code: "MO-015",
    context: "Mobile",
    title: "Capture and classify from mobile",
    description:
      "The mobile surface is for quick capture, lightweight classification, next actions, and checking launch readiness away from the main workspace.",
    chips: ["15 sec capture", "Quick classify", "Next action", "Sync to web"],
    reviewPrompt: "Ask what to capture on mobile...",
    activities: [
      {
        id: "mobile-capture",
        icon: SmartphoneIcon,
        actor: "Mobile",
        title: "Captured onboarding idea",
        description:
          "The idea syncs to the web inbox without becoming committed work.",
        time: "just now",
      },
      {
        id: "mobile-classify",
        icon: ListChecksIcon,
        actor: "Quick decision",
        title: "Classified GitHub sync as No for now",
        description:
          "A short cut reason is saved so the decision can be reviewed later.",
        time: "5 min ago",
      },
    ],
  },
} as const satisfies Record<PageId, Content>
