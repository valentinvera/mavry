import { Alert, AlertDescription, AlertTitle } from "@mavry/ui/components/alert"
import { FieldError } from "@mavry/ui/components/field"
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
  <Alert variant="destructive">
    <AlertCircleIcon aria-hidden="true" />
    <AlertTitle>{title}</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
)

interface AuthErrorSummaryProps {
  error: AuthErrorDetails | null
  title: string
}

export const AuthErrorSummary = ({ error, title }: AuthErrorSummaryProps) => {
  if (error?.target !== "form") {
    return null
  }

  return <AuthFormError message={error.message} title={title} />
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
