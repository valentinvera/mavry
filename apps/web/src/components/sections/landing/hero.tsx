import { Button } from "@mavry/ui/components/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@mavry/ui/components/field"
import { Input } from "@mavry/ui/components/input"
import { Spinner } from "@mavry/ui/components/spinner"
import { cn } from "@mavry/ui/lib/utils"
import { useMutation } from "@tanstack/react-query"
import { type FormEvent, useState } from "react"
import { HeroDemo } from "@/components/landing/demo"
import { validateWaitlistInput, type WaitlistSubmit } from "@/lib/waitlist"
import { useTRPC } from "@/utils/trpc"

export const FOCUS_EVENT = "mavry:focus-waitlist-email"

const INPUT_ID = "hero-waitlist-email"
const STATUS_ID = "hero-waitlist-status"
const UNLOCK_DELAY = 350

type WaitlistStatus =
  | "duplicate"
  | "error"
  | "idle"
  | "submitting"
  | "success"
  | "validating"
  | "validation-error"

const BUTTON_LABELS: Record<WaitlistStatus, string> = {
  duplicate: "Already joined",
  error: "Join waitlist",
  idle: "Join waitlist",
  submitting: "Joining...",
  success: "Joined",
  validating: "Validating...",
  "validation-error": "Join waitlist",
}

const STATUS_MESSAGES: Record<WaitlistStatus, string> = {
  duplicate: "You’re already on the waitlist.",
  error: "Could not join the waitlist. Try again.",
  idle: "Early access for founders shaping a focused first release.",
  submitting: "Joining the waitlist…",
  success: "You’re on the waitlist.",
  validating: "Checking your email…",
  "validation-error": "Enter a valid email address.",
}

const focusEmail = () => {
  const input = document.getElementById(INPUT_ID)

  if (!(input instanceof HTMLInputElement)) {
    return
  }

  input.scrollIntoView({ behavior: "smooth", block: "center" })

  window.setTimeout(() => {
    input.focus({ preventScroll: true })
  }, 450)
}

export const requestEmailFocus = () => {
  const isPageScrollLocked = document.body.style.overflow === "hidden"
  const focusDelay = isPageScrollLocked ? UNLOCK_DELAY : 0

  window.dispatchEvent(new Event(FOCUS_EVENT))

  window.setTimeout(() => {
    focusEmail()
  }, focusDelay)
}

export const Hero = () => (
  <section className="relative isolate flex min-h-[calc(100svh-5rem)] flex-col items-center justify-center gap-10 pt-16 pb-8 text-center sm:scroll-mt-8 sm:gap-12 sm:pt-24 sm:pb-0 md:pt-28 lg:pt-24">
    <div className="relative flex max-w-5xl flex-col items-center gap-6 sm:gap-7">
      <div className="flex flex-col items-center gap-5">
        <h1 className="text-balance font-bold text-hero tracking-normal md:text-display xl:text-display-lg">
          Know what belongs in your first release.
        </h1>
        <p className="max-w-3xl text-large text-muted-foreground">
          Mavry helps builders capture product ideas, clarify what each feature
          proves, decide what belongs in the first version, and keep launch
          blockers visible before the backlog grows.
        </p>
      </div>
      <ConnectedWaitlistForm />
    </div>
    <div className="relative w-full max-w-7xl text-left">
      <HeroDemo />
    </div>
  </section>
)

const ConnectedWaitlistForm = () => {
  const trpc = useTRPC()
  const joinWaitlist = useMutation(trpc.waitlist.join.mutationOptions())

  return <WaitlistForm onSubmit={joinWaitlist.mutateAsync} />
}

interface WaitlistFormProps {
  onSubmit: WaitlistSubmit
}

export const WaitlistForm = ({ onSubmit }: WaitlistFormProps) => {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<WaitlistStatus>("idle")

  const isError = status === "error"
  const isValidationError = status === "validation-error"
  const isPending = status === "submitting" || status === "validating"
  const isComplete = status === "duplicate" || status === "success"
  const isInputDisabled = isPending || isComplete

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isInputDisabled) {
      return
    }

    setStatus("validating")

    const validationResult = await validateWaitlistInput(email)

    if (!validationResult.success) {
      setStatus("validation-error")
      return
    }

    setStatus("submitting")

    try {
      const result = await onSubmit(validationResult.data)
      setStatus(result.status === "already_joined" ? "duplicate" : "success")
    } catch {
      setStatus("error")
    }
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)

    if (isError || isValidationError) {
      setStatus("idle")
    }
  }

  return (
    <form
      aria-busy={isPending}
      aria-label="Join the Mavry waitlist"
      className="w-full max-w-md"
      noValidate
      onSubmit={handleSubmit}
    >
      <FieldGroup className="gap-2">
        <Field
          data-disabled={isInputDisabled || undefined}
          data-invalid={isValidationError || undefined}
        >
          <FieldLabel className="sr-only" htmlFor={INPUT_ID}>
            Email
          </FieldLabel>
          <div className="flex min-w-0 items-center justify-center gap-2">
            <Input
              aria-describedby={STATUS_ID}
              aria-invalid={isValidationError || undefined}
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              className="h-8 min-w-0 flex-1 rounded-md bg-background/70 text-small sm:w-60 sm:flex-none"
              disabled={isInputDisabled}
              id={INPUT_ID}
              inputMode="email"
              name="email"
              onChange={(event) => handleEmailChange(event.target.value)}
              placeholder="builder@example.com"
              required
              spellCheck={false}
              type="email"
              value={email}
            />
            <Button
              className="h-8 min-w-24 rounded-md text-small"
              disabled={isInputDisabled}
              size="sm"
              type="submit"
            >
              {isPending ? (
                <Spinner aria-hidden="true" data-icon="inline-start" />
              ) : null}
              {BUTTON_LABELS[status]}
            </Button>
          </div>
          <div
            aria-atomic="true"
            aria-live="polite"
            className="min-h-5"
            id={STATUS_ID}
          >
            {isError || isValidationError ? (
              <FieldError className="text-center">
                {STATUS_MESSAGES[status]}
              </FieldError>
            ) : (
              <FieldDescription
                className={cn(
                  "text-center",
                  isComplete && "text-success-foreground"
                )}
              >
                {STATUS_MESSAGES[status]}
              </FieldDescription>
            )}
          </div>
        </Field>
      </FieldGroup>
    </form>
  )
}
