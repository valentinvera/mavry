import {
  CalendarCheckIcon,
  CheckCircle2Icon,
  CornerDownRightIcon,
  ScissorsIcon,
} from "lucide-react"
import { documents } from "@/components/demo/data"

const trail = [
  ["Scope", "Core and Support are separated"],
  ["Cuts", "Cut reasons remain visible"],
  ["Launch", "Feedback owner is still blocking"],
] as const

export const Highlights = () => (
  <div className="relative rounded-xl border border-border bg-card/45 px-4 py-10 md:px-6">
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <section className="min-w-0">
        <div className="flex items-end justify-between gap-4 border-border border-b pb-5">
          <div>
            <p className="font-medium text-medium">Early access review</p>
            <p className="mt-1 max-w-lg text-caption text-muted-foreground">
              Early users start with the same review structure shown in the
              product demo.
            </p>
          </div>
          <CalendarCheckIcon
            aria-hidden="true"
            className="hidden size-4 text-muted-foreground sm:block"
          />
        </div>

        <div className="relative mt-10">
          <div className="grid gap-8">
            {documents.map((document, index) => {
              const Icon = document.icon
              const isLastDocument = index === documents.length - 1

              return (
                <button
                  className="group relative grid grid-cols-[minmax(0,1fr)_auto] gap-4 pl-8 text-left transition-opacity hover:opacity-80 active:translate-y-px"
                  data-motion-item=""
                  key={document.id}
                  style={{ transitionDelay: `${160 + index * 90}ms` }}
                  type="button"
                >
                  {isLastDocument ? null : (
                    <span
                      aria-hidden="true"
                      className="absolute top-[0.625rem] -bottom-[2.625rem] left-[0.375rem] w-px bg-border"
                    />
                  )}
                  <span className="absolute top-1 left-0 flex size-3 items-center justify-center rounded-full border border-border bg-background">
                    <span className="size-1 rounded-full bg-muted-foreground transition-colors group-hover:bg-foreground" />
                  </span>
                  <span className="min-w-0 border-border border-b pb-7">
                    <span className="flex items-center gap-2 font-medium text-medium">
                      <Icon
                        aria-hidden="true"
                        className="size-3.5 text-muted-foreground"
                      />
                      {document.title}
                    </span>
                    <span className="mt-2 block text-caption text-muted-foreground">
                      Opens with context from the current MVP review.
                    </span>
                  </span>
                  <span className="text-caption text-muted-foreground">
                    {document.value}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <aside className="flex flex-col justify-between gap-10 border-border border-t pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
        <div className="divide-y divide-border">
          {trail.map(([label, value], index) => (
            <button
              className="w-full py-5 text-left transition-opacity hover:opacity-80 active:translate-y-px"
              data-motion-item=""
              key={label}
              style={{ transitionDelay: `${300 + index * 90}ms` }}
              type="button"
            >
              <span className="flex items-center gap-2 text-caption text-muted-foreground">
                <CornerDownRightIcon aria-hidden="true" className="size-3.5" />
                {label}
              </span>
              <span className="mt-1 block font-medium text-caption">
                {value}
              </span>
            </button>
          ))}
        </div>

        <button
          className="border-border border-t pt-6 text-left transition-opacity hover:opacity-80 active:translate-y-px"
          data-motion-pop=""
          style={{ transitionDelay: "620ms" }}
          type="button"
        >
          <span className="flex items-center gap-2 text-caption text-success-foreground">
            <CheckCircle2Icon aria-hidden="true" className="size-3.5" />
            Built for the first product owner
          </span>
          <span className="mt-3 block text-caption text-muted-foreground">
            The first release is optimized for one builder deciding scope before
            collaboration adds more process.
          </span>
        </button>

        <button
          className="flex items-center gap-3 border-border border-t pt-6 text-left transition-opacity hover:opacity-80 active:translate-y-px"
          data-motion-item=""
          style={{ transitionDelay: "720ms" }}
          type="button"
        >
          <ScissorsIcon
            aria-hidden="true"
            className="size-4 text-muted-foreground"
          />
          <span className="text-caption text-muted-foreground">
            The cut list is part of the review, not a hidden archive.
          </span>
        </button>
      </aside>
    </div>
  </div>
)
