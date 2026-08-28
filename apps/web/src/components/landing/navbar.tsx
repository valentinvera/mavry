import { Button } from "@mavry/ui/components/button"
import { Separator } from "@mavry/ui/components/separator"
import { cn } from "@mavry/ui/lib/utils"
import { MenuIcon, XIcon } from "lucide-react"
import { type MouseEvent, useEffect, useState } from "react"
import { MavryWordmark } from "@/components/brand/mavry-wordmark"
import { ThemeToggle } from "@/components/landing/theme-toggle"
import {
  FOCUS_EVENT,
  requestEmailFocus,
} from "@/components/sections/landing/hero"
import { scrollToLandingSection } from "@/lib/landing-navigation"

const ANIMATION_DURATION = 300
const ctaClassName = "cursor-pointer rounded-md text-action!"
const mobileRightRailClassName = "translate-x-[11.333px]"

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

const navigateToSection = (
  event: MouseEvent<HTMLAnchorElement>,
  sectionId: string,
  href: string
) => {
  event.preventDefault()
  scrollToLandingSection(sectionId, href)
}

export const Navbar = () => (
  <>
    <a
      aria-label="Mavry home"
      className="relative z-10 col-start-1 -ml-1 inline-flex justify-self-start rounded-md"
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
          onClick={(event) => navigateToSection(event, item.id, item.href)}
        >
          {item.label}
        </a>
      ))}
    </nav>
    <div className="relative z-10 col-start-3 flex items-center gap-2 justify-self-end md:gap-4">
      <Button
        className={cn("h-8 md:hidden", ctaClassName, mobileRightRailClassName)}
        onClick={requestEmailFocus}
        size="default"
        type="button"
      >
        Join waitlist
      </Button>
      <span
        aria-hidden="true"
        className={cn(
          "flex h-9 w-3 items-center justify-center md:hidden",
          mobileRightRailClassName
        )}
      >
        <Separator
          className="h-5 translate-x-1 bg-foreground/20 data-vertical:self-center"
          orientation="vertical"
        />
      </span>
      <div className="flex items-center">
        <ThemeToggle
          className={cn(mobileRightRailClassName, "md:translate-x-0")}
        />
        <MobileMenu />
      </div>
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

    const { documentElement } = document
    const previousDocumentOverflow = documentElement.style.overflow

    documentElement.style.overflow = "hidden"

    return () => {
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

  const navigateFromMobileMenu = (
    event: MouseEvent<HTMLAnchorElement>,
    sectionId: string,
    href: string
  ) => {
    closeMenu()
    navigateToSection(event, sectionId, href)
  }

  return (
    <div className="relative md:hidden">
      <Button
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        className={cn(
          "relative rounded-md bg-transparent text-body text-muted-foreground hover:bg-transparent hover:text-foreground aria-expanded:bg-transparent aria-expanded:text-muted-foreground aria-expanded:hover:bg-transparent aria-expanded:hover:text-foreground dark:aria-expanded:bg-transparent dark:hover:bg-transparent dark:aria-expanded:hover:bg-transparent",
          mobileRightRailClassName
        )}
        onClick={toggleMenu}
        size="icon-lg"
        type="button"
        variant="ghost"
      >
        <span className="sr-only">Open navigation menu</span>
        <MenuIcon
          aria-hidden="true"
          className={cn(
            "absolute inset-0 m-auto size-5 translate-y-[3px] scale-100 text-foreground opacity-100 transition-[opacity,scale] duration-300 ease-out",
            isOpen && "scale-75 opacity-0"
          )}
          strokeWidth={1}
        />
        <XIcon
          aria-hidden="true"
          className={cn(
            "absolute inset-0 m-auto size-5 translate-y-[3px] scale-75 text-foreground opacity-0 transition-[opacity,scale] duration-300 ease-out",
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
                      onClick={(event) =>
                        navigateFromMobileMenu(event, item.id, item.href)
                      }
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
