import { Badge } from "@mavry/ui/components/badge"
import { ScissorsIcon } from "lucide-react"
import { Frame } from "@/components/demo/frame"
import type { Content } from "@/components/demo/page-data"
import { cutConditions } from "@/components/demo/route-data"

export const CutList = ({ content }: { content: Content }) => (
  <Frame content={content}>
    <section className="relative min-h-[29rem] overflow-hidden">
      <div className="grid min-h-[29rem] md:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="relative p-5">
          <div className="absolute inset-x-5 bottom-12 h-px bg-destructive/35" />
          <div className="absolute bottom-12 left-5 h-44 w-px bg-destructive/35" />
          <div className="flex items-center gap-2">
            <ScissorsIcon
              aria-hidden="true"
              className="size-4 text-muted-foreground"
            />
            <p className="font-medium text-demo-metadata! text-muted-foreground">
              Not in MVP
            </p>
          </div>
          <h3 className="mt-6 max-w-md font-semibold text-subtitle">
            Hidden cuts come back when the reason disappears.
          </h3>
          <p className="mt-4 max-w-md text-demo-body! text-muted-foreground">
            Cut work is still product knowledge. It stays out of Now, but it
            keeps its reason and return condition.
          </p>
        </div>
        <aside className="border-destructive/35 border-t md:border-t-0 md:border-l">
          {cutConditions.map(([title, reason, condition]) => (
            <button
              className="w-full border-destructive/35 border-b p-4 text-left transition-colors hover:bg-background/45 active:translate-y-px"
              key={title}
              type="button"
            >
              <span className="block font-medium text-demo-control!">
                {title}
              </span>
              <span className="mt-2 block text-demo-metadata! text-muted-foreground">
                {reason}
              </span>
              <span className="mt-4 flex items-center justify-between gap-3 border-border/70 border-t pt-3 text-demo-metadata!">
                <span className="text-muted-foreground">Reconsider when</span>
                <Badge
                  className="rounded-md text-demo-metadata!"
                  variant="outline"
                >
                  {condition}
                </Badge>
              </span>
            </button>
          ))}
        </aside>
      </div>
    </section>
  </Frame>
)
