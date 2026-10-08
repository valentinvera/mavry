import { Link } from "@tanstack/react-router"
import { MavrySymbol } from "@/components/brand/mavry-symbol"

interface AuthHeaderProps {
  description: string
  title: string
}

export const AuthHeader = ({ description, title }: AuthHeaderProps) => (
  <>
    <Link
      aria-label="Mavry home"
      className="inline-flex cursor-pointer rounded-md"
      to="/"
    >
      <MavrySymbol className="size-12" />
    </Link>
    <h1 className="mt-7 text-balance font-medium text-xlarge md:text-section">
      {title}
    </h1>
    <p className="mt-2 max-w-xs text-pretty text-control text-muted-foreground leading-relaxed md:text-body">
      {description}
    </p>
  </>
)

interface AuthFooterProps {
  linkLabel: string
  prompt: string
  to: "/sign-in" | "/sign-up"
}

export const AuthFooter = ({ linkLabel, prompt, to }: AuthFooterProps) => (
  <p className="mt-8 text-center text-footer text-muted-foreground">
    {prompt}{" "}
    <Link
      className="cursor-pointer font-medium text-foreground underline-offset-4 hover:underline"
      search={{ error: undefined }}
      to={to}
    >
      {linkLabel}
    </Link>
  </p>
)
