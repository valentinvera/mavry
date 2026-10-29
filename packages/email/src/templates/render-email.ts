import { render } from "@react-email/render"
import type { ReactElement } from "react"

const EMAIL_PREVIEW_MAX_LENGTH = 200
const EMAIL_PREVIEW_WHITESPACE = "\u00a0\u200c\u200b\u200d\u200e\u200f\ufeff"

export const createPlainTextPreview = (preview: string): string => {
  const remainingPreviewLength = Math.max(
    0,
    EMAIL_PREVIEW_MAX_LENGTH - preview.length
  )

  return `${preview}${EMAIL_PREVIEW_WHITESPACE.repeat(remainingPreviewLength)}`
}

export interface RenderedEmail {
  html: string
  text: string
}

export const renderEmail = async (
  element: ReactElement,
  preview: string
): Promise<RenderedEmail> => {
  const [html, renderedText] = await Promise.all([
    render(element),
    render(element, { plainText: true }),
  ])

  return {
    html,
    text: `${createPlainTextPreview(preview)}\n\n${renderedText}`,
  }
}
