import { cn } from "@mavry/ui/lib/utils"
import {
  ListChecksIcon,
  RotateCcwIcon,
  RouteIcon,
  ScissorsIcon,
} from "lucide-react"
import {
  Count,
  dotTone,
  ListRow,
  motionItem,
  Panel,
  Setup,
  Status,
  type Tone,
} from "@/components/landing/demo-primitives"
import { DEMO_BACKGROUND, DemoStage } from "@/components/landing/demo-stage"
import {
  CheckList,
  Intro,
  TITLE,
  TwoTone,
} from "@/components/landing/section-intro"

const scopeRows = [
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

const scopeGroups = [
  {
    decision: "Build now",
    description: "Proves the hypothesis",
    id: "core",
    title: "Core",
    tone: "success",
  },
  {
    decision: "Support",
    description: "Helps launch",
    id: "support",
    title: "Support",
    tone: "info",
  },
  {
    decision: "Later",
    description: "Useful, not now",
    id: "later",
    title: "Later",
    tone: "warning",
  },
  {
    decision: "Cut",
    description: "Cut with a reason",
    id: "cut",
    title: "No for now",
    tone: "danger",
  },
] as const satisfies ReadonlyArray<{
  decision: string
  description: string
  id: string
  title: string
  tone: Tone
}>

const scopeCounts = scopeGroups.map(
  (group) => scopeRows.filter((row) => row.decision === group.decision).length
)
const scopeTotal = scopeCounts.reduce((sum, count) => sum + count, 0)

const DemoScope = () => (
  <Panel
    code="SC-011"
    icon={ListChecksIcon}
    label="MVP scope"
    status={<Status tone="success">74 readiness</Status>}
  >
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-col gap-1.5 border-border/50 border-b px-4 py-3">
        <div className="flex items-baseline justify-between gap-3">
          <Setup>Release 01 scope</Setup>
          <Count>
            Core {scopeCounts[0] ?? 0} of {scopeTotal}
          </Count>
        </div>
        <div
          aria-label={`Scope split: ${scopeGroups
            .map((group, index) => `${group.title} ${scopeCounts[index] ?? 0}`)
            .join(", ")}`}
          className="flex h-1.5 gap-px overflow-hidden rounded-full"
          role="img"
        >
          {scopeGroups.map((group, index) => (
            <span
              className={cn(
                "origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-data-[revealed=true]:scale-x-100 motion-reduce:transition-none",
                dotTone[group.tone]
              )}
              key={group.id}
              style={{
                flexGrow: scopeCounts[index] ?? 0,
                transitionDelay: `${index * 80}ms`,
              }}
            />
          ))}
        </div>
      </div>
      <div className="divide-y divide-border/50">
        {scopeGroups.map((group, index) => {
          const rows = scopeRows.filter(
            (row) => row.decision === group.decision
          )

          return (
            <ListRow
              className="flex items-start gap-3 px-4 py-3"
              key={group.id}
              primary={index === 0}
              {...motionItem(index)}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-1.5 -translate-y-px rounded-full",
                      dotTone[group.tone]
                    )}
                  />
                  <p className="font-medium text-demo-control!">
                    {group.title}
                  </p>
                  <span className="truncate text-demo-metadata! text-muted-foreground">
                    {group.description}
                  </span>
                </div>
                <p className="mt-1.5 text-demo-metadata! text-muted-foreground">
                  {rows.map((row) => row.feature).join("  ·  ")}
                </p>
              </div>
              <Count>{rows.length}</Count>
            </ListRow>
          )
        })}
      </div>
    </div>
  </Panel>
)

const cutConditions = [
  ["GitHub sync", "Integration work before product proof", "Manual export"],
  [
    "Template marketplace",
    "Does not validate decision clarity",
    "After launch",
  ],
] as const

const DemoCuts = () => (
  <Panel
    code="CL-002"
    icon={ScissorsIcon}
    label="Cut list"
    status={<Count>{cutConditions.length} cuts</Count>}
  >
    <div className="divide-y divide-border/50">
      {cutConditions.map(([title, reason, condition], index) => (
        <ListRow
          className="px-4 py-3.5"
          key={title}
          primary={index === 0}
          {...motionItem(index)}
        >
          <div className="flex items-center gap-2">
            <p className="font-medium text-demo-control!">{title}</p>
            <Status className="ml-auto" tone="danger">
              No for now
            </Status>
          </div>
          <p className="mt-1 text-demo-metadata! text-muted-foreground">
            {reason}
          </p>
          <div className="mt-2.5 flex items-center justify-between gap-3 border-border/50 border-t pt-2.5 text-demo-metadata!">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <RotateCcwIcon aria-hidden="true" className="size-3" />
              Reconsider when
            </span>
            <span className="font-medium text-foreground">{condition}</span>
          </div>
        </ListRow>
      ))}
    </div>
  </Panel>
)

const roadmapLanes = [
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

const DemoRoadmap = () => (
  <Panel code="RD-006" icon={RouteIcon} label="Roadmap">
    <div className="p-4">
      <ol className="flex flex-col">
        {roadmapLanes.map((lane, index) => {
          const isCurrent = index === 0
          const isLast = index === roadmapLanes.length - 1

          return (
            <li
              aria-current={isCurrent ? "step" : undefined}
              className="flex gap-3.5"
              key={lane.id}
              {...motionItem(index)}
            >
              <div className="relative flex w-2 flex-col items-center">
                <span
                  aria-hidden="true"
                  className="relative z-10 mt-1 size-2 shrink-0 rounded-full border border-border bg-card"
                />
                {isLast ? null : (
                  <span
                    aria-hidden="true"
                    className="absolute top-3.5 -bottom-0.5 left-1/2 w-px -translate-x-1/2 bg-border"
                  />
                )}
              </div>
              <div className={cn("min-w-0", !isLast && "pb-5")}>
                <p
                  className={cn(
                    "text-demo-metadata!",
                    isCurrent
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {lane.label}
                </p>
                <p
                  className={cn(
                    "mt-0.5 text-demo-control!",
                    isCurrent ? "font-semibold" : "font-medium"
                  )}
                >
                  {lane.summary}
                </p>
                <p className="mt-1 text-demo-metadata! text-muted-foreground">
                  {lane.detail}
                </p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  </Panel>
)

const zigzagItems = [
  {
    check: "#ea580c",
    demo: <DemoScope />,
    description:
      "Core proves the hypothesis. Support helps launch. Later stays visible without expanding the release.",
    id: "scope",
    image: DEMO_BACKGROUND,
    points: [
      "Core and Later, side by side",
      "Scope stays small enough to ship",
      "Every feature answers what it proves",
    ],
    title: { lead: "Draw the line around", tail: "the first release." },
  },
  {
    check: "#6d28d9",
    demo: <DemoCuts />,
    description:
      "Every item you remove keeps its reason and the condition that would bring it back.",
    id: "cuts",
    image: DEMO_BACKGROUND,
    points: [
      "Reasons stay attached to the cut",
      "Return conditions stay visible",
      "Reopening a cut is a decision",
    ],
    title: { lead: "A cut is a saved", tail: "decision, not a loss." },
  },
  {
    check: "#1d6b3a",
    demo: <DemoRoadmap />,
    description:
      "Now, Next, and Later keep the sequence honest and the cut work out of the way.",
    id: "roadmap",
    image: DEMO_BACKGROUND,
    points: [
      "Now, Next, and Later in order",
      "Cut work stays out of the way",
      "The sequence survives a scope change",
    ],
    title: { lead: "Order the release,", tail: "then move to beta." },
  },
] as const

export const Overview = () => (
  <section
    aria-labelledby="overview-title"
    className="group relative min-w-0 pt-8 sm:pt-10"
    data-section-reveal=""
    id="overview"
  >
    <Intro
      align="center"
      description="Mavry runs one loop: capture, clarify, classify, cut, and sequence. Every move leaves a reason behind, so the first release stays small enough to ship."
      id="overview-title"
    >
      <TwoTone lead="Turn too many ideas into" tail="one focused release." />
    </Intro>

    <div className="mt-16 flex flex-col gap-16 sm:gap-20">
      {zigzagItems.map((item, index) => {
        const isReversed = index % 2 === 1

        return (
          <div
            className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
            data-landing-row={item.id}
            key={item.id}
          >
            <div className={cn(isReversed && "lg:order-2")}>
              <h3 className={TITLE}>
                <TwoTone lead={item.title.lead} tail={item.title.tail} />
              </h3>
              <p className="mt-3 max-w-md text-[#5f6269] text-[0.9375rem] leading-7">
                {item.description}
              </p>
              <CheckList color={item.check} points={item.points} />
            </div>
            <div
              className={cn("min-w-0", isReversed && "lg:order-1")}
              data-motion-pop=""
            >
              <DemoStage image={item.image}>{item.demo}</DemoStage>
            </div>
          </div>
        )
      })}
    </div>
  </section>
)
