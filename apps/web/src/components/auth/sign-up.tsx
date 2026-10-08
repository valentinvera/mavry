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

interface SignUpProps {
  initialErrorCode?: string
}

export const SignUp = ({ initialErrorCode }: SignUpProps) => {
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
      ? "Mavry couldn’t complete that social sign-up. Try again."
      : undefined,
  })

  const handleBackToOptions = useCallback((): void => {
    selectView("options")
  }, [selectView])

  return (
    <div className="mx-auto flex w-full flex-col items-center text-center">
      <AuthHeader
        description="Set up your account, then scope your first product in a few focused steps."
        title="Create your account"
      />

      {view === "options" ? (
        <AuthMethodOptions
          authError={authError}
          errorTitle="Couldn’t create your account"
          isBusy={isFormBusy}
          mode="sign-up"
          onSelectView={selectView}
          onSocial={handleSocial}
          pendingProvider={pendingSocialProvider}
        />
      ) : null}

      {view === "email" ? (
        <AuthCredentialsForm
          authError={authError}
          errorTitle="Couldn’t create your account"
          isBusy={isFormBusy}
          isSubmitting={isSubmitting}
          mode="sign-up"
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
          linkLabel="Log in"
          prompt="Already have an account?"
          to="/sign-in"
        />
      ) : null}
    </div>
  )
}
