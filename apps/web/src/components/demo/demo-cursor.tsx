import { cn } from "@mavry/ui/lib/utils"
import { MousePointer2Icon } from "lucide-react"

export interface DemoCursorPosition {
  x: number
  y: number
}

interface DemoCursorProps {
  isClicking: boolean
  position: DemoCursorPosition | null
}

export const DemoCursor = ({ isClicking, position }: DemoCursorProps) => (
  <div
    aria-hidden="true"
    className={cn(
      "pointer-events-none absolute top-0 left-0 z-20 opacity-0 transition-[transform,opacity] duration-700 ease-out motion-reduce:hidden",
      position && "opacity-100"
    )}
    data-demo-cursor=""
    style={{
      transform: position
        ? `translate3d(${position.x}px, ${position.y}px, 0)`
        : "translate3d(0, 0, 0)",
    }}
  >
    {isClicking ? (
      <span className="absolute -top-2 -left-2 size-6 animate-ping rounded-full border border-foreground/60" />
    ) : null}
    <MousePointer2Icon className="size-6 fill-foreground text-background drop-shadow-md" />
  </div>
)
