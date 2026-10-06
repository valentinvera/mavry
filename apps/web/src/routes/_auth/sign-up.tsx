import { createFileRoute } from "@tanstack/react-router"
import { SignUp } from "@/components/auth/sign-up"

export const Route = createFileRoute("/_auth/sign-up")({
  component: SignUpPage,
  head: () => ({
    meta: [
      { title: "Create account — Mavry" },
      { content: "noindex, nofollow", name: "robots" },
    ],
  }),
  validateSearch: (search) => ({
    error: typeof search.error === "string" ? search.error : undefined,
  }),
})

function SignUpPage() {
  const { error } = Route.useSearch()

  return <SignUp initialErrorCode={error} />
}
