import { Loop } from "@/components/demo/method-loop"

export const Method = () => (
  <section
    className="relative pt-16 pb-16 before:absolute before:top-0 before:left-1/2 before:h-px before:w-screen before:-translate-x-1/2 before:bg-[rgba(255,255,255,0.08)] sm:scroll-mt-8 sm:py-32"
    data-section-reveal=""
    id="method"
  >
    <div className="mb-12 grid gap-8 sm:mb-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:items-end">
      <div className="max-w-xl">
        <h2 className="font-semibold text-section tracking-normal md:text-section-lg xl:text-title">
          A product loop for moving from
          <span className="block text-muted-foreground">
            capture to next action.
          </span>
        </h2>
      </div>
      <p className="max-w-2xl text-large text-muted-foreground md:text-xlarge lg:justify-self-end">
        Each idea moves through the same sequence: capture it, clarify the user
        problem, classify its place in the MVP, record the cut when it does not
        belong, then review the next step.
      </p>
    </div>

    <Loop />
  </section>
)
