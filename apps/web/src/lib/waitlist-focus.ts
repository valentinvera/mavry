export const WAITLIST_EMAIL_INPUT_ID = "hero-waitlist-email"

export const FOCUS_EVENT = "mavry:focus-waitlist-email"

const FOCUS_DELAY_MS = 450
const UNLOCK_DELAY_MS = 350

const focusEmail = () => {
  const input = document.getElementById(WAITLIST_EMAIL_INPUT_ID)

  if (!(input instanceof HTMLInputElement)) {
    return
  }

  input.scrollIntoView({ behavior: "smooth", block: "center" })

  window.setTimeout(() => {
    input.focus({ preventScroll: true })
  }, FOCUS_DELAY_MS)
}

export const requestEmailFocus = () => {
  const isPageScrollLocked = document.body.style.overflow === "hidden"
  const focusDelay = isPageScrollLocked ? UNLOCK_DELAY_MS : 0

  window.dispatchEvent(new Event(FOCUS_EVENT))

  window.setTimeout(() => {
    focusEmail()
  }, focusDelay)
}
