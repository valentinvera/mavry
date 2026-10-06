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
  AuthFormError,
} from "@/components/auth/auth-form-error"
import { PasswordInput } from "@/components/auth/password-input"
import { MavrySymbol } from "@/components/brand/mavry-symbol"
import { authClient } from "@/lib/auth-client"
import { type AuthErrorDetails, getAuthError } from "@/lib/auth-errors"

interface ResetPasswordProps {
  hasInvalidToken: boolean
  token?: string
}

export const ResetPassword = ({
  hasInvalidToken,
  token,
}: ResetPasswordProps) => {
  const [authError, setAuthError] = useState<AuthErrorDetails | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = useCallback((): void => {
    setAuthError(null)
  }, [])

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()
    setAuthError(null)

    if (!token) {
      setAuthError({
        message: "This reset link is invalid or has expired.",
        target: "form",
      })
      return
    }

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

    try {
      const { error } = await authClient.resetPassword({
        newPassword,
        token,
      })

      if (error) {
        setAuthError(
          getAuthError(
            error,
            "Mavry couldn’t update your password. Request a new reset link and try again."
          )
        )
        return
      }

      setIsComplete(true)
    } catch {
      setAuthError({
        message: "Mavry couldn’t reach the server. Try again.",
        target: "form",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const tokenIsUnavailable = hasInvalidToken || !token

  return (
    <div className="mx-auto flex w-full flex-col items-center text-center">
      <Link aria-label="Mavry home" className="inline-flex rounded-md" to="/">
        <MavrySymbol className="size-12" />
      </Link>
      <h1 className="mt-7 text-balance font-medium text-section">
        Choose a new password
      </h1>
      <p className="mt-2 max-w-xs text-pretty text-muted-foreground text-small leading-relaxed">
        Use at least eight characters and choose something you don’t reuse
        elsewhere.
      </p>

      {isComplete ? (
        <div className="mt-7 flex w-full flex-col gap-5">
          <Alert className="rounded-lg text-left">
            <CheckCircle2Icon aria-hidden="true" />
            <AlertDescription>
              Your password has been updated. You can now log in to Mavry.
            </AlertDescription>
          </Alert>
          <Link
            className={buttonVariants({
              className: "h-12 w-full rounded-full",
            })}
            search={{ error: undefined }}
            to="/sign-in"
          >
            Log in
          </Link>
        </div>
      ) : (
        <form
          aria-label="Choose a new password"
          className="mt-7 w-full"
          onSubmit={handleSubmit}
        >
          <FieldGroup className="gap-4">
            {tokenIsUnavailable ? (
              <AuthFormError
                message="This reset link is invalid or has expired. Request a new one to continue."
                title="Reset link unavailable"
              />
            ) : (
              <>
                <AuthErrorSummary
                  error={authError}
                  title="Couldn’t update your password"
                />

                <Field
                  data-invalid={authError?.target === "password" || undefined}
                >
                  <FieldLabel className="sr-only" htmlFor="new-password">
                    New password
                  </FieldLabel>
                  <PasswordInput
                    aria-invalid={authError?.target === "password" || undefined}
                    autoComplete="new-password"
                    className="px-5 text-small"
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
                  data-invalid={
                    authError?.target === "confirmPassword" || undefined
                  }
                >
                  <FieldLabel className="sr-only" htmlFor="confirm-password">
                    Confirm password
                  </FieldLabel>
                  <PasswordInput
                    aria-invalid={
                      authError?.target === "confirmPassword" || undefined
                    }
                    autoComplete="new-password"
                    className="px-5 text-small"
                    disabled={isSubmitting}
                    id="confirm-password"
                    minLength={8}
                    name="confirmPassword"
                    onChange={handleInputChange}
                    placeholder="Confirm new password…"
                    required
                  />
                  <AuthFieldError
                    error={authError}
                    targets={["confirmPassword"]}
                  />
                </Field>

                <Field>
                  <Button
                    className="h-12 w-full rounded-full text-small shadow-sm"
                    disabled={isSubmitting}
                    type="submit"
                  >
                    {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
                    {isSubmitting ? "Updating password…" : "Update password"}
                  </Button>
                </Field>
              </>
            )}
          </FieldGroup>
        </form>
      )}

      {tokenIsUnavailable && !isComplete ? (
        <p className="mt-8 text-caption text-muted-foreground">
          <Link
            className="font-medium text-foreground underline-offset-4 hover:underline"
            to="/forgot-password"
          >
            Request a new reset link
          </Link>
        </p>
      ) : null}
    </div>
  )
}
