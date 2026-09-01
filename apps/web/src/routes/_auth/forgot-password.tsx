import { createFileRoute } from "@tanstack/react-router"
import { PasswordRecovery } from "@/components/auth/password-recovery"

export const Route = createFileRoute("/_auth/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset password — Mavry" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  return <PasswordRecovery />
}
