import { Button } from "@mavry/ui/components/button"
import { cn } from "@mavry/ui/lib/utils"
import { ChevronDownIcon, SearchIcon, SquarePenIcon } from "lucide-react"
import { useCallback, useState } from "react"
import { MavrySymbol } from "@/components/brand/mavry-symbol"
import {
  documents,
  navMain,
  type PageId,
  secondaryNav,
} from "@/components/landing/demo/data"

const projects = [
  {
    description: "MVP scope review",
    id: "atlas-beta",
    name: "Mavry",
  },
  {
    description: "Feedback route review",
    id: "signal-kit",
    name: "Signal kit",
  },
  {
    description: "Launch readiness review",
    id: "launch-room",
    name: "Launch room",
  },
] as const

const activeItemClass = "bg-muted text-foreground"

interface Props {
  activePageId: PageId
  desktopOpen: boolean
  mobileOpen: boolean
  onPageChange: (pageId: PageId) => void
}

type MainNavItem = (typeof navMain)[number]
type DocumentItem = (typeof documents)[number]
type SecondaryNavItem = (typeof secondaryNav)[number]

interface MainNavItemButtonProps {
  isActive: boolean
  item: MainNavItem
  onPageChange: (pageId: PageId) => void
}

const MainNavItemButton = ({
  isActive,
  item,
  onPageChange,
}: MainNavItemButtonProps) => {
  const Icon = item.icon
  const handleSelect = useCallback(() => {
    onPageChange(item.id)
  }, [item.id, onPageChange])

  return (
    <button
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-demo-control! text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground active:translate-y-px",
        isActive && activeItemClass
      )}
      onClick={handleSelect}
      type="button"
    >
      <Icon aria-hidden="true" className="size-3.5" />
      {item.title}
    </button>
  )
}

interface DocumentNavItemButtonProps {
  isActive: boolean
  item: DocumentItem
  onPageChange: (pageId: PageId) => void
}

const DocumentNavItemButton = ({
  isActive,
  item,
  onPageChange,
}: DocumentNavItemButtonProps) => {
  const Icon = item.icon
  const handleSelect = useCallback(() => {
    onPageChange(item.id)
  }, [item.id, onPageChange])

  return (
    <button
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "grid grid-cols-[1rem_minmax(0,1fr)] gap-2 rounded-md px-2 py-1.5 text-left text-demo-control! text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground active:translate-y-px",
        isActive && activeItemClass
      )}
      onClick={handleSelect}
      type="button"
    >
      <Icon aria-hidden="true" className="mt-0.5 size-3.5" />
      <span className="min-w-0">
        <span className="block truncate text-foreground">{item.title}</span>
        <span className="block truncate">{item.value}</span>
      </span>
    </button>
  )
}

interface SecondaryNavItemButtonProps {
  isActive: boolean
  item: SecondaryNavItem
  onPageChange: (pageId: PageId) => void
}

const SecondaryNavItemButton = ({
  isActive,
  item,
  onPageChange,
}: SecondaryNavItemButtonProps) => {
  const Icon = item.icon
  const handleSelect = useCallback(() => {
    onPageChange(item.id)
  }, [item.id, onPageChange])

  return (
    <Button
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "justify-start rounded-md text-demo-control!",
        isActive && activeItemClass
      )}
      onClick={handleSelect}
      size="sm"
      type="button"
      variant="ghost"
    >
      <Icon data-icon="inline-start" />
      {item.title}
    </Button>
  )
}

export const Sidebar = ({
  activePageId,
  desktopOpen,
  mobileOpen,
  onPageChange,
}: Props) => {
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false)

  const handleToggleProjectMenu = useCallback(() => {
    setIsProjectMenuOpen((isOpen) => !isOpen)
  }, [])

  const handleSearchOpen = useCallback(() => {
    onPageChange("search")
  }, [onPageChange])

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
          onClick={handleToggleProjectMenu}
          type="button"
        >
          <MavrySymbol className="size-5" />
          <span className="truncate font-semibold text-demo-control!">
            Mavry
          </span>
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
          onClick={handleSearchOpen}
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
            <div className="px-2 py-1.5 font-medium text-demo-metadata! text-muted-foreground">
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
                    <span className="block truncate font-medium text-demo-control!">
                      {project.name}
                    </span>
                    <span className="block truncate text-demo-metadata! text-muted-foreground">
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
          {navMain.map((item) => (
            <MainNavItemButton
              isActive={activePageId === item.id}
              item={item}
              key={item.id}
              onPageChange={onPageChange}
            />
          ))}
        </nav>

        <div className="flex flex-col gap-2">
          <p className="px-2 font-medium text-demo-metadata! text-muted-foreground">
            Documents
          </p>
          <nav
            aria-label="Mavry decision workspace documents"
            className="flex flex-col gap-1"
          >
            {documents.map((item) => (
              <DocumentNavItemButton
                isActive={activePageId === item.id}
                item={item}
                key={item.id}
                onPageChange={onPageChange}
              />
            ))}
          </nav>
        </div>
      </div>

      <div className="border-border/80 border-t p-2">
        <div className="flex flex-col gap-1">
          {secondaryNav.map((item) => (
            <SecondaryNavItemButton
              isActive={activePageId === item.id}
              item={item}
              key={item.id}
              onPageChange={onPageChange}
            />
          ))}
        </div>
      </div>
    </aside>
  )
}
