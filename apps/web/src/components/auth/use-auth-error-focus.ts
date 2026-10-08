import { useEffect } from "react"
import type { AuthErrorDetails } from "@/lib/auth-errors"

/**
 * Moves focus to the first invalid field, or to the error summary when the
 * error is not tied to a single field. Keeps keyboard and screen reader users
 * oriented after a failed auth attempt.
 */
export const useAuthErrorFocus = (error: AuthErrorDetails | null) => {
  useEffect(() => {
    if (!error) {
      return
    }

    const frame = window.requestAnimationFrame(() => {
      const invalidField = document.querySelector<HTMLElement>(
        '[data-slot="input"][aria-invalid="true"], [data-slot="input-group"][aria-invalid="true"]'
      )
      const summary = document.getElementById("auth-error-summary")
      const target = invalidField ?? summary ?? null

      target?.focus()
    })

    return () => window.cancelAnimationFrame(frame)
  }, [error])
}
