import { createFileRoute } from "@tanstack/react-router"
import { TwoFactorChallenge } from "@/components/auth/two-factor"

export const Route = createFileRoute("/_auth/two-factor")({
  component: TwoFactorChallenge,
  head: () => ({
    meta: [
      { title: "Two-factor verification — Mavry" },
      { content: "noindex, nofollow", name: "robots" },
    ],
  }),
})
