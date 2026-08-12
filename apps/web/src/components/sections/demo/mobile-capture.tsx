import { Button } from "@mavry/ui/components/button"
import { cn } from "@mavry/ui/lib/utils"
import { ListChecksIcon, QrCodeIcon, SmartphoneIcon } from "lucide-react"
import { Frame } from "@/components/demo/frame"
import type { Content } from "@/components/demo/page-data"
import { qrActiveCells, qrCells } from "@/components/demo/route-data"

export const MobileCapture = ({ content }: { content: Content }) => (
  <Frame content={content}>
    <div className="grid min-h-[29rem] lg:grid-cols-[minmax(18rem,0.95fr)_minmax(0,1.05fr)]">
      <section className="mx-auto w-full max-w-[17rem] self-start justify-self-center rounded-[1.75rem] border border-border/70 bg-background p-2 lg:self-center">
        <div className="rounded-[1.35rem] border border-border/70 bg-card/70 p-3">
          <div className="flex items-center justify-between gap-3">
            <p className="font-semibold text-small">Quick capture</p>
            <SmartphoneIcon
              aria-hidden="true"
              className="size-4 text-muted-foreground"
            />
          </div>
          <button
            className="mt-4 min-h-28 w-full rounded-lg border border-border/70 bg-background/70 p-3 text-left transition-colors hover:bg-muted/35 active:translate-y-px"
            type="button"
          >
            <p className="text-caption text-muted-foreground">Voice note</p>
            <p className="mt-2 font-medium text-small">
              Should mobile capture become a feature?
            </p>
          </button>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {["Clarify", "Save"].map((action) => (
              <Button
                className="rounded-md text-caption"
                key={action}
                size="sm"
                type="button"
                variant="outline"
              >
                {action}
              </Button>
            ))}
          </div>
        </div>
      </section>
      <section className="grid gap-4 border-border/70 border-t p-4 md:grid-cols-[minmax(0,1fr)_12rem] lg:border-t-0 lg:border-l">
        <div>
          <p className="font-medium text-caption">Synced into idea inbox</p>
          <div className="mt-3 flex flex-col gap-2">
            {[
              "Captured as an idea",
              "Marked as Needs clarity",
              "Kept out of MVP scope",
            ].map((item) => (
              <button
                className="flex items-center gap-2 rounded-md border border-border/70 bg-card/60 px-3 py-3 text-left text-caption transition-colors hover:bg-muted/35 active:translate-y-px"
                key={item}
                type="button"
              >
                <ListChecksIcon
                  aria-hidden="true"
                  className="size-4 text-muted-foreground"
                />
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-border/70 bg-card/55 p-3">
          <div className="flex items-center gap-2">
            <QrCodeIcon
              aria-hidden="true"
              className="size-4 text-muted-foreground"
            />
            <p className="font-medium text-caption">QR handoff preview</p>
          </div>
          <div className="relative mt-3 aspect-square overflow-hidden rounded-md border border-border/70 bg-background/70 p-3">
            {["top-3 left-3", "top-3 right-3", "bottom-3 left-3"].map(
              (position) => (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute z-10 size-8 rounded-[0.1875rem] border-[0.375rem] border-foreground/80 bg-background/90 after:absolute after:inset-1 after:rounded-[0.0625rem] after:bg-foreground/80",
                    position
                  )}
                  key={position}
                />
              )
            )}
            <div className="grid size-full grid-cols-[repeat(13,minmax(0,1fr))] gap-1">
              {qrCells.map((cell) => (
                <span
                  aria-hidden="true"
                  className={cn(
                    "rounded-[0.0625rem]",
                    qrActiveCells.has(`${cell.row}-${cell.column}`)
                      ? "bg-foreground/80"
                      : "bg-transparent"
                  )}
                  key={`${cell.row}-${cell.column}`}
                />
              ))}
            </div>
          </div>
          <p className="mt-3 text-caption text-muted-foreground">
            Open the same project on mobile for capture and quick review.
          </p>
        </div>
      </section>
    </div>
  </Frame>
)
