import { Button } from "@mavry/ui/components/button"
import { requestOpen } from "@/components/landing/demo"
import { requestEmailFocus } from "@/components/sections/landing/hero"

export const Closing = () => (
  <section
    className="relative pt-14 pb-24 sm:scroll-mt-8 sm:py-28 md:pt-12 md:pb-36"
    data-section-reveal=""
  >
    <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
      <h2 className="max-w-4xl font-semibold text-hero tracking-normal md:text-section-lg xl:text-display-lg">
        Build from a scope you understand.
        <span className="block text-muted-foreground">
          Keep the rest visible, but out of the MVP.
        </span>
      </h2>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button
          className="h-8 rounded-md text-small"
          onClick={requestEmailFocus}
          type="button"
        >
          Join waitlist
        </Button>
        <Button
          className="h-8 rounded-md text-small"
          onClick={requestOpen}
          type="button"
          variant="outline"
        >
          <span className="md:hidden">Open demo</span>
          <span className="hidden md:inline">View demo</span>
        </Button>
      </div>
    </div>
  </section>
)
