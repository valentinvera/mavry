import { LandingProductFrame } from "@/components/demo/landing-product-frame"
import { contentByPage } from "@/components/demo/page-data"
import { IdeaInbox } from "@/components/sections/demo/idea-inbox"

export const Loop = () => (
  <LandingProductFrame activePageId="idea-inbox">
    <IdeaInbox content={contentByPage["idea-inbox"]} />
  </LandingProductFrame>
)
