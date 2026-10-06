import { LandingProductFrame } from "@/components/landing/demo/landing-product-frame"
import { contentByPage } from "@/components/landing/demo/page-data"
import { IdeaInbox } from "@/components/sections/landing/demo/idea-inbox"

export const Loop = () => (
  <LandingProductFrame activePageId="idea-inbox">
    <IdeaInbox content={contentByPage["idea-inbox"]} />
  </LandingProductFrame>
)
