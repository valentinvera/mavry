import { Spinner } from "@mavry/ui/components/spinner"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useTRPC } from "@/utils/trpc"

const NEXT_ACTIONS = [
  "Capture the first ideas for this MVP.",
  "Classify features into Core, Support, Later, No for now.",
  "Cut at least one item before building.",
]

export const Route = createFileRoute("/projects/$projectId/")({
  component: ProjectOverviewPage,
})

function ProjectOverviewPage() {
  const { projectId } = Route.useParams()
  const trpc = useTRPC()
  const { data: project, status } = useQuery({
    ...trpc.projects.byId.queryOptions({ id: projectId }),
    meta: { suppressGlobalError: true },
  })

  if (status === "pending") {
    return (
      <div className="flex items-center justify-center py-10">
        <Spinner className="size-5 text-muted-foreground" />
      </div>
    )
  }

  if (!project) {
    return null
  }

  return (
    <div className="flex flex-col gap-12">
      <div className="border-border/70 border-t pt-8">
        <p className="text-caption text-muted-foreground">Hypothesis</p>
        <p className="mt-3 max-w-3xl text-balance font-medium text-emphasis">
          {project.hypothesis}
        </p>
      </div>

      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_20rem]">
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
    </div>
  )
}
