import { cn } from "@mavry/ui/lib/utils"
import { createFileRoute, Outlet } from "@tanstack/react-router"
import { DemoPreview } from "@/components/auth/demo-preview"

export const Route = createFileRoute("/_auth")({
  component: AuthPage,
})

function AuthPage() {
  return (
    <section className="grid min-h-svh w-full bg-background text-foreground lg:grid-cols-2">
      <DemoPreview />

      <div className="flex min-h-svh min-w-0 flex-col px-5 py-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex flex-1 items-center justify-center py-10 lg:py-12">
          <div className={cn("w-full max-w-md", "max-w-sm")}>
            <Outlet />
          </div>
        </div>
      </div>
    </section>
  )
}
