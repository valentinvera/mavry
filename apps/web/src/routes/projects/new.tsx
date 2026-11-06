import { createFileRoute, Link } from "@tanstack/react-router"
import { ProjectIntakeForm } from "@/components/projects/project-intake-form"

export const Route = createFileRoute("/projects/new")({
  component: NewProjectPage,
  head: () => ({
    meta: [
      { title: "Create project — Mavry" },
      { content: "noindex, nofollow", name: "robots" },
    ],
  }),
})

function NewProjectPage() {
  return (
    <section className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
      <Link
        className="text-caption text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        to="/projects"
      >
        Projects
      </Link>

      <h1 className="mt-6 font-medium text-xlarge md:text-section">
        Create project
      </h1>
      <p className="mt-2 max-w-xl text-control text-muted-foreground">
        Answer these once. Mavry uses them to keep scope, cuts, and readiness
        honest.
      </p>

      <div className="mt-10">
        <ProjectIntakeForm />
      </div>
    </section>
  )
}
