import { Button } from "@mavry/ui/components/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@mavry/ui/components/field"
import { Input } from "@mavry/ui/components/input"
import { ArrowRightIcon } from "lucide-react"

export function LandingHeroSection() {
  return (
    <section className="grid gap-10 md:grid-cols-[minmax(0,1fr)_20rem] md:items-end">
      <div className="flex max-w-3xl flex-col gap-6">
        <p className="font-medium text-muted-foreground text-small">
          Product clarity for focused builders.
        </p>
        <div className="flex flex-col gap-5">
          <h1 className="max-w-4xl text-pretty font-bold text-title tracking-normal">
            Know what to build next, what to cut, and when to ship.
          </h1>
          <p className="max-w-2xl text-large text-muted-foreground">
            Mavry turns messy product ideas into a focused roadmap without
            treating every idea like a task.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="button">
            Create account
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
          <Button type="button" variant="outline">
            Sign in
          </Button>
        </div>
      </div>

      <form aria-disabled="true" className="flex flex-col gap-3">
        <FieldGroup>
          <Field data-disabled>
            <FieldLabel htmlFor="landing-project">Project idea</FieldLabel>
            <Input
              disabled
              id="landing-project"
              placeholder="Scope the first version"
              readOnly
            />
            <FieldDescription>
              Placeholder for the future entry flow.
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </section>
  )
}
