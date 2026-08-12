import { createFileRoute } from "@tanstack/react-router"
import { SectionReveal } from "@/components/landing/section-reveal"
import { Closing } from "@/components/sections/landing/closing"
import { Footer } from "@/components/sections/landing/footer"
import { Header } from "@/components/sections/landing/header"
import { Hero } from "@/components/sections/landing/hero"
import { Method } from "@/components/sections/landing/method"
import { Problem } from "@/components/sections/landing/problem"
import { Readiness } from "@/components/sections/landing/readiness"
import { Waitlist } from "@/components/sections/landing/waitlist"

export const Route = createFileRoute("/")({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div
      className="mx-auto flex min-h-svh w-full max-w-7xl flex-col bg-background px-5 pt-5 pb-24 text-foreground sm:px-8 lg:px-10"
      data-landing-shell
    >
      <SectionReveal />
      <Header />
      <Hero />
      <Problem />
      <Method />
      <Readiness />
      <Waitlist />
      <Closing />
      <Footer />
    </div>
  )
}
