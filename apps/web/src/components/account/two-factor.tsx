import { Alert, AlertDescription } from "@mavry/ui/components/alert"
import { Button } from "@mavry/ui/components/button"
import { Field, FieldGroup, FieldLabel } from "@mavry/ui/components/field"
import { Spinner } from "@mavry/ui/components/spinner"
import { QRCodeSVG } from "qrcode.react"
import { type FormEvent, useCallback, useState } from "react"
import { CodeInput } from "@/components/auth/auth-methods"
import { PasswordInput } from "@/components/auth/password-input"
import { authClient } from "@/lib/auth-client"
import { AccountSection } from "./section"

interface TwoFactorSectionProps {
  enabled: boolean
  onChanged: () => Promise<void> | void
}

type SetupState = "idle" | "setup"

export const TwoFactorSection = ({
  enabled,
  onChanged,
}: TwoFactorSectionProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [setupState, setSetupState] = useState<SetupState>("idle")
  const [totpURI, setTotpURI] = useState<string | null>(null)
  const [backupCodes, setBackupCodes] = useState<string[]>([])

  const resetSetup = useCallback((): void => {
    setSetupState("idle")
    setTotpURI(null)
    setBackupCodes([])
  }, [])

  const handleEnable = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()
    setErrorMessage(null)
    setSuccess(false)
    const password = String(
      new FormData(event.currentTarget).get("password") ?? ""
    )
    setIsSubmitting(true)

    try {
      const result = await authClient.twoFactor.enable({
        method: "totp",
        password,
      })

      if (result.error) {
        setErrorMessage(
          result.error.code === "INVALID_PASSWORD"
            ? "Your password is incorrect."
            : "Mavry couldn’t enable two-factor. Try again."
        )
        return
      }

      if (result.data?.method === "totp") {
        setTotpURI(result.data.totpURI)
        setBackupCodes(result.data.backupCodes)
      }

      setSetupState("setup")
    } catch {
      setErrorMessage("Mavry couldn’t enable two-factor. Try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerify = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()
    setErrorMessage(null)
    const code = String(new FormData(event.currentTarget).get("code") ?? "")
    setIsSubmitting(true)

    try {
      const result = await authClient.twoFactor.verifyTotp({ code })

      if (result.error) {
        setErrorMessage("That code didn’t work. Try again.")
        return
      }

      resetSetup()
      setSuccess(true)
      await onChanged()
    } catch {
      setErrorMessage("That code didn’t work. Try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDisable = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()
    setErrorMessage(null)
    setSuccess(false)
    const password = String(
      new FormData(event.currentTarget).get("password") ?? ""
    )
    setIsSubmitting(true)

    try {
      const result = await authClient.twoFactor.disable({ password })

      if (result.error) {
        setErrorMessage(
          result.error.code === "INVALID_PASSWORD"
            ? "Your password is incorrect."
            : "Mavry couldn’t disable two-factor. Try again."
        )
        return
      }

      await onChanged()
    } catch {
      setErrorMessage("Mavry couldn’t disable two-factor. Try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AccountSection
      description="Require a one-time code from an authenticator app when you sign in."
      title="Two-factor authentication"
    >
      {errorMessage ? (
        <Alert className="rounded-lg" variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      {success ? (
        <Alert className="rounded-lg">
          <AlertDescription>
            Two-factor authentication is now enabled.
          </AlertDescription>
        </Alert>
      ) : null}

      {enabled ? (
        <div className="flex flex-col gap-4">
          <Alert className="rounded-lg">
            <AlertDescription>
              Two-factor authentication is enabled on this account.
            </AlertDescription>
          </Alert>
          <form
            aria-busy={isSubmitting}
            aria-label="Disable two-factor authentication"
            onSubmit={handleDisable}
          >
            <FieldGroup className="gap-3">
              <Field>
                <FieldLabel htmlFor="disable-2fa-password">Password</FieldLabel>
                <PasswordInput
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  id="disable-2fa-password"
                  name="password"
                  placeholder="Confirm with your password…"
                  required
                />
              </Field>
              <Button
                className="h-11 w-full cursor-pointer rounded-lg text-action! sm:w-auto"
                disabled={isSubmitting}
                type="submit"
                variant="outline"
              >
                {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
                Disable two-factor
              </Button>
            </FieldGroup>
          </form>
        </div>
      ) : null}

      {!enabled && setupState === "idle" ? (
        <form
          aria-busy={isSubmitting}
          aria-label="Enable two-factor authentication"
          onSubmit={handleEnable}
        >
          <FieldGroup className="gap-3">
            <Field>
              <FieldLabel htmlFor="enable-2fa-password">Password</FieldLabel>
              <PasswordInput
                autoComplete="current-password"
                disabled={isSubmitting}
                id="enable-2fa-password"
                name="password"
                placeholder="Confirm with your password…"
                required
              />
            </Field>
            <Button
              className="h-11 w-full cursor-pointer rounded-lg text-action! sm:w-auto"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
              Enable two-factor
            </Button>
          </FieldGroup>
        </form>
      ) : null}

      {!enabled && setupState === "setup" ? (
        <div className="flex flex-col gap-5">
          <p className="text-caption text-muted-foreground">
            Scan this QR code with your authenticator app, then enter the
            6-digit code it shows.
          </p>

          {totpURI ? (
            <div className="w-fit rounded-lg bg-white p-4">
              <QRCodeSVG size={176} value={totpURI} />
            </div>
          ) : null}

          {backupCodes.length > 0 ? (
            <div className="flex flex-col gap-2">
              <p className="font-medium text-small">Backup codes</p>
              <p className="text-caption text-muted-foreground">
                Save these now. Each code can be used once if you lose access to
                your authenticator.
              </p>
              <ul className="grid grid-cols-2 gap-1 font-mono text-caption">
                {backupCodes.map((code) => (
                  <li key={code}>{code}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <form
            aria-busy={isSubmitting}
            aria-label="Verify two-factor code"
            onSubmit={handleVerify}
          >
            <FieldGroup className="gap-3">
              <Field>
                <FieldLabel className="sr-only" htmlFor="enable-2fa-code">
                  Authenticator code
                </FieldLabel>
                <CodeInput id="enable-2fa-code" name="code" />
              </Field>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  className="h-11 w-full cursor-pointer rounded-lg text-action! sm:w-auto"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
                  Verify and enable
                </Button>
                <Button
                  className="h-11 w-full cursor-pointer rounded-lg text-action! sm:w-auto"
                  disabled={isSubmitting}
                  onClick={resetSetup}
                  type="button"
                  variant="ghost"
                >
                  Cancel
                </Button>
              </div>
            </FieldGroup>
          </form>
        </div>
      ) : null}
    </AccountSection>
  )
}
