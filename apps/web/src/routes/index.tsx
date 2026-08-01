import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <main className="grid min-h-svh place-items-center px-6">
      <h1 className="font-semibold text-2xl">Hello World</h1>
    </main>
  )
}
