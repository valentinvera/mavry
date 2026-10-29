import { env } from "@mavry/env/web"
import { Alert, AlertDescription } from "@mavry/ui/components/alert"
import { Button } from "@mavry/ui/components/button"
import { Field, FieldGroup, FieldLabel } from "@mavry/ui/components/field"
import { Input } from "@mavry/ui/components/input"
import { Spinner } from "@mavry/ui/components/spinner"
import { useNavigate } from "@tanstack/react-router"
import { type FormEvent, useState } from "react"
import { authClient } from "@/lib/auth-client"

const TEXT_INPUT_CLASS =
  "h-12 rounded-lg border-border/80 bg-background/70 px-4 text-control! focus-visible:bg-background"

interface PasskeySignupPanelProps {
  onBack: () => void
}

interface PasskeySignupContextResponse {
  context?: string
  message?: string
}

export const PasskeySignupPanel = ({ onBack }: PasskeySignupPanelProps) => {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()
    setErrorMessage(null)

    const formData = new FormData(event.currentTarget)
    const name = String(formData.get("name") ?? "").trim()
    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase()
    setIsSubmitting(true)

    try {
      const response = await fetch(
        `${env.VITE_API_URL}/api/users/passkey-signup-context`,
        {
          body: JSON.stringify({ email, name }),
          credentials: "include",
          headers: { "content-type": "application/json" },
          method: "POST",
        }
      )
      const body = (await response
        .json()
        .catch(() => null)) as PasskeySignupContextResponse | null

      if (!(response.ok && body?.context)) {
        setErrorMessage(
          body?.message ?? "Mavry couldn’t start passkey sign-up. Try again."
        )
        return
      }

      const result = await authClient.passkey.addPasskey({
        context: body.context,
        createSession: true,
        name,
      })

      if (result.error) {
        setErrorMessage(
          result.error.message ??
            "Mavry couldn’t create your passkey. Try again."
        )
        return
      }

      await navigate({ to: "/account" })
    } catch {
      setErrorMessage(
        "Mavry couldn’t create your passkey. This device may not support passkeys."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      aria-busy={isSubmitting}
      aria-label="Create account with a passkey"
      className="mt-7 w-full"
      onSubmit={handleSubmit}
    >
      <FieldGroup className="gap-4">
        {errorMessage ? (
          <Alert className="rounded-lg" variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        <p className="text-pretty text-control text-muted-foreground">
          Create your account with a passkey. No password required.
        </p>

        <Field>
          <FieldLabel className="sr-only" htmlFor="passkey-signup-name">
            Name
          </FieldLabel>
          <Input
            autoComplete="name"
            className={TEXT_INPUT_CLASS}
            disabled={isSubmitting}
            id="passkey-signup-name"
            maxLength={100}
            name="name"
            placeholder="Your name…"
            required
          />
        </Field>

        <Field>
          <FieldLabel className="sr-only" htmlFor="passkey-signup-email">
            Email
          </FieldLabel>
          <Input
            autoCapitalize="none"
            autoComplete="email"
            className={TEXT_INPUT_CLASS}
            disabled={isSubmitting}
            id="passkey-signup-email"
            inputMode="email"
            name="email"
            placeholder="you@example.com…"
            required
            spellCheck={false}
            type="email"
          />
        </Field>

        <Button
          className="h-12 w-full cursor-pointer rounded-lg text-action!"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
          Create account with passkey
        </Button>

        <Button
          className="h-10 w-full cursor-pointer rounded-lg text-action!"
          disabled={isSubmitting}
          onClick={onBack}
          type="button"
          variant="ghost"
        >
          Back to all options
        </Button>
      </FieldGroup>
    </form>
  )
}
