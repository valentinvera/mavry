import { cn } from "@mavry/ui/lib/utils"

interface MavryWordmarkProps {
  className?: string
  size?: "sm" | "md"
}

const sizeClasses = {
  md: {
    mark: "size-8",
    name: "text-paragraph-md!",
    root: "gap-2",
  },
  sm: {
    mark: "size-7",
    name: "text-body!",
    root: "gap-1.5",
  },
} as const

export const MavryWordmark = ({
  className,
  size = "md",
}: MavryWordmarkProps) => {
  const classes = sizeClasses[size]

  return (
    <span
      aria-label="Mavry"
      className={cn(
        "inline-flex shrink-0 items-center font-sans text-foreground",
        classes.root,
        className
      )}
      role="img"
    >
      <img
        alt=""
        aria-hidden="true"
        className={classes.mark}
        height={128}
        src="/brand/mavry-symbol-white.svg"
        width={128}
      />
      <span
        aria-hidden="true"
        className={cn(
          "shrink-0 leading-none [font-synthesis:none] [font-variation-settings:'wght'_650]",
          classes.name
        )}
      >
        Mavry
      </span>
    </span>
  )
}
