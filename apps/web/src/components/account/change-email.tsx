import { Alert, AlertDescription } from "@mavry/ui/components/alert"
import { Button } from "@mavry/ui/components/button"
import { Field, FieldGroup, FieldLabel } from "@mavry/ui/components/field"
import { Input } from "@mavry/ui/components/input"
import { Spinner } from "@mavry/ui/components/spinner"
import { type FormEvent, useCallback, useState } from "react"
import { CodeInput } from "@/components/auth/auth-methods"
import { authClient } from "@/lib/auth-client"
import { getAuthError } from "@/lib/auth-errors"
import { AccountSection } from "./section"

interface ChangeEmailSectionProps {
  onChanged: () => Promise<void> | void
}

type ChangeEmailStep = "start" | "verify"

export const ChangeEmailSection = ({ onChanged }: ChangeEmailSectionProps) => {
  const [step, setStep] = useState<ChangeEmailStep>("start")
  const [newEmail, setNewEmail] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const reset = useCallback((): void => {
    setStep("start")
    setNewEmail("")
  }, [])

  const handleRequest = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()
    setErrorMessage(null)
    setSuccess(false)

    const email = String(
      new FormData(event.currentTarget).get("newEmail") ?? ""
    )
      .trim()
      .toLowerCase()
    setIsSubmitting(true)

    try {
      const result = await authClient.emailOtp.requestEmailChange({
        newEmail: email,
      })

      if (result.error) {
        setErrorMessage(
          getAuthError(result.error, "Mavry couldn’t send the code. Try again.")
            .message
        )
        return
      }

      setNewEmail(email)
      setStep("verify")
    } catch {
      setErrorMessage("Mavry couldn’t send the code. Try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirm = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()
    setErrorMessage(null)
    const otp = String(new FormData(event.currentTarget).get("otp") ?? "")
    setIsSubmitting(true)

    try {
      const result = await authClient.emailOtp.changeEmail({
        newEmail,
        otp,
      })

      if (result.error) {
        setErrorMessage(
          getAuthError(result.error, "That code didn’t work. Try again.")
            .message
        )
        return
      }

      reset()
      setSuccess(true)
      await onChanged()
    } catch {
      setErrorMessage("That code didn’t work. Try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = useCallback((): void => {
    setErrorMessage(null)
    reset()
  }, [reset])

  return (
    <AccountSection
      description="Change the email address associated with your account. We verify the new address with a code."
      title="Email address"
    >
      {errorMessage ? (
        <Alert className="rounded-lg" variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      {success ? (
        <Alert className="rounded-lg">
          <AlertDescription>
            Your email address has been updated.
          </AlertDescription>
        </Alert>
      ) : null}

      {step === "start" ? (
        <form
          aria-busy={isSubmitting}
          aria-label="Change email address"
          onSubmit={handleRequest}
        >
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="new-email">New email address</FieldLabel>
              <Input
                autoCapitalize="none"
                autoComplete="email"
                className="h-11 rounded-lg border-border/80 bg-background/70 px-4 text-control!"
                disabled={isSubmitting}
                id="new-email"
                inputMode="email"
                name="newEmail"
                placeholder="you@example.com…"
                required
                spellCheck={false}
                type="email"
              />
            </Field>
            <Button
              className="h-11 w-full cursor-pointer rounded-lg text-action! sm:w-auto"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
              Send code
            </Button>
          </FieldGroup>
        </form>
      ) : (
        <form
          aria-busy={isSubmitting}
          aria-label="Confirm new email address"
          onSubmit={handleConfirm}
        >
          <FieldGroup className="gap-4">
            <p className="text-control text-muted-foreground">
              Enter the 6-digit code sent to{" "}
              <span className="font-medium text-foreground">{newEmail}</span>.
            </p>
            <Field>
              <FieldLabel className="sr-only" htmlFor="change-email-code">
                Verification code
              </FieldLabel>
              <CodeInput id="change-email-code" name="otp" />
            </Field>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                className="h-11 w-full cursor-pointer rounded-lg text-action! sm:w-auto"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
                Confirm email
              </Button>
              <Button
                className="h-11 w-full cursor-pointer rounded-lg text-action! sm:w-auto"
                disabled={isSubmitting}
                onClick={handleCancel}
                type="button"
                variant="ghost"
              >
                Cancel
              </Button>
            </div>
          </FieldGroup>
        </form>
      )}
    </AccountSection>
  )
}
