import { LandingProductFrame } from "@/components/landing/demo/landing-product-frame"
import { contentByPage } from "@/components/landing/demo/page-data"
import { WeeklyReview } from "@/components/sections/landing/demo/weekly-review"

export const Highlights = () => (
  <LandingProductFrame activePageId="weekly-review">
    <WeeklyReview content={contentByPage["weekly-review"]} />
  </LandingProductFrame>
)
