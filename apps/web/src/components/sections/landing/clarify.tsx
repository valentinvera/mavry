import { ArrowRightIcon, Layers3Icon, LightbulbIcon } from "lucide-react"
import { Panel, Setup, Status } from "@/components/landing/demo-primitives"
import { DEMO_BACKGROUND, DemoStage } from "@/components/landing/demo-stage"
import { SplitIntro, TwoTone } from "@/components/landing/section-intro"

const ClarifyBefore = () => (
  <Panel
    code="ID-042"
    icon={LightbulbIcon}
    label="Raw idea"
    status={<Status tone="warning">Needs clarity</Status>}
  >
    <div className="flex min-h-0 flex-1 flex-col p-5">
      <p className="font-semibold text-demo-title!">
        Let me jot ideas before they disappear
      </p>
      <p className="mt-2 text-demo-body! text-muted-foreground">
        “Would be great to save an idea in the moment.”
      </p>
      <p className="mt-3 text-demo-metadata! text-muted-foreground">
        Source: Personal note
      </p>
      <div className="mt-5 border-border/50 border-t pt-4">
        <Setup>Missing context</Setup>
        <ul className="mt-2 flex flex-col gap-1.5 text-demo-metadata! text-muted-foreground">
          <li>Who is this for?</li>
          <li>What problem does it solve?</li>
          <li>What does it prove for the MVP?</li>
        </ul>
      </div>
      <p className="mt-auto border-border/50 border-t pt-3 text-demo-metadata! text-muted-foreground">
        Clarify before it becomes work.
      </p>
    </div>
  </Panel>
)

const ClarifyAfter = () => (
  <Panel
    code="FB-043"
    icon={Layers3Icon}
    label="Clarified feature"
    status={<Status tone="success">Core</Status>}
  >
    <div className="flex min-h-0 flex-1 flex-col p-5">
      <p className="font-semibold text-demo-title!">Quick capture</p>
      <dl className="mt-4 flex flex-col divide-y divide-border/50 text-demo-metadata!">
        <div className="flex items-baseline justify-between gap-3 py-2">
          <dt className="text-muted-foreground">Problem</dt>
          <dd className="text-right font-medium">
            Ideas are lost before they are captured
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3 py-2">
          <dt className="text-muted-foreground">User</dt>
          <dd className="text-right font-medium">Technical founders</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3 py-2">
          <dt className="text-muted-foreground">Proves</dt>
          <dd className="text-right font-medium">
            Founders save ideas without turning them into tasks
          </dd>
        </div>
      </dl>
      <p className="mt-auto border-border/50 border-t pt-3 text-demo-metadata! text-muted-foreground">
        Clear enough to classify into Core, Support, Later, or No for now.
      </p>
    </div>
  </Panel>
)

const DemoClarify = () => (
  <div className="flex w-full min-w-0 flex-col gap-4 lg:flex-row lg:items-stretch">
    <div className="flex min-w-0 flex-1">
      <ClarifyBefore />
    </div>
    <div
      aria-hidden="true"
      className="hidden items-center justify-center lg:flex"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
        <ArrowRightIcon className="size-4" />
      </span>
    </div>
    <div className="flex min-w-0 flex-1">
      <ClarifyAfter />
    </div>
  </div>
)

export const Clarify = () => (
  <section
    aria-labelledby="clarify-title"
    className="group relative min-w-0 pt-20 sm:pt-28"
    data-section-reveal=""
    id="clarify"
  >
    <SplitIntro
      description="Clarify sharpens a messy note before it becomes a feature: who it is for, what it proves, and why it belongs in the MVP."
      id="clarify-title"
    >
      <TwoTone lead="Turn a raw idea" tail="into a clear decision." />
    </SplitIntro>

    <div className="mt-14" data-motion-pop="">
      <DemoStage image={DEMO_BACKGROUND}>
        <DemoClarify />
      </DemoStage>
    </div>
  </section>
)
