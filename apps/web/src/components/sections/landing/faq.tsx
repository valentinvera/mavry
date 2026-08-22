import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@mavry/ui/components/accordion"

const questions = [
  {
    answer:
      "Mavry turns product ideas into explicit choices across your idea inbox, MVP scope, cut list, roadmap, readiness, and next actions. It helps you decide what belongs now, what can wait, and what should not be built yet.",
    question: "What does Mavry help me decide?",
  },
  {
    answer:
      "No. Project management tools organize execution after the work is defined. Mavry focuses on the product decisions that come first: what matters, why it belongs, what to cut, and what should happen next.",
    question: "Is Mavry another project management tool?",
  },
  {
    answer:
      "The first release is for technical founders, indie hackers, and builders shaping an early product. It is optimized for one product owner making clear decisions, not for managing a large team.",
    question: "Who is the first release for?",
  },
  {
    answer:
      "The web app supports deeper work on scope, roadmap, readiness, and reviews. Mobile keeps capture and quick product decisions close at hand. Both surfaces work from the same project state.",
    question: "How do web and mobile work together?",
  },
  {
    answer:
      "No. Mavry makes tradeoffs visible, keeps the reason behind each decision, and gives you a consistent way to review them. The final call stays with you.",
    question: "Does Mavry decide what to build for me?",
  },
  {
    answer:
      "Mavry is being built toward its first working release. Join the waitlist and you will hear when early access begins.",
    question: "When will early access open?",
  },
] as const

export const Faq = () => (
  <section
    className="relative py-16 before:absolute before:top-0 before:left-1/2 before:h-px before:w-screen before:-translate-x-1/2 before:bg-border sm:scroll-mt-8 sm:py-32"
    data-section-reveal=""
    id="faq"
  >
    <div className="grid gap-12 sm:gap-16">
      <div className="max-w-xl">
        <h2
          className="font-medium text-subtitle tracking-normal md:text-section-lg xl:text-title"
          data-landing-section-title=""
        >
          Clear answers
          <span className="block text-muted-foreground">before you join.</span>
        </h2>
        <p
          className="mt-6 max-w-lg text-body text-muted-foreground md:text-paragraph-md xl:text-paragraph-xl"
          data-landing-section-copy=""
        >
          What Mavry does, who the first release is for, and how it fits into
          the way you already build.
        </p>
      </div>

      <Accordion className="border-y">
        {questions.map(({ answer, question }) => (
          <AccordionItem key={question} value={question}>
            <AccordionTrigger className="py-5 text-body hover:no-underline md:py-6 md:text-paragraph-md">
              {question}
            </AccordionTrigger>
            <AccordionContent className="max-w-2xl pb-5 text-body text-muted-foreground md:pb-6 md:text-paragraph-md">
              {answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
)
