import { Stack } from "@/components/demo/layered-decision-stack"

export const Problem = () => (
  <section
    className="flex flex-col gap-12 pt-20 pb-16 sm:scroll-mt-8 sm:gap-16 sm:py-32"
    data-section-reveal=""
    id="workspace"
  >
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:items-end">
      <div className="max-w-xl">
        <h2 className="font-semibold text-section tracking-normal md:text-section-lg xl:text-title">
          Most early products collect ideas faster
          <span className="block text-muted-foreground">
            than they make decisions.
          </span>
        </h2>
      </div>
      <p className="max-w-2xl text-large text-muted-foreground md:text-xlarge lg:justify-self-end">
        Mavry turns a crowded feature list into a decision map: which items
        prove the product hypothesis, which support the launch, which should
        wait, and which should be cut with a reason.
      </p>
    </div>

    <Stack />
  </section>
)
