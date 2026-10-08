import { Alert, AlertDescription } from "@mavry/ui/components/alert"
import { Button, buttonVariants } from "@mavry/ui/components/button"
import { Field, FieldGroup, FieldLabel } from "@mavry/ui/components/field"
import { Spinner } from "@mavry/ui/components/spinner"
import { Link } from "@tanstack/react-router"
import { CheckCircle2Icon } from "lucide-react"
import { type FormEvent, useCallback, useState } from "react"
import {
  AuthErrorSummary,
  AuthFieldError,
} from "@/components/auth/auth-form-error"
import { CloudflareCaptcha, CodeInput } from "@/components/auth/auth-methods"
import { PasswordInput } from "@/components/auth/password-input"
import { useAuthErrorFocus } from "@/components/auth/use-auth-error-focus"
import { MavrySymbol } from "@/components/brand/mavry-symbol"
import type { AuthErrorDetails } from "@/lib/auth-errors"

interface ResetPasswordProps {
  email?: string
}

interface ResetFormProps {
  email: string
  onComplete: () => void
}

const ResetForm = ({ email, onComplete }: ResetFormProps) => {
  const [authError, setAuthError] = useState<AuthErrorDetails | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useAuthErrorFocus(authError)

  const handleInputChange = useCallback((): void => {
    setAuthError(null)
  }, [])

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    setAuthError(null)

    const formData = new FormData(event.currentTarget)
    const newPassword = String(formData.get("newPassword") ?? "")
    const confirmPassword = String(formData.get("confirmPassword") ?? "")

    if (newPassword !== confirmPassword) {
      setAuthError({
        message: "The passwords don’t match.",
        target: "confirmPassword",
      })
      return
    }

    setIsSubmitting(true)

    // UI/UX only for now. When the API is ready:
    // await authClient.emailOtp.resetPassword({
    //   email,
    //   otp: String(formData.get("otp") ?? ""),
    //   password: newPassword,
    // })
    onComplete()
  }

  return (
    <form
      aria-busy={isSubmitting}
      aria-label="Choose a new password"
      className="mt-7 w-full"
      onSubmit={handleSubmit}
    >
      <input name="email" type="hidden" value={email} />
      <FieldGroup className="gap-4">
        <AuthErrorSummary
          error={authError}
          title="Couldn’t reset your password"
        />

        <Field data-invalid={authError?.target === "otp" || undefined}>
          <FieldLabel className="sr-only" htmlFor="reset-code">
            Reset code
          </FieldLabel>
          <CodeInput id="reset-code" name="otp" />
          <AuthFieldError error={authError} targets={["otp"]} />
        </Field>

        <Field data-invalid={authError?.target === "password" || undefined}>
          <FieldLabel className="sr-only" htmlFor="new-password">
            New password
          </FieldLabel>
          <PasswordInput
            aria-invalid={authError?.target === "password" || undefined}
            autoComplete="new-password"
            className="px-4 text-control!"
            disabled={isSubmitting}
            id="new-password"
            minLength={8}
            name="newPassword"
            onChange={handleInputChange}
            placeholder="New password…"
            required
          />
          <AuthFieldError error={authError} targets={["password"]} />
        </Field>

        <Field
          data-invalid={authError?.target === "confirmPassword" || undefined}
        >
          <FieldLabel className="sr-only" htmlFor="confirm-password">
            Confirm password
          </FieldLabel>
          <PasswordInput
            aria-invalid={authError?.target === "confirmPassword" || undefined}
            autoComplete="new-password"
            className="px-4 text-control!"
            disabled={isSubmitting}
            id="confirm-password"
            minLength={8}
            name="confirmPassword"
            onChange={handleInputChange}
            placeholder="Confirm new password…"
            required
          />
          <AuthFieldError error={authError} targets={["confirmPassword"]} />
        </Field>

        <CloudflareCaptcha />

        <Field>
          <Button
            className="h-12 w-full cursor-pointer rounded-lg text-action!"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
            {isSubmitting ? "Resetting password…" : "Reset password"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

const ResetComplete = () => (
  <div className="mt-7 flex w-full flex-col gap-5">
    <Alert className="rounded-lg text-left">
      <CheckCircle2Icon aria-hidden="true" />
      <AlertDescription>
        Your password has been updated. You can now log in to Mavry.
      </AlertDescription>
    </Alert>
    <Link
      className={buttonVariants({
        className: "h-12 w-full cursor-pointer rounded-lg! text-action!",
      })}
      search={{ error: undefined }}
      to="/sign-in"
    >
      Log in
    </Link>
  </div>
)

const ResetMissingEmail = () => (
  <div className="mt-7 flex w-full flex-col gap-4">
    <Link
      className={buttonVariants({
        className: "h-12 w-full cursor-pointer rounded-lg! text-action!",
      })}
      to="/forgot-password"
    >
      Request a code
    </Link>
  </div>
)

type ResetState = "complete" | "form" | "missing-email"

const getResetState = (isComplete: boolean, hasEmail: boolean): ResetState => {
  if (isComplete) {
    return "complete"
  }

  if (!hasEmail) {
    return "missing-email"
  }

  return "form"
}

const getResetCopy = (state: ResetState, email: string) => {
  if (state === "complete") {
    return {
      description: "Your new password is set. Log in to continue to Mavry.",
      title: "Password updated",
    }
  }

  if (state === "missing-email") {
    return {
      description: "Request a reset code first, then enter it here.",
      title: "Reset your password",
    }
  }

  return {
    description: `Enter the 6-digit code we sent to ${email}, then choose a new password.`,
    title: "Choose a new password",
  }
}

export const ResetPassword = ({ email }: ResetPasswordProps) => {
  const [isComplete, setIsComplete] = useState(false)

  const handleComplete = useCallback(() => {
    setIsComplete(true)
  }, [])

  const state = getResetState(isComplete, Boolean(email))
  const copy = getResetCopy(state, email ?? "")

  return (
    <div className="mx-auto flex w-full flex-col items-center text-center">
      <Link aria-label="Mavry home" className="inline-flex rounded-md" to="/">
        <MavrySymbol className="size-12" />
      </Link>
      <h1 className="mt-7 text-balance font-medium text-xlarge md:text-section">
        {copy.title}
      </h1>
      <p className="mt-2 max-w-xs text-pretty text-control text-muted-foreground leading-relaxed md:text-body">
        {copy.description}
      </p>

      {state === "complete" ? <ResetComplete /> : null}
      {state === "missing-email" ? <ResetMissingEmail /> : null}
      {state === "form" ? (
        <ResetForm email={email ?? ""} onComplete={handleComplete} />
      ) : null}

      {state === "form" ? (
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
      ) : null}
    </div>
  )
}
