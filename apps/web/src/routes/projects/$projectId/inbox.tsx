import type { IdeaSummary } from "@mavry/trpc/contracts/idea"
import { Alert, AlertDescription } from "@mavry/ui/components/alert"
import { Button } from "@mavry/ui/components/button"
import { Field, FieldGroup, FieldLabel } from "@mavry/ui/components/field"
import { Input } from "@mavry/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@mavry/ui/components/select"
import { Spinner } from "@mavry/ui/components/spinner"
import { Textarea } from "@mavry/ui/components/textarea"
import { Toggle } from "@mavry/ui/components/toggle"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { type FormEvent, useCallback, useMemo, useState } from "react"
import {
  EDITABLE_IDEA_STATUSES,
  type EditableIdeaStatus,
  IDEA_SOURCE_LABELS,
  IDEA_STATUS_LABELS,
} from "@/lib/idea-labels"
import { useTRPC } from "@/utils/trpc"

const TEXT_INPUT_CLASS =
  "h-10 rounded-lg border-border/80 bg-background/70 px-3 text-control! focus-visible:bg-background"
const TEXTAREA_CLASS =
  "min-h-16 rounded-lg border-border/80 bg-background/70 px-3 py-2 text-caption! focus-visible:bg-background"

type StatusFilter = EditableIdeaStatus | "all"

const FILTERS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  ...EDITABLE_IDEA_STATUSES.map((status) => ({
    label: IDEA_STATUS_LABELS[status],
    value: status,
  })),
]

const STATUS_ITEMS = EDITABLE_IDEA_STATUSES.map((status) => ({
  label: IDEA_STATUS_LABELS[status],
  value: status,
}))

const isEditableStatus = (value: string): value is EditableIdeaStatus =>
  EDITABLE_IDEA_STATUSES.some((status) => status === value)

interface StatusFilterButtonProps {
  active: boolean
  label: string
  onSelect: (value: StatusFilter) => void
  value: StatusFilter
}

const StatusFilterButton = ({
  active,
  label,
  onSelect,
  value,
}: StatusFilterButtonProps) => {
  const handleSelect = useCallback(() => {
    onSelect(value)
  }, [onSelect, value])

  return (
    <Toggle
      aria-pressed={active}
      className={active ? "bg-muted text-foreground" : undefined}
      onPressedChange={handleSelect}
      size="sm"
      variant="outline"
    >
      {label}
    </Toggle>
  )
}

interface IdeaRowProps {
  idea: IdeaSummary
  onStatusChange: (id: string, status: EditableIdeaStatus) => void
}

const IdeaRow = ({ idea, onStatusChange }: IdeaRowProps) => {
  const handleStatusChange = useCallback(
    (value: unknown) => {
      if (typeof value === "string" && isEditableStatus(value)) {
        onStatusChange(idea.id, value)
      }
    },
    [idea.id, onStatusChange]
  )

  return (
    <li className="flex flex-col gap-3 border-border/70 border-b py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <div className="min-w-0">
        <h3 className="font-medium text-medium">{idea.title}</h3>
        {idea.note ? (
          <p className="mt-1 line-clamp-2 text-caption text-muted-foreground">
            {idea.note}
          </p>
        ) : null}
        <p className="mt-2 text-caption text-muted-foreground">
          {IDEA_SOURCE_LABELS[idea.source]}
        </p>
      </div>

      {idea.status === "converted" ? (
        <span className="shrink-0 text-caption text-muted-foreground">
          {IDEA_STATUS_LABELS.converted}
        </span>
      ) : (
        <Select
          items={STATUS_ITEMS}
          onValueChange={handleStatusChange}
          value={idea.status}
        >
          <SelectTrigger
            aria-label={`Status for ${idea.title}`}
            className="h-8 w-fit shrink-0 rounded-md border-border/80 bg-background/70 text-caption"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_ITEMS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </li>
  )
}

export const Route = createFileRoute("/projects/$projectId/inbox")({
  component: IdeaInboxPage,
})

function IdeaInboxPage() {
  const { projectId } = Route.useParams()
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const [filter, setFilter] = useState<StatusFilter>("all")
  const [submitError, setSubmitError] = useState<string | null>(null)

  const listQuery = useQuery(
    trpc.ideas.list.queryOptions({
      projectId,
      status: filter === "all" ? undefined : filter,
    })
  )
  const ideas = useMemo(() => listQuery.data ?? [], [listQuery.data])
  const createIdea = useMutation(trpc.ideas.create.mutationOptions())
  const updateStatus = useMutation(trpc.ideas.updateStatus.mutationOptions())

  const invalidateIdeas = useCallback(
    () =>
      queryClient.invalidateQueries({
        queryKey: trpc.ideas.list.queryKey(),
      }),
    [queryClient, trpc]
  )

  const handleAdd = useCallback(
    async (event: FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault()
      const form = event.currentTarget
      const formData = new FormData(form)
      const title = String(formData.get("title") ?? "").trim()
      const note = String(formData.get("note") ?? "").trim()

      if (!title) {
        return
      }

      setSubmitError(null)

      try {
        await createIdea.mutateAsync({
          note: note || undefined,
          projectId,
          source: "web",
          title,
        })
        form.reset()
        await invalidateIdeas()
      } catch {
        setSubmitError("Mavry couldn’t save the idea. Try again.")
      }
    },
    [createIdea, invalidateIdeas, projectId]
  )

  const handleStatusChange = useCallback(
    (id: string, status: EditableIdeaStatus) => {
      updateStatus
        .mutateAsync({ id, status })
        .then(() => invalidateIdeas())
        .catch(() => {
          setSubmitError("Mavry couldn’t update the idea. Try again.")
        })
    },
    [invalidateIdeas, updateStatus]
  )

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-medium text-medium">Idea inbox</h2>
        <p className="mt-1 text-caption text-muted-foreground">
          Capture ideas without deciding yet. They stay here until you choose
          what becomes a feature.
        </p>
      </div>

      <form aria-label="Add idea" onSubmit={handleAdd}>
        <FieldGroup className="gap-3">
          <Field>
            <FieldLabel className="sr-only" htmlFor="idea-title">
              Idea
            </FieldLabel>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                autoComplete="off"
                className={`${TEXT_INPUT_CLASS} flex-1`}
                id="idea-title"
                maxLength={160}
                name="title"
                placeholder="What is the idea?"
                required
              />
              <Button
                className="h-10 cursor-pointer rounded-lg px-4 text-action!"
                disabled={createIdea.isPending}
                type="submit"
              >
                {createIdea.isPending ? (
                  <Spinner data-icon="inline-start" />
                ) : null}
                Add idea
              </Button>
            </div>
          </Field>

          <Field>
            <FieldLabel className="sr-only" htmlFor="idea-note">
              Note
            </FieldLabel>
            <Textarea
              className={TEXTAREA_CLASS}
              id="idea-note"
              maxLength={2000}
              name="note"
              placeholder="Add context (optional)."
            />
          </Field>
        </FieldGroup>
      </form>

      {submitError ? (
        <Alert className="rounded-lg" variant="destructive">
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      ) : null}

      <fieldset
        aria-label="Filter ideas by status"
        className="flex flex-wrap gap-2"
      >
        {FILTERS.map((item) => (
          <StatusFilterButton
            active={filter === item.value}
            key={item.value}
            label={item.label}
            onSelect={setFilter}
            value={item.value}
          />
        ))}
      </fieldset>

      {listQuery.status === "pending" ? (
        <div className="flex items-center justify-center py-10">
          <Spinner className="size-5 text-muted-foreground" />
        </div>
      ) : null}

      {listQuery.status === "success" && ideas.length === 0 ? (
        <p className="text-caption text-muted-foreground">
          {filter === "all"
            ? "No ideas captured yet."
            : "No ideas with this status yet."}
        </p>
      ) : null}

      {ideas.length > 0 ? (
        <ul className="border-border/70 border-t">
          {ideas.map((idea) => (
            <IdeaRow
              idea={idea}
              key={idea.id}
              onStatusChange={handleStatusChange}
            />
          ))}
        </ul>
      ) : null}
    </div>
  )
}
