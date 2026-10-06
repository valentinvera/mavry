import { cn } from "@mavry/ui/lib/utils"
import type { LucideIcon } from "lucide-react"

/**
 * Product demo primitives. Mavry is monochrome first: structure comes from
 * typography, alignment, and hairlines. Accent color appears only where it
 * carries state, and never as a filled pill for ordinary metadata.
 *
 * Each demo has one dominant object. Rows expose a hover state so the surface
 * reads as a real, interactive product instead of a static screenshot.
 */

const PANEL_SHADOW =
  "shadow-[0_1px_2px_0_rgb(0_0_0/0.04),0_18px_45px_-32px_rgb(0_0_0/0.28)]"

// Strong ease-out (Emil Kowalski's UI curve). The fill is full width and scaled
// on X so the reveal stays on the compositor instead of animating layout with
// `width`.
export const BAR_FILL =
  "h-full w-full origin-left scale-x-0 rounded-full transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"

export type Tone = "danger" | "info" | "neutral" | "success" | "warning"

// Solid brand colors for small marks. The `-bg` tokens are near-transparent
// fills meant for surfaces, so a 6px dot made from them is invisible.
export const dotTone: Record<Tone, string> = {
  danger: "bg-destructive-foreground",
  info: "bg-info-foreground",
  neutral: "bg-muted-foreground/40",
  success: "bg-success-foreground",
  warning: "bg-warning-foreground",
}

export const textTone: Record<Tone, string> = {
  danger: "text-destructive-foreground",
  info: "text-info-foreground",
  neutral: "text-muted-foreground",
  success: "text-success-foreground",
  warning: "text-warning-foreground",
}

/** Status carries state as a small dot plus a muted label. No filled pills. */
export const Status = ({
  children,
  className,
  tone = "neutral",
}: {
  children: React.ReactNode
  className?: string
  tone?: Tone
}) => (
  <span
    className={cn(
      "inline-flex shrink-0 items-center gap-1.5 text-demo-metadata! text-muted-foreground",
      className
    )}
  >
    <span
      aria-hidden="true"
      className={cn("size-1.5 rounded-full", dotTone[tone])}
    />
    {children}
  </span>
)

export const Count = ({ children }: { children: React.ReactNode }) => (
  <span className="shrink-0 text-demo-metadata! text-muted-foreground tabular-nums">
    {children}
  </span>
)

export const Setup = ({ children }: { children: React.ReactNode }) => (
  <p className="font-medium text-demo-metadata! text-muted-foreground">
    {children}
  </p>
)

/** Staggers a list row on reveal, 60ms after the previous row. */
export const motionItem = (index: number) => ({
  "data-motion-item": "",
  style: { transitionDelay: `${index * 60}ms` },
})

/**
 * A list row. `primary` gives the row its demo's dominant weight; every row
 * gets a hover layer so the demo feels interactive. The hover lives on an
 * overlay so it never fights the reveal transition on the row itself.
 */
export const ListRow = ({
  boxClassName,
  children,
  className,
  primary = false,
  ...props
}: React.ComponentProps<"div"> & {
  boxClassName?: string
  primary?: boolean
}) => (
  <div
    className={cn("group/row relative", primary && "bg-muted/50", boxClassName)}
    {...props}
  >
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-[inherit] bg-muted/40 opacity-0 transition-opacity duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/row:opacity-100 motion-reduce:transition-none"
    />
    <div className={cn("relative", className)}>{children}</div>
  </div>
)

interface PanelProps {
  children: React.ReactNode
  className?: string
  code?: string
  description?: string
  icon: LucideIcon
  label: string
  status?: React.ReactNode
  title?: string
}

export const Panel = ({
  children,
  className,
  code,
  description,
  label,
  icon: Icon,
  status,
  title,
}: PanelProps) => (
  <div
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-xl border border-border/70 bg-card text-foreground",
      PANEL_SHADOW,
      className
    )}
  >
    <div className="flex shrink-0 items-center gap-2 border-border/50 border-b px-4 py-2.5">
      <Icon
        aria-hidden="true"
        className="size-3.5 shrink-0 text-muted-foreground"
      />
      {code ? (
        <span className="shrink-0 font-medium text-demo-metadata! text-muted-foreground/60 tabular-nums">
          {code}
        </span>
      ) : null}
      <p className="min-w-0 truncate font-medium text-demo-metadata! text-muted-foreground">
        {label}
      </p>
      {status ? <div className="ml-auto shrink-0">{status}</div> : null}
    </div>
    {title ? (
      <div className="shrink-0 border-border/50 border-b px-4 py-3">
        <h3 className="font-semibold text-demo-title!">{title}</h3>
        {description ? (
          <p className="mt-1 text-demo-metadata! text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
    ) : null}
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {children}
    </div>
  </div>
)
