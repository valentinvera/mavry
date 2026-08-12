import { Badge } from "@mavry/ui/components/badge"
import { CheckCircle2Icon, ShieldAlertIcon, XIcon } from "lucide-react"

const checks = [
  {
    id: "hypothesis",
    label: "Product hypothesis exists",
    detail: "One audience, one problem, one promise.",
    state: "Ready",
    variant: "success",
  },
  {
    id: "core-reasons",
    label: "Core has reasons",
    detail: "Every MVP item connects to the hypothesis.",
    state: "Ready",
    variant: "success",
  },
  {
    id: "feedback",
    label: "Feedback route has no owner",
    detail: "Beta can open after this is assigned.",
    state: "Blocking",
    variant: "warning",
  },
  {
    id: "not-required",
    label: "Nice-to-have work is separated",
    detail: "Teams, templates, and integrations can wait.",
    state: "Not required",
    variant: "destructive",
  },
] as const

const badgeClassNames = {
  destructive:
    "w-fit rounded-md bg-destructive text-caption text-destructive-foreground",
  success: "w-fit rounded-md bg-success text-caption text-success-foreground",
  warning: "w-fit rounded-md bg-warning text-caption text-warning-foreground",
} as const

export const Checklist = () => (
  <div className="relative overflow-hidden rounded-xl border border-border bg-card/45">
    <div className="border-border border-b bg-background/78 px-4 py-3">
      <p className="font-medium text-caption">5.0 Monitor</p>
      <p className="mt-1 text-caption text-muted-foreground">
        The launch gate separates real blockers from work that can wait.
      </p>
    </div>

    <div className="relative p-4">
      <div
        aria-hidden="true"
        className="absolute top-8 bottom-8 left-[1.45rem] w-px bg-border"
      />
      <div className="flex flex-col gap-3">
        {checks.map((check, index) => (
          <button
            className="relative grid w-full grid-cols-[1.75rem_minmax(0,1fr)] gap-3 rounded-lg border border-border bg-background/78 p-3 text-left transition-colors hover:bg-muted/30 active:translate-y-px sm:grid-cols-[1.75rem_minmax(0,1fr)_8rem]"
            data-motion-item=""
            key={check.id}
            style={{ transitionDelay: `${180 + index * 90}ms` }}
            type="button"
          >
            <span className="relative z-10 flex size-7 items-center justify-center rounded-md border border-border bg-card">
              <StatusIcon variant={check.variant} />
            </span>
            <span className="min-w-0">
              <span className="block font-medium text-medium">
                {check.label}
              </span>
              <span className="mt-1 block text-caption text-muted-foreground">
                {check.detail}
              </span>
            </span>
            <StatusBadge variant={check.variant}>{check.state}</StatusBadge>
          </button>
        ))}
      </div>
    </div>
  </div>
)

const StatusIcon = ({
  variant,
}: {
  variant: "destructive" | "success" | "warning"
}) => {
  if (variant === "success") {
    return (
      <CheckCircle2Icon
        aria-hidden="true"
        className="size-3.5 text-success-foreground"
      />
    )
  }

  if (variant === "warning") {
    return (
      <ShieldAlertIcon
        aria-hidden="true"
        className="size-3.5 text-warning-foreground"
      />
    )
  }

  return (
    <XIcon
      aria-hidden="true"
      className="size-3.5 text-destructive-foreground"
    />
  )
}

const StatusBadge = ({
  children,
  variant,
}: {
  children: React.ReactNode
  variant: "destructive" | "success" | "warning"
}) => <Badge className={badgeClassNames[variant]}>{children}</Badge>
