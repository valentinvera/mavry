import { cn } from "@mavry/ui/lib/utils"
import { CircleGaugeIcon } from "lucide-react"
import {
  BAR_FILL,
  ListRow,
  motionItem,
  Panel,
  Setup,
  Status,
  type Tone,
} from "@/components/landing/demo-primitives"
import { DEMO_BACKGROUND, DemoStage } from "@/components/landing/demo-stage"
import { CheckList, TITLE, TwoTone } from "@/components/landing/section-intro"

const checks = [
  ["Hypothesis", "Clear enough for beta", "Done"],
  ["Core scope", "Two build-now features remain in scope", "Done"],
  ["Cuts", "Two cut ideas have reconsider rules", "Done"],
  ["Feedback route", "Owner missing", "Blocked"],
  ["Next action", "Review blocker before more scope", "Review"],
] as const

const checkTone: Record<string, Tone> = {
  Blocked: "warning",
  Done: "success",
  Review: "neutral",
}

const DemoReadiness = () => (
  <Panel
    code="LR-074"
    icon={CircleGaugeIcon}
    label="Launch readiness"
    status={<Status tone="warning">Almost ready</Status>}
  >
    <div className="grid min-h-0 min-w-0 flex-1 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
      <div className="flex min-w-0 flex-col border-border/50 border-b p-5 lg:border-r lg:border-b-0">
        <Setup>Launch threshold</Setup>
        <p className="mt-2 font-semibold text-demo-score! tabular-nums">
          74
          <span className="ml-1.5 align-baseline font-medium text-demo-stat! text-muted-foreground">
            / 100
          </span>
        </p>
        <div
          aria-label="Launch readiness"
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={74}
          className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted"
          role="progressbar"
        >
          <div
            className={cn(
              BAR_FILL,
              "bg-success-foreground group-data-[revealed=true]:scale-x-[0.74]"
            )}
          />
        </div>
        <p className="mt-4 max-w-xs text-demo-metadata! text-muted-foreground">
          Blocked by ownership, not by more features.
        </p>
        <p className="mt-auto border-border/50 border-t pt-3 text-demo-metadata! text-muted-foreground">
          Clearing the feedback owner is the next move.
        </p>
      </div>
      <div className="flex min-h-0 min-w-0 flex-col p-5">
        <Setup>Readiness evidence</Setup>
        <div className="mt-3 min-h-0 flex-1 divide-y divide-border/50">
          {checks.map(([title, description, status], index) => (
            <ListRow
              className="flex items-center justify-between gap-4 px-2 py-3"
              key={title}
              {...motionItem(index)}
            >
              {status === "Blocked" ? (
                <span
                  aria-hidden="true"
                  className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-warning-foreground/50"
                />
              ) : null}
              <span className="min-w-0">
                <span className="block font-medium text-demo-control!">
                  {title}
                </span>
                <span className="mt-0.5 block truncate text-demo-metadata! text-muted-foreground">
                  {description}
                </span>
              </span>
              <Status tone={checkTone[status] ?? "neutral"}>{status}</Status>
            </ListRow>
          ))}
        </div>
      </div>
    </div>
  </Panel>
)

const readinessCard = {
  demo: <DemoReadiness />,
  description:
    "A deterministic score that shows the real blocker — and what you do not need yet.",
  id: "readiness",
  image: DEMO_BACKGROUND,
  title: "Know what still blocks beta.",
} as const

export const Readiness = () => (
  <section
    aria-labelledby="readiness-title"
    className="group relative min-w-0 pt-20 sm:pt-28"
    data-section-reveal=""
    id={readinessCard.id}
  >
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
      <div data-motion-pop="">
        <h2
          className={TITLE}
          data-landing-section-title=""
          id="readiness-title"
        >
          <TwoTone lead="Know what still" tail="blocks beta." />
        </h2>
        <p className="mt-5 max-w-md text-[#5f6269] text-[1rem] leading-7">
          {readinessCard.description}
        </p>
        <CheckList
          color="#1d6b3a"
          points={[
            "Deterministic score, no AI guesswork",
            "Names the blocker that stops beta",
            "Shows what you do not need yet",
          ]}
        />
      </div>
      <div className="min-w-0" data-motion-pop="">
        <DemoStage image={readinessCard.image}>{readinessCard.demo}</DemoStage>
      </div>
    </div>
  </section>
)
