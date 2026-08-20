import { DirectionPanel } from "@/components/demo/direction-panel"
import { LandscapeDemoContainer } from "@/components/landing/landscape-demo-container"

export const Readiness = () => (
  <section
    className="relative pt-16 pb-16 before:absolute before:top-0 before:left-1/2 before:h-px before:w-screen before:-translate-x-1/2 before:bg-[rgba(255,255,255,0.08)] sm:scroll-mt-8 sm:py-32"
    data-section-reveal=""
    id="readiness"
  >
    <div className="grid gap-12">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:items-end">
        <div className="max-w-xl">
          <h2
            className="font-medium text-subtitle tracking-normal md:text-section-lg xl:text-title"
            data-landing-section-title=""
          >
            Readiness is based on what is clear,
            <span className="block text-muted-foreground">
              blocked, and intentionally left out.
            </span>
          </h2>
        </div>
        <p
          className="max-w-2xl text-body text-muted-foreground md:text-paragraph-md lg:justify-self-end xl:text-paragraph-xl"
          data-landing-section-copy=""
        >
          Mavry shows whether the product hypothesis, core scope, cut list,
          roadmap, feedback route, and next actions are ready enough for the
          next release.
        </p>
      </div>

      <LandscapeDemoContainer variant="coastline">
        <DirectionPanel />
      </LandscapeDemoContainer>
    </div>
  </section>
)
