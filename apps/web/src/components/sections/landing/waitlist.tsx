import { Highlights } from "@/components/demo/waitlist-highlights"

export const Waitlist = () => (
  <section
    className="relative pt-16 pb-28 before:absolute before:top-0 before:left-1/2 before:h-px before:w-screen before:-translate-x-1/2 before:bg-[rgba(255,255,255,0.08)] sm:scroll-mt-8 sm:py-32"
    data-section-reveal=""
    id="review"
  >
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:items-end">
      <div className="max-w-xl">
        <h2 className="font-semibold text-section tracking-normal md:text-section-lg xl:text-title">
          Early access starts with a real
          <span className="block text-muted-foreground">
            product review workspace.
          </span>
        </h2>
      </div>
      <p className="max-w-2xl text-large text-muted-foreground md:text-xlarge lg:justify-self-end">
        The first version of Mavry is built for founders who need to organize an
        existing product idea, review feature pressure, and leave with a smaller
        MVP plan.
      </p>
    </div>

    <div className="mt-16">
      <Highlights />
    </div>
  </section>
)
