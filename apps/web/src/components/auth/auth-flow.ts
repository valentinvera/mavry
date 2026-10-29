import { useNavigate } from "@tanstack/react-router"
import { type FormEvent, useCallback, useState } from "react"
import { useAuthErrorFocus } from "@/components/auth/use-auth-error-focus"
import { authClient, captchaHeaders } from "@/lib/auth-client"
import { type AuthErrorDetails, getAuthError } from "@/lib/auth-errors"

export type AuthView = "code" | "email" | "magic" | "options" | "passkey-signup"
export type AuthMode = "sign-in" | "sign-up"
export type SocialProvider = "github" | "google"

interface UseAuthFlowOptions {
  initialErrorMessage?: string
  mode: AuthMode
}

export const useAuthFlow = ({
  initialErrorMessage,
  mode,
}: UseAuthFlowOptions) => {
  const navigate = useNavigate()
  const [authError, setAuthError] = useState<AuthErrorDetails | null>(() =>
    initialErrorMessage
      ? { message: initialErrorMessage, target: "form" }
      : null
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pendingPasskey, setPendingPasskey] = useState(false)
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

      const formData = new FormData(event.currentTarget)
      const email = String(formData.get("email") ?? "").trim()
      const password = String(formData.get("password") ?? "")
      const name = String(formData.get("name") ?? "").trim()
      const captchaToken = String(formData.get("captchaToken") ?? "")
      const fallbackMessage =
        mode === "sign-in"
          ? "Mavry couldn’t log you in. Try again."
          : "Mavry couldn’t create your account. Try again."

      try {
        const result =
          mode === "sign-in"
            ? await authClient.signIn.email(
                { email, password },
                captchaHeaders(captchaToken)
              )
            : await authClient.signUp.email(
                { email, name, password },
                captchaHeaders(captchaToken)
              )

        if (result.error) {
          setAuthError(
            getAuthError(
              result.error,
              fallbackMessage,
              mode === "sign-in" ? "credentials" : "form"
            )
          )
          return
        }

        const data = result.data as { twoFactorRedirect?: boolean } | null

        if (data?.twoFactorRedirect) {
          return
        }

        await navigate({ to: "/account" })
      } catch {
        setAuthError({ message: fallbackMessage, target: "form" })
      } finally {
        setIsSubmitting(false)
      }
    },
    [mode, navigate]
  )

  const handleSocial = useCallback(
    async (provider: SocialProvider): Promise<void> => {
      setAuthError(null)
      setPendingSocialProvider(provider)

      try {
        const { origin } = window.location
        await authClient.signIn.social({
          callbackURL: `${origin}/account`,
          errorCallbackURL: `${origin}/sign-in`,
          newUserCallbackURL: `${origin}/account`,
          provider,
        })
      } catch {
        setPendingSocialProvider(null)
        setAuthError({
          message: "Mavry couldn’t complete that social login. Try again.",
          target: "form",
        })
      }
    },
    []
  )

  const handlePasskey = useCallback(async (): Promise<void> => {
    if (mode === "sign-up") {
      setAuthError(null)
      setView("passkey-signup")
      return
    }

    setAuthError(null)
    setPendingPasskey(true)

    try {
      const result = await authClient.signIn.passkey()

      if (result.error) {
        setAuthError(
          getAuthError(
            result.error,
            "Mavry couldn’t use a passkey. Try again.",
            "form"
          )
        )
        return
      }

      const data = result.data as { twoFactorRedirect?: boolean } | null

      if (data?.twoFactorRedirect) {
        return
      }

      await navigate({ to: "/account" })
    } catch {
      setAuthError({
        message: "Mavry couldn’t use a passkey. Try again.",
        target: "form",
      })
    } finally {
      setPendingPasskey(false)
    }
  }, [mode, navigate])

  return {
    authError,
    clearError,
    handlePasskey,
    handleSocial,
    handleSubmit,
    isFormBusy:
      isSubmitting || pendingSocialProvider !== null || pendingPasskey,
    isSubmitting,
    pendingPasskey,
    pendingSocialProvider,
    selectView,
    view,
  }
}
