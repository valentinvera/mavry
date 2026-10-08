import { Button } from "@mavry/ui/components/button"
import { Spinner } from "@mavry/ui/components/spinner"
import { cn } from "@mavry/ui/lib/utils"
import { Cloud } from "lucide-react"
import { type ChangeEvent, type ReactNode, useState } from "react"

interface MethodButtonProps {
  badge?: string
  busy?: boolean
  disabled?: boolean
  icon?: ReactNode
  label: string
  onClick?: () => void
  variant?: "default" | "ghost" | "outline"
}

export const MethodButton = ({
  badge,
  busy,
  disabled,
  icon,
  label,
  onClick,
  variant = "outline",
}: MethodButtonProps) => (
  <Button
    aria-busy={busy}
    className="relative h-12 w-full cursor-pointer justify-center rounded-lg text-action!"
    disabled={disabled}
    onClick={onClick}
    type="button"
    variant={variant}
  >
    {/* biome-ignore lint/suspicious/noLeakedRender: icon is a ReactNode provided by the caller. */}
    {busy ? <Spinner data-icon="inline-start" /> : icon}
    {label}
    {badge ? (
      <span className="absolute right-3 font-normal text-caption text-muted-foreground">
        {badge}
      </span>
    ) : null}
  </Button>
)

export const OrDivider = () => (
  <div className="flex items-center gap-3 py-1">
    <span aria-hidden="true" className="h-px flex-1 bg-border" />
    <span className="text-caption text-muted-foreground">or</span>
    <span aria-hidden="true" className="h-px flex-1 bg-border" />
  </div>
)

export const CloudflareCaptcha = () => {
  const [checked, setChecked] = useState(false)

  const handleToggle = (event: ChangeEvent<HTMLInputElement>): void => {
    setChecked(event.target.checked)
  }

  return (
    <div className="flex w-full items-center justify-between gap-3 rounded-md border border-border bg-muted/40 p-3">
      <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
        <input
          checked={checked}
          className="size-5 shrink-0 cursor-pointer accent-foreground"
          onChange={handleToggle}
          type="checkbox"
        />
        <span className="text-foreground text-small">Verify you are human</span>
      </label>
      <div className="flex shrink-0 flex-col items-end gap-0.5">
        <div className="flex items-center gap-1">
          <Cloud
            aria-hidden="true"
            className="size-4 text-[#F6821F]"
            fill="currentColor"
          />
          <span className="font-semibold text-[0.6rem] tracking-wide">
            CLOUDFLARE
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[0.6rem] text-muted-foreground">
          <span className="underline underline-offset-2">Privacy</span>
          <span aria-hidden="true">•</span>
          <span className="underline underline-offset-2">Help</span>
        </div>
      </div>
    </div>
  )
}

export const CodeInput = ({ id, name }: { id: string; name: string }) => (
  <input
    autoComplete="one-time-code"
    className={cn(
      "h-12 w-full rounded-lg border border-border/80 bg-background/70 px-4 text-center font-medium text-control! tracking-[0.5em] outline-none transition-colors",
      "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-ring/50"
    )}
    id={id}
    inputMode="numeric"
    maxLength={6}
    name={name}
    pattern="[0-9]*"
    placeholder="······"
    required
  />
)
