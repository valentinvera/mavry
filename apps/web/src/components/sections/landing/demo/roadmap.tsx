import { cn } from "@mavry/ui/lib/utils"
import { ArrowRightIcon } from "lucide-react"
import { useCallback } from "react"
import { Frame } from "@/components/landing/demo/frame"
import type { Content } from "@/components/landing/demo/page-data"

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

type RoadmapLaneId = (typeof roadmapLanes)[number]["id"]
type RoadmapLane = (typeof roadmapLanes)[number]

const launchPath = [
  {
    id: "shape",
    label: "Shape",
    title: "Capture the messy starting point",
  },
  {
    id: "protect",
    label: "Protect",
    title: "Lock beta scope",
  },
  {
    id: "open",
    label: "Open",
    title: "Ship a beta with one feedback route",
  },
  {
    id: "learn",
    label: "Learn",
    title: "Review what users ask for",
  },
] as const

interface RoadmapLaneButtonProps {
  index: number
  interactive: boolean
  lane: RoadmapLane
  onSelectedLaneChange: (laneId: RoadmapLaneId) => void
  selectedLaneId: RoadmapLaneId
}

const RoadmapLaneButton = ({
  index,
  interactive,
  lane,
  onSelectedLaneChange,
  selectedLaneId,
}: RoadmapLaneButtonProps) => {
  const handleSelect = useCallback(() => {
    onSelectedLaneChange(lane.id)
  }, [lane.id, onSelectedLaneChange])

  return (
    <button
      aria-pressed={lane.id === selectedLaneId}
      className="group grid min-h-20 grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-4 text-left transition-colors hover:text-foreground active:translate-y-px disabled:pointer-events-none"
      disabled={!interactive}
      onClick={handleSelect}
      type="button"
    >
      <span>
        <span className="block font-medium text-demo-metadata!">
          {lane.label}
        </span>
        <span className="mt-1 block text-demo-metadata! text-muted-foreground">
          0{index + 1}
        </span>
      </span>
      <span
        className={cn(
          "block rounded-md border border-border/70 bg-card/60 px-4 py-3 transition-colors group-hover:bg-muted/35",
          lane.id === selectedLaneId && "border-foreground/60"
        )}
      >
        <span className="block font-medium text-demo-control!">
          {lane.summary}
        </span>
        <span className="mt-1 block text-demo-metadata! text-muted-foreground">
          {lane.detail}
        </span>
      </span>
    </button>
  )
}

export const Roadmap = ({
  content,
  interactive,
  onSelectedLaneChange,
  selectedLaneId,
}: {
  content: Content
  interactive: boolean
  onSelectedLaneChange: (laneId: RoadmapLaneId) => void
  selectedLaneId: RoadmapLaneId
}) => (
  <Frame content={content}>
    <div className="min-h-[29rem] overflow-hidden">
      <div className="grid grid-cols-7 border-border/70 border-b text-center text-demo-metadata! text-muted-foreground">
        {["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"].map((month) => (
          <span
            className="border-border/70 border-r py-3 last:border-r-0"
            key={month}
          >
            {month}
          </span>
        ))}
      </div>
      <div className="relative p-5">
        <div className="absolute inset-y-0 left-[42%] w-px bg-success/30" />
        <div className="absolute top-0 bottom-0 left-[68%] w-px bg-warning/30" />
        <div className="flex flex-col gap-5">
          {roadmapLanes.map((lane, index) => (
            <RoadmapLaneButton
              index={index}
              interactive={interactive}
              key={lane.id}
              lane={lane}
              onSelectedLaneChange={onSelectedLaneChange}
              selectedLaneId={selectedLaneId}
            />
          ))}
        </div>
        <div className="mt-6 grid gap-3 border-border/70 border-t pt-4 md:grid-cols-4">
          {launchPath.map((step, index) => (
            <button
              className="relative text-left transition-colors hover:text-foreground active:translate-y-px"
              key={step.id}
              type="button"
            >
              <span className="text-demo-metadata! text-muted-foreground">
                {String(index + 1).padStart(2, "0")} {step.label}
              </span>
              <span className="mt-2 block font-medium text-demo-control!">
                {step.title}
              </span>
            </button>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {["Cut drift", "Assign feedback", "Open beta"].map((item) => (
            <button
              className="flex items-center gap-2 rounded-md border border-border/70 bg-card/55 px-3 py-2 text-demo-control! transition-colors hover:bg-muted/35 active:translate-y-px"
              key={item}
              type="button"
            >
              {item}
              <ArrowRightIcon
                aria-hidden="true"
                className="size-3.5 text-muted-foreground"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  </Frame>
)
