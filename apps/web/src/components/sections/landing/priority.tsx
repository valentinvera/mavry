import { cn } from "@mavry/ui/lib/utils"
import { CircleGaugeIcon } from "lucide-react"
import {
  BAR_FILL,
  Count,
  ListRow,
  motionItem,
  Panel,
  Setup,
  textTone,
} from "@/components/landing/demo-primitives"
import { DEMO_BACKGROUND } from "@/components/landing/demo-stage"
import { SplitGiant, TwoTone } from "@/components/landing/section-intro"

const priorityRows = [
  {
    bar: "bg-success-foreground",
    feature: "MVP scope board",
    fill: "group-data-[revealed=true]:scale-x-[0.83]",
    label: "High",
    score: 15,
    tone: "success",
  },
  {
    bar: "bg-success-foreground",
    feature: "Quick capture",
    fill: "group-data-[revealed=true]:scale-x-[0.78]",
    label: "High",
    score: 14,
    tone: "success",
  },
  {
    bar: "bg-info-foreground",
    feature: "Decision log",
    fill: "group-data-[revealed=true]:scale-x-[0.61]",
    label: "Medium",
    score: 11,
    tone: "info",
  },
  {
    bar: "bg-warning-foreground",
    feature: "Feedback hub",
    fill: "group-data-[revealed=true]:scale-x-[0.39]",
    label: "Low",
    score: 7,
    tone: "warning",
  },
  {
    bar: "bg-muted-foreground/40",
    feature: "Public roadmap",
    fill: "group-data-[revealed=true]:scale-x-[0.33]",
    label: "Low",
    score: 6,
    tone: "neutral",
  },
  {
    bar: "bg-muted-foreground/40",
    feature: "GitHub sync",
    fill: "group-data-[revealed=true]:scale-x-[0.28]",
    label: "Low",
    score: 5,
    tone: "neutral",
  },
] as const

const priorityFactors = [
  ["Impact", 5],
  ["Confidence", 4],
  ["Stage fit", 4],
  ["Hypothesis fit", 5],
  ["Effort", -2],
  ["Risk", -1],
] as const

const DemoPriority = () => (
  <Panel
    code="PR-015"
    icon={CircleGaugeIcon}
    label="Priority score"
    status={<Count>Explainable</Count>}
  >
    <div className="grid h-full min-h-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      <div className="flex flex-col border-border/50 border-b p-2 lg:border-r lg:border-b-0">
        <Setup>
          <span className="px-3">Ranked features</span>
        </Setup>
        <div className="mt-2 flex flex-col gap-1">
          {priorityRows.map((row, index) => (
            <ListRow
              aria-current={index === 0 ? "true" : undefined}
              boxClassName="rounded-lg"
              className="px-3 py-2.5"
              key={row.feature}
              primary={index === 0}
              {...motionItem(index)}
            >
              {index === 0 ? (
                <span
                  aria-hidden="true"
                  className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-foreground/70"
                />
              ) : null}
              <div className="flex items-baseline justify-between gap-3">
                <span className="min-w-0 truncate font-medium text-demo-control!">
                  {row.feature}
                </span>
                <span
                  className={cn(
                    "shrink-0 text-demo-metadata! tabular-nums",
                    textTone[row.tone]
                  )}
                >
                  {row.label} · {row.score}/18
                </span>
              </div>
              <div
                aria-hidden="true"
                className="mt-2 h-1 overflow-hidden rounded-full bg-muted"
              >
                <div
                  className={cn(BAR_FILL, row.bar, row.fill)}
                  style={{ transitionDelay: `${index * 90 + 120}ms` }}
                />
              </div>
            </ListRow>
          ))}
        </div>
      </div>

      <div className="flex flex-col p-4">
        <Setup>Why MVP scope board scores high</Setup>
        <div className="mt-2 flex items-end justify-between gap-3">
          <p className="font-medium text-demo-stat!">High priority</p>
          <p className="font-semibold text-demo-score! tabular-nums">
            15
            <span className="ml-1.5 align-baseline font-medium text-demo-stat! text-muted-foreground">
              / 18
            </span>
          </p>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
          {priorityFactors.map(([label, value], index) => (
            <div
              className="flex items-baseline justify-between gap-3 border-border/50 border-b pb-1.5 text-demo-metadata!"
              key={label}
              {...motionItem(index)}
            >
              <dt className="text-muted-foreground">{label}</dt>
              <dd
                className={cn(
                  "font-medium tabular-nums",
                  value > 0
                    ? "text-success-foreground"
                    : "text-destructive-foreground"
                )}
              >
                {value > 0 ? `+${value}` : `${value}`}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-demo-metadata! text-muted-foreground">
          High priority because this validates the main hypothesis and unlocks
          the first user flow.
        </p>
        <div className="mt-4 border-border/50 border-t pt-3">
          <Setup>Signals</Setup>
          <ul className="mt-2 flex flex-col gap-1.5 text-demo-metadata! text-muted-foreground">
            <li>Validates the main hypothesis</li>
            <li>Unlocks the first user flow</li>
            <li>Low integration risk before beta</li>
          </ul>
        </div>
        <p className="mt-4 border-border/50 border-t pt-3 text-demo-metadata! text-muted-foreground/70">
          score = impact + confidence + stage fit + hypothesis fit − effort −
          risk
        </p>
      </div>
    </div>
  </Panel>
)

export const Priority = () => (
  <SplitGiant
    demo={<DemoPriority />}
    description="Mavry scores features with explainable inputs — impact, confidence, stage fit, hypothesis fit, effort, and risk — so priority never feels arbitrary."
    id="priority"
    image={DEMO_BACKGROUND}
    title={<TwoTone lead="Prioritize with reasons," tail="not vibes." />}
  />
)
