import { Badge } from "@mavry/ui/components/badge"
import { Button } from "@mavry/ui/components/button"
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  Table as TablePrimitive,
  TableRow,
} from "@mavry/ui/components/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@mavry/ui/components/tabs"
import { cn } from "@mavry/ui/lib/utils"
import { ChevronDownIcon, Columns3Icon, PlusIcon } from "lucide-react"
import {
  decisionClassNames,
  type PageId,
  readinessClassNames,
  type ScopeRowId,
  scopeRows,
} from "@/components/demo/data"

interface Props {
  activePageId: PageId
  interactive: boolean
  onSelectedRowChange: (rowId: ScopeRowId) => void
  selectedRowId: ScopeRowId
}

export const Table = ({
  activePageId,
  interactive,
  selectedRowId,
  onSelectedRowChange,
}: Props) => {
  const selectedRows = scopeRows.filter(
    (row) => row.decision === "Build now" || row.decision === "Support"
  )
  const cutRows = scopeRows.filter((row) => row.decision === "Cut")

  return (
    <Tabs
      className="min-w-0 gap-4 rounded-lg border border-border/80 bg-card/70 p-3"
      defaultValue={activePageId === "cut-list" ? "cuts" : "scope"}
    >
      <div className="flex min-w-0 items-center justify-between gap-2">
        <TabsList
          className="min-w-0 rounded-md bg-background/70"
          variant="line"
        >
          <TabsTrigger className="text-demo-control!" value="scope">
            {activePageId === "feature-backlog"
              ? "Feature backlog"
              : "MVP scope"}
          </TabsTrigger>
          <TabsTrigger className="text-demo-control!" value="cuts">
            Cuts
            <Badge
              className="rounded-full text-demo-metadata!"
              variant="secondary"
            >
              {cutRows.length}
            </Badge>
          </TabsTrigger>
        </TabsList>
        <div className="flex shrink-0 items-center justify-end gap-2">
          <Button
            className="hidden rounded-md text-demo-control! sm:inline-flex"
            size="sm"
            type="button"
            variant="outline"
          >
            <Columns3Icon data-icon="inline-start" />
            Columns
            <ChevronDownIcon data-icon="inline-end" />
          </Button>
          <Button
            className="rounded-md text-demo-control!"
            size="sm"
            type="button"
          >
            <PlusIcon data-icon="inline-start" />
            Add idea
          </Button>
        </div>
      </div>

      <TabsContent
        className="overflow-hidden rounded-lg border border-border/80"
        value="scope"
      >
        <TablePrimitive className="text-demo-metadata!">
          <TableHeader className="bg-background/70">
            <TableRow>
              <TableHead className="text-demo-metadata!">Feature</TableHead>
              <TableHead className="hidden min-w-72 text-demo-metadata! sm:table-cell">
                Decision question
              </TableHead>
              <TableHead className="text-demo-metadata!">Decision</TableHead>
              <TableHead className="hidden text-demo-metadata! md:table-cell">
                Lane
              </TableHead>
              <TableHead className="hidden text-demo-metadata! sm:table-cell">
                Readiness
              </TableHead>
              <TableHead className="hidden text-demo-metadata! lg:table-cell">
                Owner
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scopeRows.map((row) => {
              const isSelected = row.id === selectedRowId

              return (
                <TableRow
                  className={cn(
                    "transition-colors hover:bg-muted/40",
                    isSelected && "bg-muted/60"
                  )}
                  data-state={isSelected ? "selected" : undefined}
                  key={row.id}
                >
                  <TableCell className="whitespace-normal text-demo-metadata!">
                    <button
                      className="text-left font-medium text-demo-control! text-foreground underline-offset-4 transition-transform hover:underline active:translate-y-px disabled:pointer-events-none"
                      disabled={!interactive}
                      onClick={() => onSelectedRowChange(row.id)}
                      type="button"
                    >
                      {row.feature}
                    </button>
                  </TableCell>
                  <TableCell className="hidden text-demo-metadata! text-muted-foreground sm:table-cell">
                    {row.question}
                  </TableCell>
                  <TableCell className="text-demo-metadata!">
                    <Badge
                      className={cn(
                        "rounded-md text-demo-metadata!",
                        decisionClassNames[row.decision]
                      )}
                    >
                      {row.decision}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden text-demo-metadata! md:table-cell">
                    {row.lane}
                  </TableCell>
                  <TableCell className="hidden text-demo-metadata! sm:table-cell">
                    <Badge
                      className={cn(
                        "rounded-md text-demo-metadata!",
                        readinessClassNames[row.readiness]
                      )}
                    >
                      {row.readiness}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden text-demo-metadata! lg:table-cell">
                    {row.owner}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </TablePrimitive>
        <div className="flex flex-col items-start justify-between gap-1 border-border/80 border-t px-3 py-2 text-demo-metadata! text-muted-foreground sm:flex-row sm:items-center sm:gap-3">
          <p>{selectedRows.length} MVP rows selected for launch review.</p>
          <p>Page 1 of 1</p>
        </div>
      </TabsContent>

      <TabsContent
        className="rounded-lg border border-border/80 border-dashed bg-background/40 p-3"
        value="cuts"
      >
        <p className="font-medium text-demo-metadata!">Cut list</p>
        <div className="mt-3 grid gap-2">
          {cutRows.map((row) => (
            <button
              className="rounded-md border border-border/70 bg-background/60 p-3 text-left transition-colors hover:bg-muted/40 active:translate-y-px"
              key={row.id}
              type="button"
            >
              <span className="block font-medium text-demo-metadata!">
                {row.feature}
              </span>
              <span className="mt-1 block text-demo-metadata! text-muted-foreground">
                {row.question}
              </span>
            </button>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}
