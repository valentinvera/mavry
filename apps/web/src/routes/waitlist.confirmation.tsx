import { env } from "@mavry/env/web"
import {
  verifyWaitlistConfirmationResultInputSchema,
  verifyWaitlistConfirmationResultOutputSchema,
  type WaitlistConfirmationStatus,
} from "@mavry/trpc/contracts/waitlist"
import { buttonVariants } from "@mavry/ui/components/button"
import { Separator } from "@mavry/ui/components/separator"
import { cn } from "@mavry/ui/lib/utils"
import { createFileRoute, Link } from "@tanstack/react-router"
import { CircleCheckIcon, CircleXIcon } from "lucide-react"
import { z } from "zod"
import { getWaitlistConfirmedCountQueryOptions } from "@/lib/waitlist"

const INVALID_CONFIRMATION_STATUS = "invalid_or_expired"

const confirmationSearchSchema = z.object({
  result: verifyWaitlistConfirmationResultInputSchema.shape.receipt
    .optional()
    .catch(undefined),
})

const confirmationContent: Record<
  WaitlistConfirmationStatus,
  {
    description: string
    heading: string
    label: string
    tone: string
  }
> = {
  confirmed: {
    description:
      "You’re on the Mavry waitlist. We’ll keep you posted as early access gets closer.",
    heading: "Email confirmed.",
    label: "Confirmation complete",
    tone: "text-success-foreground",
  },
  already_confirmed: {
    description:
      "Your email was already confirmed. There’s nothing else you need to do.",
    heading: "You’re already confirmed.",
    label: "Confirmation complete",
    tone: "text-success-foreground",
  },
  invalid_or_expired: {
    description:
      "This confirmation link is invalid or has expired. Join the waitlist again to receive a new one.",
    heading: "We couldn’t confirm your email.",
    label: "Confirmation issue",
    tone: "text-destructive-foreground",
  },
}

const verifyConfirmationResult = async (
  receipt: string | undefined
): Promise<WaitlistConfirmationStatus> => {
  if (!receipt) {
    return INVALID_CONFIRMATION_STATUS
  }

  try {
    const response = await fetch(
      `${env.VITE_API_URL}/api/waitlist/confirmation-result`,
      {
        headers: {
          Authorization: `Bearer ${receipt}`,
        },
        method: "POST",
      }
    )

    if (!response.ok) {
      await response.body?.cancel()
      return INVALID_CONFIRMATION_STATUS
    }

    const result = verifyWaitlistConfirmationResultOutputSchema.safeParse(
      await response.json()
    )

    return result.success ? result.data.status : INVALID_CONFIRMATION_STATUS
  } catch {
    return INVALID_CONFIRMATION_STATUS
  }
}

export const Route = createFileRoute("/waitlist/confirmation")({
  validateSearch: (search) => confirmationSearchSchema.parse(search),
  loaderDeps: ({ search }) => ({ receipt: search.result }),
  loader: async ({ context, deps }) => {
    const status = await verifyConfirmationResult(deps.receipt)

    if (status !== INVALID_CONFIRMATION_STATUS) {
      await context.queryClient.prefetchQuery(
        getWaitlistConfirmedCountQueryOptions(context.trpc)
      )
    }

    return status
  },
  headers: () => ({
    "Cache-Control": "no-store",
    "Referrer-Policy": "no-referrer",
    "X-Robots-Tag": "noindex, nofollow",
  }),
  head: () => ({
    meta: [
      {
        title: "Waitlist confirmation — Mavry",
      },
      {
        name: "description",
        content: "Your Mavry waitlist confirmation status.",
      },
      {
        name: "robots",
        content: "noindex, nofollow",
      },
    ],
  }),
  component: WaitlistConfirmationPage,
})

function WaitlistConfirmationPage() {
  const status = Route.useLoaderData()
  const content = confirmationContent[status]
  const StatusIcon =
    status === "invalid_or_expired" ? CircleXIcon : CircleCheckIcon

  return (
    <main className="flex min-h-svh w-full flex-col bg-background text-foreground">
      <header className="w-full">
        <div className="px-3.5 pt-3.5 pb-2.5 sm:px-8 sm:pt-5 sm:pb-6 lg:px-10">
          <div className="mx-auto flex min-h-10 w-full max-w-7xl items-center sm:min-h-0">
            <Link
              aria-label="Mavry home"
              className="inline-flex rounded-md"
              to="/"
            >
              <img
                alt="Mavry"
                className="h-8 w-auto"
                height={128}
                src="/brand/mavry-logo-white.svg"
                width={392}
              />
            </Link>
          </div>
        </div>
        <Separator />
      </header>

      <section className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <div className="flex min-w-0 max-w-2xl flex-col items-center text-center">
          <StatusIcon
            aria-hidden="true"
            className={cn("mb-8 size-8", content.tone)}
            strokeWidth={1.5}
          />
          <p className={cn("font-medium text-small", content.tone)}>
            {content.label}
          </p>
          <h1 className="mt-3 text-balance font-bold text-hero tracking-normal md:text-title">
            {content.heading}
          </h1>
          <p className="mt-5 max-w-xl text-balance text-large text-muted-foreground">
            {content.description}
          </p>
          <Link
            className={cn(
              buttonVariants({ size: "sm" }),
              "mt-9 h-8 rounded-md text-small"
            )}
            to="/"
          >
            Back to Mavry
          </Link>
        </div>
      </section>
    </main>
  )
}
