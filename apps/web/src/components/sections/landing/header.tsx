import { cn } from "@mavry/ui/lib/utils"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/landing/navbar"

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const updateScrollState = () => {
      setIsScrolled(window.scrollY > 8)
    }

    updateScrollState()
    window.addEventListener("scroll", updateScrollState, { passive: true })

    return () => {
      window.removeEventListener("scroll", updateScrollState)
    }
  }, [])

  return (
    <>
      <header className="fixed inset-x-0 top-0 isolate z-50 h-[65px] sm:h-20">
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 z-0 h-full transition-[background-color,backdrop-filter] duration-150",
            isScrolled
              ? "bg-background/70 backdrop-blur-glass"
              : "bg-background backdrop-blur-none"
          )}
          style={{
            WebkitBackdropFilter: isScrolled
              ? "blur(var(--glass-blur))"
              : "none",
          }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-50 h-px bg-border"
        />
        <div className="relative z-10 mx-auto mt-3.5 grid h-10 w-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 sm:mt-5 sm:px-8 lg:px-10">
          <Navbar />
        </div>
      </header>
      <div aria-hidden="true" className="h-[65px] sm:h-20" />
    </>
  )
}
