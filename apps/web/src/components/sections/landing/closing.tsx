import { Button } from "@mavry/ui/components/button"
import { requestOpen } from "@/lib/hero-demo"
import { requestEmailFocus } from "@/lib/waitlist-focus"

export const Closing = () => (
  <section
    className="relative isolate mt-2 mb-8 pt-14 pb-24 sm:mt-6 sm:mb-41 sm:scroll-mt-8 sm:py-28 md:mt-8 md:mb-21 md:pt-12 md:pb-36"
    data-section-reveal=""
    id="join"
  >
    <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-5 text-center sm:px-8">
      <h2
        className="max-w-4xl font-medium text-section-lg tracking-normal md:text-title xl:text-display"
        data-landing-section-title=""
      >
        Build from a scope you understand.
        <span className="block text-[#6e797b]">
          Keep the rest visible, but out of the MVP.
        </span>
      </h2>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button
          className="h-8 cursor-pointer rounded-md text-action!"
          onClick={requestEmailFocus}
          type="button"
        >
          Join waitlist
        </Button>
        <Button
          className="h-8 cursor-pointer rounded-md text-action!"
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
