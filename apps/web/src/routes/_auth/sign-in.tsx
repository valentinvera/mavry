import { createFileRoute } from "@tanstack/react-router"
import { SignIn } from "@/components/auth/sign-in"

export const Route = createFileRoute("/_auth/sign-in")({
  head: () => ({
    meta: [
      { title: "Sign in — Mavry" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SignInPage,
})

function SignInPage() {
  return <SignIn />
}
