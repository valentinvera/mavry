import { cn } from "@mavry/ui/lib/utils"
import { ClipboardListIcon } from "lucide-react"
import { Count, Panel } from "@/components/landing/demo-primitives"
import { DEMO_BACKGROUND, DemoStage } from "@/components/landing/demo-stage"
import { TITLE, TwoTone } from "@/components/landing/section-intro"

const IntakeField = ({
  className,
  label,
  value,
}: {
  className?: string
  label: string
  value: string
}) => (
  <div className={cn("flex min-w-0 flex-col gap-1", className)}>
    <span className="text-demo-metadata! text-muted-foreground">{label}</span>
    <span className="rounded-md border border-border/70 bg-background/60 px-3 py-2 text-demo-control!">
      {value}
    </span>
  </div>
)

const DemoIntake = () => (
  <Panel
    code="IN-001"
    icon={ClipboardListIcon}
    label="Project intake"
    status={<Count>Draft</Count>}
  >
    <div className="flex min-h-0 flex-1 flex-col p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <IntakeField label="Project" value="Mavry" />
        <IntakeField label="Stage" value="MVP scope" />
        <IntakeField
          className="sm:col-span-2"
          label="Target user"
          value="Technical founders"
        />
        <IntakeField
          className="sm:col-span-2"
          label="Main problem"
          value="Every idea feels important"
        />
        <IntakeField
          className="sm:col-span-2"
          label="Hypothesis"
          value="A builder can turn raw ideas into a small, testable first version."
        />
        <IntakeField
          className="sm:col-span-2"
          label="Goal in 30 days"
          value="A clear MVP scope in one session"
        />
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 border-border/50 border-t pt-3">
        <p className="text-demo-metadata! text-muted-foreground">
          Enough context to classify every feature.
        </p>
        <span className="shrink-0 rounded-md bg-primary px-2.5 py-1 font-medium text-demo-metadata! text-primary-foreground transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98] motion-reduce:transition-none">
          Continue
        </span>
      </div>
    </div>
  </Panel>
)

const intakeSteps = [
  { detail: "Name and one-line description.", id: "project", title: "Project" },
  { detail: "Where the product stands today.", id: "stage", title: "Stage" },
  {
    detail: "Who it is for and what hurts today.",
    id: "user",
    title: "User and problem",
  },
  {
    detail: "What it must prove in 30 days.",
    id: "hypothesis",
    title: "Hypothesis and goal",
  },
] as const

export const Intake = () => (
  <section
    aria-labelledby="intake-title"
    className="group relative min-w-0 pt-20 sm:pt-28"
    data-section-reveal=""
    id="intake"
  >
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <div className="min-w-0" data-motion-pop="">
        <DemoStage image={DEMO_BACKGROUND}>
          <DemoIntake />
        </DemoStage>
      </div>
      <div data-motion-pop="">
        <h2 className={TITLE} data-landing-section-title="" id="intake-title">
          <TwoTone lead="Define the product" tail="before the backlog." />
        </h2>
        <p className="mt-5 max-w-md text-[#5f6269] text-[1rem] leading-7">
          Mavry forces enough clarity before features exist: who it is for, what
          problem it solves, what it must prove, and what ships in 30 days.
        </p>
        <ol className="mt-8 flex flex-col">
          {intakeSteps.map((step, index) => {
            const isLast = index === intakeSteps.length - 1

            return (
              <li className="flex gap-3.5" key={step.id}>
                <div className="relative flex w-5 flex-col items-center">
                  <span className="relative z-10 flex size-5 shrink-0 items-center justify-center rounded-full border border-border bg-card font-medium text-[0.6875rem] tabular-nums">
                    {index + 1}
                  </span>
                  {isLast ? null : (
                    <span
                      aria-hidden="true"
                      className="absolute top-5 -bottom-0.5 w-px bg-border"
                    />
                  )}
                </div>
                <div className={cn("min-w-0", !isLast && "pb-5")}>
                  <p className="font-medium text-[#0a0a0a] text-[0.9375rem]">
                    {step.title}
                  </p>
                  <p className="mt-0.5 text-[#5f6269] text-[0.9375rem] leading-6">
                    {step.detail}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  </section>
)
