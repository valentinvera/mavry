import { Badge } from "@mavry/ui/components/badge"
import { Button } from "@mavry/ui/components/button"
import { cn } from "@mavry/ui/lib/utils"
import { CircleDashedIcon, InboxIcon, PlusIcon } from "lucide-react"
import { Frame } from "@/components/demo/frame"
import type { Content } from "@/components/demo/page-data"
import { inboxItems } from "@/components/demo/route-data"

export const IdeaInbox = ({ content }: { content: Content }) => (
  <Frame content={content}>
    <div className="grid min-h-[29rem] overflow-hidden lg:grid-cols-[17rem_minmax(0,1fr)]">
      <section className="border-border/70 border-b lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between gap-3 border-border/70 border-b px-4 py-3">
          <p className="flex items-center gap-2 font-medium text-caption">
            <InboxIcon
              aria-hidden="true"
              className="size-4 text-muted-foreground"
            />
            Idea intake
          </p>
          <Button className="rounded-md text-caption" size="sm" type="button">
            <PlusIcon data-icon="inline-start" />
            Capture
          </Button>
        </div>
        <div className="divide-y divide-border/70">
          {inboxItems.map((item, index) => (
            <button
              className={cn(
                "flex w-full flex-col gap-2 px-3 py-3 text-left transition-colors hover:bg-muted/35 active:translate-y-px",
                index === 1 && "bg-muted/35"
              )}
              key={item.id}
              type="button"
            >
              <span className="flex items-start justify-between gap-3">
                <span className="font-medium text-small">{item.title}</span>
                <Badge className="rounded-md text-caption" variant="outline">
                  {item.status}
                </Badge>
              </span>
              <span className="text-caption text-muted-foreground">
                {item.source}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="grid grid-rows-[auto_1fr_auto]">
        <div className="border-border/70 border-b p-5">
          <div>
            <p className="text-caption text-muted-foreground">
              Clarify before it becomes work
            </p>
            <h3 className="mt-2 max-w-xl font-semibold text-xlarge">
              One beta feedback route
            </h3>
          </div>
          <p className="mt-3 max-w-2xl text-large text-muted-foreground">
            This idea becomes work only if it stays small enough for beta: one
            owner, one channel, and one clear way to collect feedback.
          </p>
        </div>
        <div className="grid content-center gap-4 p-5 md:grid-cols-3">
          {["Problem named", "MVP impact", "Owner missing"].map(
            (label, index) => (
              <button
                className="group min-h-32 border-border/70 border-l pl-4 text-left transition-colors hover:border-foreground/60 active:translate-y-px"
                key={label}
                type="button"
              >
                <CircleDashedIcon
                  aria-hidden="true"
                  className={cn(
                    "size-4 text-muted-foreground",
                    index === 2 && "text-warning-foreground"
                  )}
                />
                <span className="mt-8 block font-medium text-small">
                  {label}
                </span>
                <span className="mt-2 block text-caption text-muted-foreground">
                  {index === 2
                    ? "Decide owner before launch."
                    : "Enough context to review the idea."}
                </span>
              </button>
            )
          )}
        </div>
        <footer className="border-border/70 border-t p-5">
          <button
            className="w-full text-left transition-colors hover:text-foreground active:translate-y-px"
            type="button"
          >
            <span className="font-medium text-caption">
              Clarifying question
            </span>
            <span className="mt-2 block text-caption text-muted-foreground">
              Can beta launch with a manual feedback route instead of a full
              feedback product?
            </span>
          </button>
        </footer>
      </section>
    </div>
  </Frame>
)
