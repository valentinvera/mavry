import { Alert, AlertDescription } from "@mavry/ui/components/alert"
import { Button } from "@mavry/ui/components/button"
import { Field, FieldGroup, FieldLabel } from "@mavry/ui/components/field"
import { Input } from "@mavry/ui/components/input"
import { Spinner } from "@mavry/ui/components/spinner"
import { GithubIcon } from "@mavry/ui/icons/github"
import { GoogleIcon } from "@mavry/ui/icons/google"
import { Link } from "@tanstack/react-router"
import { AlertCircleIcon } from "lucide-react"
import { type FormEvent, useState } from "react"
import { MavrySymbol } from "@/components/brand/mavry-symbol"

export const SignIn = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isEmailFormVisible, setIsEmailFormVisible] = useState(false)
  const isFormBusy = false

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    setErrorMessage(null)
  }

  const handleEmailBack = (): void => {
    setErrorMessage(null)
    setIsEmailFormVisible(false)
  }

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
            <Field>
              <FieldLabel className="sr-only" htmlFor="email">
                Email
              </FieldLabel>
              <Input
                autoCapitalize="none"
                autoComplete="email"
                className="h-12 rounded-full border-border/80 bg-card/70 px-5 text-small shadow-sm focus-visible:bg-card"
                disabled={isFormBusy}
                id="email"
                inputMode="email"
                name="email"
                placeholder="you@example.com…"
                required
                spellCheck={false}
                type="email"
              />
            </Field>

            <Field>
              <FieldLabel className="sr-only" htmlFor="password">
                Password
              </FieldLabel>
              <Input
                autoComplete="current-password"
                className="h-12 rounded-full border-border/80 bg-card/70 px-5 text-small shadow-sm focus-visible:bg-card"
                disabled={isFormBusy}
                id="password"
                minLength={8}
                name="password"
                placeholder="Enter your password…"
                required
                type="password"
              />
              <div className="flex justify-end">
                <Link
                  className="cursor-pointer text-caption text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  to="/forgot-password"
                >
                  Forgot your password?
                </Link>
              </div>
            </Field>

            {errorMessage ? (
              <Alert className="rounded-lg" variant="destructive">
                <AlertCircleIcon aria-hidden="true" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            ) : null}

            <Field>
              <Button
                className="h-12 w-full cursor-pointer rounded-full text-small shadow-sm"
                disabled={isFormBusy}
                type="submit"
              >
                {isFormBusy ? <Spinner data-icon="inline-start" /> : null}
                Log in
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
          <Button
            aria-label="Continue with Google, coming soon"
            className="h-12 w-full cursor-pointer rounded-full text-small shadow-sm disabled:pointer-events-auto disabled:opacity-100"
            disabled
            title="Coming soon"
            type="button"
          >
            <GoogleIcon aria-hidden="true" data-icon="inline-start" />
            Continue with Google
          </Button>
          <Button
            className="h-12 w-full cursor-pointer rounded-full text-small disabled:opacity-100"
            disabled={isFormBusy}
            onClick={() => setIsEmailFormVisible(true)}
            type="button"
          >
            Continue with email
          </Button>
          <Button
            aria-label="Continue with GitHub, coming soon"
            className="h-12 w-full cursor-pointer rounded-full text-small disabled:pointer-events-auto disabled:opacity-100"
            disabled
            title="Coming soon"
            type="button"
          >
            <GithubIcon aria-hidden="true" data-icon="inline-start" />
            Continue with GitHub
          </Button>
        </fieldset>
      )}

      <p className="mt-8 text-center text-caption text-muted-foreground">
        New to Mavry?{" "}
        <Link
          className="cursor-pointer font-medium text-foreground underline-offset-4 hover:underline"
          to="/sign-up"
        >
          Create an account
        </Link>
      </p>
    </div>
  )
}
