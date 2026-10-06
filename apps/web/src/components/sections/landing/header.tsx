import { Navbar } from "@/components/landing/navbar"

export const Header = () => (
  <>
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 px-5 pt-4 sm:px-8 sm:pt-6">
      <Navbar />
    </header>
    <div aria-hidden="true" className="h-16 sm:h-20" />
  </>
)
