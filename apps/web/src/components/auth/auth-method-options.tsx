import { GithubIcon } from "@mavry/ui/icons/github"
import { GoogleIcon } from "@mavry/ui/icons/google"
import { MicrosoftIcon } from "@mavry/ui/icons/microsoft"
import {
  FingerprintIcon,
  KeyRoundIcon,
  LinkIcon,
  MailIcon,
  PhoneIcon,
} from "lucide-react"
import type { AuthView, SocialProvider } from "@/components/auth/auth-flow"
import { AuthErrorSummary } from "@/components/auth/auth-form-error"
import { MethodButton, OrDivider } from "@/components/auth/auth-methods"
import type { AuthErrorDetails } from "@/lib/auth-errors"

type AuthMode = "sign-in" | "sign-up"

interface AuthMethodOptionsProps {
  authError: AuthErrorDetails | null
  errorTitle: string
  isBusy: boolean
  mode: AuthMode
  onSelectView: (view: AuthView) => void
  onSocial: (provider: SocialProvider) => void
  pendingProvider: SocialProvider | null
  showLastUsedGoogle?: boolean
}

export const AuthMethodOptions = ({
  authError,
  errorTitle,
  isBusy,
  mode,
  onSelectView,
  onSocial,
  pendingProvider,
  showLastUsedGoogle,
}: AuthMethodOptionsProps) => {
  const isSignUp = mode === "sign-up"

  const handleGoogleSignIn = async (): Promise<void> => {
    await onSocial("google")
  }

  const handleMicrosoftSignIn = async (): Promise<void> => {
    await onSocial("microsoft")
  }

  const handleGithubSignIn = async (): Promise<void> => {
    await onSocial("github")
  }

  const handleEmailView = (): void => {
    onSelectView("email")
  }

  const handleCodeView = (): void => {
    onSelectView("code")
  }

  const handleMagicView = (): void => {
    onSelectView("magic")
  }

  const handlePhoneView = (): void => {
    onSelectView("phone")
  }

  return (
    <div className="mt-7 flex w-full flex-col gap-3">
      <AuthErrorSummary error={authError} title={errorTitle} />

      <MethodButton
        badge={showLastUsedGoogle ? "Last used" : undefined}
        busy={pendingProvider === "google"}
        disabled={isBusy}
        icon={<GoogleIcon aria-hidden="true" data-icon="inline-start" />}
        label="Continue with Google"
        onClick={handleGoogleSignIn}
      />
      <MethodButton
        busy={pendingProvider === "microsoft"}
        disabled={isBusy}
        icon={<MicrosoftIcon aria-hidden="true" data-icon="inline-start" />}
        label="Continue with Microsoft"
        onClick={handleMicrosoftSignIn}
      />
      <MethodButton
        busy={pendingProvider === "github"}
        disabled={isBusy}
        icon={<GithubIcon aria-hidden="true" data-icon="inline-start" />}
        label="Continue with GitHub"
        onClick={handleGithubSignIn}
      />
      <MethodButton
        disabled={isBusy}
        icon={<FingerprintIcon aria-hidden="true" data-icon="inline-start" />}
        label={isSignUp ? "Sign up with passkey" : "Continue with passkey"}
      />

      <OrDivider />

      <MethodButton
        disabled={isBusy}
        icon={<MailIcon aria-hidden="true" data-icon="inline-start" />}
        label="Continue with email"
        onClick={handleEmailView}
      />
      <MethodButton
        disabled={isBusy}
        icon={<KeyRoundIcon aria-hidden="true" data-icon="inline-start" />}
        label={isSignUp ? "Email me a sign-up code" : "Email me a sign-in code"}
        onClick={handleCodeView}
      />
      <MethodButton
        disabled={isBusy}
        icon={<LinkIcon aria-hidden="true" data-icon="inline-start" />}
        label="Email me a magic link"
        onClick={handleMagicView}
      />
      <MethodButton
        disabled={isBusy}
        icon={<PhoneIcon aria-hidden="true" data-icon="inline-start" />}
        label="Continue with phone"
        onClick={handlePhoneView}
      />
    </div>
  )
}
