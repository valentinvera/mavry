import { cn } from "@mavry/ui/lib/utils"
import type { CSSProperties, ReactNode } from "react"

const BACKGROUND_IMAGE = "url('/landing/alpine-clear-sunrise-light.webp')"

const LANDSCAPE_POSITIONS = {
  authPanel: {
    backgroundPosition: "50% 50%",
    backgroundSize: "cover",
  },
  cliffFace: {
    backgroundPosition: "18% 48%",
    backgroundSize: "156% auto",
  },
  coastline: {
    backgroundPosition: "72% 42%",
    backgroundSize: "162% auto",
  },
  forestPass: {
    backgroundPosition: "57% 68%",
    backgroundSize: "168% auto",
  },
  lowerTrail: {
    backgroundPosition: "34% 76%",
    backgroundSize: "178% auto",
  },
  ridgePath: {
    backgroundPosition: "48% 56%",
    backgroundSize: "148% auto",
  },
} satisfies Record<string, CSSProperties>

interface LandscapeDemoContainerProps {
  children: ReactNode
  className?: string
  contentClassName?: string
  variant: keyof typeof LANDSCAPE_POSITIONS
}

export const LandscapeDemoContainer = ({
  children,
  className,
  contentClassName,
  variant,
}: LandscapeDemoContainerProps) => (
  <div
    className={cn(
      "relative overflow-hidden rounded-2xl bg-background p-3 shadow-lg sm:p-5 md:p-7",
      className
    )}
    data-landscape-demo={variant}
    style={{
      backgroundImage: BACKGROUND_IMAGE,
      backgroundRepeat: "no-repeat",
      ...LANDSCAPE_POSITIONS[variant],
    }}
  >
    <div className={cn("relative", contentClassName)}>{children}</div>
  </div>
)
