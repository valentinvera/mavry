import { Frame } from "@/components/demo/frame"
import type { Content } from "@/components/demo/page-data"

export const DecisionLog = ({ content }: { content: Content }) => (
  <Frame content={content}>
    <div className="grid min-h-[29rem] overflow-hidden lg:grid-cols-[13rem_minmax(0,1fr)]">
      <aside className="border-border/70 border-b p-4 lg:border-r lg:border-b-0">
        <p className="font-medium text-demo-metadata!">Decision types</p>
        <div className="mt-4 divide-y divide-border/70">
          {content.chips.map((chip) => (
            <button
              className="w-full py-3 text-left text-demo-control! transition-colors hover:text-foreground active:translate-y-px"
              key={chip}
              type="button"
            >
              {chip}
            </button>
          ))}
        </div>
      </aside>
      <section className="p-4">
        <div className="relative">
          <div className="absolute top-9 bottom-9 left-4 w-px bg-border/70" />
          {content.activities.map((item, index) => {
            const Icon = item.icon

            return (
              <button
                className="grid w-full gap-3 border-border/70 border-b py-5 text-left transition-colors last:border-b-0 hover:text-foreground active:translate-y-px sm:grid-cols-[2.5rem_minmax(0,1fr)_5rem]"
                key={item.id}
                type="button"
              >
                <span className="relative flex size-8 items-center justify-center rounded-full border border-border/70 bg-background">
                  <Icon
                    aria-hidden="true"
                    className="size-4 text-muted-foreground"
                  />
                </span>
                <span>
                  <span className="block text-demo-metadata! text-muted-foreground">
                    Decision {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-1 block font-medium text-demo-control!">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-demo-metadata! text-muted-foreground">
                    {item.description}
                  </span>
                </span>
                <span className="text-demo-metadata! text-muted-foreground">
                  {item.time}
                </span>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  </Frame>
)
