import {
  CheckCircle2Icon,
  CircleDashedIcon,
  FlagIcon,
  ScissorsIcon,
  ShieldAlertIcon,
} from "lucide-react"
import { roadmapLanes, scopeRows } from "@/components/demo/data"

const months = ["Now", "+2w", "+4w", "Beta", "Later"] as const

const rows = [
  {
    label: roadmapLanes[0].label,
    detail: roadmapLanes[0].summary,
    start: "left-[4%]",
    width: "w-[46%]",
    tone: "bg-success-foreground/75",
  },
  {
    label: roadmapLanes[1].label,
    detail: roadmapLanes[1].summary,
    start: "left-[38%]",
    width: "w-[28%]",
    tone: "bg-warning-foreground/75",
  },
  {
    label: roadmapLanes[2].label,
    detail: roadmapLanes[2].summary,
    start: "left-[62%]",
    width: "w-[30%]",
    tone: "bg-info-foreground/75",
  },
] as const

const readiness = [
  ["Hypothesis", "Ready"],
  ["Core scope", "Ready"],
  ["Cut list", "Saved"],
  ["Feedback", "Blocking"],
] as const

export const DirectionPanel = () => {
  const cutItems = scopeRows.filter((row) => row.lane === "Not doing")

  return (
    <div className="relative rounded-xl border border-border bg-card/45 px-4 md:px-6">
      <div className="grid min-h-[43rem] lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="relative min-w-0 px-0 py-10 lg:pr-10">
          <div className="flex flex-col gap-4 border-border border-b pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-medium text-medium">Roadmap with exclusions</p>
              <p className="mt-1 max-w-xl text-caption text-muted-foreground">
                The roadmap includes what ships, what waits, and what stays out.
              </p>
            </div>
            <button
              className="flex w-fit items-center gap-2 text-caption text-muted-foreground transition-opacity hover:opacity-80 active:translate-y-px"
              type="button"
            >
              <FlagIcon aria-hidden="true" className="size-3.5" />
              RD-006
            </button>
          </div>

          <div className="relative mt-10">
            <div className="grid grid-cols-5 border-border border-b pb-3">
              {months.map((month) => (
                <p className="text-caption text-muted-foreground" key={month}>
                  {month}
                </p>
              ))}
            </div>

            <div className="relative min-h-[25rem] border-border border-b">
              <div
                aria-hidden="true"
                className="absolute top-0 bottom-0 left-[60%] w-px bg-warning/80"
                data-motion-line=""
                style={{ transitionDelay: "260ms" }}
              />
              <div className="absolute top-4 left-[calc(60%+0.75rem)] flex items-center gap-2 text-caption text-warning-foreground">
                <ShieldAlertIcon aria-hidden="true" className="size-3.5" />
                Launch gate
              </div>

              {rows.map((row, index) => (
                <button
                  className="absolute right-0 left-0 grid grid-cols-[5rem_minmax(0,1fr)] items-center border-border border-b py-8 text-left transition-opacity hover:opacity-80 active:translate-y-px"
                  data-motion-item=""
                  key={row.label}
                  style={{
                    top: `${5 + index * 7.2}rem`,
                    transitionDelay: `${180 + index * 90}ms`,
                  }}
                  type="button"
                >
                  <span className="font-medium text-medium">{row.label}</span>
                  <span className="relative block h-10">
                    <span
                      className={`absolute top-1/2 ${row.start} ${row.width} h-px -translate-y-1/2 ${row.tone}`}
                    />
                    <span
                      className={`absolute top-1/2 ${row.start} size-2 -translate-y-1/2 rounded-full ${row.tone}`}
                    />
                    <span className="absolute top-1/2 left-[calc(4%+0.75rem)] hidden -translate-y-1/2 text-caption text-muted-foreground md:block">
                      {row.detail}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
            <button
              className="text-left transition-opacity hover:opacity-80 active:translate-y-px"
              data-motion-pop=""
              style={{ transitionDelay: "560ms" }}
              type="button"
            >
              <span className="flex items-center gap-2 text-caption text-success-foreground">
                <CheckCircle2Icon aria-hidden="true" className="size-3.5" />
                MVP readiness
              </span>
              <span className="mt-4 block font-semibold text-display leading-none">
                74
              </span>
              <span className="mt-2 block text-caption text-muted-foreground">
                The MVP is close because scope and cuts are clear. Beta still
                needs a feedback owner.
              </span>
            </button>

            <div className="divide-y divide-border border-border border-t lg:border-t-0">
              {readiness.map(([label, value], index) => (
                <button
                  className="flex w-full items-center justify-between gap-4 py-4 text-left transition-opacity hover:opacity-80 active:translate-y-px"
                  data-motion-item=""
                  key={label}
                  style={{ transitionDelay: `${640 + index * 70}ms` }}
                  type="button"
                >
                  <span className="text-caption text-muted-foreground">
                    {label}
                  </span>
                  <span className="font-medium text-caption">{value}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <aside className="border-border border-t px-0 py-10 lg:border-t-0 lg:border-l lg:pl-8">
          <div>
            <p className="font-medium text-medium">Outside MVP scope</p>
            <p className="mt-1 text-caption text-muted-foreground">
              Cut items remain attached to the roadmap with their questions.
            </p>
          </div>

          <div className="mt-10 divide-y divide-border">
            {cutItems.map((item, index) => (
              <button
                className="w-full py-6 text-left transition-opacity hover:opacity-80 active:translate-y-px"
                data-motion-item=""
                key={item.id}
                style={{ transitionDelay: `${260 + index * 95}ms` }}
                type="button"
              >
                <span className="flex items-center justify-between gap-4">
                  <span className="font-medium text-medium text-muted-foreground">
                    {item.feature}
                  </span>
                  <ScissorsIcon
                    aria-hidden="true"
                    className="size-4 text-muted-foreground"
                  />
                </span>
                <span className="mt-3 block text-caption text-muted-foreground">
                  {item.question}
                </span>
              </button>
            ))}
          </div>

          <button
            className="mt-10 flex items-start gap-3 border-border border-t pt-6 text-left transition-opacity hover:opacity-80 active:translate-y-px"
            data-motion-item=""
            style={{ transitionDelay: "560ms" }}
            type="button"
          >
            <CircleDashedIcon
              aria-hidden="true"
              className="mt-0.5 size-4 text-warning-foreground"
            />
            <span>
              <span className="block font-medium text-caption">
                The only active blocker is ownership.
              </span>
              <span className="mt-1 block text-caption text-muted-foreground">
                Beta can open with one feedback channel and one responsible
                owner.
              </span>
            </span>
          </button>
        </aside>
      </div>
    </div>
  )
}
