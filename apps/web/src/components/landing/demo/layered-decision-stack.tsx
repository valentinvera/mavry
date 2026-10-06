"use client"

import { useState } from "react"
import { defaultRowId, type ScopeRowId } from "@/components/landing/demo/data"
import { LandingProductFrame } from "@/components/landing/demo/landing-product-frame"
import { contentByPage } from "@/components/landing/demo/page-data"
import { MvpScope } from "@/components/sections/landing/demo/mvp-scope"

export const Stack = () => {
  const [selectedRowId, setSelectedRowId] = useState<ScopeRowId>(defaultRowId)

  return (
    <LandingProductFrame activePageId="scope">
      <MvpScope
        content={contentByPage.scope}
        interactive
        onSelectedRowChange={setSelectedRowId}
        selectedRowId={selectedRowId}
      />
    </LandingProductFrame>
  )
}
