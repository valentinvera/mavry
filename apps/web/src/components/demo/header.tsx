import { Badge } from "@mavry/ui/components/badge"
import { Button } from "@mavry/ui/components/button"
import { Separator } from "@mavry/ui/components/separator"
import {
  BellIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CopyIcon,
  GitBranchIcon,
  LinkIcon,
  MoreHorizontalIcon,
  PanelLeftIcon,
  SearchIcon,
} from "lucide-react"

interface Props {
  onSearchOpen: () => void
  onToggleSidebar: () => void
  pageCode: string
  pageTitle: string
}

export const Header = ({
  onSearchOpen,
  onToggleSidebar,
  pageCode,
  pageTitle,
}: Props) => (
  <header className="flex h-12 shrink-0 items-center gap-2 border-border/80 border-b bg-transparent px-3">
    <Button
      aria-label="Toggle decision workspace sidebar"
      className="rounded-md text-muted-foreground hover:text-foreground"
      onClick={onToggleSidebar}
      size="icon-sm"
      type="button"
      variant="ghost"
    >
      <PanelLeftIcon />
    </Button>
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <p className="truncate font-medium text-caption">{pageTitle}</p>
      <Button
        aria-label="Open decision menu"
        className="rounded-md text-muted-foreground"
        size="icon-xs"
        type="button"
        variant="ghost"
      >
        <MoreHorizontalIcon />
      </Button>
      <Separator className="h-4 bg-border/80" orientation="vertical" />
      <button className="rounded-md active:translate-y-px" type="button">
        <Badge
          className="rounded-md border-border/80 bg-background/60 text-caption"
          variant="outline"
        >
          {pageCode}
        </Badge>
      </button>
    </div>
    <div className="hidden items-center gap-1 text-caption text-muted-foreground lg:flex">
      <span>03 / 18</span>
      <Button
        aria-label="Previous decision"
        className="rounded-md"
        size="icon-xs"
        type="button"
        variant="ghost"
      >
        <ChevronUpIcon />
      </Button>
      <Button
        aria-label="Next decision"
        className="rounded-md"
        size="icon-xs"
        type="button"
        variant="ghost"
      >
        <ChevronDownIcon />
      </Button>
    </div>
    <button
      className="hidden h-7 min-w-44 items-center gap-2 rounded-md border border-border/80 bg-background/60 px-2 text-left text-caption text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground active:translate-y-px xl:flex"
      onClick={onSearchOpen}
      type="button"
    >
      <SearchIcon aria-hidden="true" className="size-3.5" />
      Search decisions
    </button>
    <Button
      aria-label="Copy decision link"
      className="hidden rounded-md text-muted-foreground hover:text-foreground lg:inline-flex"
      size="icon-sm"
      type="button"
      variant="ghost"
    >
      <LinkIcon />
    </Button>
    <Button
      aria-label="Copy decision ID"
      className="hidden rounded-md text-muted-foreground hover:text-foreground lg:inline-flex"
      size="icon-sm"
      type="button"
      variant="ghost"
    >
      <CopyIcon />
    </Button>
    <Button
      aria-label="Copy branch name"
      className="hidden rounded-md text-muted-foreground hover:text-foreground lg:inline-flex"
      size="icon-sm"
      type="button"
      variant="ghost"
    >
      <GitBranchIcon />
    </Button>
    <Button
      aria-label="Open launch blocker alerts"
      className="rounded-md text-muted-foreground hover:text-foreground"
      size="icon-sm"
      type="button"
      variant="ghost"
    >
      <BellIcon />
    </Button>
  </header>
)
