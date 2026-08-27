import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"
import { SectionReveal } from "@/components/landing/section-reveal"
import { Closing } from "@/components/sections/landing/closing"
import { Faq } from "@/components/sections/landing/faq"
import { Footer } from "@/components/sections/landing/footer"
import { Header } from "@/components/sections/landing/header"
import { Hero } from "@/components/sections/landing/hero"
import { Method } from "@/components/sections/landing/method"
import { Problem } from "@/components/sections/landing/problem"
import { Readiness } from "@/components/sections/landing/readiness"
import { Waitlist } from "@/components/sections/landing/waitlist"
import { scrollToLandingSection } from "@/lib/landing-navigation"
import { getWaitlistConfirmedCountQueryOptions } from "@/lib/waitlist"

export const Route = createFileRoute("/")({
  component: HomeComponent,
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(
      getWaitlistConfirmedCountQueryOptions(context.trpc)
    )
  },
})

function HomeComponent() {
  useEffect(() => {
    const hash = window.location.hash

    if (!hash) {
      return
    }

    try {
      const sectionId = decodeURIComponent(hash.slice(1))

      if (sectionId) {
        scrollToLandingSection(sectionId, hash, "instant")
      }
    } catch {
      // Ignore malformed URL fragments and preserve the browser's position.
    }
  }, [])

  return (
    <div className="w-full overflow-x-clip">
      <div className="mx-auto flex min-h-svh w-full max-w-7xl flex-col bg-background px-5 pt-5 pb-4 text-foreground sm:px-8 lg:px-10">
        <SectionReveal />
        <Header />
        <Hero />
        <Problem />
        <Method />
        <Readiness />
        <Waitlist />
        <Faq />
        <Closing />
        <Footer />
      </div>
    </div>
  )
}
