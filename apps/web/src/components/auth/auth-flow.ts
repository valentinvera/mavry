import { useNavigate } from "@tanstack/react-router"
import { type FormEvent, useCallback, useState } from "react"
import { simulateAuthRequest } from "@/components/auth/simulate-request"
import { useAuthErrorFocus } from "@/components/auth/use-auth-error-focus"
import type { AuthErrorDetails } from "@/lib/auth-errors"

export type AuthView = "code" | "email" | "magic" | "options" | "phone"
export type SocialProvider = "github" | "google" | "microsoft"

interface UseAuthFlowOptions {
  initialErrorMessage?: string
}

export const useAuthFlow = ({ initialErrorMessage }: UseAuthFlowOptions) => {
  const navigate = useNavigate()
  const [authError, setAuthError] = useState<AuthErrorDetails | null>(() =>
    initialErrorMessage
      ? { message: initialErrorMessage, target: "form" }
      : null
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pendingSocialProvider, setPendingSocialProvider] =
    useState<SocialProvider | null>(null)
  const [view, setView] = useState<AuthView>("options")

  useAuthErrorFocus(authError)

  const clearError = useCallback((): void => {
    setAuthError(null)
  }, [])

  const selectView = useCallback((next: AuthView): void => {
    setAuthError(null)
    setView(next)
  }, [])

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault()
      setAuthError(null)
      setIsSubmitting(true)

      // UI/UX only for now. When the API is ready, call the better-auth client.
      await simulateAuthRequest()
      await navigate({ to: "/" })
    },
    [navigate]
  )

  const handleSocial = useCallback(
    async (provider: SocialProvider): Promise<void> => {
      setAuthError(null)
      setPendingSocialProvider(provider)

      // UI/UX only for now. When the API is ready:
      // await authClient.signIn.social({ callbackURL, errorCallbackURL, provider })
      await simulateAuthRequest()
      setPendingSocialProvider(null)
      await navigate({ to: "/" })
    },
    [navigate]
  )

  return {
    authError,
    clearError,
    handleSocial,
    handleSubmit,
    isFormBusy: isSubmitting || pendingSocialProvider !== null,
    isSubmitting,
    pendingSocialProvider,
    selectView,
    view,
  }
}
