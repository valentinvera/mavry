import { Alert, AlertDescription } from "@mavry/ui/components/alert"
import { Button } from "@mavry/ui/components/button"
import { Field, FieldGroup, FieldLabel } from "@mavry/ui/components/field"
import { Input } from "@mavry/ui/components/input"
import { Spinner } from "@mavry/ui/components/spinner"
import { useNavigate } from "@tanstack/react-router"
import { CheckCircle2Icon } from "lucide-react"
import { type FormEvent, useCallback, useState } from "react"

import {
  AuthErrorSummary,
  AuthFieldError,
} from "@/components/auth/auth-form-error"
import { CloudflareCaptcha, CodeInput } from "@/components/auth/auth-methods"
import { useAuthErrorFocus } from "@/components/auth/use-auth-error-focus"
import { authClient, captchaHeaders, isCaptchaEnabled } from "@/lib/auth-client"
import { type AuthErrorDetails, getAuthError } from "@/lib/auth-errors"

const TEXT_INPUT_CLASS =
  "h-12 rounded-lg border-border/80 bg-background/70 px-4 text-control! focus-visible:bg-background"

interface PanelProps {
  onBack: () => void
}

const getFormValue = (formData: FormData, key: string): string =>
  String(formData.get(key) ?? "").trim()

export const EmailCodePanel = ({ onBack }: PanelProps) => {
  const navigate = useNavigate()
  const [authError, setAuthError] = useState<AuthErrorDetails | null>(null)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState<"code" | "email">("email")
  const [captchaResetKey, setCaptchaResetKey] = useState(0)
  const [captchaReady, setCaptchaReady] = useState(!isCaptchaEnabled)

  useAuthErrorFocus(authError)

  const handleInputChange = useCallback((): void => {
    setAuthError(null)
  }, [])

  const handleUseDifferentEmail = useCallback((): void => {
    setAuthError(null)
    setStep("email")
  }, [])

  const handleSend = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()
    setAuthError(null)
    const formData = new FormData(event.currentTarget)
    const nextEmail = getFormValue(formData, "email")
    const captchaToken = getFormValue(formData, "captchaToken")
    setCaptchaResetKey((key) => key + 1)
    setIsSubmitting(true)

    try {
      const result = await authClient.emailOtp.sendVerificationOtp(
        {
          email: nextEmail,
          type: "sign-in",
        },
        captchaHeaders(captchaToken)
      )

      if (result.error) {
        setAuthError(
          getAuthError(
            result.error,
            "Mavry couldn’t send the code. Try again.",
            "email"
          )
        )
        return
      }

      setEmail(nextEmail)
      setStep("code")
    } catch {
      setAuthError({
        message: "Mavry couldn’t send the code. Try again.",
        target: "form",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerify = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()
    setAuthError(null)
    const otp = getFormValue(new FormData(event.currentTarget), "code")
    setIsSubmitting(true)

    try {
      const result = await authClient.signIn.emailOtp({ email, otp })

      if (result.error) {
        setAuthError(
          getAuthError(result.error, "That code didn’t work. Try again.", "otp")
        )
        return
      }

      await navigate({ to: "/account" })
    } catch {
      setAuthError({
        message: "That code didn’t work. Try again.",
        target: "form",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (step === "code") {
    return (
      <form
        aria-busy={isSubmitting}
        aria-label="Verify sign-in code"
        className="mt-7 w-full"
        onSubmit={handleVerify}
      >
        <FieldGroup className="gap-4">
          <AuthErrorSummary
            error={authError}
            title="Couldn’t verify the code"
          />
          <p className="text-pretty text-control text-muted-foreground">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-foreground">{email}</span>.
          </p>
          <Field data-invalid={authError?.target === "otp" || undefined}>
            <FieldLabel className="sr-only" htmlFor="signin-code">
              Sign-in code
            </FieldLabel>
            <CodeInput id="signin-code" name="code" />
            <AuthFieldError error={authError} targets={["otp"]} />
          </Field>
          <Button
            className="h-12 w-full cursor-pointer rounded-lg text-action!"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
            Verify code
          </Button>
          <Button
            className="h-10 w-full cursor-pointer rounded-lg text-action!"
            disabled={isSubmitting}
            onClick={handleUseDifferentEmail}
            type="button"
            variant="ghost"
          >
            Use a different email
          </Button>
        </FieldGroup>
      </form>
    )
  }

  return (
    <form
      aria-busy={isSubmitting}
      aria-label="Email me a sign-in code"
      className="mt-7 w-full"
      onSubmit={handleSend}
    >
      <FieldGroup className="gap-4">
        <AuthErrorSummary error={authError} title="Couldn’t send the code" />
        <p className="text-pretty text-control text-muted-foreground">
          We’ll email you a 6-digit code.
        </p>
        <Field data-invalid={authError?.target === "email" || undefined}>
          <FieldLabel className="sr-only" htmlFor="signin-code-email">
            Email
          </FieldLabel>
          <Input
            aria-invalid={authError?.target === "email" || undefined}
            autoCapitalize="none"
            autoComplete="email"
            className={TEXT_INPUT_CLASS}
            disabled={isSubmitting}
            id="signin-code-email"
            inputMode="email"
            name="email"
            onChange={handleInputChange}
            placeholder="you@example.com…"
            required
            spellCheck={false}
            type="email"
          />
          <AuthFieldError error={authError} targets={["email"]} />
        </Field>
        <CloudflareCaptcha
          key={captchaResetKey}
          onReadyChange={setCaptchaReady}
        />
        <Button
          className="h-12 w-full cursor-pointer rounded-lg text-action!"
          disabled={isSubmitting || !captchaReady}
          type="submit"
        >
          {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
          Send code
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

export const MagicLinkPanel = ({ onBack }: PanelProps) => {
  const [authError, setAuthError] = useState<AuthErrorDetails | null>(null)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [captchaResetKey, setCaptchaResetKey] = useState(0)
  const [captchaReady, setCaptchaReady] = useState(!isCaptchaEnabled)

  useAuthErrorFocus(authError)

  const handleInputChange = useCallback((): void => {
    setAuthError(null)
  }, [])

  const handleSend = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()
    setAuthError(null)
    const formData = new FormData(event.currentTarget)
    const nextEmail = getFormValue(formData, "email")
    const captchaToken = getFormValue(formData, "captchaToken")
    setCaptchaResetKey((key) => key + 1)
    setIsSubmitting(true)

    try {
      const { origin } = window.location
      const result = await authClient.signIn.magicLink(
        {
          callbackURL: `${origin}/account`,
          email: nextEmail,
          errorCallbackURL: `${origin}/sign-in`,
        },
        captchaHeaders(captchaToken)
      )

      if (result.error) {
        setAuthError(
          getAuthError(
            result.error,
            "Mavry couldn’t send the magic link. Try again.",
            "email"
          )
        )
        return
      }

      setEmail(nextEmail)
      setSent(true)
    } catch {
      setAuthError({
        message: "Mavry couldn’t send the magic link. Try again.",
        target: "form",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (sent) {
    return (
      <div className="mt-7 flex w-full flex-col gap-5">
        <Alert className="rounded-lg text-left">
          <CheckCircle2Icon aria-hidden="true" />
          <AlertDescription>
            If an account exists for {email}, a magic link is on its way.
          </AlertDescription>
        </Alert>
        <Button
          className="h-12 w-full cursor-pointer rounded-lg text-action!"
          onClick={onBack}
          type="button"
          variant="ghost"
        >
          Back to all options
        </Button>
      </div>
    )
  }

  return (
    <form
      aria-busy={isSubmitting}
      aria-label="Email me a magic link"
      className="mt-7 w-full"
      onSubmit={handleSend}
    >
      <FieldGroup className="gap-4">
        <AuthErrorSummary
          error={authError}
          title="Couldn’t send the magic link"
        />
        <p className="text-pretty text-control text-muted-foreground">
          We’ll email you a secure link that signs you in.
        </p>
        <Field data-invalid={authError?.target === "email" || undefined}>
          <FieldLabel className="sr-only" htmlFor="magic-link-email">
            Email
          </FieldLabel>
          <Input
            aria-invalid={authError?.target === "email" || undefined}
            autoCapitalize="none"
            autoComplete="email"
            className={TEXT_INPUT_CLASS}
            disabled={isSubmitting}
            id="magic-link-email"
            inputMode="email"
            name="email"
            onChange={handleInputChange}
            placeholder="you@example.com…"
            required
            spellCheck={false}
            type="email"
          />
          <AuthFieldError error={authError} targets={["email"]} />
        </Field>
        <CloudflareCaptcha
          key={captchaResetKey}
          onReadyChange={setCaptchaReady}
        />
        <Button
          className="h-12 w-full cursor-pointer rounded-lg text-action!"
          disabled={isSubmitting || !captchaReady}
          type="submit"
        >
          {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
          Send magic link
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
