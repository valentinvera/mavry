export const OPEN_EVENT = "mavry:open-hero-demo"

export const requestOpen = () => {
  window.dispatchEvent(new Event(OPEN_EVENT))
}
