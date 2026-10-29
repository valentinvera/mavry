import { Button } from "@mavry/ui/components/button"
import { Field, FieldGroup, FieldLabel } from "@mavry/ui/components/field"
import { Input } from "@mavry/ui/components/input"
import { Spinner } from "@mavry/ui/components/spinner"
import { Link, useNavigate } from "@tanstack/react-router"
import { type FormEvent, useCallback, useState } from "react"
import {
  AuthErrorSummary,
  AuthFieldError,
} from "@/components/auth/auth-form-error"
import { CodeInput } from "@/components/auth/auth-methods"
import { useAuthErrorFocus } from "@/components/auth/use-auth-error-focus"
import { MavrySymbol } from "@/components/brand/mavry-symbol"
import { authClient } from "@/lib/auth-client"
import { type AuthErrorDetails, getAuthError } from "@/lib/auth-errors"

type TwoFactorMode = "backup" | "totp"

export const TwoFactorChallenge = () => {
  const navigate = useNavigate()
  const [authError, setAuthError] = useState<AuthErrorDetails | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mode, setMode] = useState<TwoFactorMode>("totp")

  useAuthErrorFocus(authError)

  const handleToggleMode = useCallback((): void => {
    setAuthError(null)
    setMode((current) => (current === "totp" ? "backup" : "totp"))
  }, [])

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()
    setAuthError(null)
    const code = String(new FormData(event.currentTarget).get("code") ?? "")
    setIsSubmitting(true)

    try {
      const result =
        mode === "totp"
          ? await authClient.twoFactor.verifyTotp({
              code,
              trustDevice: true,
            })
          : await authClient.twoFactor.verifyBackupCode({
              code,
              trustDevice: true,
            })

      if (result.error) {
        setAuthError(
          getAuthError(result.error, "That code didn’t work. Try again.", "otp")
        )
        return
      }

      await navigate({ to: "/account" })
    } catch {
      setAuthError({
        message: "That code didn’t work. Try again.",
        target: "form",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex w-full flex-col items-center text-center">
      <Link aria-label="Mavry home" className="inline-flex rounded-md" to="/">
        <MavrySymbol className="size-12" />
      </Link>
      <h1 className="mt-7 text-balance font-medium text-xlarge md:text-section">
        Two-factor verification
      </h1>
      <p className="mt-2 max-w-xs text-pretty text-control text-muted-foreground leading-relaxed md:text-body">
        {mode === "totp"
          ? "Enter the 6-digit code from your authenticator app."
          : "Enter one of the backup codes you saved when you enabled two-factor."}
      </p>

      <form
        aria-busy={isSubmitting}
        aria-label="Two-factor verification"
        className="mt-7 w-full"
        onSubmit={handleSubmit}
      >
        <FieldGroup className="gap-4">
          <AuthErrorSummary error={authError} title="Couldn’t verify" />

          <Field data-invalid={authError?.target === "otp" || undefined}>
            <FieldLabel className="sr-only" htmlFor="two-factor-code">
              Verification code
            </FieldLabel>
            {mode === "totp" ? (
              <CodeInput id="two-factor-code" name="code" />
            ) : (
              <Input
                autoComplete="one-time-code"
                className="h-12 rounded-lg border-border/80 bg-background/70 px-4 text-center text-control! tracking-widest"
                id="two-factor-code"
                name="code"
                placeholder="Backup code…"
                required
              />
            )}
            <AuthFieldError error={authError} targets={["otp"]} />
          </Field>

          <Button
            className="h-12 w-full cursor-pointer rounded-lg text-action!"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
            Verify
          </Button>

          <Button
            className="h-10 w-full cursor-pointer rounded-lg text-action!"
            disabled={isSubmitting}
            onClick={handleToggleMode}
            type="button"
            variant="ghost"
          >
            {mode === "totp"
              ? "Use a backup code"
              : "Use an authenticator code"}
          </Button>
        </FieldGroup>
      </form>

      <p className="mt-8 text-footer text-muted-foreground">
        <Link
          className="font-medium text-foreground underline-offset-4 hover:underline"
          search={{ error: undefined }}
          to="/sign-in"
        >
          Back to log in
        </Link>
      </p>
    </div>
  )
}
