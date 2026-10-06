import { LandingProductFrame } from "@/components/landing/demo/landing-product-frame"
import { contentByPage } from "@/components/landing/demo/page-data"
import { Readiness } from "@/components/sections/landing/demo/readiness"

export const DirectionPanel = () => (
  <LandingProductFrame activePageId="readiness">
    <Readiness content={contentByPage.readiness} />
  </LandingProductFrame>
)
