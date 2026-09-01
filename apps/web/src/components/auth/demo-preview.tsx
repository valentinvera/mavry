import { lazy, Suspense } from "react"
import type { PageId } from "@/components/demo/data"
import { LandscapeDemoContainer } from "@/components/landing/landscape-demo-container"

const ProductDecisionWorkspace = lazy(async () => {
  const module = await import("@/components/demo/product-decision-workspace")

  return { default: module.Workspace }
})

interface DemoPreviewProps {
  pageId?: PageId
}

export const DemoPreview = ({ pageId = "home" }: DemoPreviewProps) => (
  <section
    aria-hidden="true"
    className="pointer-events-none relative hidden h-svh min-h-svh min-w-0 overflow-hidden bg-background lg:sticky lg:top-0 lg:block"
    data-auth-product-preview={pageId}
    inert
  >
    <LandscapeDemoContainer
      className="h-full min-h-0 rounded-none p-0 shadow-none sm:p-0 md:p-0"
      contentClassName="h-full"
      variant="authPanel"
    >
      <Suspense fallback={null}>
        <ProductDecisionWorkspace
          className="absolute top-1/2 left-12 w-[64rem] translate-x-4 -translate-y-1/2 rounded-lg shadow-xl"
          initialPageId={pageId}
          interactive={false}
          key={pageId}
          viewportClassName="h-[calc(100svh-8rem-2px)]"
        />
      </Suspense>
    </LandscapeDemoContainer>
  </section>
)
