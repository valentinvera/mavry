import { Input as InputPrimitive } from "@base-ui/react/input"
import type * as React from "react"

import { cn } from "#lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  invalidAppearance?: "message-only" | "outline"
}

function Input({
  className,
  invalidAppearance = "outline",
  type,
  ...props
}: InputProps) {
  return (
    <InputPrimitive
      className={cn(
        "h-8 w-full min-w-0 rounded-none border border-input bg-transparent px-2.5 py-1 text-caption outline-none transition-colors file:inline-flex file:h-6 file:border-0 file:bg-transparent file:font-medium file:text-caption file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive-foreground/50 aria-invalid:ring-1 aria-invalid:ring-destructive-foreground/20 md:text-caption dark:bg-input/30 dark:aria-invalid:border-destructive-foreground/60 dark:aria-invalid:ring-destructive-foreground/30 dark:disabled:bg-input/80",
        invalidAppearance === "message-only" &&
          "aria-invalid:border-input aria-invalid:ring-0 dark:aria-invalid:border-input dark:aria-invalid:ring-0",
        className
      )}
      data-slot="input"
      type={type}
      {...props}
    />
  )
}

export { Input }
