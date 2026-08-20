import type { ReactNode } from "react"
import { navMain, type PageId } from "@/components/demo/data"

interface LandingProductFrameProps {
  activePageId: PageId
  children: ReactNode
}

export const LandingProductFrame = ({
  activePageId,
  children,
}: LandingProductFrameProps) => {
  const activePage = navMain.find(({ id }) => id === activePageId)

  return (
    <section
      aria-label={`${activePage?.title ?? "Mavry"} product preview`}
      className="overflow-hidden rounded-xl border border-border/80 bg-background text-foreground shadow-lg"
    >
      <main className="min-w-0 bg-card">{children}</main>
    </section>
  )
}
