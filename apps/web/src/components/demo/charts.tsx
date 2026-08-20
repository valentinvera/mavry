import { Badge } from "@mavry/ui/components/badge"
import { Button } from "@mavry/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@mavry/ui/components/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@mavry/ui/components/chart"
import { cn } from "@mavry/ui/lib/utils"
import { ArrowRightIcon } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"
import {
  type RoadmapLaneId,
  readinessSeries,
  roadmapLanes,
} from "@/components/demo/data"

const chartConfig = {
  score: {
    label: "Readiness",
    color: "var(--success-foreground)",
  },
} satisfies ChartConfig

const barColors = [
  "var(--muted-foreground)",
  "var(--info-foreground)",
  "var(--warning-foreground)",
  "var(--success-foreground)",
  "var(--success-foreground)",
] as const

interface Props {
  interactive: boolean
  onSelectedLaneChange: (laneId: RoadmapLaneId) => void
  selectedLaneId: RoadmapLaneId
}

export const Charts = ({
  interactive,
  selectedLaneId,
  onSelectedLaneChange,
}: Props) => {
  const selectedLane =
    roadmapLanes.find((lane) => lane.id === selectedLaneId) ?? roadmapLanes[0]

  return (
    <Card className="rounded-lg border-border/80 bg-card/70">
      <CardHeader className="border-border/80 border-b">
        <div>
          <CardTitle className="text-demo-control!">
            Readiness trajectory
          </CardTitle>
          <CardDescription className="text-demo-metadata!">
            Readiness increases as intake, scope, cut review, blocker review,
            and launch preparation become clearer.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 pt-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <button
          className="flex min-h-48 flex-col justify-end gap-3 rounded-md border border-border/70 bg-background/60 p-3 text-left transition-colors hover:bg-muted/30 active:translate-y-px"
          type="button"
        >
          <ChartContainer
            className="h-40 w-full"
            config={chartConfig}
            initialDimension={{ width: 560, height: 190 }}
          >
            <BarChart
              accessibilityLayer
              data={readinessSeries}
              margin={{ bottom: 0, left: 0, right: 0, top: 8 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                axisLine={false}
                dataKey="label"
                tickLine={false}
                tickMargin={8}
              />
              <YAxis domain={[0, 100]} hide />
              <ChartTooltip
                content={<ChartTooltipContent hideLabel />}
                cursor={false}
              />
              <Bar
                animationDuration={900}
                barSize={30}
                dataKey="score"
                fill="var(--color-score)"
                isAnimationActive
                radius={[6, 6, 2, 2]}
              >
                {readinessSeries.map((entry, index) => (
                  <Cell fill={barColors[index]} key={`readiness-${entry.id}`} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
          <div className="flex flex-wrap items-center justify-between gap-3 border-border/70 border-t pt-3">
            <div>
              <p className="font-medium text-demo-metadata!">
                Current decision window
              </p>
              <p className="text-demo-metadata! text-muted-foreground">
                Review the cut list first, then resolve the feedback owner
                blocking beta.
              </p>
            </div>
            <Badge className="rounded-md bg-warning text-demo-metadata! text-warning-foreground">
              1 blocker
            </Badge>
          </div>
        </button>

        <div className="flex flex-col gap-2">
          {roadmapLanes.map((lane) => {
            const isSelected = lane.id === selectedLaneId

            return (
              <button
                aria-pressed={isSelected}
                className={cn(
                  "rounded-md border border-border/70 bg-background/60 p-3 text-left transition-colors hover:bg-muted/40 active:translate-y-px disabled:pointer-events-none",
                  isSelected && "border-foreground/70 bg-muted/60"
                )}
                disabled={!interactive}
                key={lane.id}
                onClick={() => onSelectedLaneChange(lane.id)}
                type="button"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-demo-metadata!">
                    {lane.label}
                  </p>
                  {isSelected && (
                    <Badge
                      className="rounded-md text-demo-metadata!"
                      variant="outline"
                    >
                      Selected
                    </Badge>
                  )}
                </div>
                <p className="mt-2 text-demo-metadata!">{lane.summary}</p>
              </button>
            )
          })}
          <div className="rounded-md border bg-muted/30 p-3">
            <p className="font-medium text-demo-metadata!">
              {selectedLane.label}
            </p>
            <p className="mt-1 text-demo-metadata! text-muted-foreground">
              {selectedLane.detail}
            </p>
            <Button
              className="mt-3 rounded-md text-demo-control!"
              size="sm"
              type="button"
            >
              Review next action
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
