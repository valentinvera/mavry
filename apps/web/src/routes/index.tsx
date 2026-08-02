import { createFileRoute } from "@tanstack/react-router"
import { LandingShell } from "@/components/landing/shell"

export const Route = createFileRoute("/")({
  component: HomeComponent,
})

function HomeComponent() {
  return <LandingShell />
}
