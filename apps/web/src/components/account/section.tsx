import type { ReactNode } from "react"

interface AccountSectionProps {
  children: ReactNode
  description?: string
  title: string
}

export const AccountSection = ({
  children,
  description,
  title,
}: AccountSectionProps) => (
  <section className="flex min-w-0 flex-col gap-4">
    <div>
      <h2 className="font-medium text-medium">{title}</h2>
      {description ? (
        <p className="mt-1 text-caption text-muted-foreground">{description}</p>
      ) : null}
    </div>
    {children}
  </section>
)
