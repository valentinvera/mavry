import { buttonVariants } from "@mavry/ui/components/button"
import { Spinner } from "@mavry/ui/components/spinner"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link, Outlet } from "@tanstack/react-router"
import { PROJECT_STAGE_LABELS } from "@/lib/project-stage"
import { useTRPC } from "@/utils/trpc"

const TAB_CLASS =
  "-mb-px border-transparent border-b-2 pb-3 text-caption text-muted-foreground transition-colors hover:text-foreground"
const ACTIVE_TAB_CLASS = "border-foreground font-medium text-foreground"

export const Route = createFileRoute("/projects/$projectId")({
  component: ProjectShell,
  head: () => ({
    meta: [
      { title: "Project — Mavry" },
      { content: "noindex, nofollow", name: "robots" },
    ],
  }),
})

function ProjectShell() {
  const { projectId } = Route.useParams()
  const trpc = useTRPC()
  const { data: project, status } = useQuery({
    ...trpc.projects.byId.queryOptions({ id: projectId }),
    meta: { suppressGlobalError: true },
  })

  if (status === "pending") {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <Spinner className="size-5 text-muted-foreground" />
      </div>
    )
  }

  if (status === "error" || !project) {
    return (
      <section className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
        <Link
          className="text-caption text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          to="/projects"
        >
          Projects
        </Link>
        <h1 className="mt-6 font-medium text-xlarge md:text-section">
          Project not found
        </h1>
        <p className="mt-2 max-w-xl text-control text-muted-foreground">
          This project does not exist or you do not have access to it.
        </p>
        <Link
          className={buttonVariants({
            className: "mt-7 h-10 rounded-lg text-action!",
            size: "sm",
          })}
          to="/projects"
        >
          Back to projects
        </Link>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
      <Link
        className="text-caption text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        to="/projects"
      >
        Projects
      </Link>

      <header className="mt-6 flex flex-col gap-2">
        <p className="text-caption text-muted-foreground">
          {PROJECT_STAGE_LABELS[project.stage]}
        </p>
        <h1 className="font-medium text-xlarge md:text-section">
          {project.name}
        </h1>
        <p className="max-w-2xl text-control text-muted-foreground">
          {project.description}
        </p>
      </header>

      <nav
        aria-label="Project sections"
        className="mt-8 flex gap-6 border-border/70 border-b"
      >
        <Link
          activeOptions={{ exact: true }}
          activeProps={{ className: ACTIVE_TAB_CLASS }}
          className={TAB_CLASS}
          params={{ projectId }}
          to="/projects/$projectId"
        >
          Overview
        </Link>
        <Link
          activeProps={{ className: ACTIVE_TAB_CLASS }}
          className={TAB_CLASS}
          params={{ projectId }}
          to="/projects/$projectId/inbox"
        >
          Inbox
        </Link>
      </nav>

      <div className="mt-8">
        <Outlet />
      </div>
    </section>
  )
}
