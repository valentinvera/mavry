import { Alert, AlertDescription } from "@mavry/ui/components/alert"
import { Button, buttonVariants } from "@mavry/ui/components/button"
import { Field, FieldGroup, FieldLabel } from "@mavry/ui/components/field"
import { Input } from "@mavry/ui/components/input"
import { Spinner } from "@mavry/ui/components/spinner"
import { Link } from "@tanstack/react-router"
import { CheckCircle2Icon } from "lucide-react"
import { type FormEvent, useCallback, useState } from "react"
import {
  AuthErrorSummary,
  AuthFieldError,
} from "@/components/auth/auth-form-error"
import { MavrySymbol } from "@/components/brand/mavry-symbol"
import { authClient } from "@/lib/auth-client"
import { type AuthErrorDetails, getAuthError } from "@/lib/auth-errors"

export const PasswordRecovery = () => {
  const [authError, setAuthError] = useState<AuthErrorDetails | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = useCallback((): void => {
    setAuthError(null)
  }, [])

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()
    setAuthError(null)

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get("email") ?? "")

    setIsSubmitting(true)

    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: new URL(
          "/reset-password",
          window.location.origin
        ).toString(),
      })

      if (error) {
        setAuthError(
          getAuthError(error, "Mavry couldn’t send the reset link. Try again.")
        )
        return
      }

      setIsSubmitted(true)
    } catch {
      setAuthError({
        message: "Mavry couldn’t reach the server. Try again.",
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
      <h1 className="mt-7 text-balance font-medium text-section">
        Reset your password
      </h1>
      <p className="mt-2 max-w-xs text-pretty text-muted-foreground text-small leading-relaxed">
        Enter your email and we’ll send you a secure link to choose a new
        password.
      </p>

      {isSubmitted ? (
        <div className="mt-7 flex w-full flex-col gap-5">
          <Alert className="rounded-lg text-left">
            <CheckCircle2Icon aria-hidden="true" />
            <AlertDescription>
              If an account exists for that email, a reset link is on its way.
            </AlertDescription>
          </Alert>
          <Link
            className={buttonVariants({
              className: "h-12 w-full rounded-full",
            })}
            search={{ error: undefined }}
            to="/sign-in"
          >
            Back to log in
          </Link>
        </div>
      ) : (
        <form
          aria-label="Reset your password"
          className="mt-7 w-full"
          onSubmit={handleSubmit}
        >
          <FieldGroup className="gap-4">
            <AuthErrorSummary
              error={authError}
              title="Couldn’t send the reset link"
            />

            <Field data-invalid={authError?.target === "email" || undefined}>
              <FieldLabel className="sr-only" htmlFor="recovery-email">
                Email
              </FieldLabel>
              <Input
                aria-invalid={authError?.target === "email" || undefined}
                autoCapitalize="none"
                autoComplete="email"
                className="h-12 rounded-full border-border/80 bg-card/70 px-5 text-small shadow-sm focus-visible:bg-card"
                disabled={isSubmitting}
                id="recovery-email"
                inputMode="email"
                invalidAppearance="message-only"
                name="email"
                onChange={handleInputChange}
                placeholder="you@example.com…"
                required
                spellCheck={false}
                type="email"
              />
              <AuthFieldError error={authError} targets={["email"]} />
            </Field>

            <Field>
              <Button
                className="h-12 w-full rounded-full text-small shadow-sm"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
                {isSubmitting ? "Sending reset link…" : "Send reset link"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      )}

      {isSubmitted ? null : (
        <p className="mt-8 text-caption text-muted-foreground">
          Remembered your password?{" "}
          <Link
            className="font-medium text-foreground underline-offset-4 hover:underline"
            search={{ error: undefined }}
            to="/sign-in"
          >
            Back to log in
          </Link>
        </p>
      )}
    </div>
  )
}
