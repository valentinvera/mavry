import { useNavigate } from "@tanstack/react-router"
import { useEffect, useRef, useState } from "react"
import { authClient } from "@/lib/auth-client"

/**
 * Protects client-rendered product routes.
 *
 * The session store can hold a stale signed-out value right after a sign-in
 * method that does not update it synchronously (for example passkeys), so the
 * session is confirmed with a refetch before redirecting to sign-in.
 */
export const useSessionGuard = () => {
  const navigate = useNavigate()
  const { data: session, isPending, refetch } = authClient.useSession()
  const [isSessionChecked, setIsSessionChecked] = useState(false)
  const hasRequestedSessionCheck = useRef(false)

  useEffect(() => {
    if (session) {
      setIsSessionChecked(true)
      return
    }

    if (isPending || hasRequestedSessionCheck.current) {
      return
    }

    hasRequestedSessionCheck.current = true

    refetch().finally(() => {
      setIsSessionChecked(true)
    })
  }, [isPending, refetch, session])

  useEffect(() => {
    if (!(isSessionChecked && !isPending && !session)) {
      return
    }

    navigate({ search: { error: undefined }, to: "/sign-in" }).catch(
      () => undefined
    )
  }, [isPending, isSessionChecked, navigate, session])

  return { isPending, refetch, session }
}
