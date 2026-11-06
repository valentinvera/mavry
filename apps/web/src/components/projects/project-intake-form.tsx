import {
  type CreateProjectInput,
  createProjectInputSchema,
  type ProjectStage,
} from "@mavry/trpc/contracts/project"
import { Alert, AlertDescription } from "@mavry/ui/components/alert"
import { Button } from "@mavry/ui/components/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@mavry/ui/components/field"
import { Input } from "@mavry/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@mavry/ui/components/select"
import { Separator } from "@mavry/ui/components/separator"
import { Spinner } from "@mavry/ui/components/spinner"
import { Textarea } from "@mavry/ui/components/textarea"
import { Toggle } from "@mavry/ui/components/toggle"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { type FormEvent, useCallback, useState } from "react"
import { PROJECT_STAGE_LABELS, PROJECT_STAGES } from "@/lib/project-stage"
import { useTRPC } from "@/utils/trpc"

const TEXT_INPUT_CLASS =
  "h-10 rounded-lg border-border/80 bg-background/70 px-3 text-control! focus-visible:bg-background"
const TEXTAREA_CLASS =
  "min-h-24 rounded-lg border-border/80 bg-background/70 px-3 py-2.5 text-control! focus-visible:bg-background"
const SELECT_TRIGGER_CLASS =
  "h-10 w-full rounded-lg border-border/80 bg-background/70 px-3 text-control! focus-visible:bg-background"

const STAGE_ITEMS = PROJECT_STAGES.map((stage) => ({
  label: PROJECT_STAGE_LABELS[stage],
  value: stage,
}))

type FieldErrors = Partial<Record<string, string>>

const readValue = (formData: FormData, key: string): string =>
  String(formData.get(key) ?? "").trim()

const buildIntakeInput = (
  formData: FormData,
  stage: ProjectStage,
  alreadyStarted: boolean
) => ({
  alreadyBuilt: readValue(formData, "alreadyBuilt") || undefined,
  alreadyStarted,
  description: readValue(formData, "description"),
  goal30Days: readValue(formData, "goal30Days"),
  hypothesis: readValue(formData, "hypothesis"),
  launchBlocker: readValue(formData, "launchBlocker") || undefined,
  mainProblem: readValue(formData, "mainProblem"),
  name: readValue(formData, "name"),
  scopeCreepConcern: readValue(formData, "scopeCreepConcern") || undefined,
  stage,
  targetUser: readValue(formData, "targetUser"),
})

const getFieldErrors = (
  issues: readonly { message: string; path: PropertyKey[] }[]
): FieldErrors => {
  const errors: FieldErrors = {}

  for (const issue of issues) {
    const [key] = issue.path

    if (typeof key === "string" && !errors[key]) {
      errors[key] = issue.message
    }
  }

  return errors
}

const fieldErrors = (message: string | undefined) =>
  message ? [{ message }] : undefined

interface StartingPointFieldsProps {
  alreadyStarted: boolean
  errors: FieldErrors
  onSelectAlreadyStarted: () => void
  onSelectFreshStart: () => void
}

const StartingPointFields = ({
  alreadyStarted,
  errors,
  onSelectAlreadyStarted,
  onSelectFreshStart,
}: StartingPointFieldsProps) => (
  <>
    <Separator />

    <FieldSet>
      <FieldLegend>Starting point</FieldLegend>
      <FieldGroup className="gap-5">
        <Field>
          <FieldLabel>Is there anything already built?</FieldLabel>
          <div className="flex flex-wrap gap-2">
            <Toggle
              aria-pressed={!alreadyStarted}
              onPressedChange={onSelectFreshStart}
              size="lg"
              variant="outline"
            >
              Starting fresh
            </Toggle>
            <Toggle
              aria-pressed={alreadyStarted}
              onPressedChange={onSelectAlreadyStarted}
              size="lg"
              variant="outline"
            >
              Already started
            </Toggle>
          </div>
        </Field>

        {alreadyStarted ? (
          <FieldGroup className="gap-5">
            <Field data-invalid={Boolean(errors.alreadyBuilt) || undefined}>
              <FieldLabel htmlFor="project-already-built">
                What is already built?
              </FieldLabel>
              <Textarea
                aria-invalid={Boolean(errors.alreadyBuilt) || undefined}
                className={TEXTAREA_CLASS}
                id="project-already-built"
                maxLength={1000}
                name="alreadyBuilt"
                placeholder="Screens, features, or infrastructure that exist today."
                required
              />
              <FieldError errors={fieldErrors(errors.alreadyBuilt)} />
            </Field>

            <Field data-invalid={Boolean(errors.launchBlocker) || undefined}>
              <FieldLabel htmlFor="project-launch-blocker">
                What is blocking launch?
              </FieldLabel>
              <Textarea
                aria-invalid={Boolean(errors.launchBlocker) || undefined}
                className={TEXTAREA_CLASS}
                id="project-launch-blocker"
                maxLength={1000}
                name="launchBlocker"
                placeholder="The one thing that must be solved before beta."
                required
              />
              <FieldError errors={fieldErrors(errors.launchBlocker)} />
            </Field>

            <Field>
              <FieldLabel htmlFor="project-scope-creep">
                What is causing scope creep? (optional)
              </FieldLabel>
              <Textarea
                className={TEXTAREA_CLASS}
                id="project-scope-creep"
                maxLength={1000}
                name="scopeCreepConcern"
                placeholder="Ideas, requests, or features pulling the scope wider."
              />
            </Field>
          </FieldGroup>
        ) : null}
      </FieldGroup>
    </FieldSet>
  </>
)

export const ProjectIntakeForm = () => {
  const trpc = useTRPC()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const createProject = useMutation(trpc.projects.create.mutationOptions())
  const [stage, setStage] = useState<ProjectStage>("idea")
  const [alreadyStarted, setAlreadyStarted] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleStageChange = useCallback((value: unknown) => {
    if (typeof value === "string" && value in PROJECT_STAGE_LABELS) {
      setStage(value as ProjectStage)
    }
  }, [])

  const selectFreshStart = useCallback(() => {
    setAlreadyStarted(false)
  }, [])

  const selectAlreadyStarted = useCallback(() => {
    setAlreadyStarted(true)
  }, [])

  const submitProject = useCallback(
    async (input: CreateProjectInput): Promise<void> => {
      try {
        await createProject.mutateAsync(input)
        await queryClient.invalidateQueries({
          queryKey: trpc.projects.list.queryKey(),
        })
        await navigate({ to: "/projects" })
      } catch {
        setSubmitError("Mavry couldn’t create the project. Try again.")
      }
    },
    [createProject, navigate, queryClient, trpc]
  )

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault()
      setErrors({})
      setSubmitError(null)

      const input = buildIntakeInput(
        new FormData(event.currentTarget),
        stage,
        alreadyStarted
      )
      const parsed = createProjectInputSchema.safeParse(input)

      if (!parsed.success) {
        setErrors(getFieldErrors(parsed.error.issues))
        return
      }

      await submitProject(parsed.data)
    },
    [alreadyStarted, stage, submitProject]
  )

  return (
    <form
      aria-busy={createProject.isPending}
      aria-label="Create project"
      className="w-full max-w-2xl"
      onSubmit={handleSubmit}
    >
      <FieldGroup className="gap-8">
        <FieldSet>
          <FieldLegend>Product</FieldLegend>
          <FieldGroup className="gap-5">
            <Field data-invalid={Boolean(errors.name) || undefined}>
              <FieldLabel htmlFor="project-name">Name</FieldLabel>
              <Input
                aria-invalid={Boolean(errors.name) || undefined}
                autoComplete="off"
                className={TEXT_INPUT_CLASS}
                id="project-name"
                maxLength={80}
                name="name"
                placeholder="e.g. Mavry"
                required
              />
              <FieldError errors={fieldErrors(errors.name)} />
            </Field>

            <Field data-invalid={Boolean(errors.description) || undefined}>
              <FieldLabel htmlFor="project-description">
                One-line description
              </FieldLabel>
              <Input
                aria-invalid={Boolean(errors.description) || undefined}
                className={TEXT_INPUT_CLASS}
                id="project-description"
                maxLength={280}
                name="description"
                placeholder="What it is, in one line."
                required
              />
              <FieldError errors={fieldErrors(errors.description)} />
            </Field>
          </FieldGroup>
        </FieldSet>

        <Separator />

        <FieldSet>
          <FieldLegend>Stage</FieldLegend>
          <FieldGroup className="gap-5">
            <Field data-invalid={Boolean(errors.stage) || undefined}>
              <FieldLabel htmlFor="project-stage">
                Where is this product today?
              </FieldLabel>
              <Select
                items={STAGE_ITEMS}
                onValueChange={handleStageChange}
                value={stage}
              >
                <SelectTrigger
                  aria-invalid={Boolean(errors.stage) || undefined}
                  className={SELECT_TRIGGER_CLASS}
                  id="project-stage"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAGE_ITEMS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={fieldErrors(errors.stage)} />
            </Field>
          </FieldGroup>
        </FieldSet>

        <Separator />

        <FieldSet>
          <FieldLegend>Clarity</FieldLegend>
          <FieldGroup className="gap-5">
            <Field data-invalid={Boolean(errors.targetUser) || undefined}>
              <FieldLabel htmlFor="project-target-user">Target user</FieldLabel>
              <Input
                aria-invalid={Boolean(errors.targetUser) || undefined}
                className={TEXT_INPUT_CLASS}
                id="project-target-user"
                maxLength={200}
                name="targetUser"
                placeholder="Who is it for?"
                required
              />
              <FieldError errors={fieldErrors(errors.targetUser)} />
            </Field>

            <Field data-invalid={Boolean(errors.mainProblem) || undefined}>
              <FieldLabel htmlFor="project-main-problem">
                Main problem
              </FieldLabel>
              <Textarea
                aria-invalid={Boolean(errors.mainProblem) || undefined}
                className={TEXTAREA_CLASS}
                id="project-main-problem"
                maxLength={1000}
                name="mainProblem"
                placeholder="What problem does it solve?"
                required
              />
              <FieldError errors={fieldErrors(errors.mainProblem)} />
            </Field>

            <Field data-invalid={Boolean(errors.hypothesis) || undefined}>
              <FieldLabel htmlFor="project-hypothesis">
                Product hypothesis
              </FieldLabel>
              <Textarea
                aria-invalid={Boolean(errors.hypothesis) || undefined}
                className={TEXTAREA_CLASS}
                id="project-hypothesis"
                maxLength={1000}
                name="hypothesis"
                placeholder="What do you believe makes this worth building?"
                required
              />
              <FieldDescription>
                This stays visible later to keep scope honest.
              </FieldDescription>
              <FieldError errors={fieldErrors(errors.hypothesis)} />
            </Field>

            <Field data-invalid={Boolean(errors.goal30Days) || undefined}>
              <FieldLabel htmlFor="project-goal">Next 30-day goal</FieldLabel>
              <Textarea
                aria-invalid={Boolean(errors.goal30Days) || undefined}
                className={TEXTAREA_CLASS}
                id="project-goal"
                maxLength={500}
                name="goal30Days"
                placeholder="What should be true in 30 days?"
                required
              />
              <FieldError errors={fieldErrors(errors.goal30Days)} />
            </Field>
          </FieldGroup>
        </FieldSet>

        <StartingPointFields
          alreadyStarted={alreadyStarted}
          errors={errors}
          onSelectAlreadyStarted={selectAlreadyStarted}
          onSelectFreshStart={selectFreshStart}
        />

        {submitError ? (
          <Alert className="rounded-lg" variant="destructive">
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        ) : null}

        <div className="flex items-center gap-3">
          <Button
            className="h-10 cursor-pointer rounded-lg px-4 text-action!"
            disabled={createProject.isPending}
            type="submit"
          >
            {createProject.isPending ? (
              <Spinner data-icon="inline-start" />
            ) : null}
            {createProject.isPending ? "Creating project…" : "Create project"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
