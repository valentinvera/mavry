import { Badge } from "@mavry/ui/components/badge"
import { cn } from "@mavry/ui/lib/utils"
import { ArrowRightIcon } from "lucide-react"
import { Frame } from "@/components/demo/frame"
import type { Content } from "@/components/demo/page-data"
import {
  weeklyReviewChanges,
  weeklyReviewSignals,
} from "@/components/demo/route-data"

export const WeeklyReview = ({ content }: { content: Content }) => (
  <Frame content={content}>
    <div className="grid min-h-[29rem] overflow-hidden lg:grid-cols-[10rem_minmax(0,1fr)]">
      <aside className="border-border/70 border-b p-4 lg:border-r lg:border-b-0">
        <p className="font-medium text-caption">Week 05</p>
        <p className="mt-1 text-caption text-muted-foreground">
          Beta scope review
        </p>
        <div className="mt-6 divide-y divide-border/70">
          {weeklyReviewSignals.map(([label, value]) => (
            <button
              className="w-full py-3 text-left transition-colors hover:text-foreground active:translate-y-px"
              key={label}
              type="button"
            >
              <span className="block font-semibold text-section">{value}</span>
              <span className="mt-1 block text-caption text-muted-foreground">
                {label}
              </span>
            </button>
          ))}
        </div>
      </aside>

      <section className="min-w-0">
        <div className="grid border-border/70 border-b md:grid-cols-[minmax(0,1fr)_12rem]">
          <div className="px-5 py-4">
            <p className="text-caption text-muted-foreground">Review brief</p>
            <h3 className="mt-2 max-w-xl font-semibold text-xlarge">
              New ideas appeared, but the beta scope stayed small.
            </h3>
            <p className="mt-3 max-w-xl text-muted-foreground text-small leading-relaxed">
              The review keeps the feedback hub out of beta, saves the cut
              reasons, and keeps the launch path focused on one manual feedback
              route.
            </p>
          </div>
          <div className="border-border/70 border-t px-4 py-4 md:border-t-0 md:border-l">
            <p className="font-medium text-caption">Decision to save</p>
            <p className="mt-3 text-muted-foreground text-small">
              No new Core feature should be added until feedback ownership is
              assigned.
            </p>
          </div>
        </div>

        <div className="divide-y divide-border/70 border-border/70 border-b">
          {weeklyReviewChanges.map((change) => (
            <button
              className="w-full px-5 py-4 text-left transition-colors hover:bg-muted/25 active:translate-y-px"
              key={change.id}
              type="button"
            >
              <span className="flex max-w-xl flex-wrap items-center gap-2">
                <span className="font-medium text-small">{change.title}</span>
                <Badge
                  className={cn(
                    "rounded-md text-caption",
                    change.status === "Cut" &&
                      "bg-destructive text-destructive-foreground",
                    change.status === "Moved" &&
                      "bg-warning text-warning-foreground",
                    change.status === "Reduced" &&
                      "bg-info text-info-foreground"
                  )}
                >
                  {change.status}
                </Badge>
              </span>
              <span className="mt-2 flex max-w-xl items-center gap-2 text-caption text-muted-foreground">
                {change.from}
                <ArrowRightIcon aria-hidden="true" className="size-3.5" />
                <span className="text-foreground">{change.to}</span>
              </span>
              <span className="mt-2 block max-w-xl text-caption text-muted-foreground">
                {change.reason}
              </span>
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-[minmax(0,1fr)_12rem]">
          <div className="px-5 py-4">
            <p className="font-medium text-caption">Activity sampled</p>
            <div className="mt-2 grid gap-2 md:grid-cols-3">
              {content.activities.map((item) => (
                <button
                  className="border-border/70 border-l pl-3 text-left transition-colors hover:border-foreground/60 active:translate-y-px"
                  key={item.id}
                  type="button"
                >
                  <span className="block font-medium text-caption">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-caption text-muted-foreground">
                    {item.time}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="border-border/70 border-t px-4 py-4 md:border-t-0 md:border-l">
            <p className="font-medium text-caption">Save review</p>
            <div className="mt-3 divide-y divide-border/70">
              {["Cut feedback hub", "Assign owner", "Open beta"].map((item) => (
                <button
                  className="flex w-full items-center justify-between gap-3 py-2 text-left transition-colors hover:text-foreground active:translate-y-px"
                  key={item}
                  type="button"
                >
                  <span className="text-caption">{item}</span>
                  <ArrowRightIcon
                    aria-hidden="true"
                    className="size-3.5 text-muted-foreground"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  </Frame>
)
