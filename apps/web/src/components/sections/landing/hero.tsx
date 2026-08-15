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
import { useMutation, useQuery } from "@tanstack/react-query"
import { type FormEvent, useEffect, useRef, useState } from "react"
import { HeroDemo } from "@/components/landing/demo"
import {
  getWaitlistConfirmedCountQueryOptions,
  validateWaitlistInput,
  type WaitlistSubmit,
} from "@/lib/waitlist"
import { useTRPC } from "@/utils/trpc"

export const FOCUS_EVENT = "mavry:focus-waitlist-email"

const INPUT_ID = "hero-waitlist-email"
const STATUS_ID = "hero-waitlist-status"
const SUCCESS_RESET_DELAY = 2000
const UNLOCK_DELAY = 350

type WaitlistStatus =
  | "error"
  | "idle"
  | "submitting"
  | "success"
  | "validation-error"

const BUTTON_LABELS: Record<WaitlistStatus, string> = {
  error: "Join waitlist",
  idle: "Join waitlist",
  submitting: "Joining...",
  success: "Joined",
  "validation-error": "Join waitlist",
}

const COUNT_UNAVAILABLE_DESCRIPTION =
  "Join founders shaping focused first releases."
const CONFIRMATION_PENDING_MESSAGE =
  "Confirmation email sent. Check your inbox to confirm your email."
const SUBMISSION_ERROR_MESSAGE = "Could not join the waitlist. Try again."
const VALIDATION_ERROR_MESSAGE = "Enter a valid email address."

const founderCountFormatter = new Intl.NumberFormat("en-US")

const getFounderCountDescription = (confirmedCount?: number): string => {
  if (!confirmedCount) {
    return COUNT_UNAVAILABLE_DESCRIPTION
  }

  if (confirmedCount === 1) {
    return "Join 1 founder shaping a focused first release."
  }

  return `Join ${founderCountFormatter.format(confirmedCount)} founders shaping focused first releases.`
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
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-1/2 top-[44%] -z-10 h-[62%] w-screen -translate-x-1/2 sm:top-[38%]"
      style={{
        background:
          "radial-gradient(ellipse 86% 42% at 50% 24%, color-mix(in oklch, var(--foreground) 18%, transparent) 0%, color-mix(in oklch, var(--muted) 35%, transparent) 42%, transparent 78%), radial-gradient(ellipse 90% 48% at 50% 78%, color-mix(in oklch, var(--foreground) 20%, transparent) 0%, color-mix(in oklch, var(--muted) 42%, transparent) 38%, transparent 76%), linear-gradient(180deg, transparent 0%, color-mix(in oklch, var(--foreground) 6%, transparent) 28%, color-mix(in oklch, var(--muted) 18%, transparent) 72%, var(--background) 100%)",
        maskImage:
          "linear-gradient(180deg, transparent 0%, black 10%, black 84%, transparent 100%)",
      }}
    />
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-1/2 -bottom-16 -z-10 h-[40%] w-screen -translate-x-1/2"
      style={{
        background:
          "linear-gradient(180deg, transparent 0%, color-mix(in oklch, var(--foreground) 9%, transparent) 42%, color-mix(in oklch, var(--muted) 36%, transparent) 100%)",
        maskImage:
          "radial-gradient(ellipse 78% 106% at 50% 52%, black 0%, black 38%, transparent 86%)",
      }}
    />
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
  const confirmedCount = useQuery(getWaitlistConfirmedCountQueryOptions(trpc))
  const joinWaitlist = useMutation(trpc.waitlist.join.mutationOptions())

  return (
    <WaitlistForm
      confirmedCount={confirmedCount.data?.count}
      onSubmit={joinWaitlist.mutateAsync}
    />
  )
}

interface WaitlistFormProps {
  confirmedCount?: number
  onSubmit: WaitlistSubmit
}

export const WaitlistForm = ({
  confirmedCount,
  onSubmit,
}: WaitlistFormProps) => {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<WaitlistStatus>("idle")
  const successResetTimeout = useRef<number | null>(null)

  const isError = status === "error"
  const isValidationError = status === "validation-error"
  const isPending = status === "submitting"
  const isSuccess = status === "success"
  const isInputDisabled = isPending || isSuccess

  useEffect(
    () => () => {
      if (successResetTimeout.current !== null) {
        window.clearTimeout(successResetTimeout.current)
      }
    },
    []
  )

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isInputDisabled) {
      return
    }

    const validationResult = validateWaitlistInput(email)

    if (!validationResult.success) {
      setStatus("validation-error")
      return
    }

    setStatus("submitting")

    try {
      await onSubmit(validationResult.data)
      setEmail(validationResult.data.email)
      setStatus("success")

      successResetTimeout.current = window.setTimeout(() => {
        setEmail("")
        setStatus("idle")
        successResetTimeout.current = null
      }, SUCCESS_RESET_DELAY)
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
              data-waitlist-email
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
            className="flex min-h-5 flex-col items-center"
            id={STATUS_ID}
          >
            {isSuccess ? (
              <span className="sr-only">{CONFIRMATION_PENDING_MESSAGE}</span>
            ) : null}
            {isError || isValidationError ? (
              <FieldError className="text-center">
                {isValidationError
                  ? VALIDATION_ERROR_MESSAGE
                  : SUBMISSION_ERROR_MESSAGE}
              </FieldError>
            ) : (
              <FieldDescription className="text-center">
                {getFounderCountDescription(confirmedCount)}
              </FieldDescription>
            )}
          </div>
        </Field>
      </FieldGroup>
    </form>
  )
}
