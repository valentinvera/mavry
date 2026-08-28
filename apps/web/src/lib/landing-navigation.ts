import type { MouseEvent } from "react"

const LANDING_SECTION_GAP_PX = 16
const LANDING_SECTION_TITLE_SELECTOR = "[data-landing-section-title]"
const SCROLL_RESTORATION_STORAGE_KEY = "tsr-scroll-restoration-v1_3"

export const LANDING_HASH_RESTORATION_SCRIPT = `(()=>{try{const hash=location.hash;if(!hash)return;const sectionId=decodeURIComponent(hash.slice(1));const section=document.getElementById(sectionId);const title=section?.querySelector("${LANDING_SECTION_TITLE_SELECTOR}");const header=document.querySelector("header");if(!(title&&header))return;let documentTop=0;let current=title;while(current){documentTop+=current.offsetTop;current=current.offsetParent}scrollTo({behavior:"instant",top:Math.max(0,documentTop-header.offsetHeight-${LANDING_SECTION_GAP_PX})})}catch{}})()`

const getDocumentOffsetTop = (element: HTMLElement): number => {
  let offsetTop = 0
  let currentElement: HTMLElement | null = element

  while (currentElement) {
    offsetTop += currentElement.offsetTop
    currentElement = currentElement.offsetParent as HTMLElement | null
  }

  return offsetTop
}

const resetSavedLandingScroll = () => {
  try {
    const serializedCache = sessionStorage.getItem(
      SCROLL_RESTORATION_STORAGE_KEY
    )
    if (!serializedCache) {
      return
    }

    const scrollCache: unknown = JSON.parse(serializedCache)
    const historyState: unknown = window.history.state
    if (
      typeof scrollCache !== "object" ||
      scrollCache === null ||
      Array.isArray(scrollCache) ||
      typeof historyState !== "object" ||
      historyState === null ||
      !("__TSR_key" in historyState) ||
      typeof historyState.__TSR_key !== "string"
    ) {
      return
    }

    const savedScroll = (scrollCache as Record<string, unknown>)[
      historyState.__TSR_key
    ]
    if (
      typeof savedScroll !== "object" ||
      savedScroll === null ||
      Array.isArray(savedScroll)
    ) {
      return
    }

    Object.assign(savedScroll, {
      window: { scrollX: 0, scrollY: 0 },
    })
    sessionStorage.setItem(
      SCROLL_RESTORATION_STORAGE_KEY,
      JSON.stringify(scrollCache)
    )
  } catch {
    // Storage can be unavailable in privacy-restricted browser contexts.
  }
}

export const reloadLandingAtTop = (
  event: MouseEvent<HTMLAnchorElement>
): void => {
  if (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return
  }

  event.preventDefault()
  const href = event.currentTarget.href

  window.addEventListener("pagehide", resetSavedLandingScroll, { once: true })
  window.location.assign(href)
}

export const scrollToLandingSection = (
  sectionId: string,
  href: string,
  behaviorOverride?: ScrollBehavior
): void => {
  const sectionTitle = document
    .getElementById(sectionId)
    ?.querySelector<HTMLElement>(LANDING_SECTION_TITLE_SELECTOR)
  const header = document.querySelector<HTMLElement>("header")

  if (!(sectionTitle && header)) {
    return
  }

  const scrollTop = Math.max(
    0,
    getDocumentOffsetTop(sectionTitle) -
      header.offsetHeight -
      LANDING_SECTION_GAP_PX
  )
  const behavior =
    behaviorOverride ??
    (window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth")

  History.prototype.replaceState.call(
    window.history,
    window.history.state,
    "",
    href
  )
  requestAnimationFrame(() => {
    window.scrollTo({ behavior, top: scrollTop })
  })
}
