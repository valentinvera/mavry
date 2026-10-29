import { createFileRoute } from "@tanstack/react-router"
import { VerifyEmail } from "@/components/auth/verify-email"

export const Route = createFileRoute("/_auth/verify-email")({
  component: VerifyEmailPage,
  head: () => ({
    meta: [
      { title: "Verify your email — Mavry" },
      { content: "noindex, nofollow", name: "robots" },
    ],
  }),
  validateSearch: (search) => ({
    email: typeof search.email === "string" ? search.email : undefined,
  }),
})

function VerifyEmailPage() {
  const { email } = Route.useSearch()

  return <VerifyEmail email={email} />
}
