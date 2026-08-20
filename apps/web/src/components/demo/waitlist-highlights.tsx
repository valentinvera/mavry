import { LandingProductFrame } from "@/components/demo/landing-product-frame"
import { contentByPage } from "@/components/demo/page-data"
import { WeeklyReview } from "@/components/sections/demo/weekly-review"

export const Highlights = () => (
  <LandingProductFrame activePageId="weekly-review">
    <WeeklyReview content={contentByPage["weekly-review"]} />
  </LandingProductFrame>
)
