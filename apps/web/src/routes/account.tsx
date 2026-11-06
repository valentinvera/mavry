import { Alert, AlertDescription } from "@mavry/ui/components/alert"
import { Button } from "@mavry/ui/components/button"
import { Separator } from "@mavry/ui/components/separator"
import { Spinner } from "@mavry/ui/components/spinner"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useCallback, useEffect, useRef, useState } from "react"
import { ChangeEmailSection } from "@/components/account/change-email"
import { ChangePasswordSection } from "@/components/account/change-password"
import { PasskeySection } from "@/components/account/passkeys"
import { SessionSection } from "@/components/account/sessions"
import { TwoFactorSection } from "@/components/account/two-factor"
import { MavrySymbol } from "@/components/brand/mavry-symbol"
import { authClient } from "@/lib/auth-client"

export const Route = createFileRoute("/account")({
  component: AccountPage,
  head: () => ({
    meta: [
      { title: "Account — Mavry" },
      { content: "noindex, nofollow", name: "robots" },
    ],
  }),
})

function AccountPage() {
  const navigate = useNavigate()
  const { data: session, isPending, refetch } = authClient.useSession()
  const [isSessionChecked, setIsSessionChecked] = useState(false)
  const hasRequestedSessionCheck = useRef(false)

  // The session store can hold a stale signed-out value right after a sign-in
  // method that does not update it synchronously (for example passkeys), so we
  // confirm the session before deciding that the visitor is signed out.
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

  const handleChanged = useCallback(async (): Promise<void> => {
    await refetch()
  }, [refetch])

  const handleSignOut = useCallback(async (): Promise<void> => {
    await authClient.signOut()
    await navigate({ search: { error: undefined }, to: "/sign-in" })
  }, [navigate])

  const handleSignOutClick = useCallback((): void => {
    handleSignOut().catch(() => undefined)
  }, [handleSignOut])

  if (isPending || !session) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-background">
        <Spinner className="size-5 text-muted-foreground" />
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-col gap-10 bg-background px-5 py-12 text-foreground">
      <header className="flex flex-col gap-4">
        <MavrySymbol className="size-12" />
        <div>
          <h1 className="font-medium text-xlarge">Account security</h1>
          <p className="mt-2 text-control text-muted-foreground">
            Signed in as {session.user.email}
            {session.user.emailVerified ? " · Verified" : " · Not verified"}
          </p>
        </div>

        {session.user.emailVerified ? null : (
          <Alert className="rounded-lg">
            <AlertDescription>
              Verify your email to secure your account.{" "}
              <Link
                className="font-medium text-foreground underline underline-offset-4"
                search={{ email: session.user.email }}
                to="/verify-email"
              >
                Verify email
              </Link>
            </AlertDescription>
          </Alert>
        )}
      </header>

      <Separator />
      <ChangePasswordSection />

      <Separator />
      <ChangeEmailSection onChanged={handleChanged} />

      <Separator />
      <TwoFactorSection
        enabled={Boolean(session.user.twoFactorEnabled)}
        onChanged={handleChanged}
      />

      <Separator />
      <PasskeySection />

      <Separator />
      <SessionSection currentSessionId={session.session.id} />

      <Separator />
      <Button
        className="h-11 w-full cursor-pointer rounded-lg text-action! sm:w-auto"
        onClick={handleSignOutClick}
        type="button"
        variant="outline"
      >
        Sign out
      </Button>
    </main>
  )
}
