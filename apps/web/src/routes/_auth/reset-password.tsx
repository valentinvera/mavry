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
    error: typeof search.error === "string" ? search.error : undefined,
    token: typeof search.token === "string" ? search.token : undefined,
  }),
})

function ResetPasswordPage() {
  const { error, token } = Route.useSearch()

  return (
    <ResetPassword hasInvalidToken={error === "INVALID_TOKEN"} token={token} />
  )
}
