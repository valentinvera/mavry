import { createFileRoute } from "@tanstack/react-router"
import { ResetPassword } from "@/components/auth/reset-password"

export const Route = createFileRoute("/_auth/reset-password")({
  validateSearch: (search) => ({
    error: typeof search.error === "string" ? search.error : undefined,
    token: typeof search.token === "string" ? search.token : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Choose a new password — Mavry" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ResetPasswordPage,
})

function ResetPasswordPage() {
  const { error, token } = Route.useSearch()
  const previewToken = token ?? "ui-preview"

  return (
    <ResetPassword
      hasInvalidToken={error === "INVALID_TOKEN"}
      token={previewToken}
    />
  )
}
