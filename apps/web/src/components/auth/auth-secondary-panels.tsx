import { Alert, AlertDescription } from "@mavry/ui/components/alert"
import { Button } from "@mavry/ui/components/button"
import { Field, FieldGroup, FieldLabel } from "@mavry/ui/components/field"
import { Input } from "@mavry/ui/components/input"
import { CheckCircle2Icon } from "lucide-react"
import { type FormEvent, useState } from "react"

import { CloudflareCaptcha, CodeInput } from "@/components/auth/auth-methods"

const TEXT_INPUT_CLASS =
  "h-12 rounded-lg border-border/80 bg-background/70 px-4 text-control! focus-visible:bg-background"

interface PanelProps {
  onBack: () => void
}

export const EmailCodePanel = ({ onBack }: PanelProps) => {
  const [step, setStep] = useState<"code" | "email">("email")
  const [email, setEmail] = useState("")

  const handlePreventSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
  }

  const handleUseDifferentEmail = (): void => {
    setStep("email")
  }

  const handleSend = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setEmail(String(formData.get("email") ?? ""))
    setStep("code")
  }

  if (step === "code") {
    return (
      <form
        aria-label="Verify sign-in code"
        className="mt-7 w-full"
        onSubmit={handlePreventSubmit}
      >
        <FieldGroup className="gap-4">
          <p className="text-pretty text-control text-muted-foreground">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-foreground">{email}</span>.
          </p>
          <Field>
            <FieldLabel className="sr-only" htmlFor="signin-code">
              Sign-in code
            </FieldLabel>
            <CodeInput id="signin-code" name="code" />
          </Field>
          <Button
            className="h-12 w-full cursor-pointer rounded-lg text-action!"
            type="submit"
          >
            Verify code
          </Button>
          <Button
            className="h-10 w-full cursor-pointer rounded-lg text-action!"
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
      aria-label="Email me a sign-in code"
      className="mt-7 w-full"
      onSubmit={handleSend}
    >
      <FieldGroup className="gap-4">
        <p className="text-pretty text-control text-muted-foreground">
          We’ll email you a 6-digit code.
        </p>
        <Field>
          <FieldLabel className="sr-only" htmlFor="signin-code-email">
            Email
          </FieldLabel>
          <Input
            autoCapitalize="none"
            autoComplete="email"
            className={TEXT_INPUT_CLASS}
            id="signin-code-email"
            inputMode="email"
            name="email"
            placeholder="you@example.com…"
            required
            spellCheck={false}
            type="email"
          />
        </Field>
        <CloudflareCaptcha />
        <Button
          className="h-12 w-full cursor-pointer rounded-lg text-action!"
          type="submit"
        >
          Send code
        </Button>
        <Button
          className="h-10 w-full cursor-pointer rounded-lg text-action!"
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
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState("")

  const handleSend = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setEmail(String(formData.get("email") ?? ""))
    setSent(true)
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
      aria-label="Email me a magic link"
      className="mt-7 w-full"
      onSubmit={handleSend}
    >
      <FieldGroup className="gap-4">
        <p className="text-pretty text-control text-muted-foreground">
          We’ll email you a secure link that signs you in.
        </p>
        <Field>
          <FieldLabel className="sr-only" htmlFor="magic-link-email">
            Email
          </FieldLabel>
          <Input
            autoCapitalize="none"
            autoComplete="email"
            className={TEXT_INPUT_CLASS}
            id="magic-link-email"
            inputMode="email"
            name="email"
            placeholder="you@example.com…"
            required
            spellCheck={false}
            type="email"
          />
        </Field>
        <CloudflareCaptcha />
        <Button
          className="h-12 w-full cursor-pointer rounded-lg text-action!"
          type="submit"
        >
          Send magic link
        </Button>
        <Button
          className="h-10 w-full cursor-pointer rounded-lg text-action!"
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

export const PhonePanel = ({ onBack }: PanelProps) => {
  const [step, setStep] = useState<"code" | "phone">("phone")
  const [phone, setPhone] = useState("")

  const handlePreventSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
  }

  const handleUseDifferentNumber = (): void => {
    setStep("phone")
  }

  const handleSend = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setPhone(String(formData.get("phone") ?? ""))
    setStep("code")
  }

  if (step === "code") {
    return (
      <form
        aria-label="Verify phone code"
        className="mt-7 w-full"
        onSubmit={handlePreventSubmit}
      >
        <FieldGroup className="gap-4">
          <p className="text-pretty text-control text-muted-foreground">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-foreground">{phone}</span>.
          </p>
          <Field>
            <FieldLabel className="sr-only" htmlFor="phone-code">
              SMS code
            </FieldLabel>
            <CodeInput id="phone-code" name="code" />
          </Field>
          <Button
            className="h-12 w-full cursor-pointer rounded-lg text-action!"
            type="submit"
          >
            Verify code
          </Button>
          <Button
            className="h-10 w-full cursor-pointer rounded-lg text-action!"
            onClick={handleUseDifferentNumber}
            type="button"
            variant="ghost"
          >
            Use a different number
          </Button>
        </FieldGroup>
      </form>
    )
  }

  return (
    <form
      aria-label="Continue with phone"
      className="mt-7 w-full"
      onSubmit={handleSend}
    >
      <FieldGroup className="gap-4">
        <p className="text-pretty text-control text-muted-foreground">
          We’ll text you a 6-digit sign-in code.
        </p>
        <Field>
          <FieldLabel className="sr-only" htmlFor="phone-number">
            Phone number
          </FieldLabel>
          <Input
            autoComplete="tel"
            className={TEXT_INPUT_CLASS}
            id="phone-number"
            inputMode="tel"
            name="phone"
            placeholder="+1 555 000 0000…"
            required
            type="tel"
          />
        </Field>
        <CloudflareCaptcha />
        <Button
          className="h-12 w-full cursor-pointer rounded-lg text-action!"
          type="submit"
        >
          Send code
        </Button>
        <Button
          className="h-10 w-full cursor-pointer rounded-lg text-action!"
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
