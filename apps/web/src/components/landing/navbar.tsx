import { Button } from "@mavry/ui/components/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@mavry/ui/components/collapsible"
import { cn } from "@mavry/ui/lib/utils"
import {
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import { MavryWordmark } from "@/components/brand/mavry-wordmark"
import {
  LANDING_FAQ,
  LANDING_SECTIONS,
  reloadLandingAtTop,
  scrollToLandingSection,
} from "@/lib/landing-navigation"
import { requestEmailFocus } from "@/lib/waitlist-focus"

const navItems = [
  ...LANDING_SECTIONS.map((section) => ({
    href: `#${section.id}`,
    id: section.id,
    label: section.label,
  })),
  {
    href: `#${LANDING_FAQ.id}`,
    id: LANDING_FAQ.id,
    label: LANDING_FAQ.label,
  },
]

const MOBILE_MENU_CLOSE_DELAY_MS = 320

const navigateToSection = (
  event: MouseEvent<HTMLAnchorElement>,
  sectionId: string,
  href: string
) => {
  event.preventDefault()
  scrollToLandingSection(sectionId, href)
}

type NavItem = (typeof navItems)[number]

interface DesktopNavLinkProps {
  item: NavItem
}

const DesktopNavLink = ({ item }: DesktopNavLinkProps) => {
  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      navigateToSection(event, item.id, item.href)
    },
    [item.href, item.id]
  )

  return (
    <a
      className="whitespace-nowrap rounded-md px-1.5 py-2 transition-colors hover:text-foreground"
      href={item.href}
      onClick={handleClick}
    >
      {item.label}
    </a>
  )
}

interface MobileNavLinkProps {
  item: NavItem
  onClose: () => void
}

const MobileNavLink = ({ item, onClose }: MobileNavLinkProps) => {
  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault()
      onClose()
      window.setTimeout(() => {
        scrollToLandingSection(item.id, item.href)
      }, MOBILE_MENU_CLOSE_DELAY_MS)
    },
    [item.href, item.id, onClose]
  )

  return (
    <a
      className="flex min-h-12 items-center rounded-lg px-2 text-body text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      href={item.href}
      onClick={handleClick}
    >
      {item.label}
    </a>
  )
}

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navbarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)")
    const closeOnDesktop = () => {
      if (desktop.matches) {
        setIsOpen(false)
      }
    }

    desktop.addEventListener("change", closeOnDesktop)

    return () => desktop.removeEventListener("change", closeOnDesktop)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !navbarRef.current?.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    document.addEventListener("pointerdown", closeOnOutsideClick)
    document.addEventListener("keydown", closeOnEscape)

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick)
      document.removeEventListener("keydown", closeOnEscape)
    }
  }, [isOpen])

  const closeMenu = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleJoinWaitlist = useCallback(() => {
    setIsOpen(false)
    requestEmailFocus()
  }, [])

  return (
    <Collapsible
      className="pointer-events-auto mx-auto w-full max-w-5xl rounded-2xl border bg-background p-2 pl-3 sm:pl-4"
      data-intro-item="nav"
      onOpenChange={setIsOpen}
      open={isOpen}
      ref={navbarRef}
      style={{ transitionDelay: "90ms" }}
    >
      <div className="flex min-h-10 items-center justify-between gap-3 sm:gap-6">
        <a
          aria-label="Mavry home"
          className="inline-flex shrink-0 rounded-md"
          href="/"
          onClick={reloadLandingAtTop}
        >
          <MavryWordmark
            className="max-[360px]:[&>span:last-child]:hidden"
            size="md"
          />
        </a>
        <nav
          aria-label="Landing sections"
          className="hidden min-w-0 items-center gap-0.5 text-muted-foreground text-nav lg:flex"
        >
          {navItems.map((item) => (
            <DesktopNavLink item={item} key={item.id} />
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            className="h-10 cursor-pointer rounded-lg px-4 text-action!"
            onClick={handleJoinWaitlist}
            type="button"
          >
            Join waitlist
          </Button>
          <CollapsibleTrigger
            render={
              <Button
                aria-label={
                  isOpen ? "Close navigation menu" : "Open navigation menu"
                }
                className="size-10 rounded-lg text-foreground lg:hidden"
                size="icon-lg"
                type="button"
                variant="ghost"
              />
            }
          >
            <span aria-hidden="true" className="relative block size-5">
              <span
                className={cn(
                  "absolute top-1/2 left-1/2 h-px w-5 -translate-x-1/2 bg-current transition-transform duration-300 ease-out motion-reduce:transition-none",
                  isOpen ? "-translate-y-1/2 rotate-45" : "-translate-y-1"
                )}
              />
              <span
                className={cn(
                  "absolute top-1/2 left-1/2 h-px w-5 -translate-x-1/2 bg-current transition-transform duration-300 ease-out motion-reduce:transition-none",
                  isOpen ? "-translate-y-1/2 -rotate-45" : "translate-y-1"
                )}
              />
            </span>
          </CollapsibleTrigger>
        </div>
      </div>
      <CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden transition-[height,opacity] duration-300 ease-out data-ending-style:h-0 data-starting-style:h-0 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none lg:hidden">
        <nav aria-label="Mobile landing sections" className="pt-5 pb-1">
          <p className="px-2 pb-2 text-caption text-muted-foreground">
            Explore Mavry
          </p>
          <div className="flex flex-col">
            {navItems.map((item) => (
              <MobileNavLink item={item} key={item.id} onClose={closeMenu} />
            ))}
          </div>
        </nav>
      </CollapsibleContent>
    </Collapsible>
  )
}
