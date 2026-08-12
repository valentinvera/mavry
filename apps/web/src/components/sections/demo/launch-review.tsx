import { Badge } from "@mavry/ui/components/badge"
import { Button } from "@mavry/ui/components/button"
import { cn } from "@mavry/ui/lib/utils"
import { ArrowRightIcon, CircleAlertIcon } from "lucide-react"
import { Frame } from "@/components/demo/frame"
import type { Content } from "@/components/demo/page-data"
import { launchGates } from "@/components/demo/route-data"

export const LaunchReview = ({ content }: { content: Content }) => (
  <Frame content={content}>
    <div className="grid min-h-[29rem] overflow-hidden lg:grid-cols-[minmax(0,1fr)_15rem]">
      <section className="relative p-5">
        <div className="absolute inset-x-5 top-28 h-px bg-warning/35" />
        <div className="grid gap-3 md:grid-cols-4">
          {launchGates.map(([label, status], index) => (
            <button
              className={cn(
                "relative flex min-h-28 flex-col items-start border-border/70 border-l pl-3 text-left transition-colors hover:border-foreground/60 active:translate-y-px",
                status === "Blocked"
                  ? "border-warning/60 text-warning-foreground"
                  : "text-foreground"
              )}
              key={label}
              type="button"
            >
              <span className="flex size-7 items-center justify-center rounded-full border border-border/70 bg-card text-caption">
                {index + 1}
              </span>
              <span className="mt-5 block min-h-10 font-medium text-small">
                {label}
              </span>
              <Badge
                className={cn(
                  "mt-3 rounded-md text-caption",
                  status === "Blocked"
                    ? "bg-warning text-warning-foreground"
                    : "bg-success text-success-foreground"
                )}
              >
                {status}
              </Badge>
            </button>
          ))}
        </div>
        <div className="mt-8 max-w-xl">
          <div className="flex items-center gap-2">
            <CircleAlertIcon
              aria-hidden="true"
              className="size-4 text-warning-foreground"
            />
            <p className="font-medium text-caption text-warning-foreground">
              Launch blocker
            </p>
          </div>
          <h3 className="mt-3 font-semibold text-xlarge">
            Feedback route needs an owner
          </h3>
          <p className="mt-3 max-w-xl text-large text-muted-foreground">
            Do not build the feedback hub. Assign one person and one channel,
            then open beta.
          </p>
        </div>
      </section>
      <aside className="border-warning/35 border-t p-4 lg:border-t-0 lg:border-l">
        <p className="font-medium text-caption">Next launch actions</p>
        <div className="mt-4 flex flex-col gap-2">
          {["Assign owner", "Pick channel", "Ship beta"].map((action) => (
            <Button
              className="justify-between rounded-md text-caption"
              key={action}
              size="sm"
              type="button"
              variant="outline"
            >
              {action}
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          ))}
        </div>
      </aside>
    </div>
  </Frame>
)
