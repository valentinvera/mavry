"use client"

import {
  type ComponentProps,
  type ComponentType,
  type CSSProperties,
  createContext,
  type ReactNode,
  useContext,
  useId,
  useMemo,
} from "react"
import {
  type DefaultLegendContentProps,
  type DefaultTooltipContentProps,
  Legend,
  ResponsiveContainer,
  Tooltip,
  type TooltipValueType,
} from "recharts"

import { cn } from "#lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

const INITIAL_DIMENSION = { width: 320, height: 200 } as const
type TooltipNameType = number | string
type ChartTooltipPayloadItem = NonNullable<
  DefaultTooltipContentProps<TooltipValueType, TooltipNameType>["payload"]
>[number]

export type ChartConfig = Record<
  string,
  {
    label?: ReactNode
    icon?: ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
>

interface ChartContextProps {
  config: ChartConfig
}

const ChartContext = createContext<ChartContextProps | null>(null)

function useChart() {
  const context = useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

function ChartContainer({
  id,
  className,
  children,
  config,
  initialDimension = INITIAL_DIMENSION,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig
  children: ComponentProps<typeof ResponsiveContainer>["children"]
  initialDimension?: {
    width: number
    height: number
  }
}) {
  const uniqueId = useId()
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        className={cn(
          "flex aspect-video justify-center text-caption [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-hidden [&_.recharts-surface]:outline-hidden",
          className
        )}
        data-chart={chartId}
        data-slot="chart"
        {...props}
      >
        <ChartStyle config={config} id={chartId} />
        <ResponsiveContainer initialDimension={initialDimension}>
          {children}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme ?? config.color
  )

  if (!colorConfig.length) {
    return null
  }

  const chartStyle = Object.entries(THEMES)
    .map(
      ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ??
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
    )
    .join("\n")

  return <style>{chartStyle}</style>
}

const ChartTooltip = Tooltip

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: ComponentProps<typeof Tooltip> &
  ComponentProps<"div"> & {
    hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: "line" | "dot" | "dashed"
    nameKey?: string
    labelKey?: string
  } & Omit<
    DefaultTooltipContentProps<TooltipValueType, TooltipNameType>,
    "accessibilityLayer"
  >) {
  const { config } = useChart()

  const tooltipLabel = useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null
    }

    const [item] = payload
    const key = `${labelKey ?? item?.dataKey ?? item?.name ?? "value"}`
    const itemConfig = getPayloadConfigFromPayload(config, item, key)
    const value =
      !labelKey && typeof label === "string"
        ? (config[label]?.label ?? label)
        : itemConfig?.label

    if (labelFormatter) {
      return (
        <div className={cn("font-medium", labelClassName)}>
          {labelFormatter(value, payload)}
        </div>
      )
    }

    if (!value) {
      return null
    }

    return <div className={cn("font-medium", labelClassName)}>{value}</div>
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ])

  if (!(active && payload?.length)) {
    return null
  }

  const nestLabel = payload.length === 1 && indicator !== "dot"

  return (
    <div
      className={cn(
        "grid min-w-32 items-start gap-1.5 rounded-none border border-border/50 bg-background px-2.5 py-1.5 text-caption shadow-xl",
        className
      )}
    >
      {nestLabel ? null : tooltipLabel}
      <div className="grid gap-1.5">
        {payload
          .filter((item) => item.type !== "none")
          .map((item, index) => (
            <ChartTooltipItem
              color={color}
              config={config}
              formatter={formatter}
              hideIndicator={hideIndicator}
              indicator={indicator}
              item={item}
              itemIndex={index}
              key={`${item.dataKey ?? item.name ?? "value"}-${item.value ?? ""}`}
              nameKey={nameKey}
              nestLabel={nestLabel}
              tooltipLabel={tooltipLabel}
            />
          ))}
      </div>
    </div>
  )
}

const ChartLegend = Legend

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: React.ComponentProps<"div"> & {
  hideIcon?: boolean
  nameKey?: string
} & DefaultLegendContentProps) {
  const { config } = useChart()

  if (!payload?.length) {
    return null
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payload
        .filter((item) => item.type !== "none")
        .map((item) => {
          const key = `${nameKey ?? item.dataKey ?? "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)

          return (
            <div
              className={cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
              )}
              key={`${key}-${item.value ?? item.color ?? ""}`}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          )
        })}
    </div>
  )
}

interface ChartTooltipItemProps {
  color?: string
  config: ChartConfig
  formatter?: DefaultTooltipContentProps<
    TooltipValueType,
    TooltipNameType
  >["formatter"]
  hideIndicator: boolean
  indicator: "line" | "dot" | "dashed"
  item: ChartTooltipPayloadItem
  itemIndex: number
  nameKey?: string
  nestLabel: boolean
  tooltipLabel: ReactNode
}

function ChartTooltipItem({
  color,
  config,
  formatter,
  hideIndicator,
  indicator,
  item,
  itemIndex,
  nameKey,
  nestLabel,
  tooltipLabel,
}: ChartTooltipItemProps) {
  const key = `${nameKey ?? item.name ?? item.dataKey ?? "value"}`
  const itemConfig = getPayloadConfigFromPayload(config, item, key)
  const indicatorColor = color ?? item.payload?.fill ?? item.color
  const hasCustomFormatter = formatter && item.value !== undefined && item.name

  return (
    <div
      className={cn(
        "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
        indicator === "dot" && "items-center"
      )}
    >
      {hasCustomFormatter ? (
        formatter(item.value, item.name, item, itemIndex, item.payload)
      ) : (
        <>
          <ChartTooltipIndicator
            color={indicatorColor}
            config={itemConfig}
            hideIndicator={hideIndicator}
            indicator={indicator}
            nestLabel={nestLabel}
          />
          <ChartTooltipText
            item={item}
            itemConfig={itemConfig}
            nestLabel={nestLabel}
            tooltipLabel={tooltipLabel}
          />
        </>
      )}
    </div>
  )
}

interface ChartTooltipIndicatorProps {
  color?: string
  config?: ChartConfig[string]
  hideIndicator: boolean
  indicator: "line" | "dot" | "dashed"
  nestLabel: boolean
}

function ChartTooltipIndicator({
  color,
  config,
  hideIndicator,
  indicator,
  nestLabel,
}: ChartTooltipIndicatorProps) {
  if (config?.icon) {
    return <config.icon />
  }

  if (hideIndicator) {
    return null
  }

  return (
    <div
      className={cn(
        "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
        {
          "h-2.5 w-2.5": indicator === "dot",
          "w-1": indicator === "line",
          "w-0 border-[1.5px] border-dashed bg-transparent":
            indicator === "dashed",
          "my-0.5": nestLabel && indicator === "dashed",
        }
      )}
      style={
        {
          "--color-bg": color,
          "--color-border": color,
        } as CSSProperties
      }
    />
  )
}

interface ChartTooltipTextProps {
  item: ChartTooltipPayloadItem
  itemConfig?: ChartConfig[string]
  nestLabel: boolean
  tooltipLabel: ReactNode
}

function ChartTooltipText({
  item,
  itemConfig,
  nestLabel,
  tooltipLabel,
}: ChartTooltipTextProps) {
  return (
    <div
      className={cn(
        "flex flex-1 justify-between leading-none",
        nestLabel ? "items-end" : "items-center"
      )}
    >
      <div className="grid gap-1.5">
        {nestLabel ? tooltipLabel : null}
        <span className="text-muted-foreground">
          {itemConfig?.label ?? item.name}
        </span>
      </div>
      {item.value != null && (
        <span className="font-medium font-mono text-foreground tabular-nums">
          {typeof item.value === "number"
            ? item.value.toLocaleString()
            : String(item.value)}
        </span>
      )}
    </div>
  )
}

function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return configLabelKey in config ? config[configLabelKey] : config[key]
}

export {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
}
