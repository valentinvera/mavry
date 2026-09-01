import { Alert, AlertDescription } from "@mavry/ui/components/alert"
import { Button, buttonVariants } from "@mavry/ui/components/button"
import { Field, FieldGroup, FieldLabel } from "@mavry/ui/components/field"
import { Input } from "@mavry/ui/components/input"
import { Spinner } from "@mavry/ui/components/spinner"
import { Link } from "@tanstack/react-router"
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react"
import { type FormEvent, useState } from "react"
import { MavrySymbol } from "@/components/brand/mavry-symbol"

interface ResetPasswordProps {
  hasInvalidToken: boolean
  token?: string
}

export const ResetPassword = ({
  hasInvalidToken,
  token,
}: ResetPasswordProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    setErrorMessage(null)

    if (!token) {
      setErrorMessage("This reset link is invalid or has expired.")
      return
    }

    const formData = new FormData(event.currentTarget)
    const newPassword = String(formData.get("newPassword") ?? "")
    const confirmPassword = String(formData.get("confirmPassword") ?? "")

    if (newPassword !== confirmPassword) {
      setErrorMessage("The passwords don’t match.")
      return
    }

    setIsSubmitting(true)

    try {
      setIsComplete(true)
    } catch {
      setErrorMessage("Mavry couldn’t reach the server. Try again.")
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
              <Alert className="rounded-lg text-left" variant="destructive">
                <AlertCircleIcon aria-hidden="true" />
                <AlertDescription>
                  This reset link is invalid or has expired. Request a new one
                  to continue.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <Field>
                  <FieldLabel className="sr-only" htmlFor="new-password">
                    New password
                  </FieldLabel>
                  <Input
                    autoComplete="new-password"
                    className="h-12 rounded-full border-border/80 bg-card/70 px-5 text-small shadow-sm focus-visible:bg-card"
                    disabled={isSubmitting}
                    id="new-password"
                    minLength={8}
                    name="newPassword"
                    placeholder="New password…"
                    required
                    type="password"
                  />
                </Field>
                <Field>
                  <FieldLabel className="sr-only" htmlFor="confirm-password">
                    Confirm password
                  </FieldLabel>
                  <Input
                    autoComplete="new-password"
                    className="h-12 rounded-full border-border/80 bg-card/70 px-5 text-small shadow-sm focus-visible:bg-card"
                    disabled={isSubmitting}
                    id="confirm-password"
                    minLength={8}
                    name="confirmPassword"
                    placeholder="Confirm new password…"
                    required
                    type="password"
                  />
                </Field>

                {errorMessage ? (
                  <Alert className="rounded-lg" variant="destructive">
                    <AlertCircleIcon aria-hidden="true" />
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                ) : null}

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
