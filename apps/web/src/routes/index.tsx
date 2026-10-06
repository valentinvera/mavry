import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"
import { SectionReveal } from "@/components/landing/section-reveal"
import { Capture } from "@/components/sections/landing/capture"
import { Clarify } from "@/components/sections/landing/clarify"
import { Closing } from "@/components/sections/landing/closing"
import { Decisions } from "@/components/sections/landing/decisions"
import { Faq } from "@/components/sections/landing/faq"
import { Footer } from "@/components/sections/landing/footer"
import { Header } from "@/components/sections/landing/header"
import { Hero } from "@/components/sections/landing/hero"
import { Hypothesis } from "@/components/sections/landing/hypothesis"
import { Intake } from "@/components/sections/landing/intake"
import { Mobile } from "@/components/sections/landing/mobile"
import { Overview } from "@/components/sections/landing/overview"
import { Priority } from "@/components/sections/landing/priority"
import { Readiness } from "@/components/sections/landing/readiness"
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
    <div
      className="min-h-svh w-full overflow-x-clip bg-background font-sans text-foreground"
      data-fixed-color-scheme=""
    >
      <SectionReveal />
      <div
        className="relative overflow-hidden pb-14 sm:pb-[88px]"
        data-landing-intro=""
        suppressHydrationWarning
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 bg-[url('/landing/alpine-clear-sunrise-light.webp')] bg-center bg-cover bg-no-repeat"
          data-intro-item="bg"
          data-landing-background=""
        >
          <div
            className="absolute inset-x-0 bottom-0 h-[88px] bg-linear-to-b from-transparent to-[var(--mavry-white)]"
            data-hero-fade=""
          />
        </div>
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-5 pt-5 sm:px-8 lg:px-10">
          <Header />
          <Hero />
        </div>
        <script>
          {`var i=document.currentScript?document.currentScript.closest('[data-landing-intro]'):null;if(i){requestAnimationFrame(function(){requestAnimationFrame(function(){i.setAttribute('data-intro','true')})})}`}
        </script>
      </div>
      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <main className="flex flex-col">
          <Overview />
          <Intake />
          <Capture />
          <Clarify />
          <Decisions />
          <Priority />
          <Hypothesis />
          <Readiness />
          <Mobile />
        </main>
      </div>
      <Faq />
      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <Closing />
      </div>
      <Footer />
    </div>
  )
}
