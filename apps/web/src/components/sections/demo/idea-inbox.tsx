"use client"

import { Badge } from "@mavry/ui/components/badge"
import { Button } from "@mavry/ui/components/button"
import { Field, FieldGroup, FieldLabel } from "@mavry/ui/components/field"
import { Input } from "@mavry/ui/components/input"
import { cn } from "@mavry/ui/lib/utils"
import { CheckIcon, CircleDashedIcon, InboxIcon, PlusIcon } from "lucide-react"
import { type FormEvent, useEffect, useRef, useState } from "react"
import {
  DemoCursor,
  type DemoCursorPosition,
} from "@/components/demo/demo-cursor"
import { Frame } from "@/components/demo/frame"
import type { Content } from "@/components/demo/page-data"
import { inboxItems } from "@/components/demo/route-data"

const CAPTURED_IDEA = "Add release notes before beta"
const CAPTURED_IDEA_ID = "release-notes"
const TYPING_INTERVAL = 42

type MethodDemoPhase =
  | "idle"
  | "move-to-capture"
  | "opening"
  | "move-to-input"
  | "typing"
  | "move-to-save"
  | "saving"
  | "captured"
  | "move-to-idea"
  | "selecting"
  | "selected"

type CursorTarget = "capture" | "input" | "save" | "idea" | null

const capturedIdea = {
  detail:
    "Captured ideas stay outside the backlog until their user problem and MVP impact are clear.",
  id: CAPTURED_IDEA_ID,
  source: "Web capture",
  status: "Needs clarity",
  title: CAPTURED_IDEA,
} as const

const capturedSignals = [
  {
    detail: "Name who needs this before it enters scope.",
    id: "problem",
    label: "Problem missing",
    warning: true,
  },
  {
    detail: "Explain how it reduces beta launch risk.",
    id: "impact",
    label: "MVP impact unclear",
    warning: true,
  },
  {
    detail: "Ownership can wait until the idea is clarified.",
    id: "owner",
    label: "Owner not needed yet",
    warning: false,
  },
] as const

const feedbackSignals = [
  {
    detail: "Enough context to review the idea.",
    id: "problem",
    label: "Problem named",
    warning: false,
  },
  {
    detail: "Enough context to review the idea.",
    id: "impact",
    label: "MVP impact",
    warning: false,
  },
  {
    detail: "Decide owner before launch.",
    id: "owner",
    label: "Owner missing",
    warning: true,
  },
] as const

interface IdeaInboxProps {
  autoPlay?: boolean
  content: Content
}

export const IdeaInbox = ({ autoPlay = false, content }: IdeaInboxProps) => {
  const demoRef = useRef<HTMLDivElement>(null)
  const captureButtonRef = useRef<HTMLButtonElement>(null)
  const ideaInputRef = useRef<HTMLInputElement>(null)
  const saveButtonRef = useRef<HTMLButtonElement>(null)
  const capturedIdeaRef = useRef<HTMLButtonElement>(null)
  const [cycle, setCycle] = useState(0)
  const [cursorPosition, setCursorPosition] =
    useState<DemoCursorPosition | null>(null)
  const [cursorTarget, setCursorTarget] = useState<CursorTarget>(null)
  const [demoPhase, setDemoPhase] = useState<MethodDemoPhase>("idle")
  const [isCaptureOpen, setIsCaptureOpen] = useState(false)
  const [isIdeaCaptured, setIsIdeaCaptured] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState("feedback-route")
  const [typedIdea, setTypedIdea] = useState("")

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updateMotionPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches)
    }

    updateMotionPreference()
    mediaQuery.addEventListener("change", updateMotionPreference)

    return () => {
      mediaQuery.removeEventListener("change", updateMotionPreference)
    }
  }, [])

  useEffect(() => {
    const demo = demoRef.current

    if (!(autoPlay && demo)) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry?.isIntersecting ?? false)
      },
      { threshold: 0.25 }
    )

    observer.observe(demo)

    return () => {
      observer.disconnect()
    }
  }, [autoPlay])

  useEffect(() => {
    if (!autoPlay) {
      return
    }

    if (prefersReducedMotion) {
      setCursorTarget(null)
      setDemoPhase("selected")
      setIsCaptureOpen(false)
      setIsIdeaCaptured(true)
      setSelectedItemId(CAPTURED_IDEA_ID)
      setTypedIdea("")
      return
    }

    if (!isInView) {
      return
    }

    const timeouts: number[] = []
    const schedule = (callback: () => void, delay: number) => {
      timeouts.push(window.setTimeout(callback, delay))
    }

    setCursorTarget(null)
    setDemoPhase("idle")
    setIsCaptureOpen(false)
    setIsIdeaCaptured(false)
    setSelectedItemId("feedback-route")
    setTypedIdea("")

    schedule(() => {
      setCursorTarget("capture")
      setDemoPhase("move-to-capture")
    }, 500)
    schedule(() => {
      setIsCaptureOpen(true)
      setDemoPhase("opening")
    }, 1200)
    schedule(() => {
      setCursorTarget("input")
      setDemoPhase("move-to-input")
    }, 1850)

    const typingStart = 2450
    for (let index = 0; index < CAPTURED_IDEA.length; index += 1) {
      schedule(
        () => {
          setDemoPhase("typing")
          setTypedIdea(CAPTURED_IDEA.slice(0, index + 1))
        },
        typingStart + index * TYPING_INTERVAL
      )
    }

    const typingEnd = typingStart + CAPTURED_IDEA.length * TYPING_INTERVAL

    schedule(() => {
      setCursorTarget("save")
      setDemoPhase("move-to-save")
    }, typingEnd + 450)
    schedule(() => {
      setDemoPhase("saving")
    }, typingEnd + 1150)
    schedule(() => {
      setIsCaptureOpen(false)
      setIsIdeaCaptured(true)
      setTypedIdea("")
      setDemoPhase("captured")
    }, typingEnd + 1450)
    schedule(() => {
      setCursorTarget("idea")
      setDemoPhase("move-to-idea")
    }, typingEnd + 2150)
    schedule(() => {
      setDemoPhase("selecting")
    }, typingEnd + 2850)
    schedule(() => {
      setSelectedItemId(CAPTURED_IDEA_ID)
      setDemoPhase("selected")
    }, typingEnd + 3150)
    schedule(() => {
      setCycle(cycle + 1)
    }, typingEnd + 6800)

    return () => {
      for (const timeout of timeouts) {
        window.clearTimeout(timeout)
      }
    }
  }, [autoPlay, cycle, isInView, prefersReducedMotion])

  useEffect(() => {
    if (!(cursorTarget && demoRef.current) || prefersReducedMotion) {
      setCursorPosition(null)
      return
    }

    const updateCursorPosition = () => {
      const demo = demoRef.current
      const cursorTargets = {
        capture: captureButtonRef.current,
        idea: capturedIdeaRef.current,
        input: ideaInputRef.current,
        save: saveButtonRef.current,
      }
      const target = cursorTarget ? cursorTargets[cursorTarget] : null

      if (!(demo && target)) {
        return
      }

      const demoBounds = demo.getBoundingClientRect()
      const targetBounds = target.getBoundingClientRect()

      setCursorPosition({
        x: targetBounds.left - demoBounds.left + targetBounds.width * 0.72,
        y: targetBounds.top - demoBounds.top + targetBounds.height * 0.55,
      })
    }

    const animationFrame = window.requestAnimationFrame(updateCursorPosition)
    window.addEventListener("resize", updateCursorPosition)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener("resize", updateCursorPosition)
    }
  }, [cursorTarget, prefersReducedMotion])

  const captureIdea = () => {
    setIsCaptureOpen(false)
    setIsIdeaCaptured(true)
    setSelectedItemId(CAPTURED_IDEA_ID)
    setTypedIdea("")
    setDemoPhase("selected")
  }

  const handleCaptureSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!typedIdea.trim()) {
      return
    }

    captureIdea()
  }

  const isCapturedIdeaSelected = selectedItemId === CAPTURED_IDEA_ID
  const detail = isCapturedIdeaSelected
    ? {
        description: capturedIdea.detail,
        question:
          "What launch decision would release notes help the first beta make?",
        signals: capturedSignals,
        subtitle: "Captured · Needs clarity",
        title: capturedIdea.title,
      }
    : {
        description:
          "This idea becomes work only if it stays small enough for beta: one owner, one channel, and one clear way to collect feedback.",
        question:
          "Can beta launch with a manual feedback route instead of a full feedback product?",
        signals: feedbackSignals,
        subtitle: "Clarify before it becomes work",
        title: "One beta feedback route",
      }
  const visibleItems = isIdeaCaptured
    ? [capturedIdea, ...inboxItems]
    : inboxItems
  const isCursorClicking =
    demoPhase === "opening" ||
    demoPhase === "saving" ||
    demoPhase === "selecting"

  return (
    <Frame content={content}>
      <div
        className="relative grid min-h-[29rem] overflow-hidden lg:grid-cols-[17rem_minmax(0,1fr)]"
        data-autoplay-surface={autoPlay ? "" : undefined}
        data-method-demo-phase={demoPhase}
        inert={autoPlay ? true : undefined}
        ref={demoRef}
      >
        <section className="border-border/70 border-b lg:border-r lg:border-b-0">
          <div className="flex items-center justify-between gap-3 border-border/70 border-b px-4 py-3">
            <p className="flex items-center gap-2 font-medium text-demo-metadata!">
              <InboxIcon
                aria-hidden="true"
                className="size-4 text-muted-foreground"
              />
              Idea intake
            </p>
            <Button
              className={cn(
                "rounded-md text-demo-control!",
                demoPhase === "opening" && "ring-2 ring-ring/50"
              )}
              onClick={() => setIsCaptureOpen(true)}
              ref={captureButtonRef}
              size="sm"
              type="button"
            >
              <PlusIcon data-icon="inline-start" />
              Capture
            </Button>
          </div>

          {isCaptureOpen ? (
            <form
              aria-label="Capture a new idea"
              className="flex gap-2 border-border/70 border-b p-3"
              onSubmit={handleCaptureSubmit}
            >
              <FieldGroup className="min-w-0 flex-1 gap-0">
                <Field>
                  <FieldLabel className="sr-only" htmlFor="new-idea">
                    New idea
                  </FieldLabel>
                  <Input
                    aria-label="New idea"
                    className={cn(
                      "rounded-md text-demo-control!",
                      (demoPhase === "move-to-input" ||
                        demoPhase === "typing") &&
                        "border-ring ring-1 ring-ring/50"
                    )}
                    id="new-idea"
                    onChange={(event) =>
                      setTypedIdea(event.currentTarget.value)
                    }
                    placeholder="Write a new idea…"
                    ref={ideaInputRef}
                    value={typedIdea}
                  />
                </Field>
              </FieldGroup>
              <Button
                aria-label="Save idea"
                className={cn(
                  "rounded-md",
                  demoPhase === "saving" && "ring-2 ring-ring/50"
                )}
                disabled={!typedIdea.trim()}
                ref={saveButtonRef}
                size="icon"
                type="submit"
              >
                <CheckIcon aria-hidden="true" data-icon="inline-start" />
              </Button>
            </form>
          ) : null}

          <div aria-live="polite" className="divide-y divide-border/70">
            {visibleItems.map((item) => {
              const isSelected = item.id === selectedItemId
              const isCaptured = item.id === CAPTURED_IDEA_ID

              return (
                <button
                  aria-pressed={isSelected}
                  className={cn(
                    "flex w-full flex-col gap-2 px-3 py-3 text-left transition-colors hover:bg-muted/35 active:translate-y-px",
                    isSelected && "bg-muted/35",
                    isCaptured &&
                      demoPhase === "selecting" &&
                      "ring-2 ring-ring/50 ring-inset"
                  )}
                  data-captured-idea={isCaptured ? "" : undefined}
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  ref={isCaptured ? capturedIdeaRef : undefined}
                  type="button"
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="font-medium text-demo-control!">
                      {item.title}
                    </span>
                    <Badge
                      className="rounded-md text-demo-metadata!"
                      variant="outline"
                    >
                      {item.status}
                    </Badge>
                  </span>
                  <span className="text-demo-metadata! text-muted-foreground">
                    {item.source}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <section className="grid grid-rows-[auto_1fr_auto]">
          <div className="border-border/70 border-b p-5">
            <div>
              <p className="text-demo-metadata! text-muted-foreground">
                {detail.subtitle}
              </p>
              <h3 className="mt-2 max-w-xl font-semibold text-demo-title!">
                {detail.title}
              </h3>
            </div>
            <p className="mt-3 max-w-2xl text-demo-body! text-muted-foreground">
              {detail.description}
            </p>
          </div>
          <div className="grid content-center gap-4 p-5 md:grid-cols-3">
            {detail.signals.map((signal) => (
              <button
                className="group min-h-32 border-border/70 border-l pl-4 text-left transition-colors hover:border-foreground/60 active:translate-y-px"
                key={signal.id}
                type="button"
              >
                <CircleDashedIcon
                  aria-hidden="true"
                  className={cn(
                    "size-4 text-muted-foreground",
                    signal.warning && "text-warning-foreground"
                  )}
                />
                <span className="mt-8 block font-medium text-demo-control!">
                  {signal.label}
                </span>
                <span className="mt-2 block text-demo-metadata! text-muted-foreground">
                  {signal.detail}
                </span>
              </button>
            ))}
          </div>
          <footer className="border-border/70 border-t p-5">
            <button
              className="w-full text-left transition-colors hover:text-foreground active:translate-y-px"
              type="button"
            >
              <span className="font-medium text-demo-metadata!">
                Clarifying question
              </span>
              <span className="mt-2 block text-demo-metadata! text-muted-foreground">
                {detail.question}
              </span>
            </button>
          </footer>
        </section>

        {autoPlay ? (
          <DemoCursor isClicking={isCursorClicking} position={cursorPosition} />
        ) : null}
      </div>
    </Frame>
  )
}
