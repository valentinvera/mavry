import { Separator } from "@mavry/ui/components/separator"
import type { MouseEvent } from "react"
import { MavryWordmark } from "@/components/brand/mavry-wordmark"
import {
  LANDING_FAQ,
  LANDING_SECTIONS,
  reloadLandingAtTop,
  scrollToLandingSection,
} from "@/lib/landing-navigation"

type FooterLink = readonly [label: string, href: string]

const productLinks: readonly FooterLink[] = LANDING_SECTIONS.map(
  (section) => [section.label, `#${section.id}`] as const
)

const connectLinks: readonly FooterLink[] = [
  ["GitHub", "https://github.com/valentinvera/mavry"],
  ["X (Twitter)", "https://x.com/mavry_app"],
]

const companyLinks: readonly FooterLink[] = [
  [LANDING_FAQ.label, `#${LANDING_FAQ.id}`],
]

const navigateToSection = (
  event: MouseEvent<HTMLAnchorElement>,
  href: string
) => {
  if (!href.startsWith("#")) {
    return
  }

  event.preventDefault()
  scrollToLandingSection(href.slice(1), href)
}

const FooterColumn = ({
  links,
  title,
}: {
  links: readonly FooterLink[]
  title: string
}) => (
  <div className="flex flex-col gap-3">
    <p className="font-medium text-footer text-foreground">{title}</p>
    <nav aria-label={`${title} links`} className="flex flex-col gap-2.5">
      {links.map(([label, href]) => (
        <a
          className="w-fit transition-colors hover:text-foreground"
          href={href}
          key={href}
          onClick={(event) => navigateToSection(event, href)}
          rel={href.startsWith("https://") ? "noopener" : undefined}
          target={href.startsWith("https://") ? "_blank" : undefined}
        >
          {label}
        </a>
      ))}
    </nav>
  </div>
)

export const Footer = () => (
  <footer className="relative pt-8 text-footer text-muted-foreground">
    <Separator className="absolute inset-x-0 top-0" />
    <div
      className="mx-auto w-full max-w-7xl px-5 pb-4 sm:px-8 lg:px-10"
      data-section-reveal=""
    >
      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-16">
        <div className="flex flex-col items-start gap-3">
          <a
            aria-label="Mavry home"
            className="inline-flex rounded-md"
            href="/"
            onClick={reloadLandingAtTop}
          >
            <MavryWordmark size="sm" />
          </a>
          <p className="max-w-sm">
            A product clarity workspace for early MVP decisions.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3">
          <FooterColumn links={productLinks} title="Product" />
          <FooterColumn links={connectLinks} title="Connect" />
          <FooterColumn links={companyLinks} title="Company" />
        </div>
      </div>
      <Separator className="mt-12 mb-4" />
      <p>© {new Date().getFullYear()} Mavry.</p>
    </div>
  </footer>
)
