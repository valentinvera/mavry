import { Alert, AlertDescription, AlertTitle } from "@mavry/ui/components/alert"
import { Badge } from "@mavry/ui/components/badge"
import { Separator } from "@mavry/ui/components/separator"
import { LandingHeroSection } from "../sections/landing/hero"
import { mavryBrandAssets } from "./brand-assets"

export function LandingShell() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto flex min-h-svh w-full max-w-6xl flex-col px-6 py-5 md:px-10">
        <header className="flex items-center justify-between gap-4">
          <a
            aria-label="Mavry home"
            className="inline-flex items-center"
            href="/"
          >
            <img
              alt="Mavry"
              className="h-6 w-auto"
              height={128}
              src={mavryBrandAssets.logo}
              width={392}
            />
          </a>
          <Badge variant="outline">Foundation</Badge>
        </header>

        <div className="flex flex-1 flex-col justify-center gap-10 py-16">
          <LandingHeroSection />

          <Separator />

          <Alert className="max-w-2xl">
            <img
              alt=""
              aria-hidden="true"
              className="size-4"
              height={128}
              src={mavryBrandAssets.lettermark}
              width={128}
            />
            <AlertTitle>Landing foundation</AlertTitle>
            <AlertDescription>
              The page shell is ready for final sections, real entry actions,
              and launch copy.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </main>
  )
}
