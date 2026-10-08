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
import { CloudflareCaptcha } from "@/components/auth/auth-methods"
import { useAuthErrorFocus } from "@/components/auth/use-auth-error-focus"
import { MavrySymbol } from "@/components/brand/mavry-symbol"
import type { AuthErrorDetails } from "@/lib/auth-errors"

export const PasswordRecovery = () => {
  const navigate = useNavigate()
  const [authError, setAuthError] = useState<AuthErrorDetails | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useAuthErrorFocus(authError)

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
      // UI/UX only for now. When the API is ready:
      // await authClient.emailOtp.requestPasswordReset({ email })
      await navigate({ search: { email }, to: "/reset-password" })
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
        Reset your password
      </h1>
      <p className="mt-2 max-w-xs text-pretty text-control text-muted-foreground leading-relaxed md:text-body">
        Enter your email and we’ll send a 6-digit code to choose a new password.
      </p>

      <form
        aria-busy={isSubmitting}
        aria-label="Reset your password"
        className="mt-7 w-full"
        onSubmit={handleSubmit}
      >
        <FieldGroup className="gap-4">
          <AuthErrorSummary error={authError} title="Couldn’t send the code" />

          <Field data-invalid={authError?.target === "email" || undefined}>
            <FieldLabel className="sr-only" htmlFor="recovery-email">
              Email
            </FieldLabel>
            <Input
              aria-invalid={authError?.target === "email" || undefined}
              autoCapitalize="none"
              autoComplete="email"
              className="h-12 rounded-lg border-border/80 bg-background/70 px-4 text-control! focus-visible:bg-background"
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

          <CloudflareCaptcha />

          <Field>
            <Button
              className="h-12 w-full cursor-pointer rounded-lg text-action!"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
              {isSubmitting ? "Sending code…" : "Send code"}
            </Button>
          </Field>
        </FieldGroup>
      </form>

      <p className="mt-8 text-footer text-muted-foreground">
        Remembered your password?{" "}
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
