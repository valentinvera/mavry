import { Alert, AlertDescription } from "@mavry/ui/components/alert"
import { Button } from "@mavry/ui/components/button"
import { Field, FieldGroup, FieldLabel } from "@mavry/ui/components/field"
import { Spinner } from "@mavry/ui/components/spinner"
import { Link } from "@tanstack/react-router"
import { CheckCircle2Icon } from "lucide-react"
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

interface VerifyEmailProps {
  email?: string
}

export const VerifyEmail = ({ email }: VerifyEmailProps) => {
  const [authError, setAuthError] = useState<AuthErrorDetails | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resent, setResent] = useState(false)
  const [verified, setVerified] = useState(false)

  useAuthErrorFocus(authError)

  const handleResend = useCallback(async (): Promise<void> => {
    if (!email) {
      return
    }

    setAuthError(null)
    setIsResending(true)

    try {
      const result = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      })

      if (result.error) {
        setAuthError(
          getAuthError(
            result.error,
            "Mavry couldn’t resend the code. Try again.",
            "email"
          )
        )
        return
      }

      setResent(true)
    } catch {
      setAuthError({
        message: "Mavry couldn’t resend the code. Try again.",
        target: "form",
      })
    } finally {
      setIsResending(false)
    }
  }, [email])

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()

    if (!email) {
      return
    }

    setAuthError(null)
    const otp = String(new FormData(event.currentTarget).get("otp") ?? "")
    setIsSubmitting(true)

    try {
      const result = await authClient.emailOtp.verifyEmail({ email, otp })

      if (result.error) {
        setAuthError(
          getAuthError(result.error, "That code didn’t work. Try again.", "otp")
        )
        return
      }

      setVerified(true)
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
        Verify your email
      </h1>

      {email ? (
        <p className="mt-2 max-w-xs text-pretty text-control text-muted-foreground leading-relaxed md:text-body">
          Enter the 6-digit code we sent to{" "}
          <span className="font-medium text-foreground">{email}</span>.
        </p>
      ) : (
        <p className="mt-2 max-w-xs text-pretty text-control text-muted-foreground leading-relaxed md:text-body">
          We couldn’t find the email to verify. Sign in and request a new code.
        </p>
      )}

      {verified ? (
        <div className="mt-7 flex w-full flex-col gap-4">
          <Alert className="rounded-lg text-left">
            <CheckCircle2Icon aria-hidden="true" />
            <AlertDescription>
              Your email is verified. You can continue to Mavry.
            </AlertDescription>
          </Alert>
          <Link
            className="inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-primary px-4 font-medium text-action! text-primary-foreground"
            to="/account"
          >
            Continue to account
          </Link>
        </div>
      ) : (
        <form
          aria-busy={isSubmitting}
          aria-label="Verify your email"
          className="mt-7 w-full"
          onSubmit={handleSubmit}
        >
          <FieldGroup className="gap-4">
            <AuthErrorSummary error={authError} title="Couldn’t verify email" />

            {resent ? (
              <Alert className="rounded-lg text-left">
                <AlertDescription>
                  If an account exists for {email}, a new code is on its way.
                </AlertDescription>
              </Alert>
            ) : null}

            <Field data-invalid={authError?.target === "otp" || undefined}>
              <FieldLabel className="sr-only" htmlFor="verify-email-code">
                Verification code
              </FieldLabel>
              <CodeInput id="verify-email-code" name="otp" />
              <AuthFieldError error={authError} targets={["otp"]} />
            </Field>

            <Button
              className="h-12 w-full cursor-pointer rounded-lg text-action!"
              disabled={isSubmitting || !email}
              type="submit"
            >
              {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
              Verify email
            </Button>

            <Button
              className="h-10 w-full cursor-pointer rounded-lg text-action!"
              disabled={isResending || !email}
              onClick={handleResend}
              type="button"
              variant="ghost"
            >
              {isResending ? <Spinner data-icon="inline-start" /> : null}
              Resend code
            </Button>
          </FieldGroup>
        </form>
      )}

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
