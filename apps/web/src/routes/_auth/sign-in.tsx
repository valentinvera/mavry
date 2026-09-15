import { createFileRoute } from "@tanstack/react-router"
import { SignIn } from "@/components/auth/sign-in"

export const Route = createFileRoute("/_auth/sign-in")({
  validateSearch: (search) => ({
    error: typeof search.error === "string" ? search.error : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — Mavry" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SignInPage,
})

function SignInPage() {
  const { error } = Route.useSearch()

  return <SignIn initialErrorCode={error} />
}
