import { env } from "@mavry/env/web"
import { Alert, AlertDescription } from "@mavry/ui/components/alert"
import { Button } from "@mavry/ui/components/button"
import { Field, FieldGroup, FieldLabel } from "@mavry/ui/components/field"
import { Input } from "@mavry/ui/components/input"
import { Spinner } from "@mavry/ui/components/spinner"
import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react"
import { authClient } from "@/lib/auth-client"
import { AccountSection } from "./section"

interface PasskeySummary {
  createdAt?: string
  id: string
  name?: string
}

const PASSKEYS_ENDPOINT = "/api/auth/passkey/list-user-passkeys"

export const PasskeySection = () => {
  const [passkeys, setPasskeys] = useState<PasskeySummary[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [name, setName] = useState("")

  const loadPasskeys = useCallback(async (): Promise<void> => {
    const response = await fetch(`${env.VITE_API_URL}${PASSKEYS_ENDPOINT}`, {
      credentials: "include",
    })

    if (!response.ok) {
      return
    }

    const data: unknown = await response.json()
    setPasskeys(Array.isArray(data) ? (data as PasskeySummary[]) : [])
  }, [])

  useEffect(() => {
    loadPasskeys().catch(() => undefined)
  }, [loadPasskeys])

  const handleAdd = useCallback(async (): Promise<void> => {
    setErrorMessage(null)
    setSuccess(false)
    setIsAdding(true)

    try {
      const result = await authClient.passkey.addPasskey({
        name: name.trim() || undefined,
      })

      if (result.error) {
        setErrorMessage(
          result.error.message ??
            "Mavry couldn’t add a passkey on this device. Try again."
        )
        return
      }

      setName("")
      setSuccess(true)
      await loadPasskeys()
    } catch {
      setErrorMessage(
        "Mavry couldn’t add a passkey. This browser or device may not support passkeys."
      )
    } finally {
      setIsAdding(false)
    }
  }, [loadPasskeys, name])

  const handleNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      setName(event.target.value)
    },
    []
  )

  const handleFormSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault()
      handleAdd().catch(() => undefined)
    },
    [handleAdd]
  )

  return (
    <AccountSection
      description="Register passkeys to sign in without a password."
      title="Passkeys"
    >
      {errorMessage ? (
        <Alert className="rounded-lg" variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      {success ? (
        <Alert className="rounded-lg">
          <AlertDescription>Passkey added.</AlertDescription>
        </Alert>
      ) : null}

      {passkeys.length > 0 ? (
        <ul className="flex flex-col">
          {passkeys.map((passkey) => (
            <li
              className="flex items-center justify-between gap-3 border-border border-b py-2 last:border-b-0"
              key={passkey.id}
            >
              <span className="text-small">
                {passkey.name?.trim() || "Passkey"}
              </span>
              <span className="text-caption text-muted-foreground">
                {passkey.createdAt
                  ? new Date(passkey.createdAt).toLocaleDateString()
                  : ""}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-caption text-muted-foreground">
          No passkeys registered yet.
        </p>
      )}

      <form
        aria-busy={isAdding}
        aria-label="Add a passkey"
        onSubmit={handleFormSubmit}
      >
        <FieldGroup className="gap-3">
          <Field>
            <FieldLabel htmlFor="passkey-label">Passkey name</FieldLabel>
            <Input
              className="h-11 rounded-lg border-border/80 bg-background/70 px-4 text-control!"
              disabled={isAdding}
              id="passkey-label"
              maxLength={60}
              onChange={handleNameChange}
              placeholder="Optional name…"
              value={name}
            />
          </Field>
          <Button
            className="h-11 w-full cursor-pointer rounded-lg text-action! sm:w-auto"
            disabled={isAdding}
            type="submit"
            variant="outline"
          >
            {isAdding ? <Spinner data-icon="inline-start" /> : null}
            Add a passkey
          </Button>
        </FieldGroup>
      </form>
    </AccountSection>
  )
}
