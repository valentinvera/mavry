import { Badge } from "@mavry/ui/components/badge"
import { cn } from "@mavry/ui/lib/utils"
import type { Content } from "@/components/demo/page-data"

export const Header = ({ content }: { content: Content }) => (
  <header className="flex flex-col gap-4 border-border/80 border-b px-4 py-5 md:px-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        <Badge
          className="rounded-md border-border/80 bg-background/60 text-demo-metadata!"
          variant="outline"
        >
          {content.code}
        </Badge>
        <span className="text-demo-metadata! text-muted-foreground">
          {content.context}
        </span>
      </div>
      <Badge className="rounded-md bg-success text-demo-metadata! text-success-foreground">
        74 readiness
      </Badge>
    </div>
    <div className="max-w-2xl">
      <h2 className="font-semibold text-demo-title!">{content.title}</h2>
      <p className="mt-2 text-demo-body! text-muted-foreground">
        {content.description}
      </p>
    </div>
  </header>
)

export const Frame = ({
  children,
  content,
  className,
}: {
  children: React.ReactNode
  content: Content
  className?: string
}) => (
  <article
    className={cn(
      "min-h-[34rem] overflow-hidden border-border/80 border-b bg-transparent",
      className
    )}
  >
    <Header content={content} />
    <div>{children}</div>
  </article>
)
