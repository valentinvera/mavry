"use client"

import { useState } from "react"
import { defaultRowId, type ScopeRowId } from "@/components/demo/data"
import { LandingProductFrame } from "@/components/demo/landing-product-frame"
import { contentByPage } from "@/components/demo/page-data"
import { MvpScope } from "@/components/sections/demo/mvp-scope"

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
