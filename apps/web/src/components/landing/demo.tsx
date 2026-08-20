import { Button } from "@mavry/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@mavry/ui/components/dialog"
import { Maximize2Icon } from "lucide-react"
import { useEffect, useState } from "react"
import { Workspace } from "@/components/demo/product-decision-workspace"

export const ID = "hero-demo"

const OPEN_EVENT = "mavry:open-hero-demo"

export const requestOpen = () => {
  window.dispatchEvent(new Event(OPEN_EVENT))
}

export const HeroDemo = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const open = () => {
      const demo = document.getElementById(ID)
      const shouldOpenDialog = window.matchMedia("(max-width: 767px)").matches

      demo?.scrollIntoView({
        behavior: "smooth",
        block: shouldOpenDialog ? "center" : "start",
      })

      if (!shouldOpenDialog) {
        return
      }

      window.setTimeout(() => {
        setIsDialogOpen(true)
      }, 450)
    }

    window.addEventListener(OPEN_EVENT, open)

    return () => {
      window.removeEventListener(OPEN_EVENT, open)
    }
  }, [])

  return (
    <div className="w-full text-left md:scroll-mt-28" id={ID}>
      <div className="hidden md:block">
        <Workspace />
      </div>

      <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
        <div className="mx-auto flex w-full max-w-[22rem] flex-col items-center gap-3 md:hidden">
          <div className="relative h-[17rem] w-full overflow-hidden rounded-lg border bg-card/60 shadow-lg">
            <div className="pointer-events-none h-full overflow-hidden">
              <Workspace
                className="rounded-none border-0 shadow-none"
                interactive={false}
              />
            </div>
            <DialogTrigger
              render={
                <Button
                  aria-label="Open full Mavry dashboard demo"
                  className="absolute inset-0 h-full w-full rounded-lg bg-transparent p-0 hover:bg-transparent"
                  type="button"
                  variant="ghost"
                />
              }
            />
          </div>
          <DialogTrigger
            render={
              <Button
                aria-label="Open full Mavry dashboard demo"
                className="rounded-md text-demo-control!"
                size="sm"
                type="button"
              />
            }
          >
            Open Demo
            <Maximize2Icon data-icon="inline-end" />
          </DialogTrigger>
        </div>

        <DialogContent
          className="max-h-[92svh] max-w-[calc(100vw-1rem)] overflow-hidden rounded-lg p-3 sm:p-4 md:max-w-6xl md:overflow-y-auto"
          data-smooth-scroll=""
        >
          <DialogHeader className="pr-9">
            <DialogTitle>Mavry decision workspace</DialogTitle>
            <DialogDescription>
              Select captured ideas, inspect the scope decision, and review what
              still blocks launch.
            </DialogDescription>
          </DialogHeader>
          <Workspace className="max-md:h-[calc(92svh-8.75rem)] max-md:[&>div]:h-full" />
        </DialogContent>
      </Dialog>
    </div>
  )
}
