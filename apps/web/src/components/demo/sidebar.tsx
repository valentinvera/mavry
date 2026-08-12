import { Button } from "@mavry/ui/components/button"
import { cn } from "@mavry/ui/lib/utils"
import { ChevronDownIcon, SearchIcon, SquarePenIcon } from "lucide-react"
import { useState } from "react"
import {
  documents,
  navMain,
  type PageId,
  secondaryNav,
} from "@/components/demo/data"

const projects = [
  {
    id: "atlas-beta",
    name: "Mavry",
    description: "MVP scope review",
  },
  {
    id: "signal-kit",
    name: "Signal kit",
    description: "Feedback route review",
  },
  {
    id: "launch-room",
    name: "Launch room",
    description: "Launch readiness review",
  },
] as const

const activeItemClass = "bg-muted text-foreground"

interface Props {
  activePageId: PageId
  desktopOpen: boolean
  mobileOpen: boolean
  onPageChange: (pageId: PageId) => void
}

export const Sidebar = ({
  activePageId,
  desktopOpen,
  mobileOpen,
  onPageChange,
}: Props) => {
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false)

  return (
    <aside
      className={cn(
        "w-60 shrink-0 border-sidebar-border border-r bg-sidebar shadow-[8px_0_24px_-18px_rgb(0_0_0_/_0.9),inset_-1px_0_0_rgb(253_253_253_/_0.04)]",
        "hidden sm:flex sm:flex-col",
        !desktopOpen && "sm:hidden",
        mobileOpen &&
          "absolute inset-y-0 left-0 z-20 flex flex-col overflow-hidden rounded-r-xl border-y border-l-0 sm:relative sm:rounded-none sm:border-y-0"
      )}
    >
      <div className="relative flex h-12 items-center border-border/80 border-b px-2">
        <button
          aria-expanded={isProjectMenuOpen}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-1 py-1 text-left transition-colors hover:bg-muted/50 active:translate-y-px"
          onClick={() => setIsProjectMenuOpen((isOpen) => !isOpen)}
          type="button"
        >
          <img
            alt="Mavry"
            className="size-5 shrink-0"
            height={128}
            src="/brand/mavry-symbol-white.svg?v=2"
            width={128}
          />
          <span className="truncate font-semibold text-medium">Mavry</span>
          <ChevronDownIcon
            aria-hidden="true"
            className={cn(
              "size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ease-out",
              isProjectMenuOpen && "rotate-180"
            )}
          />
        </button>
        <Button
          aria-label="Search projects and decisions"
          className="ml-1 rounded-md text-muted-foreground hover:text-foreground"
          onClick={() => onPageChange("search")}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <SearchIcon />
        </Button>
        <Button
          aria-label="Create new project"
          className="rounded-md text-muted-foreground hover:text-foreground"
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <SquarePenIcon />
        </Button>

        {isProjectMenuOpen ? (
          <div className="absolute top-[calc(100%+0.375rem)] right-2 left-2 z-30 rounded-lg border border-border/80 bg-background/95 p-1 shadow-xl backdrop-blur-glass">
            <div className="px-2 py-1.5 font-medium text-caption text-muted-foreground">
              Switch project
            </div>
            <div className="flex flex-col gap-1">
              {projects.map((project) => {
                const isCurrent = project.id === "atlas-beta"

                return (
                  <button
                    className={cn(
                      "rounded-md px-2 py-1.5 text-left transition-colors hover:bg-muted/50 active:translate-y-px",
                      isCurrent && "bg-muted/60"
                    )}
                    key={project.id}
                    type="button"
                  >
                    <span className="block truncate font-medium text-small">
                      {project.name}
                    </span>
                    <span className="block truncate text-caption text-muted-foreground">
                      {project.description}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ) : null}
      </div>

      <div
        className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto overscroll-contain px-2 py-3 [scrollbar-width:none] max-sm:-mr-4 max-sm:pr-6 [&::-webkit-scrollbar]:hidden"
        data-smooth-scroll=""
      >
        <nav
          aria-label="Mavry decision workspace areas"
          className="flex flex-col gap-1"
        >
          {navMain.map((item) => {
            const Icon = item.icon
            const isActive = activePageId === item.id

            return (
              <button
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-caption text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground active:translate-y-px",
                  isActive && activeItemClass
                )}
                key={item.id}
                onClick={() => onPageChange(item.id)}
                type="button"
              >
                <Icon aria-hidden="true" className="size-3.5" />
                {item.title}
              </button>
            )
          })}
        </nav>

        <div className="flex flex-col gap-2">
          <p className="px-2 font-medium text-caption text-muted-foreground">
            Documents
          </p>
          <nav
            aria-label="Mavry decision workspace documents"
            className="flex flex-col gap-1"
          >
            {documents.map((item) => {
              const Icon = item.icon
              const isActive = activePageId === item.id

              return (
                <button
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "grid grid-cols-[1rem_minmax(0,1fr)] gap-2 rounded-md px-2 py-1.5 text-left text-caption text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground active:translate-y-px",
                    isActive && activeItemClass
                  )}
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  type="button"
                >
                  <Icon aria-hidden="true" className="mt-0.5 size-3.5" />
                  <span className="min-w-0">
                    <span className="block truncate text-foreground">
                      {item.title}
                    </span>
                    <span className="block truncate">{item.value}</span>
                  </span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      <div className="border-border/80 border-t p-2">
        <div className="flex flex-col gap-1">
          {secondaryNav.map((item) => {
            const Icon = item.icon
            const isActive = activePageId === item.id

            return (
              <Button
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "justify-start rounded-md text-caption",
                  isActive && activeItemClass
                )}
                key={item.id}
                onClick={() => onPageChange(item.id)}
                size="sm"
                type="button"
                variant="ghost"
              >
                <Icon data-icon="inline-start" />
                {item.title}
              </Button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
