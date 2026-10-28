import { Turnstile } from "@marsidev/react-turnstile"
import { env } from "@mavry/env/web"
import { Button } from "@mavry/ui/components/button"
import { Spinner } from "@mavry/ui/components/spinner"
import { cn } from "@mavry/ui/lib/utils"
import { type ReactNode, useCallback, useEffect, useState } from "react"

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

interface CloudflareCaptchaProps {
  onReadyChange?: (ready: boolean) => void
}

export const CloudflareCaptcha = ({
  onReadyChange,
}: CloudflareCaptchaProps) => {
  const siteKey = env.VITE_TURNSTILE_SITE_KEY
  const [token, setToken] = useState("")

  useEffect(() => {
    if (!siteKey) {
      onReadyChange?.(true)
      return
    }

    onReadyChange?.(false)
  }, [onReadyChange])

  const handleSuccess = useCallback(
    (nextToken: string): void => {
      setToken(nextToken)
      onReadyChange?.(true)
    },
    [onReadyChange]
  )

  const handleError = useCallback((): void => {
    setToken("")
    onReadyChange?.(false)
  }, [onReadyChange])

  const handleExpire = useCallback((): void => {
    setToken("")
    onReadyChange?.(false)
  }, [onReadyChange])

  if (!siteKey) {
    return null
  }

  return (
    <div className="w-full">
      <Turnstile
        onError={handleError}
        onExpire={handleExpire}
        onSuccess={handleSuccess}
        options={{ size: "flexible", theme: "light" }}
        siteKey={siteKey}
      />
      <input name="captchaToken" type="hidden" value={token} />
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
