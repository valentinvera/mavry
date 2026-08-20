import { Button } from "@mavry/ui/components/button"
import { Separator } from "@mavry/ui/components/separator"
import { cn } from "@mavry/ui/lib/utils"
import { MenuIcon, XIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { MavryWordmark } from "@/components/brand/mavry-wordmark"
import {
  FOCUS_EVENT,
  requestEmailFocus,
} from "@/components/sections/landing/hero"

const ANIMATION_DURATION = 300
const ctaClassName = "rounded-md text-action!"

const items = [
  { id: "workspace", label: "Workspace", href: "#workspace" },
  { id: "method", label: "Method", href: "#method" },
  { id: "readiness", label: "Readiness", href: "#readiness" },
  { id: "review", label: "Review", href: "#review" },
] as const

const groups = [
  {
    id: "system",
    label: "Decision system",
    items,
  },
] as const

export const Navbar = () => (
  <>
    <a
      aria-label="Mavry home"
      className="relative z-10 col-start-1 inline-flex justify-self-start rounded-md"
      href="/"
    >
      <MavryWordmark />
    </a>
    <nav
      aria-label="Landing sections"
      className="relative z-10 col-start-2 hidden items-center gap-6 justify-self-center text-muted-foreground text-nav md:flex"
    >
      {items.map((item) => (
        <a
          className="rounded-md px-2 py-1 transition-colors hover:text-foreground"
          href={item.href}
          key={item.id}
        >
          {item.label}
        </a>
      ))}
    </nav>
    <div className="relative z-10 col-start-3 flex items-center gap-2 justify-self-end">
      <Button
        className={cn("h-8 md:hidden", ctaClassName)}
        onClick={requestEmailFocus}
        size="default"
        type="button"
      >
        Join waitlist
      </Button>
      <span
        aria-hidden="true"
        className="flex h-9 w-3 items-center justify-center md:hidden"
      >
        <Separator
          className="h-5 translate-x-1 bg-foreground/20 data-vertical:self-center"
          orientation="vertical"
        />
      </span>
      <MobileMenu />
      <Button
        className={cn("hidden h-8 md:inline-flex", ctaClassName)}
        onClick={requestEmailFocus}
        size="sm"
        type="button"
      >
        Join waitlist
      </Button>
    </div>
  </>
)

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMenuMounted, setIsMenuMounted] = useState(false)

  useEffect(() => {
    if (!isMenuMounted) {
      return
    }

    const { body, documentElement } = document
    const previousBodyOverflow = body.style.overflow
    const previousDocumentOverflow = documentElement.style.overflow

    body.style.overflow = "hidden"
    documentElement.style.overflow = "hidden"

    return () => {
      body.style.overflow = previousBodyOverflow
      documentElement.style.overflow = previousDocumentOverflow
    }
  }, [isMenuMounted])

  useEffect(() => {
    if (!isMenuMounted) {
      return
    }

    const animationFrame = requestAnimationFrame(() => {
      setIsOpen(true)
    })

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [isMenuMounted])

  useEffect(() => {
    if (isOpen || !isMenuMounted) {
      return
    }

    const timeout = window.setTimeout(() => {
      setIsMenuMounted(false)
    }, ANIMATION_DURATION)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [isOpen, isMenuMounted])

  useEffect(() => {
    const closeMenuOnWaitlistFocus = () => {
      setIsOpen(false)
    }

    window.addEventListener(FOCUS_EVENT, closeMenuOnWaitlistFocus)

    return () => {
      window.removeEventListener(FOCUS_EVENT, closeMenuOnWaitlistFocus)
    }
  }, [])

  const toggleMenu = () => {
    if (isOpen) {
      setIsOpen(false)
      return
    }

    if (isMenuMounted) {
      setIsOpen(true)
      return
    }

    setIsMenuMounted(true)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <div className="relative md:hidden">
      <Button
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        className="relative rounded-md bg-transparent text-body text-muted-foreground hover:bg-transparent hover:text-foreground aria-expanded:bg-transparent aria-expanded:text-muted-foreground aria-expanded:hover:bg-transparent aria-expanded:hover:text-foreground dark:aria-expanded:bg-transparent dark:hover:bg-transparent dark:aria-expanded:hover:bg-transparent"
        onClick={toggleMenu}
        size="icon-lg"
        type="button"
        variant="ghost"
      >
        <span className="sr-only">Open navigation menu</span>
        <MenuIcon
          aria-hidden="true"
          className={cn(
            "absolute inset-0 m-auto size-5 translate-y-[3px] scale-100 text-[var(--mavry-white)] opacity-100 transition-[opacity,scale] duration-300 ease-out",
            isOpen && "scale-75 opacity-0"
          )}
          strokeWidth={1}
        />
        <XIcon
          aria-hidden="true"
          className={cn(
            "absolute inset-0 m-auto size-5 translate-y-[3px] scale-75 text-[var(--mavry-white)] opacity-0 transition-[opacity,scale] duration-300 ease-out",
            isOpen && "scale-100 opacity-100"
          )}
          strokeWidth={1}
        />
      </Button>
      {isMenuMounted ? (
        <nav
          aria-label="Mobile landing sections"
          className={cn(
            "fixed inset-x-0 top-[65px] bottom-0 z-40 overflow-y-auto overscroll-y-contain bg-background/70 px-6 pt-8 pb-10 opacity-0 backdrop-blur-glass transition-[opacity,transform] duration-300 ease-out sm:top-20",
            isOpen && "translate-y-0 opacity-100"
          )}
          data-smooth-scroll=""
          style={{ WebkitBackdropFilter: "blur(var(--glass-blur))" }}
        >
          <div className="flex flex-col gap-8">
            {groups.map((group) => (
              <div className="flex flex-col gap-3" key={group.id}>
                <p className="font-medium text-medium text-muted-foreground">
                  {group.label}
                </p>
                <div className="flex flex-col gap-1">
                  {group.items.map((item) => (
                    <a
                      className="rounded-md py-1 font-normal text-body text-foreground tracking-normal transition-colors hover:text-muted-foreground"
                      href={item.href}
                      key={item.id}
                      onClick={closeMenu}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>
      ) : null}
    </div>
  )
}
