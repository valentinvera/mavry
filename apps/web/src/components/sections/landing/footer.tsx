const links = [
  ["Workspace", "#workspace"],
  ["Method", "#method"],
  ["Readiness", "#readiness"],
  ["Review", "#review"],
  ["GitHub", "https://github.com/valentinvera/mavry"],
] as const

export const Footer = () => (
  <footer
    className="relative grid gap-6 pt-8 text-caption text-muted-foreground before:absolute before:top-0 before:left-1/2 before:h-px before:w-screen before:-translate-x-1/2 before:bg-[rgba(255,255,255,0.08)] md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
    data-section-reveal=""
  >
    <div className="flex items-center gap-3">
      <img
        alt="Mavry"
        className="h-7 w-auto"
        height={128}
        src="/brand/mavry-logo-white.svg"
        width={392}
      />
      <div>
        <p className="mt-1">
          A product clarity workspace for early MVP decisions.
        </p>
      </div>
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
  </footer>
)
