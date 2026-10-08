import { createFileRoute } from "@tanstack/react-router"
import { ResetPassword } from "@/components/auth/reset-password"

export const Route = createFileRoute("/_auth/reset-password")({
  component: ResetPasswordPage,
  head: () => ({
    meta: [
      { title: "Choose a new password — Mavry" },
      { content: "noindex, nofollow", name: "robots" },
    ],
  }),
  validateSearch: (search) => ({
    email: typeof search.email === "string" ? search.email : undefined,
  }),
})

function ResetPasswordPage() {
  const { email } = Route.useSearch()

  return <ResetPassword email={email} />
}
