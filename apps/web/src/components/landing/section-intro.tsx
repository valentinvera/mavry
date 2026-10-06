import { cn } from "@mavry/ui/lib/utils"
import { CheckIcon } from "lucide-react"
import { DemoStage } from "@/components/landing/demo-stage"

const MUTED = "text-[#6e797b]"

export const TITLE =
  "text-balance font-medium text-[#000000] text-[2rem] leading-[1.12] tracking-tight md:text-[2.75rem]"

export const TwoTone = ({ lead, tail }: { lead: string; tail: string }) => (
  <>
    {lead}
    <span className={cn("block", MUTED)}>{tail}</span>
  </>
)

export const Intro = ({
  align = "start",
  children,
  description,
  id,
}: {
  align?: "center" | "start"
  children: React.ReactNode
  description: string
  id: string
}) => (
  <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
    <h2 className={TITLE} data-landing-section-title="" id={id}>
      {children}
    </h2>
    <p className="mt-5 text-[#5f6269] text-[1rem] leading-7">{description}</p>
  </div>
)

export const SplitIntro = ({
  children,
  description,
  id,
}: {
  children: React.ReactNode
  description: string
  id: string
}) => (
  <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end">
    <h2 className={TITLE} data-landing-section-title="" id={id}>
      {children}
    </h2>
    <p className="max-w-md text-[#5f6269] text-[1rem] leading-7 lg:justify-self-end">
      {description}
    </p>
  </div>
)

export const SplitGiant = ({
  description,
  demo,
  id,
  image,
  title,
}: {
  description: string
  demo: React.ReactNode
  id: string
  image: string
  title: React.ReactNode
}) => (
  <section
    aria-labelledby={`${id}-title`}
    className="group relative min-w-0 pt-20 sm:pt-28"
    data-section-reveal=""
    id={id}
  >
    <SplitIntro description={description} id={`${id}-title`}>
      {title}
    </SplitIntro>
    <div className="mt-12" data-motion-pop="">
      <DemoStage className="h-auto lg:h-[36rem]" image={image}>
        {demo}
      </DemoStage>
    </div>
  </section>
)

export const CheckList = ({
  color,
  points,
}: {
  color: string
  points: readonly string[]
}) => (
  <ul className="mt-6 flex flex-col gap-3">
    {points.map((point) => (
      <li
        className="flex items-start gap-3 text-[#3f3f46] text-[0.9375rem] leading-6"
        key={point}
      >
        <span
          aria-hidden="true"
          className="mt-1 flex size-4 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: color }}
        >
          <CheckIcon className="size-2.5 text-white" strokeWidth={3.5} />
        </span>
        {point}
      </li>
    ))}
  </ul>
)
