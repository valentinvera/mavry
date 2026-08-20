import { Badge } from "@mavry/ui/components/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@mavry/ui/components/card"
import { cn } from "@mavry/ui/lib/utils"
import { ArrowUpRightIcon } from "lucide-react"
import { cards } from "@/components/demo/data"

const badgeClassNames = {
  readiness: "bg-success text-success-foreground",
  "build-now": "bg-info text-info-foreground",
  cut: "bg-destructive text-destructive-foreground",
  blocker: "bg-warning text-warning-foreground",
} satisfies Record<(typeof cards)[number]["id"], string>

export const SectionCards = () => (
  <div className="grid gap-3 px-3 sm:grid-cols-2 lg:grid-cols-4 lg:px-4">
    {cards.map((card) => (
      <button
        className="text-left transition-transform active:translate-y-px"
        key={card.id}
        type="button"
      >
        <Card
          className="h-full rounded-lg transition-colors hover:bg-muted/40"
          size="sm"
        >
          <CardHeader>
            <CardDescription className="text-demo-metadata!">
              {card.label}
            </CardDescription>
            <CardTitle className="flex items-end gap-1 text-demo-stat!">
              {card.value}
              <span className="pb-0.5 font-normal text-demo-metadata! text-muted-foreground">
                {card.suffix}
              </span>
            </CardTitle>
            <CardAction>
              <Badge
                className={cn(
                  "rounded-md text-demo-metadata!",
                  badgeClassNames[card.id]
                )}
              >
                {card.badge}
                <ArrowUpRightIcon data-icon="inline-end" />
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-demo-metadata! text-muted-foreground">
              {card.description}
            </p>
          </CardContent>
        </Card>
      </button>
    ))}
  </div>
)
