import { Badge } from "@mavry/ui/components/badge"
import { Button } from "@mavry/ui/components/button"
import { cn } from "@mavry/ui/lib/utils"
import {
  ArrowUpIcon,
  CircleDotDashedIcon,
  Maximize2Icon,
  Minimize2Icon,
  PaperclipIcon,
  XIcon,
} from "lucide-react"
import { useState } from "react"
import { MavrySymbol } from "@/components/brand/mavry-symbol"
import type { PageId } from "@/components/demo/data"
import { contentByPage } from "@/components/demo/page-data"

interface Props {
  activePageId: PageId
}

export const ReviewPanel = ({ activePageId }: Props) => {
  const [isMinimized, setIsMinimized] = useState(false)
  const pageContent = contentByPage[activePageId]

  if (activePageId === "mobile-capture") {
    return null
  }

  return (
    <section
      aria-label="Mavry launch review panel"
      className={cn(
        "hidden overflow-hidden rounded-lg border border-border/80 bg-popover shadow-[0_24px_80px_-32px_rgb(0_0_0_/_0.9)] transition-[width] duration-200 ease-out xl:absolute xl:right-5 xl:bottom-5 xl:z-20 xl:block",
        isMinimized ? "w-[17rem]" : "w-[25rem]"
      )}
    >
      <header
        className={cn(
          "flex h-12 items-center justify-between gap-3 px-3",
          !isMinimized && "border-border/80 border-b"
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          <MavrySymbol className="size-4" />
          <p className="truncate font-medium text-demo-metadata!">Mavry</p>
          <Badge
            className="rounded-md border-border/80 bg-background/60 text-demo-metadata!"
            variant="outline"
          >
            {pageContent.context}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button
            aria-label={isMinimized ? "Open review" : "Minimize review"}
            className="rounded-md text-muted-foreground"
            onClick={() => setIsMinimized((current) => !current)}
            size="icon-xs"
            type="button"
            variant="ghost"
          >
            {isMinimized ? <Maximize2Icon /> : <Minimize2Icon />}
          </Button>
          {!isMinimized && (
            <Button
              aria-label="Expand review"
              className="rounded-md text-muted-foreground"
              onClick={() => setIsMinimized(false)}
              size="icon-xs"
              type="button"
              variant="ghost"
            >
              <Maximize2Icon />
            </Button>
          )}
          <Button
            aria-label="Close review"
            className="rounded-md text-muted-foreground"
            size="icon-xs"
            type="button"
            variant="ghost"
          >
            <XIcon />
          </Button>
        </div>
      </header>

      {!isMinimized && (
        <>
          <div className="min-h-28 px-3 py-4">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center text-success-foreground">
                <CircleDotDashedIcon aria-hidden="true" className="size-3.5" />
              </span>
              <div className="min-w-0">
                <p className="text-demo-metadata! text-muted-foreground">
                  Mavry connected to {pageContent.code}
                </p>
                <p className="mt-3 text-demo-metadata!">
                  {pageContent.description}
                </p>
                <p className="mt-3 text-demo-metadata! text-muted-foreground">
                  Thinking through launch risk...
                </p>
              </div>
            </div>
          </div>

          <div className="border-border/80 border-t p-3">
            <div className="rounded-md border border-border/80 bg-background/60 p-2">
              <p className="px-1 py-2 text-demo-metadata! text-muted-foreground">
                {pageContent.reviewPrompt}
              </p>
              <div className="flex items-center justify-end gap-1">
                <Button
                  aria-label="Attach context"
                  className="rounded-md text-muted-foreground"
                  size="icon-xs"
                  type="button"
                  variant="ghost"
                >
                  <PaperclipIcon />
                </Button>
                <Button
                  aria-label="Send review prompt"
                  className="rounded-md"
                  size="icon-xs"
                  type="button"
                >
                  <ArrowUpIcon />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
