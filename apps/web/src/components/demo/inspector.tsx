import { Badge } from "@mavry/ui/components/badge"
import { Button } from "@mavry/ui/components/button"
import { cn } from "@mavry/ui/lib/utils"
import {
  ArrowRightIcon,
  CheckIcon,
  CircleAlertIcon,
  LinkIcon,
  MoreHorizontalIcon,
} from "lucide-react"
import {
  decisionClassNames,
  type PageId,
  type RoadmapLaneId,
  readinessClassNames,
  roadmapLanes,
  type ScopeRow,
  scopeRows,
} from "@/components/demo/data"
import { contentByPage } from "@/components/demo/page-data"

interface Props {
  activePageId: PageId
  selectedLaneId: RoadmapLaneId
  selectedRow: ScopeRow
}

export const Inspector = ({
  activePageId,
  selectedLaneId,
  selectedRow,
}: Props) => {
  const selectedLane =
    roadmapLanes.find((lane) => lane.id === selectedLaneId) ?? roadmapLanes[0]
  const cutRows = scopeRows.filter((row) => row.decision === "Cut")
  const pageContent = contentByPage[activePageId]

  return (
    <aside className="hidden min-h-0 border-border/80 border-l bg-transparent xl:flex xl:flex-col">
      <header className="flex items-center justify-between gap-3 border-border/80 border-b px-4 py-3">
        <div>
          <p className="text-caption text-muted-foreground">
            {pageContent.code}
          </p>
          <h2 className="mt-1 font-medium text-body">{pageContent.title}</h2>
        </div>
        <div className="flex items-center gap-1">
          <Button
            aria-label="Copy inspector link"
            className="rounded-md text-muted-foreground"
            size="icon-xs"
            type="button"
            variant="ghost"
          >
            <LinkIcon />
          </Button>
          <Button
            aria-label="Inspector menu"
            className="rounded-md text-muted-foreground"
            size="icon-xs"
            type="button"
            variant="ghost"
          >
            <MoreHorizontalIcon />
          </Button>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto" data-smooth-scroll="">
        <section className="border-border/80 border-b px-4 py-4">
          <dl className="grid gap-3 text-caption">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Decision</dt>
              <dd>
                <Badge
                  className={cn(
                    "rounded-md text-caption",
                    decisionClassNames[selectedRow.decision]
                  )}
                >
                  {selectedRow.decision}
                </Badge>
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Page</dt>
              <dd>{pageContent.context}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Owner</dt>
              <dd>{selectedRow.owner}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Lane</dt>
              <dd>{selectedRow.lane}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Readiness</dt>
              <dd>
                <Badge
                  className={cn(
                    "rounded-md text-caption",
                    readinessClassNames[selectedRow.readiness]
                  )}
                >
                  {selectedRow.readiness}
                </Badge>
              </dd>
            </div>
          </dl>
        </section>

        <section className="border-border/80 border-b px-4 py-4">
          <div className="flex items-center gap-2">
            <CircleAlertIcon
              aria-hidden="true"
              className="size-3.5 text-warning-foreground"
            />
            <p className="font-medium text-caption">Launch confidence</p>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[74%] rounded-full bg-success" />
          </div>
          <p className="mt-3 text-caption text-muted-foreground">
            74/100 means the MVP scope can keep moving, but beta should wait
            until the feedback route has an owner.
          </p>
        </section>

        <section className="border-border/80 border-b px-4 py-4">
          <p className="font-medium text-caption">Next 3 actions</p>
          <div className="mt-3 divide-y divide-border/70">
            {[
              "Assign one owner for beta feedback",
              "Review cut reasons before adding scope",
              "Choose the next launch action",
            ].map((action) => (
              <button
                className="grid w-full grid-cols-[1rem_minmax(0,1fr)] gap-2 py-2 text-left text-caption transition-colors hover:text-foreground active:translate-y-px"
                key={action}
                type="button"
              >
                <CheckIcon
                  aria-hidden="true"
                  className="mt-0.5 size-3.5 text-success-foreground"
                />
                {action}
              </button>
            ))}
          </div>
          <Button
            className="mt-3 rounded-md text-caption"
            size="sm"
            type="button"
          >
            Open review
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </section>

        <section className="border-border/80 border-b px-4 py-4">
          <p className="font-medium text-caption">Not in this MVP</p>
          <div className="mt-3 divide-y divide-border/70">
            {cutRows.map((row) => (
              <button
                className="grid w-full grid-cols-[1rem_minmax(0,1fr)] gap-2 py-2 text-left transition-colors hover:text-foreground active:translate-y-px"
                key={row.id}
                type="button"
              >
                <CheckIcon
                  aria-hidden="true"
                  className="mt-0.5 size-3.5 text-destructive-foreground"
                />
                <span>
                  <span className="block font-medium text-caption">
                    {row.feature}
                  </span>
                  <span className="block text-caption text-muted-foreground">
                    Reconsider only if manual export becomes a repeated blocker.
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="px-4 py-4">
          <p className="font-medium text-caption">{selectedLane.label}</p>
          <p className="mt-2 text-caption text-muted-foreground">
            {selectedLane.detail}
          </p>
        </section>
      </div>
    </aside>
  )
}
