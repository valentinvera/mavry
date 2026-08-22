import { Highlights } from "@/components/demo/waitlist-highlights"
import { LandscapeDemoContainer } from "@/components/landing/landscape-demo-container"

export const Waitlist = () => (
  <section
    className="relative pt-16 pb-28 before:absolute before:top-0 before:left-1/2 before:h-px before:w-screen before:-translate-x-1/2 before:bg-border sm:scroll-mt-8 sm:py-32"
    data-section-reveal=""
    id="review"
  >
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:items-end">
      <div className="max-w-xl">
        <h2
          className="font-medium text-subtitle tracking-normal md:text-section-lg xl:text-title"
          data-landing-section-title=""
        >
          Early access starts with a real
          <span className="block text-muted-foreground">
            product review workspace.
          </span>
        </h2>
      </div>
      <p
        className="max-w-2xl text-body text-muted-foreground md:text-paragraph-md lg:justify-self-end xl:text-paragraph-xl"
        data-landing-section-copy=""
      >
        The first version of Mavry is built for founders who need to organize an
        existing product idea, review feature pressure, and leave with a smaller
        MVP plan.
      </p>
    </div>

    <LandscapeDemoContainer className="mt-16" variant="lowerTrail">
      <Highlights />
    </LandscapeDemoContainer>
  </section>
)
