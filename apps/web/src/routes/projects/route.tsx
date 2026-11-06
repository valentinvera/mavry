import { Alert, AlertDescription } from "@mavry/ui/components/alert"
import { Separator } from "@mavry/ui/components/separator"
import { Spinner } from "@mavry/ui/components/spinner"
import { createFileRoute, Link, Outlet } from "@tanstack/react-router"
import { MavryWordmark } from "@/components/brand/mavry-wordmark"
import { useSessionGuard } from "@/lib/use-session-guard"

export const Route = createFileRoute("/projects")({
  component: ProjectsLayout,
  head: () => ({
    meta: [
      { title: "Projects — Mavry" },
      { content: "noindex, nofollow", name: "robots" },
    ],
  }),
})

function ProjectsLayout() {
  const { session, isPending } = useSessionGuard()

  if (isPending || !session) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-background">
        <Spinner className="size-5 text-muted-foreground" />
      </main>
    )
  }

  return (
    <main className="flex min-h-svh w-full flex-col bg-background text-foreground">
      <header className="w-full">
        <div className="px-5 pt-5 pb-4 sm:px-8 lg:px-10">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
            <Link
              aria-label="Mavry projects"
              className="inline-flex rounded-md"
              to="/projects"
            >
              <MavryWordmark size="sm" />
            </Link>

            <nav className="flex items-center gap-5 text-muted-foreground text-small">
              <Link
                className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
                to="/account"
              >
                Account
              </Link>
            </nav>
          </div>
        </div>
        <Separator />
      </header>

      {session.user.emailVerified ? null : (
        <div className="mx-auto w-full max-w-6xl px-5 pt-6 sm:px-8 lg:px-10">
          <Alert className="rounded-lg">
            <AlertDescription>
              Verify your email to secure your account.{" "}
              <Link
                className="font-medium text-foreground underline underline-offset-4"
                search={{ email: session.user.email }}
                to="/verify-email"
              >
                Verify email
              </Link>
            </AlertDescription>
          </Alert>
        </div>
      )}

      <Outlet />
    </main>
  )
}
