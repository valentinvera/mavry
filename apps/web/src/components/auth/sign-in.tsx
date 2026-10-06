import { Button } from "@mavry/ui/components/button"
import { Field, FieldGroup, FieldLabel } from "@mavry/ui/components/field"
import { Input } from "@mavry/ui/components/input"
import { Spinner } from "@mavry/ui/components/spinner"
import { GithubIcon } from "@mavry/ui/icons/github"
import { GoogleIcon } from "@mavry/ui/icons/google"
import { Link, useNavigate } from "@tanstack/react-router"
import { type FormEvent, useCallback, useState } from "react"
import {
  AuthErrorSummary,
  AuthFieldError,
} from "@/components/auth/auth-form-error"
import { PasswordInput } from "@/components/auth/password-input"
import { MavrySymbol } from "@/components/brand/mavry-symbol"
import { authClient } from "@/lib/auth-client"
import { type AuthErrorDetails, getAuthError } from "@/lib/auth-errors"

interface SignInProps {
  initialErrorCode?: string
}

type SocialProvider = "github" | "google"

const getSocialErrorCallbackUrl = (): string =>
  new URL(
    "/sign-in?error=SOCIAL_SIGN_IN_FAILED",
    window.location.origin
  ).toString()

export const SignIn = ({ initialErrorCode }: SignInProps) => {
  const navigate = useNavigate()
  const [authError, setAuthError] = useState<AuthErrorDetails | null>(() =>
    initialErrorCode
      ? {
          message: "Mavry couldn’t complete that social login. Try again.",
          target: "form",
        }
      : null
  )
  const [isEmailFormVisible, setIsEmailFormVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pendingSocialProvider, setPendingSocialProvider] =
    useState<SocialProvider | null>(null)
  const isFormBusy = isSubmitting || pendingSocialProvider !== null

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()
    setAuthError(null)

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get("email") ?? "")
    const password = String(formData.get("password") ?? "")

    setIsSubmitting(true)

    try {
      const { error } = await authClient.signIn.email({ email, password })

      if (error) {
        setAuthError(
          getAuthError(
            error,
            "Mavry couldn’t log you in. Check your details and try again.",
            "credentials"
          )
        )
        return
      }

      await navigate({ to: "/" })
    } catch {
      setAuthError({
        message: "Mavry couldn’t reach the server. Try again.",
        target: "form",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSocialSignIn = useCallback(
    async (provider: SocialProvider): Promise<void> => {
      setAuthError(null)
      setPendingSocialProvider(provider)

      try {
        const { error } = await authClient.signIn.social({
          callbackURL: window.location.origin,
          errorCallbackURL: getSocialErrorCallbackUrl(),
          provider,
        })

        if (error) {
          setAuthError(
            getAuthError(
              error,
              `Mavry couldn’t continue with ${provider === "google" ? "Google" : "GitHub"}. Try again.`
            )
          )
        }
      } catch {
        setAuthError({
          message: "Mavry couldn’t reach the server. Try again.",
          target: "form",
        })
      } finally {
        setPendingSocialProvider(null)
      }
    },
    []
  )

  const handleGoogleSignIn = useCallback(async (): Promise<void> => {
    await handleSocialSignIn("google")
  }, [handleSocialSignIn])

  const handleGithubSignIn = useCallback(async (): Promise<void> => {
    await handleSocialSignIn("github")
  }, [handleSocialSignIn])

  const handleInputChange = useCallback((): void => {
    setAuthError(null)
  }, [])

  const handleEmailBack = (): void => {
    setAuthError(null)
    setIsEmailFormVisible(false)
  }

  const handleEmailStart = (): void => {
    setAuthError(null)
    setIsEmailFormVisible(true)
  }

  const emailHasError =
    authError?.target === "email" || authError?.target === "credentials"
  const passwordHasError =
    authError?.target === "password" || authError?.target === "credentials"

  return (
    <div className="mx-auto flex w-full flex-col items-center text-center">
      <Link
        aria-label="Mavry home"
        className="inline-flex cursor-pointer rounded-md"
        to="/"
      >
        <MavrySymbol className="size-12" />
      </Link>
      <h1 className="mt-7 text-balance font-medium text-section">
        Log in to Mavry
      </h1>
      <p className="mt-2 max-w-xs text-pretty text-muted-foreground text-small leading-relaxed">
        Return to your private workspace and continue where you left off.
      </p>

      {isEmailFormVisible ? (
        <form
          aria-label="Log in"
          className="mt-7 w-full"
          onSubmit={handleSubmit}
        >
          <FieldGroup className="gap-4">
            <AuthErrorSummary error={authError} title="Couldn’t log in" />

            <Field data-invalid={emailHasError || undefined}>
              <FieldLabel className="sr-only" htmlFor="email">
                Email
              </FieldLabel>
              <Input
                aria-invalid={emailHasError || undefined}
                autoCapitalize="none"
                autoComplete="email"
                className="h-12 rounded-full border-border/80 bg-card/70 px-5 text-small shadow-sm focus-visible:bg-card"
                disabled={isFormBusy}
                id="email"
                inputMode="email"
                invalidAppearance="message-only"
                name="email"
                onChange={handleInputChange}
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
                autoComplete="current-password"
                className="px-5 text-small"
                disabled={isFormBusy}
                id="password"
                minLength={8}
                name="password"
                onChange={handleInputChange}
                placeholder="Enter your password…"
                required
              />
              <div className="flex min-h-5 items-start justify-between gap-3 px-1">
                <AuthFieldError
                  error={authError}
                  targets={["credentials", "password"]}
                />
                <Link
                  className="ml-auto shrink-0 cursor-pointer text-caption text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  to="/forgot-password"
                >
                  Forgot your password?
                </Link>
              </div>
            </Field>

            <Field>
              <Button
                className="h-12 w-full cursor-pointer rounded-full text-small shadow-sm"
                disabled={isFormBusy}
                type="submit"
              >
                {isFormBusy ? <Spinner data-icon="inline-start" /> : null}
                {isSubmitting ? "Logging in…" : "Log in"}
              </Button>
            </Field>

            <Field>
              <Button
                className="h-10 w-full cursor-pointer rounded-full"
                disabled={isFormBusy}
                onClick={handleEmailBack}
                type="button"
                variant="ghost"
              >
                Back to all options
              </Button>
            </Field>
          </FieldGroup>
        </form>
      ) : (
        <fieldset
          aria-label="Authentication methods"
          className="mt-7 flex w-full flex-col gap-4"
        >
          <AuthErrorSummary error={authError} title="Couldn’t log in" />
          <Button
            className="h-12 w-full cursor-pointer rounded-full text-small shadow-sm"
            disabled={isFormBusy}
            onClick={handleGoogleSignIn}
            type="button"
          >
            {pendingSocialProvider === "google" ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <GoogleIcon aria-hidden="true" data-icon="inline-start" />
            )}
            {pendingSocialProvider === "google"
              ? "Opening Google…"
              : "Continue with Google"}
          </Button>
          <Button
            className="h-12 w-full cursor-pointer rounded-full text-small disabled:opacity-100"
            disabled={isFormBusy}
            onClick={handleEmailStart}
            type="button"
          >
            Continue with email
          </Button>
          <Button
            className="h-12 w-full cursor-pointer rounded-full text-small"
            disabled={isFormBusy}
            onClick={handleGithubSignIn}
            type="button"
          >
            {pendingSocialProvider === "github" ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <GithubIcon aria-hidden="true" data-icon="inline-start" />
            )}
            {pendingSocialProvider === "github"
              ? "Opening GitHub…"
              : "Continue with GitHub"}
          </Button>
        </fieldset>
      )}

      <p className="mt-8 text-center text-caption text-muted-foreground">
        New to Mavry?{" "}
        <Link
          className="cursor-pointer font-medium text-foreground underline-offset-4 hover:underline"
          search={{ error: undefined }}
          to="/sign-up"
        >
          Create an account
        </Link>
      </p>
    </div>
  )
}
