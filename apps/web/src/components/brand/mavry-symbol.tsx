import { cn } from "@mavry/ui/lib/utils"

export const MavrySymbol = ({ className }: { className?: string }) => (
  <span aria-hidden="true" className={cn("relative shrink-0", className)}>
    <img
      alt=""
      aria-hidden="true"
      className="size-full dark:hidden"
      height={128}
      src="/brand/mavry-symbol-black.svg"
      width={128}
    />
    <img
      alt=""
      aria-hidden="true"
      className="hidden size-full dark:block"
      height={128}
      src="/brand/mavry-symbol-white.svg"
      width={128}
    />
  </span>
)
