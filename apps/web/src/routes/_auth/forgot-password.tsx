import { createFileRoute } from "@tanstack/react-router"
import { PasswordRecovery } from "@/components/auth/password-recovery"

export const Route = createFileRoute("/_auth/forgot-password")({
  component: ForgotPasswordPage,
  head: () => ({
    meta: [
      { title: "Reset password — Mavry" },
      { content: "noindex, nofollow", name: "robots" },
    ],
  }),
})

function ForgotPasswordPage() {
  return <PasswordRecovery />
}
