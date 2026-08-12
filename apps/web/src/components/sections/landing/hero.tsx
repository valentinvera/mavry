import { Button } from "@mavry/ui/components/button"
import { Input } from "@mavry/ui/components/input"
import { HeroDemo } from "@/components/landing/demo"

export const FOCUS_EVENT = "mavry:focus-waitlist-email"

const INPUT_ID = "hero-waitlist-email"
const UNLOCK_DELAY = 350

const focusEmail = () => {
  const input = document.getElementById(INPUT_ID)

  if (!(input instanceof HTMLInputElement)) {
    return
  }

  input.scrollIntoView({ behavior: "smooth", block: "center" })

  window.setTimeout(() => {
    input.focus({ preventScroll: true })
  }, 450)
}

export const requestEmailFocus = () => {
  const isPageScrollLocked = document.body.style.overflow === "hidden"
  const focusDelay = isPageScrollLocked ? UNLOCK_DELAY : 0

  window.dispatchEvent(new Event(FOCUS_EVENT))

  window.setTimeout(() => {
    focusEmail()
  }, focusDelay)
}

export const Hero = () => (
  <section className="relative isolate flex min-h-[calc(100svh-5rem)] flex-col items-center justify-center gap-10 pt-16 pb-8 text-center sm:scroll-mt-8 sm:gap-12 sm:pt-24 sm:pb-0 md:pt-28 lg:pt-24">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-1/2 top-[44%] -z-10 h-[62%] w-screen -translate-x-1/2 sm:top-[38%]"
      style={{
        background:
          "radial-gradient(ellipse 86% 42% at 50% 24%, color-mix(in oklch, var(--foreground) 18%, transparent) 0%, color-mix(in oklch, var(--muted) 35%, transparent) 42%, transparent 78%), radial-gradient(ellipse 90% 48% at 50% 78%, color-mix(in oklch, var(--foreground) 20%, transparent) 0%, color-mix(in oklch, var(--muted) 42%, transparent) 38%, transparent 76%), linear-gradient(180deg, transparent 0%, color-mix(in oklch, var(--foreground) 6%, transparent) 28%, color-mix(in oklch, var(--muted) 18%, transparent) 72%, var(--background) 100%)",
        maskImage:
          "linear-gradient(180deg, transparent 0%, black 10%, black 84%, transparent 100%)",
      }}
    />
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-1/2 -bottom-16 -z-10 h-[40%] w-screen -translate-x-1/2"
      style={{
        background:
          "linear-gradient(180deg, transparent 0%, color-mix(in oklch, var(--foreground) 9%, transparent) 42%, color-mix(in oklch, var(--muted) 36%, transparent) 100%)",
        maskImage:
          "radial-gradient(ellipse 78% 106% at 50% 52%, black 0%, black 38%, transparent 86%)",
      }}
    />
    <div className="relative flex max-w-5xl flex-col items-center gap-6 sm:gap-7">
      <div className="flex flex-col items-center gap-5">
        <h1 className="text-balance font-bold text-hero tracking-normal md:text-display xl:text-display-lg">
          Know what belongs in your first release.
        </h1>
        <p className="max-w-3xl text-large text-muted-foreground">
          Mavry helps builders capture product ideas, clarify what each feature
          proves, decide what belongs in the first version, and keep launch
          blockers visible before the backlog grows.
        </p>
      </div>
      <form className="flex w-full max-w-md flex-col items-center gap-2">
        <div className="flex w-full items-center justify-center gap-2 sm:w-auto">
          <label className="sr-only" htmlFor="hero-waitlist-email">
            Email
          </label>
          <Input
            className="h-8 flex-1 rounded-md bg-background/70 text-small sm:w-60 sm:flex-none"
            id="hero-waitlist-email"
            placeholder="builder@example.com"
            type="email"
          />
          <Button className="h-8 rounded-md text-small" size="sm" type="button">
            Join waitlist
          </Button>
        </div>
        <p className="text-caption text-muted-foreground">
          Early access for founders shaping a focused first release.
        </p>
      </form>
    </div>
    <div className="relative w-full max-w-7xl text-left">
      <HeroDemo />
    </div>
  </section>
)
