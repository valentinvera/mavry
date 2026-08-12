import { cn } from "@mavry/ui/lib/utils"
import { Frame } from "@/components/demo/frame"
import type { Content } from "@/components/demo/page-data"
import { homeDecisionSignals } from "@/components/demo/route-data"

export const Home = ({ content }: { content: Content }) => (
  <Frame content={content}>
    <div className="grid min-h-[29rem] overflow-hidden lg:grid-cols-[minmax(0,1fr)_16rem]">
      <section className="min-h-[29rem] px-5 py-6">
        <div className="max-w-xl">
          <h3 className="font-semibold text-xlarge">
            The first release is defined by scope, cuts, and one blocker.
          </h3>
          <p className="mt-3 text-muted-foreground text-small leading-relaxed">
            This page collects the current MVP state: the features that stay in,
            the ideas that have been cut, and the feedback owner that still
            blocks beta.
          </p>
        </div>
        <div className="mt-8">
          <p className="font-medium text-caption">Activity</p>
          <div className="mt-3 divide-y divide-border/70 border-border/70 border-y">
            {content.activities.map((item) => {
              const Icon = item.icon

              return (
                <button
                  className="grid w-full grid-cols-[1.75rem_minmax(0,1fr)_auto] gap-3 py-3 text-left transition-colors hover:text-foreground active:translate-y-px"
                  key={item.id}
                  type="button"
                >
                  <span className="flex size-6 items-center justify-center rounded-full border border-border/70 bg-card text-muted-foreground">
                    <Icon aria-hidden="true" className="size-3.5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium text-small">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-caption text-muted-foreground">
                      {item.description}
                    </span>
                  </span>
                  <span className="hidden text-caption text-muted-foreground sm:block">
                    {item.time}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {homeDecisionSignals.map((signal) => (
            <button
              className="border-border/70 border-l pl-3 text-left transition-colors hover:border-foreground/60 active:translate-y-px"
              key={signal.id}
              type="button"
            >
              <span
                className={cn(
                  "inline-block rounded-md border px-2 py-1 text-caption",
                  signal.className
                )}
              >
                {signal.value}
              </span>
              <span className="mt-3 block font-medium text-caption">
                {signal.label}
              </span>
            </button>
          ))}
        </div>
      </section>
      <aside className="border-border/70 border-t p-4 lg:border-t-0 lg:border-l">
        <p className="font-medium text-caption">Decision queue</p>
        <div className="mt-4 divide-y divide-border/70">
          {["Assign feedback owner", "Review cuts", "Open beta scope"].map(
            (action, index) => (
              <button
                className="grid w-full grid-cols-[1.75rem_minmax(0,1fr)] gap-3 py-4 text-left transition-colors hover:text-foreground active:translate-y-px"
                key={action}
                type="button"
              >
                <span className="flex size-7 items-center justify-center rounded-full border border-border/70 bg-card text-caption">
                  {index + 1}
                </span>
                <span>
                  <span className="block font-medium text-small">{action}</span>
                  <span className="mt-1 block text-caption text-muted-foreground">
                    This must be resolved before adding another feature.
                  </span>
                </span>
              </button>
            )
          )}
        </div>
      </aside>
    </div>
  </Frame>
)
