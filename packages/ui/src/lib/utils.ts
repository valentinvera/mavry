import { type ClassValue, clsx } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "micro",
        "compact",
        "caption",
        "small",
        "medium",
        "large",
        "body",
        "emphasis",
        "xlarge",
        "section",
        "subtitle",
        "hero",
        "section-lg",
        "title",
        "display",
        "display-lg",
        "display-xl",
      ],
    },
  },
})

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
