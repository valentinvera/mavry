import { Loader2Icon, type LucideProps } from "lucide-react"
import { cn } from "#lib/utils"

type SpinnerProps = Omit<LucideProps, "ref">

function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <Loader2Icon
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      data-slot="spinner"
      role="status"
      {...props}
    />
  )
}

export { Spinner }
