import { cn } from "@mavry/ui/lib/utils"
import { CheckIcon, TargetIcon } from "lucide-react"
import {
  ListRow,
  motionItem,
  Panel,
  Setup,
  Status,
} from "@/components/landing/demo-primitives"
import { DEMO_BACKGROUND } from "@/components/landing/demo-stage"
import { SplitGiant, TwoTone } from "@/components/landing/section-intro"

const hypothesisCore = [
  ["MVP scope board", "Keeps the first release small."],
  ["Quick capture", "Captures ideas without becoming work."],
] as const

const hypothesisLater = [
  ["Feedback hub", "Does not test the core hypothesis yet."],
  ["Template marketplace", "Adds product area before demand."],
  ["GitHub sync", "Integration risk before the loop works."],
] as const

const hypothesisFacts = [
  ["Target user", "Technical founders"],
  ["Main problem", "Every idea feels important"],
  ["Goal in 30 days", "A clear MVP scope in one session"],
  ["Stage", "MVP scope"],
  ["Success signal", "A clear scope with one explicit cut"],
  ["Fails if", "Core grows past two features"],
] as const

const DemoHypothesis = () => (
  <Panel
    code="HY-001"
    icon={TargetIcon}
    label="Product hypothesis"
    status={<Status tone="success">1 hypothesis</Status>}
  >
    <div className="grid h-full min-h-0 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <div className="flex flex-col border-border/50 border-b p-5 lg:border-r lg:border-b-0">
        <Setup>What this MVP proves</Setup>
        <p className="mt-2 max-w-md text-balance font-semibold text-demo-title! leading-snug">
          A builder can turn raw ideas into a small, testable first version.
        </p>
        <dl className="mt-5 flex flex-col divide-y divide-border/50">
          {hypothesisFacts.map(([term, value], index) => (
            <div
              className="flex items-baseline justify-between gap-3 py-2 text-demo-metadata!"
              key={term}
              {...motionItem(index)}
            >
              <dt className="text-muted-foreground">{term}</dt>
              <dd
                className={cn(
                  "font-medium",
                  term === "Fails if"
                    ? "text-destructive-foreground"
                    : "text-foreground"
                )}
              >
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="flex min-h-0 flex-col">
        <div className="border-border/50 border-b p-4">
          <Setup>Core features that answer it</Setup>
          <div className="mt-2 flex flex-col">
            {hypothesisCore.map(([feature, note], index) => (
              <ListRow
                boxClassName="rounded-md"
                className="flex items-start gap-2.5 px-2 py-2"
                key={feature}
                {...motionItem(index)}
              >
                <CheckIcon
                  aria-hidden="true"
                  className="mt-0.5 size-3.5 shrink-0 text-success-foreground"
                />
                <span className="min-w-0">
                  <span className="block font-medium text-demo-control!">
                    {feature}
                  </span>
                  <span className="block text-demo-metadata! text-muted-foreground">
                    {note}
                  </span>
                </span>
              </ListRow>
            ))}
          </div>
        </div>
        <div className="border-border/50 border-b p-4">
          <Setup>Not required yet</Setup>
          <div className="mt-1 flex flex-col divide-y divide-border/50">
            {hypothesisLater.map(([feature, note], index) => (
              <ListRow
                className="flex items-baseline justify-between gap-3 px-2 py-2.5"
                key={feature}
                {...motionItem(index)}
              >
                <span className="min-w-0">
                  <span className="block font-medium text-demo-control!">
                    {feature}
                  </span>
                  <span className="block text-demo-metadata! text-muted-foreground">
                    {note}
                  </span>
                </span>
                <span className="shrink-0 text-demo-metadata! text-muted-foreground">
                  Later
                </span>
              </ListRow>
            ))}
          </div>
        </div>
        <div className="min-h-0 flex-1 p-4">
          <Setup>Open questions</Setup>
          <ul className="mt-2 flex flex-col gap-1.5 text-demo-metadata! text-muted-foreground">
            <li>Who owns beta feedback?</li>
            <li>Does the feedback hub wait for Later?</li>
          </ul>
        </div>
      </div>
    </div>
  </Panel>
)

export const Hypothesis = () => (
  <SplitGiant
    demo={<DemoHypothesis />}
    description="Every Core feature answers a product hypothesis. If a feature cannot explain what it proves, it does not belong in the first release."
    id="hypothesis"
    image={DEMO_BACKGROUND}
    title={<TwoTone lead="Start from what the" tail="MVP must prove." />}
  />
)
