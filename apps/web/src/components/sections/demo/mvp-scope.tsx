import { Badge } from "@mavry/ui/components/badge"
import { cn } from "@mavry/ui/lib/utils"
import type { ScopeRowId } from "@/components/demo/data"
import { Frame } from "@/components/demo/frame"
import type { Content } from "@/components/demo/page-data"
import { scopeColumns } from "@/components/demo/route-data"

export const MvpScope = ({
  content,
  interactive,
  onSelectedRowChange,
  selectedRowId,
}: {
  content: Content
  interactive: boolean
  onSelectedRowChange: (rowId: ScopeRowId) => void
  selectedRowId: ScopeRowId
}) => (
  <Frame content={content}>
    <div className="relative min-h-[29rem] overflow-hidden p-5">
      <div className="absolute inset-x-5 top-1/2 h-px bg-border/50" />
      <div className="absolute inset-y-5 left-1/2 w-px bg-border/50" />
      <div className="grid min-h-[25rem] gap-4 md:grid-cols-2">
        {scopeColumns.map((column) => (
          <section
            className={cn(
              "relative p-3",
              column.id === "core" && "border-success/30",
              column.id === "cut" && "border-destructive/30"
            )}
            key={column.id}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-demo-metadata!">
                  {column.title}
                </p>
                <p className="mt-1 text-demo-metadata! text-muted-foreground">
                  {column.description}
                </p>
              </div>
              <Badge
                className="rounded-md text-demo-metadata!"
                variant="outline"
              >
                {column.rows.length}
              </Badge>
            </div>
            <div className="flex flex-col gap-2">
              {column.rows.map((row) => (
                <button
                  aria-pressed={row.id === selectedRowId}
                  className={cn(
                    "w-full rounded-md border border-transparent px-3 py-2 text-left transition-colors hover:border-border/70 hover:bg-muted/35 active:translate-y-px disabled:pointer-events-none",
                    row.id === selectedRowId && "border-border/80 bg-card/65"
                  )}
                  disabled={!interactive}
                  key={row.id}
                  onClick={() => onSelectedRowChange(row.id)}
                  type="button"
                >
                  <span className="block font-medium text-demo-control!">
                    {row.feature}
                  </span>
                  <span className="mt-1 block text-demo-metadata! text-muted-foreground">
                    {row.question}
                  </span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
      <div className="pointer-events-none absolute top-1/2 left-1/2 hidden size-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-card text-center shadow-2xl shadow-background/70 md:flex">
        <div>
          <p className="font-semibold text-demo-control!">MVP</p>
          <p className="mt-1 text-demo-metadata! text-muted-foreground">
            scope
          </p>
        </div>
      </div>
    </div>
  </Frame>
)
