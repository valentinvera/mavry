import type { SVGProps } from "react"

export interface IconProps extends SVGProps<SVGSVGElement> {
  /** Accessible label; adds `role="img"` when used. */
  ariaLabel?: string
  /** Custom class names (Tailwind) for sizing and positioning. */
  className?: string
  /** Stroke color for line glyphs (defaults to currentColor). */
  color?: string
  /**
   * Toggles between `currentColor` and an explicit color so icons inherit
   * the surrounding text color by default. Pass a string to force a color.
   */
  currentColor?: boolean | string
  /** Marks the icon as the leading inline element in a button/label. */
  dataIcon?: IconDataIcon
  /** Fill color for filled glyphs (defaults to currentColor). */
  fill?: string
  /** Horizontal/vertical flip. */
  flip?: IconFlip
  /** Explicit height in px. Overrides the intrinsic height. */
  height?: number | string
  /** Opacity between 0 and 1. */
  opacity?: number
  /** Rotation in degrees. */
  rotate?: number
  /** Renders as 1x1 relative to the current font size (e.g. Tailwind size-4). */
  size?: number | string
  /** Line cap for stroked glyphs. */
  strokeLinecap?: SVGStrokeLinecap
  /** Line join for stroked glyphs. */
  strokeLinejoin?: SVGStrokeLinejoin
  /** Accessible description; links to a `<desc>` element. */
  title?: string
  /** Dark/light variant used by multi-color or monochrome brand icons. */
  variant?: IconVariant
  /** Original SVG coordinate space, e.g. "0 0 24 24". */
  viewBox?: string
  /** Stroke thickness (lucide-style line weight). */
  weight?: IconWeight
  /** Explicit width in px. Overrides the intrinsic width. */
  width?: number | string
}

export type IconWeight =
  | "thin"
  | "light"
  | "regular"
  | "medium"
  | "bold"
  | "fill"
  | (string & {})

export type IconVariant = "light" | "dark" | "auto" | (string & {})

export type IconDataIcon = "inline-start" | "inline-end" | (string & {})

export type IconFlip = "horizontal" | "vertical" | (string & {})

export type SVGStrokeLinecap = "butt" | "round" | "square" | "inherit"

export type SVGStrokeLinejoin = "round" | "inherit" | "miter" | "bevel"
