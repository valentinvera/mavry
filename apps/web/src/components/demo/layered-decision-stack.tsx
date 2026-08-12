import {
  CheckCircle2Icon,
  CircleDashedIcon,
  RouteIcon,
  ScissorsIcon,
} from "lucide-react"
import { scopeRows } from "@/components/demo/data"

const incomingIdeas = scopeRows.map((row, index) => ({
  code: `0${index + 1}`,
  feature: row.feature,
  question: row.question,
  decision: row.decision,
}))

const scopeOutcomes = [
  {
    label: "Build now",
    count: scopeRows.filter((row) => row.decision === "Build now").length,
    icon: CheckCircle2Icon,
    labelTone: "text-foreground",
    tone: "text-success-foreground",
    description: "Features that prove the MVP.",
  },
  {
    label: "Later",
    count: scopeRows.filter((row) => row.decision === "Later").length,
    icon: RouteIcon,
    labelTone: "text-foreground",
    tone: "text-warning-foreground",
    description: "Useful, but not part of launch.",
  },
  {
    label: "Cut",
    count: scopeRows.filter((row) => row.decision === "Cut").length,
    icon: ScissorsIcon,
    labelTone: "text-muted-foreground",
    tone: "text-muted-foreground",
    description: "Saved outside the MVP.",
  },
] as const

const toneClassNames = {
  "Build now": "text-success-foreground",
  Cut: "text-destructive-foreground",
  Later: "text-warning-foreground",
  Support: "text-info-foreground",
} as const

export const Stack = () => (
  <div className="relative min-h-[42rem] rounded-xl border border-border bg-card/45 px-4 md:px-6">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-70"
      style={{
        backgroundImage:
          "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
        backgroundPosition: "-1px -1px",
        backgroundSize: "6rem 6rem",
        maskImage:
          "linear-gradient(180deg, transparent 0%, black 18%, black 82%, transparent 100%)",
      }}
    />

    <div className="relative grid min-h-[42rem] lg:grid-cols-[minmax(0,0.9fr)_10rem_minmax(0,0.8fr)]">
      <section className="flex min-w-0 flex-col justify-center px-0 py-10 lg:pr-8">
        <div className="flex items-center justify-between border-border border-b pb-4">
          <p className="font-medium text-medium">Captured ideas</p>
          <p className="text-caption text-muted-foreground">
            {incomingIdeas.length} captured
          </p>
        </div>

        <div className="divide-y divide-border">
          {incomingIdeas.map((idea, index) => (
            <button
              className="group grid w-full gap-4 py-5 text-left transition-opacity hover:opacity-80 active:translate-y-px sm:grid-cols-[3rem_minmax(0,1fr)_7rem]"
              data-motion-item=""
              key={idea.feature}
              style={{ transitionDelay: `${160 + index * 55}ms` }}
              type="button"
            >
              <span className="text-caption text-muted-foreground">
                {idea.code}
              </span>
              <span className="min-w-0">
                <span className="block font-medium text-medium">
                  {idea.feature}
                </span>
                <span className="mt-1 block text-caption text-muted-foreground">
                  {idea.question}
                </span>
              </span>
              <span
                className={`font-medium text-caption ${toneClassNames[idea.decision]}`}
              >
                {idea.decision}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="relative hidden border-border border-x lg:block">
        <div
          aria-hidden="true"
          className="absolute top-12 bottom-12 left-1/2 w-px -translate-x-1/2 bg-foreground/30"
          data-motion-line=""
          style={{ transitionDelay: "260ms" }}
        />
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center">
          <button
            className="mx-auto flex size-20 items-center justify-center rounded-full border border-border bg-background text-center transition-colors hover:bg-muted/30 active:scale-[0.98]"
            data-motion-pop=""
            style={{ transitionDelay: "360ms" }}
            type="button"
          >
            <span className="max-w-12 font-medium text-caption">MVP scope</span>
          </button>
        </div>
        <svg
          aria-hidden="true"
          className="absolute inset-y-16 right-full h-[calc(100%-8rem)] w-44"
          preserveAspectRatio="none"
          viewBox="0 0 180 520"
        >
          <path
            className="stroke-border"
            d="M180 40 C96 116 96 206 180 260 C96 314 96 404 180 480"
            data-motion-path=""
            fill="none"
            pathLength={1}
            strokeLinecap="round"
          />
        </svg>
        <svg
          aria-hidden="true"
          className="absolute inset-y-16 left-full h-[calc(100%-8rem)] w-44"
          preserveAspectRatio="none"
          viewBox="0 0 180 520"
        >
          <path
            className="stroke-border"
            d="M0 80 C94 120 94 180 0 240 C94 300 94 380 0 440"
            data-motion-path=""
            fill="none"
            pathLength={1}
            strokeLinecap="round"
            style={{ transitionDelay: "120ms" }}
          />
        </svg>
      </section>

      <section className="flex min-w-0 flex-col justify-center border-border border-t px-0 py-10 lg:border-t-0 lg:pl-8">
        <div className="border-border border-b pb-4">
          <p className="font-medium text-medium">Reviewed outcome</p>
          <p className="mt-1 text-caption text-muted-foreground">
            Every item leaves the review with a place.
          </p>
        </div>

        <div className="divide-y divide-border">
          {scopeOutcomes.map((outcome, index) => {
            const Icon = outcome.icon

            return (
              <button
                className="grid w-full grid-cols-[2rem_minmax(0,1fr)_4rem] items-center gap-4 py-8 text-left transition-opacity hover:opacity-80 active:translate-y-px"
                data-motion-item=""
                key={outcome.label}
                style={{ transitionDelay: `${520 + index * 95}ms` }}
                type="button"
              >
                <Icon aria-hidden="true" className={`size-4 ${outcome.tone}`} />
                <span>
                  <span
                    className={`block font-medium text-large ${outcome.labelTone}`}
                  >
                    {outcome.label}
                  </span>
                  <span className="mt-1 block text-caption text-muted-foreground">
                    {outcome.description}
                  </span>
                </span>
                <span className="text-right font-semibold text-section">
                  {outcome.count}
                </span>
              </button>
            )
          })}
        </div>

        <button
          className="mt-8 flex items-center gap-3 border-border border-t pt-5 text-left transition-opacity hover:opacity-80 active:translate-y-px"
          data-motion-item=""
          style={{ transitionDelay: "820ms" }}
          type="button"
        >
          <CircleDashedIcon
            aria-hidden="true"
            className="size-4 text-muted-foreground"
          />
          <span>
            <span className="block font-medium text-caption">
              Mavry makes the first version smaller before work starts.
            </span>
            <span className="block text-caption text-muted-foreground">
              Cuts, later items, and blockers stay visible as product context.
            </span>
          </span>
        </button>
      </section>
    </div>
  </div>
)
