import { Button } from "@mavry/ui/components/button"
import { Field, FieldGroup, FieldLabel } from "@mavry/ui/components/field"
import { Input } from "@mavry/ui/components/input"
import { Spinner } from "@mavry/ui/components/spinner"
import { Link } from "@tanstack/react-router"
import type { FormEvent } from "react"
import {
  AuthErrorSummary,
  AuthFieldError,
} from "@/components/auth/auth-form-error"
import { CloudflareCaptcha } from "@/components/auth/auth-methods"
import { PasswordInput } from "@/components/auth/password-input"
import type { AuthErrorDetails } from "@/lib/auth-errors"

type AuthMode = "sign-in" | "sign-up"

const TEXT_INPUT_CLASS =
  "h-12 rounded-lg border-border/80 bg-background/70 px-4 text-control! focus-visible:bg-background"

interface AuthCredentialsFormProps {
  authError: AuthErrorDetails | null
  errorTitle: string
  isBusy: boolean
  isSubmitting: boolean
  mode: AuthMode
  onBack: () => void
  onInputChange: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export const AuthCredentialsForm = ({
  authError,
  errorTitle,
  isBusy,
  isSubmitting,
  mode,
  onBack,
  onInputChange,
  onSubmit,
}: AuthCredentialsFormProps) => {
  const isSignIn = mode === "sign-in"
  const emailHasError =
    authError?.target === "email" ||
    (isSignIn && authError?.target === "credentials")
  const passwordHasError =
    authError?.target === "password" ||
    (isSignIn && authError?.target === "credentials")
  const submitLabel = isSignIn ? "Log in" : "Create account"
  const busyLabel = isSignIn ? "Logging in…" : "Creating account…"

  return (
    <form
      aria-busy={isBusy}
      aria-label={isSignIn ? "Log in" : "Create account"}
      className="mt-7 w-full"
      onSubmit={onSubmit}
    >
      <FieldGroup className="gap-4">
        <AuthErrorSummary error={authError} title={errorTitle} />

        {isSignIn ? null : (
          <Field>
            <FieldLabel className="sr-only" htmlFor="name">
              Name
            </FieldLabel>
            <Input
              autoComplete="name"
              className={TEXT_INPUT_CLASS}
              disabled={isBusy}
              id="name"
              maxLength={100}
              name="name"
              onChange={onInputChange}
              placeholder="Your name…"
              required
            />
          </Field>
        )}

        <Field data-invalid={emailHasError || undefined}>
          <FieldLabel className="sr-only" htmlFor="email">
            Email
          </FieldLabel>
          <Input
            aria-invalid={emailHasError || undefined}
            autoCapitalize="none"
            autoComplete="email"
            className={TEXT_INPUT_CLASS}
            disabled={isBusy}
            id="email"
            inputMode="email"
            invalidAppearance="message-only"
            name="email"
            onChange={onInputChange}
            placeholder="you@example.com…"
            required
            spellCheck={false}
            type="email"
          />
          <AuthFieldError error={authError} targets={["email"]} />
        </Field>

        <Field data-invalid={passwordHasError || undefined}>
          <FieldLabel className="sr-only" htmlFor="password">
            Password
          </FieldLabel>
          <PasswordInput
            aria-invalid={passwordHasError || undefined}
            autoComplete={isSignIn ? "current-password" : "new-password"}
            className="px-4 text-control!"
            disabled={isBusy}
            id="password"
            minLength={8}
            name="password"
            onChange={onInputChange}
            placeholder={
              isSignIn ? "Enter your password…" : "At least 8 characters…"
            }
            required
          />
          {isSignIn ? (
            <div className="flex min-h-5 items-start justify-between gap-3 px-1">
              <AuthFieldError
                error={authError}
                targets={["credentials", "password"]}
              />
              <Link
                className="ml-auto shrink-0 cursor-pointer text-muted-foreground text-small underline-offset-4 transition-colors hover:text-foreground hover:underline"
                to="/forgot-password"
              >
                Forgot your password?
              </Link>
            </div>
          ) : (
            <AuthFieldError error={authError} targets={["password"]} />
          )}
        </Field>

        <CloudflareCaptcha />

        <Field>
          <Button
            className="h-12 w-full cursor-pointer rounded-lg text-action!"
            disabled={isBusy}
            type="submit"
          >
            {isBusy ? <Spinner data-icon="inline-start" /> : null}
            {/* biome-ignore lint/suspicious/noLeakedRender: submit labels resolve to strings. */}
            {isSubmitting ? busyLabel : submitLabel}
          </Button>
        </Field>

        <Field>
          <Button
            className="h-10 w-full cursor-pointer rounded-lg text-action!"
            disabled={isBusy}
            onClick={onBack}
            type="button"
            variant="ghost"
          >
            Back to all options
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
