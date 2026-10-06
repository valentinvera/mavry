import { Badge } from "@mavry/ui/components/badge"
import { Button } from "@mavry/ui/components/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@mavry/ui/components/table"
import { cn } from "@mavry/ui/lib/utils"
import { SearchIcon } from "lucide-react"
import { Frame } from "@/components/landing/demo/frame"
import type { Content } from "@/components/landing/demo/page-data"

const scopeRows = [
  {
    id: "quick-capture",
    feature: "Quick capture",
    question: "Can founders save ideas without turning them into tasks?",
    decision: "Build now",
    lane: "Now",
    readiness: "Ready",
    owner: "Founder",
  },
  {
    id: "scope-board",
    feature: "MVP scope board",
    question: "Can the first version stay small enough to ship?",
    decision: "Build now",
    lane: "Now",
    readiness: "Ready",
    owner: "Product",
  },
  {
    id: "decision-log",
    feature: "Decision log",
    question: "Can old reasons stay visible when pressure returns?",
    decision: "Support",
    lane: "Now",
    readiness: "Ready",
    owner: "Product",
  },
  {
    id: "feedback-hub",
    feature: "Feedback hub",
    question: "Does the first beta need a complete feedback system?",
    decision: "Later",
    lane: "Next",
    readiness: "Blocked",
    owner: "Founder",
  },
  {
    id: "github-sync",
    feature: "GitHub sync",
    question: "Does integration work reduce launch risk before beta?",
    decision: "Cut",
    lane: "Not doing",
    readiness: "Not needed",
    owner: "Later",
  },
  {
    id: "templates",
    feature: "Template marketplace",
    question: "Does a marketplace validate the product hypothesis?",
    decision: "Cut",
    lane: "Not doing",
    readiness: "Not needed",
    owner: "Later",
  },
] as const

type ScopeRowId = (typeof scopeRows)[number]["id"]

const decisionClassNames = {
  "Build now": "bg-success text-success-foreground",
  Support: "bg-info text-info-foreground",
  Later: "bg-warning text-warning-foreground",
  Cut: "bg-destructive text-destructive-foreground",
} as const

const backlogRiskLenses = [
  ["Impact", "High", "Quick capture, MVP scope board"],
  ["Effort", "Medium", "Decision log needs polish, not automation"],
  ["Confidence", "Mixed", "Feedback route needs owner"],
  ["Risk", "Cut", "Integrations widen the MVP"],
] as const

export const FeatureBacklog = ({
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
    <div className="grid min-h-[29rem] overflow-hidden lg:grid-cols-[14rem_minmax(0,1fr)]">
      <aside className="border-border/70 border-b p-4 lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between gap-3">
          <p className="font-medium text-demo-metadata!">Risk lens</p>
          <Button
            className="rounded-md text-demo-control!"
            size="sm"
            type="button"
            variant="outline"
          >
            <SearchIcon data-icon="inline-start" />
            Filter
          </Button>
        </div>
        <div className="mt-4 divide-y divide-border/70">
          {backlogRiskLenses.map(([label, value, detail]) => (
            <button
              className="w-full py-3 text-left transition-colors hover:text-foreground active:translate-y-px"
              key={label}
              type="button"
            >
              <span className="flex items-center justify-between gap-3">
                <span className="text-demo-metadata! text-muted-foreground">
                  {label}
                </span>
                <Badge
                  className="rounded-md text-demo-metadata!"
                  variant="outline"
                >
                  {value}
                </Badge>
              </span>
              <span className="mt-2 block font-medium text-demo-control!">
                {detail}
              </span>
            </button>
          ))}
        </div>
      </aside>
      <section>
        <div className="border-border/70 border-b px-4 py-3">
          <p className="font-medium text-demo-metadata!">
            Feature decision matrix
          </p>
          <p className="mt-1 text-demo-metadata! text-muted-foreground">
            Classification stays visible next to the product question.
          </p>
        </div>
        <div className="overflow-x-auto">
          <Table className="min-w-[36rem] table-fixed lg:min-w-[42rem]">
            <TableHeader>
              <TableRow className="border-border/70 hover:bg-transparent">
                <TableHead className="w-[9rem]">Feature</TableHead>
                <TableHead className="hidden w-[18rem] md:table-cell">
                  Product question
                </TableHead>
                <TableHead className="w-[8.5rem]">Decision</TableHead>
                <TableHead className="hidden w-[6rem] lg:table-cell">
                  Owner
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="[&_tr:last-child]:border-border/70 [&_tr:last-child]:border-b">
              {scopeRows.map((row) => (
                <TableRow
                  className={cn(
                    "border-border/70 transition-colors hover:bg-muted/30",
                    row.id === selectedRowId && "bg-muted/35"
                  )}
                  key={row.id}
                >
                  <TableCell>
                    <button
                      className="w-full text-left active:translate-y-px disabled:pointer-events-none"
                      disabled={!interactive}
                      onClick={() => onSelectedRowChange(row.id)}
                      type="button"
                    >
                      <span className="block font-medium text-demo-control!">
                        {row.feature}
                      </span>
                      <span className="mt-1 block truncate text-demo-metadata! text-muted-foreground md:hidden">
                        {row.question}
                      </span>
                    </button>
                  </TableCell>
                  <TableCell className="hidden max-w-0 truncate text-demo-metadata! text-muted-foreground md:table-cell">
                    <span className="block truncate">{row.question}</span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge
                      className={cn(
                        "w-fit rounded-md px-2 text-demo-metadata!",
                        decisionClassNames[row.decision]
                      )}
                    >
                      {row.decision}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden truncate text-demo-metadata! text-muted-foreground lg:table-cell">
                    {row.owner}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  </Frame>
)
