import { Button } from "@mavry/ui/components/button"
import { requestOpen } from "@/components/landing/demo"
import { requestEmailFocus } from "@/components/sections/landing/hero"

export const Closing = () => (
  <section
    className="relative isolate mt-2 mb-8 pt-14 pb-24 sm:mt-6 sm:mb-41 sm:scroll-mt-8 sm:py-28 md:mt-8 md:mb-21 md:pt-12 md:pb-36"
    data-section-reveal=""
  >
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 -top-5 bottom-5 z-0 overflow-hidden rounded-2xl bg-cover bg-no-repeat sm:inset-y-0 md:-top-12 md:bottom-12"
      style={{
        backgroundImage: "url('/landing/hero-demo-madeira-cliffs.png')",
        backgroundPosition: "86% 78%",
      }}
    >
      <div className="absolute inset-0 dark:bg-background/65" />
    </div>
    <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-5 text-center sm:px-8">
      <h2 className="max-w-4xl font-medium text-section-lg tracking-normal md:text-title xl:text-display">
        Build from a scope you understand.
        <span className="block text-muted-foreground">
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
