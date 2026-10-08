import { Alert, AlertDescription, AlertTitle } from "@mavry/ui/components/alert"
import { FieldError } from "@mavry/ui/components/field"
import { cn } from "@mavry/ui/lib/utils"
import { AlertCircleIcon } from "lucide-react"
import type { AuthErrorDetails, AuthErrorTarget } from "@/lib/auth-errors"

interface AuthFormErrorProps {
  message: string
  title?: string
}

export const AuthFormError = ({
  message,
  title = "Couldn’t continue",
}: AuthFormErrorProps) => (
  <Alert
    className="rounded-lg"
    id="auth-error-summary"
    tabIndex={-1}
    variant="destructive"
  >
    <AlertCircleIcon aria-hidden="true" />
    <AlertTitle>{title}</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
)

interface AuthErrorSummaryProps {
  error: AuthErrorDetails | null
  title: string
}

const SUMMARY_TRANSITION =
  "grid w-full transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none"

export const AuthErrorSummary = ({ error, title }: AuthErrorSummaryProps) => {
  if (error?.target !== "form") {
    return (
      <div
        aria-hidden="true"
        className={cn(SUMMARY_TRANSITION, "grid-rows-[0fr] opacity-0")}
      >
        <div className="overflow-hidden" />
      </div>
    )
  }

  return (
    <div
      aria-live="polite"
      className={cn(SUMMARY_TRANSITION, "grid-rows-[1fr] opacity-100")}
    >
      <div className="overflow-hidden">
        <AuthFormError message={error.message} title={title} />
      </div>
    </div>
  )
}

interface AuthFieldErrorProps {
  error: AuthErrorDetails | null
  targets: AuthErrorTarget[]
}

export const AuthFieldError = ({ error, targets }: AuthFieldErrorProps) => {
  if (!(error && targets.includes(error.target))) {
    return null
  }

  return <FieldError>{error.message}</FieldError>
}
