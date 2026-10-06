import { cn } from "@mavry/ui/lib/utils"

export const DEMO_BACKGROUND = "alpine-clear-sunrise-light.webp"

export const DemoStage = ({
  children,
  className,
  image,
}: {
  children: React.ReactNode
  className?: string
  image: string
}) => (
  <div
    className={cn(
      "relative flex items-center justify-center overflow-hidden rounded-2xl p-4 sm:p-6",
      className
    )}
  >
    <img
      alt=""
      className="absolute inset-0 size-full object-cover"
      height={941}
      loading="lazy"
      src={`/landing/${image}`}
      width={1672}
    />
    <div aria-hidden="true" className="absolute inset-0 bg-white/10" />
    <div className="relative flex h-full w-full items-stretch justify-center">
      {children}
    </div>
  </div>
)
