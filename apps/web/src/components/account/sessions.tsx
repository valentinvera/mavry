import { Alert, AlertDescription } from "@mavry/ui/components/alert"
import { Button } from "@mavry/ui/components/button"
import { Spinner } from "@mavry/ui/components/spinner"
import { useNavigate } from "@tanstack/react-router"
import { useCallback, useEffect, useState } from "react"
import { authClient } from "@/lib/auth-client"
import { AccountSection } from "./section"

interface SessionSummary {
  createdAt?: string | Date
  expiresAt?: string | Date
  id: string
  ipAddress?: string | null
  token: string
  userAgent?: string | null
}

interface SessionSectionProps {
  currentSessionId?: string
}

const formatDate = (value?: string | Date): string => {
  if (!value) {
    return "Unknown"
  }

  const date = value instanceof Date ? value : new Date(value)

  return Number.isNaN(date.getTime()) ? "Unknown" : date.toLocaleString()
}

interface SessionRowProps {
  isCurrent: boolean
  isPending: boolean
  onRevoke: (token: string) => void
  session: SessionSummary
}

const SessionRow = ({
  isCurrent,
  isPending,
  onRevoke,
  session,
}: SessionRowProps) => {
  const handleRevokeClick = useCallback((): void => {
    onRevoke(session.token)
  }, [onRevoke, session.token])

  return (
    <li className="flex flex-col gap-2 border-border border-b py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="truncate text-small">
          {session.userAgent?.trim() || "Unknown device"}
          {isCurrent ? (
            <span className="ml-2 text-caption text-muted-foreground">
              This device
            </span>
          ) : null}
        </p>
        <p className="text-caption text-muted-foreground">
          {session.ipAddress?.trim() || "Unknown IP"} · Started{" "}
          {formatDate(session.createdAt)}
        </p>
      </div>
      {isCurrent ? null : (
        <Button
          className="h-9 w-full cursor-pointer rounded-lg text-action! sm:w-auto"
          disabled={isPending}
          onClick={handleRevokeClick}
          type="button"
          variant="outline"
        >
          {isPending ? <Spinner data-icon="inline-start" /> : null}
          Sign out
        </Button>
      )}
    </li>
  )
}

export const SessionSection = ({ currentSessionId }: SessionSectionProps) => {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState<SessionSummary[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [pendingToken, setPendingToken] = useState<string | null>(null)
  const [isRevokingAll, setIsRevokingAll] = useState(false)

  const loadSessions = useCallback(async (): Promise<void> => {
    const result = await authClient.listSessions()

    if (result.error) {
      setErrorMessage("Mavry couldn’t load your sessions. Try again.")
      return
    }

    setSessions((result.data ?? []) as SessionSummary[])
  }, [])

  useEffect(() => {
    loadSessions().finally(() => setIsLoading(false))
  }, [loadSessions])

  const handleRevoke = useCallback(
    async (token: string): Promise<void> => {
      setErrorMessage(null)
      setPendingToken(token)

      try {
        const result = await authClient.revokeSession({ token })

        if (result.error) {
          setErrorMessage("Mavry couldn’t sign out that session. Try again.")
          return
        }

        await loadSessions()
      } catch {
        setErrorMessage("Mavry couldn’t sign out that session. Try again.")
      } finally {
        setPendingToken(null)
      }
    },
    [loadSessions]
  )

  const handleRevokeOthers = useCallback(async (): Promise<void> => {
    setErrorMessage(null)

    try {
      const result = await authClient.revokeOtherSessions()

      if (result.error) {
        setErrorMessage(
          "Mavry couldn’t sign out the other sessions. Try again."
        )
        return
      }

      await loadSessions()
    } catch {
      setErrorMessage("Mavry couldn’t sign out the other sessions. Try again.")
    }
  }, [loadSessions])

  const handleRevokeAll = useCallback(async (): Promise<void> => {
    setErrorMessage(null)
    setIsRevokingAll(true)

    try {
      const result = await authClient.revokeSessions()

      if (result.error) {
        setErrorMessage("Mavry couldn’t sign out everywhere. Try again.")
        return
      }

      await navigate({ search: { error: undefined }, to: "/sign-in" })
    } catch {
      setErrorMessage("Mavry couldn’t sign out everywhere. Try again.")
    } finally {
      setIsRevokingAll(false)
    }
  }, [navigate])

  const handleSessionRevoke = useCallback(
    (token: string): void => {
      handleRevoke(token).catch(() => undefined)
    },
    [handleRevoke]
  )

  const handleRevokeOthersClick = useCallback((): void => {
    handleRevokeOthers().catch(() => undefined)
  }, [handleRevokeOthers])

  const handleRevokeAllClick = useCallback((): void => {
    handleRevokeAll().catch(() => undefined)
  }, [handleRevokeAll])

  return (
    <AccountSection
      description="Review the devices with access to your account and sign out anything you don’t recognize."
      title="Sessions"
    >
      {errorMessage ? (
        <Alert className="rounded-lg" variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? (
        <div className="flex items-center gap-2 text-caption text-muted-foreground">
          <Spinner className="size-4" />
          Loading sessions…
        </div>
      ) : null}

      {!isLoading && sessions.length > 0 ? (
        <ul className="flex flex-col">
          {sessions.map((session) => (
            <SessionRow
              isCurrent={session.id === currentSessionId}
              isPending={pendingToken === session.token}
              key={session.id}
              onRevoke={handleSessionRevoke}
              session={session}
            />
          ))}
        </ul>
      ) : null}

      {!isLoading && sessions.length === 0 ? (
        <p className="text-caption text-muted-foreground">
          No active sessions found.
        </p>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          className="h-11 w-full cursor-pointer rounded-lg text-action! sm:w-auto"
          disabled={isRevokingAll}
          onClick={handleRevokeOthersClick}
          type="button"
          variant="outline"
        >
          Sign out other devices
        </Button>
        <Button
          className="h-11 w-full cursor-pointer rounded-lg text-action! sm:w-auto"
          disabled={isRevokingAll}
          onClick={handleRevokeAllClick}
          type="button"
          variant="ghost"
        >
          {isRevokingAll ? <Spinner data-icon="inline-start" /> : null}
          Sign out everywhere
        </Button>
      </div>
    </AccountSection>
  )
}
