import { Badge } from "@mavry/ui/components/badge"
import { Input } from "@mavry/ui/components/input"
import { cn } from "@mavry/ui/lib/utils"
import { ArrowRightIcon, SearchIcon } from "lucide-react"
import { Frame } from "@/components/demo/frame"
import type { Content } from "@/components/demo/page-data"
import { searchResults, statusClassNames } from "@/components/demo/route-data"

export const ProjectSearch = ({ content }: { content: Content }) => (
  <Frame content={content}>
    <div className="grid min-h-[29rem] overflow-hidden lg:grid-cols-[minmax(0,1fr)_15rem]">
      <section>
        <div className="border-border/70 border-b p-4">
          <label className="sr-only" htmlFor="project-search-preview">
            Search project decisions
          </label>
          <div className="relative">
            <SearchIcon
              aria-hidden="true"
              className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              className="h-10 rounded-md border-border/80 bg-card/65 pl-9 text-demo-control!"
              id="project-search-preview"
              readOnly
              value="feedback route"
            />
          </div>
        </div>
        <div className="divide-y divide-border/70">
          {searchResults.map((result) => (
            <button
              className="grid w-full gap-3 px-4 py-4 text-left transition-colors hover:bg-muted/30 active:translate-y-px md:grid-cols-[minmax(0,1fr)_7rem]"
              key={result.id}
              type="button"
            >
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-demo-control!">
                    {result.title}
                  </span>
                  <Badge
                    className="rounded-md text-demo-metadata!"
                    variant="outline"
                  >
                    {result.area}
                  </Badge>
                </span>
                <span className="mt-2 block text-demo-metadata! text-muted-foreground">
                  {result.detail}
                </span>
              </span>
              <Badge
                className={cn(
                  "w-fit rounded-md text-demo-control!",
                  statusClassNames[result.status]
                )}
              >
                {result.status}
              </Badge>
            </button>
          ))}
        </div>
      </section>
      <aside className="border-border/70 border-t p-4 lg:border-t-0 lg:border-l">
        <p className="font-medium text-demo-metadata!">Decision trail</p>
        <p className="mt-2 text-demo-metadata! text-muted-foreground">
          Search results keep the feature, decision, and reason connected.
        </p>
        <div className="mt-4 divide-y divide-border/70">
          {content.chips.map((chip) => (
            <button
              className="flex w-full items-center justify-between gap-3 py-3 text-left transition-colors hover:text-foreground active:translate-y-px"
              key={chip}
              type="button"
            >
              <span className="text-demo-metadata!">{chip}</span>
              <ArrowRightIcon
                aria-hidden="true"
                className="size-3.5 text-muted-foreground"
              />
            </button>
          ))}
        </div>
      </aside>
    </div>
  </Frame>
)
