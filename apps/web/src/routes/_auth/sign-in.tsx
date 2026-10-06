import { createFileRoute } from "@tanstack/react-router"
import { SignIn } from "@/components/auth/sign-in"

export const Route = createFileRoute("/_auth/sign-in")({
  component: SignInPage,
  head: () => ({
    meta: [
      { title: "Sign in — Mavry" },
      { content: "noindex, nofollow", name: "robots" },
    ],
  }),
  validateSearch: (search) => ({
    error: typeof search.error === "string" ? search.error : undefined,
  }),
})

function SignInPage() {
  const { error } = Route.useSearch()

  return <SignIn initialErrorCode={error} />
}
