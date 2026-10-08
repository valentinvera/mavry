import { useCallback } from "react"
import { AuthCredentialsForm } from "@/components/auth/auth-credentials-form"
import { useAuthFlow } from "@/components/auth/auth-flow"
import { AuthMethodOptions } from "@/components/auth/auth-method-options"
import {
  EmailCodePanel,
  MagicLinkPanel,
  PhonePanel,
} from "@/components/auth/auth-secondary-panels"
import { AuthFooter, AuthHeader } from "@/components/auth/auth-shell"

interface SignInProps {
  initialErrorCode?: string
}

export const SignIn = ({ initialErrorCode }: SignInProps) => {
  const {
    authError,
    clearError,
    handleSocial,
    handleSubmit,
    isFormBusy,
    isSubmitting,
    pendingSocialProvider,
    selectView,
    view,
  } = useAuthFlow({
    initialErrorMessage: initialErrorCode
      ? "Mavry couldn’t complete that social login. Try again."
      : undefined,
  })

  const handleBackToOptions = useCallback((): void => {
    selectView("options")
  }, [selectView])

  return (
    <div className="mx-auto flex w-full flex-col items-center text-center">
      <AuthHeader
        description="Return to your workspace and pick up the next decision."
        title="Log in to Mavry"
      />

      {view === "options" ? (
        <AuthMethodOptions
          authError={authError}
          errorTitle="Couldn’t log in"
          isBusy={isFormBusy}
          mode="sign-in"
          onSelectView={selectView}
          onSocial={handleSocial}
          pendingProvider={pendingSocialProvider}
          showLastUsedGoogle
        />
      ) : null}

      {view === "email" ? (
        <AuthCredentialsForm
          authError={authError}
          errorTitle="Couldn’t log in"
          isBusy={isFormBusy}
          isSubmitting={isSubmitting}
          mode="sign-in"
          onBack={handleBackToOptions}
          onInputChange={clearError}
          onSubmit={handleSubmit}
        />
      ) : null}

      {view === "code" ? <EmailCodePanel onBack={handleBackToOptions} /> : null}
      {view === "magic" ? (
        <MagicLinkPanel onBack={handleBackToOptions} />
      ) : null}
      {view === "phone" ? <PhonePanel onBack={handleBackToOptions} /> : null}

      {view === "options" ? (
        <AuthFooter
          linkLabel="Create account"
          prompt="New to Mavry?"
          to="/sign-up"
        />
      ) : null}
    </div>
  )
}
