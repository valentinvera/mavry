const SIMULATED_REQUEST_MS = 900

/**
 * Simulates the latency of an auth request. The auth surface is UI/UX only for
 * now; replace the call sites with the real better-auth client calls once the
 * API and providers are wired.
 */
export const simulateAuthRequest = (): Promise<void> =>
  new Promise((resolve) => {
    window.setTimeout(resolve, SIMULATED_REQUEST_MS)
  })
