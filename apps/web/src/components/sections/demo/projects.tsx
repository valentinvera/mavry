import { cn } from "@mavry/ui/lib/utils"
import { Frame } from "@/components/demo/frame"
import type { Content } from "@/components/demo/page-data"
import { projectRows, projectSignals } from "@/components/demo/route-data"

export const Projects = ({ content }: { content: Content }) => (
  <Frame content={content}>
    <div className="grid min-h-[29rem] overflow-hidden lg:grid-cols-[minmax(0,1fr)_15rem]">
      <section className="divide-y divide-border/70">
        {projectSignals.map(([name, stage, readiness, blocker], index) => (
          <button
            className={cn(
              "grid min-h-[8.9rem] w-full gap-3 p-4 text-left transition-colors hover:bg-muted/30 active:translate-y-px md:grid-cols-[minmax(0,1fr)_8rem]",
              index === 0 && "bg-card/55"
            )}
            key={name}
            type="button"
          >
            <span>
              <span className="block font-medium text-demo-control!">
                {name}
              </span>
              <span className="mt-1 block text-demo-metadata! text-muted-foreground">
                {stage}
              </span>
            </span>
            <span>
              <span className="block font-semibold text-demo-stat!">
                {readiness}
              </span>
              <span className="mt-1 block text-demo-metadata! text-muted-foreground">
                {blocker}
              </span>
            </span>
          </button>
        ))}
      </section>
      <aside className="border-border/70 border-t p-4 lg:border-t-0 lg:border-l">
        <p className="font-medium text-demo-metadata!">Where attention goes</p>
        <div className="mt-5 divide-y divide-border/70">
          {projectRows.map(([name, stage, readiness, blocker]) => (
            <button
              className="w-full py-3 text-left transition-colors hover:text-foreground active:translate-y-px"
              key={name}
              type="button"
            >
              <span className="flex items-center justify-between gap-3">
                <span className="text-demo-metadata!">{stage}</span>
                <span className="font-medium text-demo-metadata!">
                  {readiness}
                </span>
              </span>
              <span className="mt-2 block text-demo-metadata! text-muted-foreground">
                {blocker}
              </span>
            </button>
          ))}
        </div>
      </aside>
    </div>
  </Frame>
)
