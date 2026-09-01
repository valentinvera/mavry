import { createFileRoute } from "@tanstack/react-router"
import { SignUp } from "@/components/auth/sign-up"

export const Route = createFileRoute("/_auth/sign-up")({
  head: () => ({
    meta: [
      { title: "Create account — Mavry" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SignUpPage,
})

function SignUpPage() {
  return <SignUp />
}
