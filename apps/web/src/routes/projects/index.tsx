import { buttonVariants } from "@mavry/ui/components/button"
import { Spinner } from "@mavry/ui/components/spinner"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { PROJECT_STAGE_LABELS } from "@/lib/project-stage"
import { useTRPC } from "@/utils/trpc"

const DATE_FORMATTER = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
})

export const Route = createFileRoute("/projects/")({
  component: ProjectsPage,
})

function ProjectsPage() {
  const trpc = useTRPC()
  const { data: projects = [], status } = useQuery(
    trpc.projects.list.queryOptions()
  )

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-medium text-xlarge md:text-section">Projects</h1>
          <p className="mt-2 max-w-xl text-control text-muted-foreground">
            Choose a project to shape, or start a new one.
          </p>
        </div>

        {projects.length > 0 ? (
          <Link
            className={buttonVariants({
              className: "h-9 rounded-md text-small",
              size: "sm",
            })}
            to="/projects/new"
          >
            New project
          </Link>
        ) : null}
      </div>

      {status === "pending" ? (
        <div className="flex flex-1 items-center justify-center py-20">
          <Spinner className="size-5 text-muted-foreground" />
        </div>
      ) : null}

      {status === "success" && projects.length === 0 ? (
        <div className="mt-10 border-border/70 border-t pt-10">
          <div className="max-w-xl">
            <h2 className="font-medium text-emphasis">
              Create your first project.
            </h2>
            <p className="mt-2 text-caption text-muted-foreground leading-relaxed">
              A project holds one product: its hypothesis, MVP scope, cuts, and
              launch readiness.
            </p>

            <ul className="mt-6 space-y-1.5 text-caption text-muted-foreground">
              <li>The product hypothesis and the next 30-day goal</li>
              <li>Who it is for and the problem it solves</li>
              <li>What is already built and what blocks launch</li>
            </ul>

            <Link
              className={buttonVariants({
                className: "mt-7 h-10 rounded-lg text-action!",
                size: "sm",
              })}
              to="/projects/new"
            >
              Create project
            </Link>
          </div>
        </div>
      ) : null}

      {status === "success" && projects.length > 0 ? (
        <ul className="mt-8 border-border/70 border-t">
          {projects.map((project) => (
            <li className="border-border/70 border-b" key={project.id}>
              <Link
                className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                params={{ projectId: project.id }}
                to="/projects/$projectId"
              >
                <div className="min-w-0">
                  <h2 className="truncate font-medium text-body group-hover:underline group-hover:underline-offset-4">
                    {project.name}
                  </h2>
                  <p className="mt-1 line-clamp-2 max-w-2xl text-caption text-muted-foreground">
                    {project.description}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2 text-caption text-muted-foreground">
                  <span>{PROJECT_STAGE_LABELS[project.stage]}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    Updated {DATE_FORMATTER.format(new Date(project.updatedAt))}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
