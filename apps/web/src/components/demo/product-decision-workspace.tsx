"use client"

import { cn } from "@mavry/ui/lib/utils"
import { useState } from "react"
import {
  defaultLaneId,
  defaultRowId,
  type PageId,
  type RoadmapLaneId,
  type ScopeRowId,
  scopeRows,
} from "@/components/demo/data"
import { Header } from "@/components/demo/header"
import { Inspector } from "@/components/demo/inspector"
import { Page } from "@/components/demo/page"
import { contentByPage } from "@/components/demo/page-data"
import { ReviewPanel } from "@/components/demo/review-panel"
import { Sidebar } from "@/components/demo/sidebar"

interface Props {
  className?: string
  interactive?: boolean
}

export const Workspace = ({ className, interactive = true }: Props) => {
  const [selectedRowId, setSelectedRowId] = useState<ScopeRowId>(defaultRowId)
  const [selectedLaneId, setSelectedLaneId] =
    useState<RoadmapLaneId>(defaultLaneId)
  const [activePageId, setActivePageId] = useState<PageId>("home")
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const selectedRow =
    scopeRows.find((row) => row.id === selectedRowId) ?? scopeRows[0]
  const activePageContent = contentByPage[activePageId]

  const handleToggleSidebar = () => {
    const isPersistentSidebar =
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 640px)").matches

    if (isPersistentSidebar) {
      setDesktopSidebarOpen((isOpen) => !isOpen)
      return
    }

    setMobileSidebarOpen((isOpen) => !isOpen)
  }

  const handlePageChange = (pageId: PageId) => {
    setActivePageId(pageId)

    const isPersistentSidebar =
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 640px)").matches

    if (!isPersistentSidebar) {
      setMobileSidebarOpen(false)
    }
  }

  return (
    <section
      aria-label="Mavry product decision workspace preview"
      className={cn(
        "overflow-hidden rounded-xl border border-border/80 bg-background text-foreground shadow-lg",
        className
      )}
    >
      <div className="relative flex h-[44rem] bg-[color-mix(in_oklch,var(--background)_92%,var(--muted))]">
        {mobileSidebarOpen && (
          <button
            aria-label="Close decision workspace sidebar overlay"
            className="absolute inset-y-0 right-0 left-60 z-10 bg-background/70 backdrop-blur-glass sm:hidden"
            onClick={() => setMobileSidebarOpen(false)}
            style={{ WebkitBackdropFilter: "blur(var(--glass-blur))" }}
            type="button"
          />
        )}
        <Sidebar
          activePageId={activePageId}
          desktopOpen={desktopSidebarOpen}
          mobileOpen={mobileSidebarOpen}
          onPageChange={handlePageChange}
        />
        <div className="flex min-w-0 flex-1 flex-col bg-card">
          <Header
            onSearchOpen={() => setActivePageId("search")}
            onToggleSidebar={handleToggleSidebar}
            pageCode={activePageContent.code}
            pageTitle={activePageContent.title}
          />
          <main className="@container/main min-h-0 flex-1 overflow-hidden">
            <div className="grid h-full min-w-0 xl:grid-cols-[minmax(0,1fr)_18rem]">
              <div className="min-w-0 overflow-y-auto" data-smooth-scroll="">
                <div className="flex flex-col">
                  <Page
                    activePageId={activePageId}
                    interactive={interactive}
                    onSelectedLaneChange={setSelectedLaneId}
                    onSelectedRowChange={setSelectedRowId}
                    selectedLaneId={selectedLaneId}
                    selectedRowId={selectedRowId}
                  />
                </div>
              </div>
              <Inspector
                activePageId={activePageId}
                selectedLaneId={selectedLaneId}
                selectedRow={selectedRow}
              />
            </div>
          </main>
        </div>
        <ReviewPanel activePageId={activePageId} />
      </div>
    </section>
  )
}
