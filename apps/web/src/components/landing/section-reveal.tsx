"use client"

import { useEffect } from "react"

const SECTION_SELECTOR = "[data-section-reveal]"

const getRevealSections = (root: ParentNode): HTMLElement[] => {
  const sections = Array.from(
    root.querySelectorAll<HTMLElement>(SECTION_SELECTOR)
  )

  if (root instanceof HTMLElement && root.matches(SECTION_SELECTOR)) {
    sections.unshift(root)
  }

  return sections
}

export const SectionReveal = () => {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (prefersReducedMotion) {
      const revealSections = (root: ParentNode) => {
        for (const section of getRevealSections(root)) {
          section.dataset.revealed = "true"
        }
      }

      revealSections(document)

      const mutationObserver = new MutationObserver((records) => {
        for (const record of records) {
          for (const node of record.addedNodes) {
            if (node instanceof HTMLElement) {
              revealSections(node)
            }
          }
        }
      })

      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      })

      return () => mutationObserver.disconnect()
    }

    const isMobileViewport = window.matchMedia("(max-width: 767px)").matches

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue
          }

          const section = entry.target as HTMLElement
          section.dataset.revealed = "true"
          observer.unobserve(section)
        }
      },
      {
        rootMargin: isMobileViewport ? "0px 0px 52% 0px" : "0px 0px -4% 0px",
        threshold: isMobileViewport ? 0.01 : 0.16,
      }
    )

    const observeSections = (root: ParentNode) => {
      for (const section of getRevealSections(root)) {
        if (section.dataset.revealed !== "true") {
          observer.observe(section)
        }
      }
    }

    observeSections(document)

    const mutationObserver = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node instanceof HTMLElement) {
            observeSections(node)
          }
        }
      }
    })

    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      mutationObserver.disconnect()
      observer.disconnect()
    }
  }, [])

  return (
    <style>
      {`
        @media (prefers-reduced-motion: no-preference) {
          [data-section-reveal] {
            opacity: 0;
            transform: translate3d(0, 2.75rem, 0);
            filter: blur(8px);
            transition:
              opacity 760ms cubic-bezier(0.22, 1, 0.36, 1),
              transform 860ms cubic-bezier(0.22, 1, 0.36, 1),
              filter 860ms cubic-bezier(0.22, 1, 0.36, 1);
            will-change: opacity, transform, filter;
          }

          [data-section-reveal] > * {
            opacity: 0;
            transform: translate3d(0, 1.25rem, 0);
            transition:
              opacity 700ms cubic-bezier(0.22, 1, 0.36, 1),
              transform 760ms cubic-bezier(0.22, 1, 0.36, 1);
            will-change: opacity, transform;
          }

          [data-section-reveal][data-revealed="true"],
          [data-section-reveal][data-revealed="true"] > * {
            opacity: 1;
            transform: translate3d(0, 0, 0);
            filter: blur(0);
          }

          [data-section-reveal][data-revealed="true"] > :nth-child(1) {
            transition-delay: 80ms;
          }

          [data-section-reveal][data-revealed="true"] > :nth-child(2) {
            transition-delay: 160ms;
          }

          [data-section-reveal][data-revealed="true"] > :nth-child(3) {
            transition-delay: 220ms;
          }

          [data-section-reveal] [data-motion-item],
          [data-section-reveal] [data-motion-pop] {
            opacity: 0;
            translate: 0 1rem;
            transition:
              opacity 640ms cubic-bezier(0.22, 1, 0.36, 1),
              translate 760ms cubic-bezier(0.22, 1, 0.36, 1),
              scale 760ms cubic-bezier(0.22, 1, 0.36, 1),
              filter 760ms cubic-bezier(0.22, 1, 0.36, 1);
            will-change: opacity, translate, scale, filter;
          }

          [data-section-reveal] [data-motion-pop] {
            translate: 0 0.75rem;
            scale: 0.96;
            filter: blur(4px);
          }

          [data-section-reveal] [data-motion-line] {
            transform: scaleX(0);
            transform-origin: left center;
            transition: transform 900ms cubic-bezier(0.22, 1, 0.36, 1);
            transition-delay: calc(var(--motion-index, 0) * 80ms + 220ms);
            will-change: transform;
          }

          [data-section-reveal] [data-motion-path] {
            stroke-dasharray: 1;
            stroke-dashoffset: 1;
            transition: stroke-dashoffset 1100ms cubic-bezier(0.22, 1, 0.36, 1);
            transition-delay: calc(var(--motion-index, 0) * 90ms + 260ms);
            will-change: stroke-dashoffset;
          }

          [data-section-reveal][data-revealed="true"] [data-motion-item],
          [data-section-reveal][data-revealed="true"] [data-motion-pop] {
            opacity: 1;
            translate: 0 0;
            scale: 1;
            filter: blur(0);
          }

          [data-section-reveal][data-revealed="true"] [data-motion-line] {
            transform: scaleX(1);
          }

          [data-section-reveal][data-revealed="true"] [data-motion-path] {
            stroke-dashoffset: 0;
          }

          @media (max-width: 767px) {
            [data-section-reveal] {
              transform: translate3d(0, 1.75rem, 0);
              filter: blur(5px);
              transition:
                opacity 520ms cubic-bezier(0.22, 1, 0.36, 1),
                transform 600ms cubic-bezier(0.22, 1, 0.36, 1),
                filter 600ms cubic-bezier(0.22, 1, 0.36, 1);
            }

            [data-section-reveal] > * {
              transform: translate3d(0, 0.75rem, 0);
              transition:
                opacity 480ms cubic-bezier(0.22, 1, 0.36, 1),
                transform 560ms cubic-bezier(0.22, 1, 0.36, 1);
            }

            [data-section-reveal][data-revealed="true"] > :nth-child(1) {
              transition-delay: 40ms;
            }

            [data-section-reveal][data-revealed="true"] > :nth-child(2) {
              transition-delay: 80ms;
            }

            [data-section-reveal][data-revealed="true"] > :nth-child(3) {
              transition-delay: 120ms;
            }
          }
        }
      `}
    </style>
  )
}
