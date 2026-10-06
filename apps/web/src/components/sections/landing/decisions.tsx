import { cn } from "@mavry/ui/lib/utils"
import {
  ArrowRightIcon,
  Layers3Icon,
  NotebookTabsIcon,
  SearchIcon,
  TargetIcon,
} from "lucide-react"
import {
  Count,
  ListRow,
  motionItem,
  Panel,
  Status,
  type Tone,
  textTone,
} from "@/components/landing/demo-primitives"
import { DEMO_BACKGROUND, DemoStage } from "@/components/landing/demo-stage"
import { SplitIntro, TwoTone } from "@/components/landing/section-intro"

const backlogRows = [
  {
    classification: "Needs clarity",
    feature: "Feedback hub",
    risk: "Impact High · Effort Medium",
    tone: "warning",
    why: "Does the first beta need a full feedback system?",
  },
  {
    classification: "Core",
    feature: "Quick capture",
    risk: "Impact High · Effort Low",
    tone: "success",
    why: "Can founders save ideas without turning them into tasks?",
  },
  {
    classification: "Support",
    feature: "Decision log",
    risk: "Impact Medium · Effort Low",
    tone: "info",
    why: "Can old reasons stay visible when pressure returns?",
  },
  {
    classification: "No for now",
    feature: "GitHub sync",
    risk: "Impact Low · Effort High",
    tone: "danger",
    why: "Does integration work reduce launch risk before beta?",
  },
] as const satisfies ReadonlyArray<{
  classification: string
  feature: string
  risk: string
  tone: Tone
  why: string
}>

const DemoBacklog = () => (
  <Panel
    code="FB-017"
    description="Impact, effort, confidence, and risk give every feature a reason — or a clear Needs clarity."
    icon={Layers3Icon}
    label="Feature backlog"
    status={<Count>6 candidates</Count>}
    title="Clarify risk before scope."
  >
    <div className="divide-y divide-border/50">
      {backlogRows.map((row, index) => (
        <ListRow
          className="flex items-center gap-4 px-4 py-3"
          key={row.feature}
          primary={index === 0}
          {...motionItem(index)}
        >
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-demo-control!">
              {row.feature}
            </p>
            <p className="mt-0.5 truncate text-demo-metadata! text-muted-foreground">
              {row.why}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <Status tone={row.tone}>{row.classification}</Status>
            <span className="text-demo-metadata! text-muted-foreground/80 tabular-nums">
              {row.risk}
            </span>
          </div>
        </ListRow>
      ))}
    </div>
  </Panel>
)

const decisionEntries = [
  {
    from: "Scope pressure",
    id: "feedback-hub",
    reason: "Manual replies cover beta.",
    to: "Later",
    tone: "warning",
  },
  {
    from: "Core",
    id: "decision-log",
    reason: "Keeps clarity, not the main proof.",
    to: "Support",
    tone: "info",
  },
  {
    from: "Reopened",
    id: "github-sync",
    reason: "Wait for repeated export pain.",
    to: "No for now",
    tone: "danger",
  },
  {
    from: "Templates",
    id: "template-marketplace",
    reason: "Marketplace waits for real demand.",
    to: "Later",
    tone: "warning",
  },
] as const satisfies ReadonlyArray<{
  from: string
  id: string
  reason: string
  to: string
  tone: Tone
}>

const DemoDecisions = () => (
  <Panel
    code="DL-018"
    description="Every classification change keeps what moved and why, so old debates do not restart."
    icon={NotebookTabsIcon}
    label="Decision log"
    status={<Count>18 notes</Count>}
    title="The reason stays with the move."
  >
    <div className="divide-y divide-border/50">
      {decisionEntries.map((entry, index) => (
        <ListRow
          className="px-4 py-2.5"
          key={entry.id}
          primary={index === 0}
          {...motionItem(index)}
        >
          <p className="flex items-center gap-1.5 text-demo-metadata!">
            <span className="text-muted-foreground">{entry.from}</span>
            <ArrowRightIcon
              aria-hidden="true"
              className="size-3 text-muted-foreground/60"
            />
            <span className={cn("font-medium", textTone[entry.tone])}>
              {entry.to}
            </span>
          </p>
          <p className="mt-1 text-demo-metadata! text-muted-foreground">
            {entry.reason}
          </p>
        </ListRow>
      ))}
    </div>
  </Panel>
)

const searchResults = [
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

const DemoSearch = () => (
  <Panel
    code="SR-021"
    description="Find a feature, cut, decision, or next action without remembering which page owns it."
    icon={SearchIcon}
    label="Project search"
    status={<Count>{searchResults.length} results</Count>}
    title="Find any product decision."
  >
    <div className="flex min-h-0 flex-1 flex-col p-4">
      <div className="flex items-center gap-2 rounded-md border border-border/70 bg-background/60 px-3 py-2 text-demo-control! text-muted-foreground">
        <SearchIcon aria-hidden="true" className="size-3.5" />
        beta feedback owner
      </div>
      <div className="mt-1 min-h-0 flex-1 divide-y divide-border/50">
        {searchResults.slice(0, 3).map((result, index) => (
          <ListRow
            className="px-2 py-2.5"
            key={result.id}
            primary={index === 0}
            {...motionItem(index)}
          >
            <div className="flex items-baseline gap-2">
              <p className="min-w-0 flex-1 truncate font-medium text-demo-control!">
                {result.title}
              </p>
              <span className="shrink-0 text-demo-metadata! text-muted-foreground">
                {result.area}
              </span>
            </div>
            <p className="mt-0.5 truncate text-demo-metadata! text-muted-foreground">
              {result.detail}
            </p>
          </ListRow>
        ))}
      </div>
      <p className="mt-auto border-border/50 border-t pt-2.5 text-demo-metadata! text-muted-foreground">
        1 more result in Review
      </p>
    </div>
  </Panel>
)

const nextActions = [
  {
    action: "Assign one owner for beta feedback",
    meta: "Owner: Founder · before beta",
  },
  {
    action: "Review cut reasons before adding scope",
    meta: "Owner: Product · this week",
  },
  {
    action: "Choose the next launch action",
    meta: "Owner: Founder · after review",
  },
] as const

const DemoNextActions = () => (
  <Panel
    code="NA-003"
    description="The review ends with the smallest moves that actually unblock the release."
    icon={TargetIcon}
    label="Next 3 actions"
    status={<Count>3 open</Count>}
    title="Leave with the next three actions."
  >
    <div className="divide-y divide-border/50">
      {nextActions.map((item, index) => (
        <ListRow
          className="flex items-start gap-3.5 px-4 py-3.5"
          key={item.action}
          primary={index === 0}
          {...motionItem(index)}
        >
          <span className="mt-0.5 shrink-0 text-demo-metadata! text-muted-foreground tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0">
            <p className="text-demo-control!">{item.action}</p>
            <p className="mt-0.5 truncate text-demo-metadata! text-muted-foreground">
              {item.meta}
            </p>
          </div>
        </ListRow>
      ))}
    </div>
    <div className="mt-auto border-border/50 border-t px-4 py-3">
      <p className="text-demo-metadata! text-muted-foreground">
        Review due before opening beta.
      </p>
    </div>
  </Panel>
)

export const Decisions = () => (
  <section
    aria-labelledby="decisions-title"
    className="group relative min-w-0 pt-20 sm:pt-28"
    data-section-reveal=""
    id="decisions"
  >
    <SplitIntro
      description="Clarify the risk, record the decision, search the history, and leave with the next three actions."
      id="decisions-title"
    >
      <TwoTone lead="Decide with reasons" tail="you can explain." />
    </SplitIntro>

    <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-6">
      <div className="lg:col-span-4" data-motion-pop="">
        <DemoStage className="h-[30rem]" image={DEMO_BACKGROUND}>
          <DemoBacklog />
        </DemoStage>
      </div>

      <div className="lg:col-span-2" data-motion-pop="">
        <DemoStage className="h-[30rem]" image={DEMO_BACKGROUND}>
          <DemoDecisions />
        </DemoStage>
      </div>

      <div className="lg:col-span-2" data-motion-pop="">
        <DemoStage className="h-[30rem]" image={DEMO_BACKGROUND}>
          <DemoSearch />
        </DemoStage>
      </div>

      <div className="lg:col-span-4" data-motion-pop="">
        <DemoStage className="h-[30rem]" image={DEMO_BACKGROUND}>
          <DemoNextActions />
        </DemoStage>
      </div>
    </div>
  </section>
)
