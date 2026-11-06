import { buttonVariants } from "@mavry/ui/components/button"
import { Spinner } from "@mavry/ui/components/spinner"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { PROJECT_STAGE_LABELS } from "@/lib/project-stage"
import { useTRPC } from "@/utils/trpc"

const NEXT_ACTIONS = [
  "Capture the first ideas for this MVP.",
  "Classify features into Core, Support, Later, No for now.",
  "Cut at least one item before building.",
]

export const Route = createFileRoute("/projects/$projectId")({
  component: ProjectHomePage,
  head: () => ({
    meta: [
      { title: "Project — Mavry" },
      { content: "noindex, nofollow", name: "robots" },
    ],
  }),
})

function ProjectHomePage() {
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

      <div className="mt-10 border-border/70 border-t pt-8">
        <p className="text-caption text-muted-foreground">Hypothesis</p>
        <p className="mt-3 max-w-3xl text-balance font-medium text-emphasis">
          {project.hypothesis}
        </p>
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex min-w-0 flex-col gap-10">
          <section>
            <h2 className="font-medium text-medium">Context</h2>
            <dl className="mt-4 grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="text-caption text-muted-foreground">
                  Target user
                </dt>
                <dd className="mt-1 text-caption">{project.targetUser}</dd>
              </div>
              <div>
                <dt className="text-caption text-muted-foreground">
                  Main problem
                </dt>
                <dd className="mt-1 text-caption">{project.mainProblem}</dd>
              </div>
            </dl>
          </section>

          <section>
            <h2 className="font-medium text-medium">Starting point</h2>
            {project.alreadyStarted ? (
              <dl className="mt-4 flex flex-col gap-5">
                <div>
                  <dt className="text-caption text-muted-foreground">
                    Already built
                  </dt>
                  <dd className="mt-1 text-caption">
                    {project.alreadyBuilt ?? "Not recorded."}
                  </dd>
                </div>
                <div>
                  <dt className="text-caption text-muted-foreground">
                    Launch blocker
                  </dt>
                  <dd className="mt-1 text-caption">
                    {project.launchBlocker ?? "None recorded."}
                  </dd>
                </div>
                <div>
                  <dt className="text-caption text-muted-foreground">
                    Scope creep
                  </dt>
                  <dd className="mt-1 text-caption">
                    {project.scopeCreepConcern ?? "None recorded."}
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="mt-2 text-caption text-muted-foreground">
                Starting fresh. Nothing is built yet.
              </p>
            )}
          </section>
        </div>

        <aside className="flex min-w-0 flex-col gap-8">
          <section>
            <h2 className="font-medium text-medium">Next 30 days</h2>
            <p className="mt-2 text-caption">{project.goal30Days}</p>
          </section>

          <section>
            <h2 className="font-medium text-medium">Next actions</h2>
            <ol className="mt-3 flex flex-col gap-3">
              {NEXT_ACTIONS.map((action, index) => (
                <li className="flex gap-3" key={action}>
                  <span className="text-caption text-muted-foreground">
                    {index + 1}
                  </span>
                  <span className="text-caption">{action}</span>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>
    </section>
  )
}
