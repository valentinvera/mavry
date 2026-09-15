import { createFileRoute } from "@tanstack/react-router"
import { SignUp } from "@/components/auth/sign-up"

export const Route = createFileRoute("/_auth/sign-up")({
  validateSearch: (search) => ({
    error: typeof search.error === "string" ? search.error : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Create account — Mavry" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SignUpPage,
})

function SignUpPage() {
  const { error } = Route.useSearch()

  return <SignUp initialErrorCode={error} />
}
