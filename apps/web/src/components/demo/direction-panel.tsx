import { LandingProductFrame } from "@/components/demo/landing-product-frame"
import { contentByPage } from "@/components/demo/page-data"
import { Readiness } from "@/components/sections/demo/readiness"

export const DirectionPanel = () => (
  <LandingProductFrame activePageId="readiness">
    <Readiness content={contentByPage.readiness} />
  </LandingProductFrame>
)
