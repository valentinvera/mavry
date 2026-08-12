import {
  CheckCircle2Icon,
  CircleDashedIcon,
  CornerDownRightIcon,
  ScissorsIcon,
} from "lucide-react"

const steps = [
  {
    index: "01",
    label: "Capture",
    detail: "Save ideas quickly without turning them into tasks.",
  },
  {
    index: "02",
    label: "Clarify",
    detail: "Add the user problem and the product question.",
  },
  {
    index: "03",
    label: "Classify",
    detail: "Place each feature in Core, Support, Later, or No.",
  },
  {
    index: "04",
    label: "Cut",
    detail: "Record why the feature does not belong in the MVP.",
  },
  {
    index: "05",
    label: "Roadmap",
    detail: "Sequence Now, Next, Later, and Not doing.",
  },
  {
    index: "06",
    label: "Review",
    detail: "Return to the scope and choose the next action.",
  },
] as const

const receiptLines = [
  ["Build now", "Scope board, intake, quick capture"],
  ["Later", "Feedback hub after beta"],
  ["Cut", "GitHub sync, template marketplace"],
  ["Blocker", "Feedback owner before beta"],
] as const

export const Loop = () => (
  <div className="relative rounded-xl border border-border bg-card/45 px-4 md:px-6">
    <div className="grid min-h-[45rem] lg:grid-cols-[minmax(0,1fr)_19rem]">
      <section className="relative min-w-0 px-0 py-10 lg:pr-10">
        <div
          aria-hidden="true"
          className="absolute top-[15.75rem] right-0 left-0 hidden h-px bg-border lg:block"
          data-motion-line=""
        />

        <div className="flex items-center justify-between border-border border-b pb-4">
          <p className="font-medium text-medium">Mavry product loop</p>
          <p className="text-caption text-muted-foreground">
            Capture to review
          </p>
        </div>

        <div className="mt-12 grid gap-y-12 md:grid-cols-3 lg:mt-20 lg:grid-cols-6">
          {steps.map((step, index) => (
            <button
              className="group relative ml-2 min-h-48 border-border border-l pl-4 text-left transition-opacity hover:opacity-80 active:translate-y-px lg:min-h-64"
              data-motion-item=""
              key={step.label}
              style={{ transitionDelay: `${150 + index * 70}ms` }}
              type="button"
            >
              <span className="absolute top-0 -left-[0.3125rem] size-2.5 rounded-full border border-border bg-background transition-colors group-hover:bg-foreground" />
              <span className="block text-caption text-muted-foreground">
                {step.index}
              </span>
              <span className="mt-12 block font-medium text-large lg:mt-20">
                {step.label}
              </span>
              <span className="mt-3 block max-w-36 text-caption text-muted-foreground">
                {step.detail}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-12 border-border border-t pt-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] lg:items-end">
            <button
              className="text-left transition-opacity hover:opacity-80 active:translate-y-px"
              data-motion-pop=""
              style={{ transitionDelay: "640ms" }}
              type="button"
            >
              <span className="flex items-center gap-3 text-caption text-muted-foreground">
                <CheckCircle2Icon
                  aria-hidden="true"
                  className="size-4 text-success-foreground"
                />
                Decision saved to scope
              </span>
              <span className="mt-4 block max-w-lg font-medium text-subtitle leading-tight">
                Build the scope board and quick capture before collaboration.
              </span>
            </button>

            <button
              className="border-border border-t pt-4 text-left transition-opacity hover:opacity-80 active:translate-y-px lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6"
              data-motion-item=""
              style={{ transitionDelay: "760ms" }}
              type="button"
            >
              <span className="flex items-center gap-2 text-caption text-muted-foreground">
                <ScissorsIcon
                  aria-hidden="true"
                  className="size-3.5 text-muted-foreground"
                />
                Cut reason
              </span>
              <span className="mt-3 block text-caption text-muted-foreground">
                Template marketplace stays visible as a cut because it does not
                help the first version prove the product workflow.
              </span>
            </button>
          </div>
        </div>
      </section>

      <aside className="border-border border-t px-0 py-10 lg:border-t-0 lg:border-l lg:pl-8">
        <div className="flex h-full flex-col justify-between gap-10">
          <div>
            <p className="font-medium text-medium">Review receipt</p>
            <p className="mt-1 text-caption text-muted-foreground">
              The output of a scope review.
            </p>
          </div>

          <div className="divide-y divide-border">
            {receiptLines.map(([label, value], index) => (
              <button
                className="grid w-full gap-2 py-5 text-left transition-opacity hover:opacity-80 active:translate-y-px"
                data-motion-item=""
                key={label}
                style={{ transitionDelay: `${280 + index * 80}ms` }}
                type="button"
              >
                <span className="flex items-center gap-2 text-caption text-muted-foreground">
                  <CornerDownRightIcon
                    aria-hidden="true"
                    className="size-3.5"
                  />
                  {label}
                </span>
                <span className="font-medium text-caption">{value}</span>
              </button>
            ))}
          </div>

          <button
            className="flex items-center gap-3 border-border border-t pt-5 text-left transition-opacity hover:opacity-80 active:translate-y-px"
            data-motion-item=""
            style={{ transitionDelay: "720ms" }}
            type="button"
          >
            <CircleDashedIcon
              aria-hidden="true"
              className="size-4 text-muted-foreground"
            />
            <span className="text-caption text-muted-foreground">
              Each review ends with a smaller scope and a next action.
            </span>
          </button>
        </div>
      </aside>
    </div>
  </div>
)
