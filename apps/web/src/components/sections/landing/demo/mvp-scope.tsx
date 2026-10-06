import { Badge } from "@mavry/ui/components/badge"
import { cn } from "@mavry/ui/lib/utils"
import { useCallback } from "react"
import { Frame } from "@/components/landing/demo/frame"
import type { Content } from "@/components/landing/demo/page-data"

const scopeRows = [
  {
    decision: "Build now",
    feature: "Quick capture",
    id: "quick-capture",
    question: "Can founders save ideas without turning them into tasks?",
  },
  {
    decision: "Build now",
    feature: "MVP scope board",
    id: "scope-board",
    question: "Can the first version stay small enough to ship?",
  },
  {
    decision: "Support",
    feature: "Decision log",
    id: "decision-log",
    question: "Can old reasons stay visible when pressure returns?",
  },
  {
    decision: "Later",
    feature: "Feedback hub",
    id: "feedback-hub",
    question: "Does the first beta need a complete feedback system?",
  },
  {
    decision: "Cut",
    feature: "GitHub sync",
    id: "github-sync",
    question: "Does integration work reduce launch risk before beta?",
  },
  {
    decision: "Cut",
    feature: "Template marketplace",
    id: "templates",
    question: "Does a marketplace validate the product hypothesis?",
  },
] as const

type ScopeRowId = (typeof scopeRows)[number]["id"]

const scopeColumns = [
  {
    description: "Must validate the product hypothesis",
    id: "core",
    rows: scopeRows.filter((row) => row.decision === "Build now"),
    title: "Core",
  },
  {
    description: "Helps the release without becoming the product",
    id: "support",
    rows: scopeRows.filter((row) => row.decision === "Support"),
    title: "Support",
  },
  {
    description: "Useful after the first release is working",
    id: "later",
    rows: scopeRows.filter((row) => row.decision === "Later"),
    title: "Later",
  },
  {
    description: "Visible cuts with reasons",
    id: "cut",
    rows: scopeRows.filter((row) => row.decision === "Cut"),
    title: "No for now",
  },
] as const

type ScopeRow = (typeof scopeRows)[number]

interface ScopeRowButtonProps {
  interactive: boolean
  onSelectedRowChange: (rowId: ScopeRowId) => void
  row: ScopeRow
  selectedRowId: ScopeRowId
}

const ScopeRowButton = ({
  interactive,
  onSelectedRowChange,
  row,
  selectedRowId,
}: ScopeRowButtonProps) => {
  const handleSelect = useCallback(() => {
    onSelectedRowChange(row.id)
  }, [row.id, onSelectedRowChange])

  return (
    <button
      aria-pressed={row.id === selectedRowId}
      className={cn(
        "w-full rounded-md border border-transparent px-3 py-2 text-left transition-colors hover:border-border/70 hover:bg-muted/35 active:translate-y-px disabled:pointer-events-none",
        row.id === selectedRowId && "border-border/80 bg-card/65"
      )}
      disabled={!interactive}
      onClick={handleSelect}
      type="button"
    >
      <span className="block font-medium text-demo-control!">
        {row.feature}
      </span>
      <span className="mt-1 block text-demo-metadata! text-muted-foreground">
        {row.question}
      </span>
    </button>
  )
}

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
                <ScopeRowButton
                  interactive={interactive}
                  key={row.id}
                  onSelectedRowChange={onSelectedRowChange}
                  row={row}
                  selectedRowId={selectedRowId}
                />
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
