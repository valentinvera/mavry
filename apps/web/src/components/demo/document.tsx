import { Badge } from "@mavry/ui/components/badge"
import type { PageId } from "@/components/demo/data"
import { contentByPage } from "@/components/demo/page-data"

interface Props {
  activePageId: PageId
}

export const Document = ({ activePageId }: Props) => {
  const pageContent = contentByPage[activePageId]

  return (
    <article className="min-h-[34rem] rounded-lg border border-border/80 bg-card/75">
      <header className="flex items-center justify-between gap-4 border-border/80 border-b px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <Badge
            className="rounded-md border-border/80 bg-background/60 text-caption"
            variant="outline"
          >
            {pageContent.code}
          </Badge>
          <span className="text-caption text-muted-foreground">
            {pageContent.context}
          </span>
        </div>
        <Badge className="rounded-md bg-success text-caption text-success-foreground">
          74 readiness
        </Badge>
      </header>

      <div className="px-4 py-6 md:px-6 md:py-7">
        <div className="max-w-3xl">
          <h2 className="font-semibold text-section">{pageContent.title}</h2>
          <p className="mt-3 text-large text-muted-foreground">
            {pageContent.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {pageContent.chips.map((chip) => (
              <button
                className="rounded-md border border-border/70 bg-background/60 px-2 py-1 text-caption transition-colors hover:bg-muted/50 active:translate-y-px"
                key={chip}
                type="button"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        <section className="mt-7 rounded-lg border border-border/70 bg-background/45">
          <div className="border-border/70 border-b px-4 py-3">
            <p className="font-medium text-caption">Recent product decisions</p>
          </div>
          <div className="divide-y divide-border/70">
            {pageContent.activities.map((item) => {
              const Icon = item.icon

              return (
                <button
                  className="grid w-full grid-cols-[1.75rem_minmax(0,1fr)_auto] gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/30 active:translate-y-px"
                  key={item.id}
                  type="button"
                >
                  <span className="flex size-7 items-center justify-center rounded-md border border-border/70 bg-card/70 text-muted-foreground">
                    <Icon aria-hidden="true" className="size-3.5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-caption text-muted-foreground">
                      {item.actor}
                    </span>
                    <span className="mt-0.5 block font-medium text-small">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-caption text-muted-foreground">
                      {item.description}
                    </span>
                  </span>
                  <span className="hidden text-caption text-muted-foreground sm:block">
                    {item.time}
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      </div>
    </article>
  )
}
