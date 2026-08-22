import { Separator } from "@mavry/ui/components/separator"
import { MavryWordmark } from "@/components/brand/mavry-wordmark"

const links = [
  ["Workspace", "#workspace"],
  ["Method", "#method"],
  ["Readiness", "#readiness"],
  ["Review", "#review"],
  ["GitHub", "https://github.com/valentinvera/mavry"],
  ["X (Twitter)", "https://x.com/mavry_app"],
] as const

export const Footer = () => (
  <footer
    className="relative pt-8 text-footer text-muted-foreground before:absolute before:top-0 before:left-1/2 before:h-px before:w-screen before:-translate-x-1/2 before:bg-border"
    data-section-reveal=""
  >
    <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
      <div className="flex flex-col items-start gap-3">
        <MavryWordmark size="sm" />
        <p className="max-w-sm">
          A product clarity workspace for early MVP decisions.
        </p>
      </div>
      <nav aria-label="Footer navigation" className="flex flex-wrap gap-4">
        {links.map(([label, href]) => (
          <a
            className="transition-colors hover:text-foreground"
            href={href}
            key={href}
            rel={href.startsWith("https://") ? "noopener" : undefined}
            target={href.startsWith("https://") ? "_blank" : undefined}
          >
            {label}
          </a>
        ))}
      </nav>
    </div>
    <Separator className="mt-12 mb-4" />
    <p>© {new Date().getFullYear()} Mavry. All rights reserved.</p>
  </footer>
)
