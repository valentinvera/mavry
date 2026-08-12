import { Badge } from "@mavry/ui/components/badge"
import { cn } from "@mavry/ui/lib/utils"
import { Frame } from "@/components/demo/frame"
import type { Content } from "@/components/demo/page-data"
import { checks } from "@/components/demo/route-data"

export const Readiness = ({ content }: { content: Content }) => (
  <Frame content={content}>
    <div className="grid min-h-[29rem] overflow-hidden lg:grid-cols-[minmax(0,1fr)_17rem]">
      <section className="relative p-5">
        <div className="absolute right-5 bottom-12 left-5 h-px bg-border/60" />
        <div className="absolute bottom-12 left-[74%] h-48 w-px bg-success/40" />
        <div className="relative flex min-h-[24rem] flex-col justify-end">
          <div className="mb-6 max-w-md">
            <p className="text-caption text-muted-foreground">
              Launch threshold
            </p>
            <p className="mt-2 font-bold text-display">74</p>
            <p className="mt-3 text-large text-muted-foreground">
              Almost ready. The score is not blocked by more features; it is
              blocked by ownership.
            </p>
          </div>
          <div className="relative h-16 rounded-full border border-border/70 bg-card/55">
            <div className="h-full w-[74%] rounded-full bg-success/70" />
            <button
              className="absolute top-1/2 left-[74%] size-11 -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/70 bg-background font-medium text-caption transition-colors hover:bg-muted/35 active:translate-y-px"
              type="button"
            >
              74
            </button>
          </div>
        </div>
      </section>
      <aside className="border-border/70 border-t p-4 lg:border-t-0 lg:border-l">
        <p className="font-medium text-caption">Readiness evidence</p>
        <div className="mt-4 divide-y divide-border/70">
          {checks.map(([title, description, status]) => (
            <button
              className="w-full py-3 text-left transition-colors hover:text-foreground active:translate-y-px"
              key={title}
              type="button"
            >
              <span className="flex items-center justify-between gap-3">
                <span className="font-medium text-small">{title}</span>
                <Badge
                  className={cn(
                    "rounded-md text-caption",
                    status === "Blocked" &&
                      "bg-warning text-warning-foreground",
                    status === "Done" && "bg-success text-success-foreground"
                  )}
                  variant={status === "Review" ? "outline" : "default"}
                >
                  {status}
                </Badge>
              </span>
              <span className="mt-1 block text-caption text-muted-foreground">
                {description}
              </span>
            </button>
          ))}
        </div>
      </aside>
    </div>
  </Frame>
)
