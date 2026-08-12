import { Alert, AlertDescription, AlertTitle } from "@mavry/ui/components/alert"
import { Badge } from "@mavry/ui/components/badge"
import { Button } from "@mavry/ui/components/button"
import { ArrowRightIcon, CircleIcon, ShieldAlertIcon } from "lucide-react"
import { contentByPage } from "@/components/demo/page-data"

const content = contentByPage.readiness

export const Summary = () => (
  <aside className="relative overflow-hidden rounded-xl border border-border bg-card/45 p-4 shadow-2xl shadow-background/60 lg:sticky lg:top-28">
    <div className="mb-4 flex items-center justify-between gap-3">
      <div>
        <p className="font-medium text-caption">{content.code}</p>
        <p className="text-caption text-muted-foreground">{content.context}</p>
      </div>
      <Badge className="rounded-md text-caption" variant="outline">
        {content.chips[1]}
      </Badge>
    </div>
    <div
      className="relative mx-auto flex aspect-square max-w-56 items-center justify-center"
      data-motion-pop=""
      style={{ transitionDelay: "220ms" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(var(--success) 0 74%, var(--border) 74% 100%)",
        }}
      />
      <div className="absolute inset-2 rounded-full bg-background" />
      <div className="relative text-center">
        <p className="font-bold text-display xl:text-display-lg">74</p>
        <p className="-mt-1 text-caption text-muted-foreground">
          Scope is clear enough to continue
        </p>
      </div>
    </div>

    <Alert
      className="mt-5 rounded-lg bg-background/78"
      data-motion-item=""
      style={{ transitionDelay: "380ms" }}
    >
      <ShieldAlertIcon aria-hidden="true" />
      <AlertTitle>Feedback ownership is unresolved</AlertTitle>
      <AlertDescription>
        Beta does not need a full feedback hub, but it does need one owner
        responsible for collecting and reviewing feedback.
      </AlertDescription>
    </Alert>

    <div className="mt-5 flex flex-col gap-2">
      {content.activities.slice(0, 3).map((activity, index) => (
        <button
          className="grid grid-cols-[1rem_minmax(0,1fr)] gap-2 rounded-lg border border-border bg-background/72 px-3 py-2 text-left transition-colors hover:bg-muted/30 active:translate-y-px"
          data-motion-item=""
          key={activity.id}
          style={{ transitionDelay: `${480 + index * 70}ms` }}
          type="button"
        >
          <CircleIcon
            aria-hidden="true"
            className="mt-1 size-2 fill-current text-muted-foreground"
          />
          <span>
            <span className="block text-caption text-muted-foreground">
              {activity.actor} · {index + 1}
            </span>
            <span className="mt-0.5 block font-medium text-caption">
              {activity.title}
            </span>
          </span>
        </button>
      ))}
    </div>

    <Button
      className="mt-5 w-full justify-between rounded-md text-small"
      data-motion-item=""
      style={{ transitionDelay: "720ms" }}
      type="button"
      variant="secondary"
    >
      Open launch review
      <ArrowRightIcon data-icon="inline-end" />
    </Button>
  </aside>
)
