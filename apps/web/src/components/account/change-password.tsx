import { Alert, AlertDescription } from "@mavry/ui/components/alert"
import { Button } from "@mavry/ui/components/button"
import { Field, FieldGroup, FieldLabel } from "@mavry/ui/components/field"
import { Spinner } from "@mavry/ui/components/spinner"
import { type FormEvent, useCallback, useState } from "react"
import { PasswordInput } from "@/components/auth/password-input"
import { authClient } from "@/lib/auth-client"
import { AccountSection } from "./section"

export const ChangePasswordSection = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = useCallback((): void => {
    setErrorMessage(null)
    setSuccess(false)
  }, [])

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()
    setErrorMessage(null)
    setSuccess(false)

    const form = event.currentTarget
    const formData = new FormData(form)
    const currentPassword = String(formData.get("currentPassword") ?? "")
    const newPassword = String(formData.get("newPassword") ?? "")
    const confirmPassword = String(formData.get("confirmPassword") ?? "")

    if (newPassword !== confirmPassword) {
      setErrorMessage("The passwords don’t match.")
      return
    }

    setIsSubmitting(true)

    try {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      })

      if (result.error) {
        setErrorMessage(
          result.error.code === "INVALID_PASSWORD"
            ? "Your current password is incorrect."
            : "Mavry couldn’t update your password. Try again."
        )
        return
      }

      form.reset()
      setSuccess(true)
    } catch {
      setErrorMessage("Mavry couldn’t update your password. Try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AccountSection
      description="Update the password used to sign in. Other sessions will be signed out."
      title="Password"
    >
      <form
        aria-busy={isSubmitting}
        aria-label="Change password"
        onSubmit={handleSubmit}
      >
        <FieldGroup className="gap-4">
          {errorMessage ? (
            <Alert className="rounded-lg" variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          ) : null}

          {success ? (
            <Alert className="rounded-lg">
              <AlertDescription>
                Your password has been updated.
              </AlertDescription>
            </Alert>
          ) : null}

          <Field>
            <FieldLabel htmlFor="current-password">Current password</FieldLabel>
            <PasswordInput
              autoComplete="current-password"
              disabled={isSubmitting}
              id="current-password"
              name="currentPassword"
              onChange={handleInputChange}
              placeholder="Current password…"
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="new-password">New password</FieldLabel>
            <PasswordInput
              autoComplete="new-password"
              disabled={isSubmitting}
              id="new-password"
              minLength={8}
              name="newPassword"
              onChange={handleInputChange}
              placeholder="At least 8 characters…"
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="confirm-new-password">
              Confirm new password
            </FieldLabel>
            <PasswordInput
              autoComplete="new-password"
              disabled={isSubmitting}
              id="confirm-new-password"
              minLength={8}
              name="confirmPassword"
              onChange={handleInputChange}
              placeholder="Repeat the new password…"
              required
            />
          </Field>

          <Button
            className="h-11 w-full cursor-pointer rounded-lg text-action! sm:w-auto"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
            Update password
          </Button>
        </FieldGroup>
      </form>
    </AccountSection>
  )
}
