import { InboxIcon, SparklesIcon } from "lucide-react"
import {
  Count,
  ListRow,
  motionItem,
  Panel,
  Setup,
  Status,
  type Tone,
} from "@/components/landing/demo-primitives"
import { DEMO_BACKGROUND, DemoStage } from "@/components/landing/demo-stage"
import { CheckList, TITLE, TwoTone } from "@/components/landing/section-intro"

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

const inboxTone: Record<string, Tone> = {
  Convert: "success",
  Later: "neutral",
  "Needs clarity": "warning",
  Reject: "danger",
}

const DemoInbox = () => (
  <Panel
    code="IN-028"
    icon={InboxIcon}
    label="Idea inbox"
    status={<Count>12 captured</Count>}
  >
    <div className="grid min-h-0 min-w-0 flex-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <div className="flex min-h-0 min-w-0 flex-col p-4">
        <div className="flex items-center gap-2 rounded-md border border-border/70 bg-background/60 px-3 py-2 text-demo-control! text-muted-foreground">
          <SparklesIcon aria-hidden="true" className="size-3.5" />
          Capture without committing to build
        </div>
        <div className="mt-2 min-h-0 flex-1 divide-y divide-border/50">
          {inboxItems.slice(0, 4).map((item, index) => (
            <ListRow
              className="flex items-center gap-3 px-3 py-3"
              key={item.id}
              primary={index === 0}
              {...motionItem(index)}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-demo-control!">
                  {item.title}
                </p>
                <p className="mt-0.5 truncate text-demo-metadata! text-muted-foreground">
                  {item.source}
                </p>
              </div>
              <Status tone={inboxTone[item.status]}>{item.status}</Status>
            </ListRow>
          ))}
        </div>
        <p className="mt-3 border-border/50 border-t pt-2.5 text-demo-metadata! text-muted-foreground">
          9 more captured, none urgent yet
        </p>
      </div>

      <div className="flex min-h-0 min-w-0 flex-col border-border/50 border-t p-5 lg:border-t-0 lg:border-l">
        <Setup>Under review</Setup>
        <p className="mt-2 font-semibold text-demo-title!">
          {inboxItems[0].title}
        </p>
        <p className="mt-1 text-demo-metadata! text-muted-foreground">
          {inboxItems[0].source} · {inboxItems[0].status}
        </p>
        <p className="mt-4 text-demo-body! text-muted-foreground">
          {inboxItems[0].detail}
        </p>
        <div className="mt-5 border-border/50 border-t pt-4">
          <Setup>Decision</Setup>
          <p className="mt-2 font-medium text-demo-control!">
            Not a commitment yet
          </p>
          <p className="mt-1.5 text-demo-metadata! text-muted-foreground">
            It needs one owner and one channel before it earns a place in Core.
          </p>
        </div>
        <p className="mt-auto border-border/50 border-t pt-3 text-demo-metadata! text-muted-foreground/80">
          An idea only enters Core when it proves the hypothesis.
        </p>
      </div>
    </div>
  </Panel>
)

const captureCard = {
  demo: <DemoInbox />,
  description:
    "Capture without committing. Nothing enters the MVP just because it was written down.",
  id: "capture",
  image: DEMO_BACKGROUND,
  title: "Catch the idea before it becomes work.",
} as const

export const Capture = () => (
  <section
    aria-labelledby="capture-title"
    className="group relative min-w-0 pt-20 sm:pt-28"
    data-section-reveal=""
    id="capture"
  >
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <div data-motion-pop="">
        <h2 className={TITLE} data-landing-section-title="" id="capture-title">
          <TwoTone lead="Catch the idea before" tail="it becomes work." />
        </h2>
        <p className="mt-5 max-w-md text-[#5f6269] text-[1rem] leading-7">
          {captureCard.description}
        </p>
        <CheckList
          color="#0b63ce"
          points={[
            "Captured without a commitment to build",
            "Nothing enters Core just because it was written",
            "Classify now or leave it for the next review",
          ]}
        />
      </div>
      <div className="min-w-0" data-motion-pop="">
        <DemoStage image={captureCard.image}>{captureCard.demo}</DemoStage>
      </div>
    </div>
  </section>
)
