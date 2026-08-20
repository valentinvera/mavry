import { cn } from "@mavry/ui/lib/utils"
import { ArchiveIcon } from "lucide-react"
import { Frame } from "@/components/demo/frame"
import type { Content } from "@/components/demo/page-data"
import { archivedIdeas } from "@/components/demo/route-data"

export const ArchivedIdeas = ({ content }: { content: Content }) => (
  <Frame content={content}>
    <section className="min-h-[29rem] overflow-hidden p-4">
      <div className="flex items-center gap-2">
        <ArchiveIcon
          aria-hidden="true"
          className="size-4 text-muted-foreground"
        />
        <p className="font-medium text-demo-metadata!">Archived ideas</p>
      </div>
      <div className="relative mt-6 min-h-[22rem]">
        <div className="absolute inset-x-0 top-16 h-px bg-border/70" />
        <div className="absolute inset-x-0 top-40 h-px bg-border/70" />
        <div className="absolute inset-x-0 bottom-8 h-px bg-border/70" />
        {archivedIdeas.map(([title, reason, condition], index) => (
          <button
            className={cn(
              "absolute w-52 rounded-lg border border-border/70 bg-card/65 p-4 text-left transition-colors hover:bg-muted/35 active:translate-y-px",
              index === 0 && "top-0 left-0",
              index === 1 && "top-24 left-[28%]",
              index === 2 && "top-12 right-4"
            )}
            key={title}
            type="button"
          >
            <span>
              <span className="flex size-8 items-center justify-center rounded-full border border-border/70 bg-background/70 text-demo-metadata!">
                {index + 1}
              </span>
              <span className="mt-5 block font-medium text-demo-control!">
                {title}
              </span>
              <span className="mt-3 block text-demo-metadata! text-muted-foreground">
                {reason}
              </span>
            </span>
            <span className="border-border/70 border-t pt-3 text-demo-metadata! text-muted-foreground">
              Revisit: {condition}
            </span>
          </button>
        ))}
      </div>
    </section>
  </Frame>
)
