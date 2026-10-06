import { cn } from "@mavry/ui/lib/utils"
import { ArrowRightIcon, CalendarCheckIcon } from "lucide-react"
import {
  dotTone,
  ListRow,
  motionItem,
  Panel,
  Setup,
  Status,
  type Tone,
} from "@/components/landing/demo-primitives"
import { DEMO_BACKGROUND, DemoStage } from "@/components/landing/demo-stage"
import { SplitIntro, TwoTone } from "@/components/landing/section-intro"

const weeklyReviewChanges = [
  {
    id: "feedback-hub",
    title: "Feedback hub requested again",
    from: "Scope pressure",
    to: "Later",
    reason:
      "Useful after beta, but the first release only needs one feedback route.",
    status: "Moved",
  },
  {
    id: "decision-log",
    title: "Decision log moved out of Core",
    from: "Core",
    to: "Support",
    reason:
      "Helpful for clarity, but not required as the main proof of the product.",
    status: "Reduced",
  },
  {
    id: "github-sync",
    title: "GitHub sync stayed cut",
    from: "Reopened",
    to: "No for now",
    reason: "Integration work should wait until manual export becomes painful.",
    status: "Cut",
  },
] as const

const weeklyReviewSignals = [
  ["New ideas", "+9"],
  ["Moved", "3"],
  ["Cuts kept", "2"],
  ["Next actions", "3"],
] as const

const changeTone: Record<string, Tone> = {
  Cut: "danger",
  Moved: "info",
  Reduced: "warning",
}

const DemoReview = () => (
  <Panel code="WR-005" icon={CalendarCheckIcon} label="Weekly review">
    <div className="grid min-h-0 min-w-0 flex-1 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
      <div className="flex min-h-0 min-w-0 flex-col border-border/50 border-b p-5 lg:border-r lg:border-b-0">
        <Setup>Week 05</Setup>
        <p className="mt-1 text-demo-metadata! text-muted-foreground">
          Beta scope review
        </p>
        <div className="mt-5 flex flex-col divide-y divide-border/50">
          {weeklyReviewSignals.map(([label, value], index) => (
            <div
              className="flex items-baseline justify-between gap-3 py-3"
              key={label}
              {...motionItem(index)}
            >
              <span className="text-demo-metadata! text-muted-foreground">
                {label}
              </span>
              <span className="font-semibold text-demo-stat! tabular-nums">
                {value}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-auto border-border/50 border-t pt-3 text-demo-metadata! text-muted-foreground">
          No new Core feature until feedback ownership is assigned.
        </p>
      </div>

      <div className="flex min-h-0 min-w-0 flex-col p-5">
        <Setup>Recorded changes</Setup>
        <p className="mt-2 max-w-xl font-medium text-demo-control!">
          New ideas appeared, but the beta scope stayed small.
        </p>
        <div className="mt-4 min-h-0 flex-1 divide-y divide-border/50">
          {weeklyReviewChanges.slice(0, 3).map((change, index) => (
            <ListRow
              className="py-3.5"
              key={change.id}
              primary={index === 0}
              {...motionItem(index)}
            >
              <div className="flex items-center gap-2">
                <p className="min-w-0 flex-1 truncate font-medium text-demo-control!">
                  {change.title}
                </p>
                <Status tone={changeTone[change.status] ?? "neutral"}>
                  {change.status}
                </Status>
              </div>
              <p className="mt-1.5 flex items-center gap-1.5 text-demo-metadata!">
                <span className="text-muted-foreground">{change.from}</span>
                <ArrowRightIcon
                  aria-hidden="true"
                  className="size-3 text-muted-foreground/60"
                />
                <span className="font-medium text-foreground">{change.to}</span>
              </p>
              <p className="mt-1.5 text-demo-metadata! text-muted-foreground/80">
                {change.reason}
              </p>
            </ListRow>
          ))}
        </div>
      </div>
    </div>
  </Panel>
)

const inboxItems = [
  {
    id: "mobile-capture",
    title: "Mobile capture stays lightweight",
    source: "Mobile capture",
    status: "Needs clarity",
    detail: "Can this capture an idea without committing it to build?",
  },
  {
    id: "feedback-route",
    title: "One beta feedback route",
    source: "Founder note",
    status: "Convert",
    detail: "One owner and one channel are enough to unblock beta.",
  },
  {
    id: "public-roadmap",
    title: "Public roadmap after launch",
    source: "Customer call",
    status: "Later",
    detail: "Useful after beta, but too early before the MVP has users.",
  },
  {
    id: "templates",
    title: "Template marketplace",
    source: "Backlog import",
    status: "Reject",
    detail: "It does not help the first version answer its core question.",
  },
] as const

const mobileTiles: readonly [string, Tone][] = [
  ["Core", "success"],
  ["Support", "info"],
  ["Later", "warning"],
  ["No for now", "danger"],
]

const DemoMobile = () => (
  <div
    className="flex items-center justify-center"
    data-reference-scene="mobile-capture"
  >
    <div className="relative w-[15.5rem] rounded-[2.7rem] border-[9px] border-foreground bg-foreground shadow-[0_1px_2px_0_rgb(0_0_0/0.08),0_40px_80px_-40px_rgb(0_0_0/0.55)]">
      <span
        aria-hidden="true"
        className="absolute top-[7.5rem] -right-[11px] h-14 w-[3px] rounded-r-sm bg-foreground/70"
      />
      <span
        aria-hidden="true"
        className="absolute top-[6rem] -left-[11px] h-8 w-[3px] rounded-l-sm bg-foreground/70"
      />
      <span
        aria-hidden="true"
        className="absolute top-[8.25rem] -left-[11px] h-14 w-[3px] rounded-l-sm bg-foreground/70"
      />

      <div className="relative overflow-hidden rounded-[2.05rem] bg-background">
        <div className="absolute top-2 left-1/2 z-10 h-[1.35rem] w-16 -translate-x-1/2 rounded-full bg-foreground" />

        <div className="px-5 pt-12 pb-6">
          <p className="text-demo-metadata! text-muted-foreground">
            Mavry / Capture
          </p>
          <p className="mt-1 font-semibold text-demo-title!">Quick capture</p>
          <div className="mt-3 rounded-lg border border-border/70 bg-muted/40 px-3 py-2 text-demo-control!">
            Where should beta replies go?
          </div>
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            {mobileTiles.map(([tile, tone]) => {
              const isSelected = tile === "Support"

              return (
                <span
                  className={cn(
                    "flex items-center justify-center gap-1.5 rounded-md border py-1.5 text-demo-metadata! transition-[transform,background-color,border-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98] motion-reduce:transition-none",
                    isSelected
                      ? "border-foreground/50 bg-foreground/[0.05] font-medium text-foreground"
                      : "border-border/70 text-muted-foreground hover:bg-muted/40"
                  )}
                  key={tile}
                >
                  <span
                    aria-hidden="true"
                    className={cn("size-1.5 rounded-full", dotTone[tone])}
                  />
                  {tile}
                </span>
              )
            })}
          </div>
          <div className="mt-4 flex flex-col divide-y divide-border/50">
            {inboxItems.slice(0, 3).map((item, index) => (
              <ListRow
                boxClassName="rounded-md"
                className="px-2 py-2.5"
                key={item.id}
                primary={index === 0}
                {...motionItem(index)}
              >
                <p className="truncate font-medium text-demo-metadata!">
                  {item.title}
                </p>
                <p className="truncate text-demo-metadata! text-muted-foreground">
                  {item.source}
                </p>
              </ListRow>
            ))}
          </div>
        </div>

        <div className="flex justify-center pb-2">
          <span className="h-1 w-24 rounded-full bg-foreground/25" />
        </div>
      </div>
    </div>
  </div>
)

export const Mobile = () => (
  <section
    aria-labelledby="mobile-title"
    className="group relative min-w-0 pt-20 sm:pt-28"
    data-section-reveal=""
    id="mobile"
  >
    <SplitIntro
      description="Review on web, capture and classify on mobile. The same project state follows you, so the loop never stops."
      id="mobile-title"
    >
      <TwoTone lead="Keep the loop moving" tail="wherever you are." />
    </SplitIntro>

    <div className="mt-12 grid gap-5 lg:grid-cols-3">
      <div className="lg:col-span-2" data-motion-pop="">
        <DemoStage className="h-auto lg:h-[34rem]" image={DEMO_BACKGROUND}>
          <DemoReview />
        </DemoStage>
      </div>
      <div className="lg:col-span-1" data-motion-pop="">
        <DemoStage className="h-auto lg:h-[34rem]" image={DEMO_BACKGROUND}>
          <DemoMobile />
        </DemoStage>
      </div>
    </div>
  </section>
)
