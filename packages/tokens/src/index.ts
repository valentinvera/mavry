const colors = {
  black: "#000000",
  white: "#FDFDFD",
  gray: {
    background: "#16171AEB",
    foreground: "#FDFEFFA6",
  },
  red: {
    background: "#FF173F2D",
    foreground: "#FF9592",
  },
  amber: {
    background: "#FA820022",
    foreground: "#FFCA16",
  },
  green: {
    background: "#22FF991E",
    foreground: "#46FEA5D4",
  },
  blue: {
    background: "#0077FF3A",
    foreground: "#70B8FF",
  },
} as const

const typography = {
  fontFamily: {
    sans: '"Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif',
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  text: {
    caption: { fontSize: "0.75rem", lineHeight: "1rem" },
    small: { fontSize: "0.875rem", lineHeight: "1.25rem" },
    medium: { fontSize: "1rem", lineHeight: "1.5rem" },
    large: { fontSize: "1.125rem", lineHeight: "1.75rem" },
    xlarge: { fontSize: "1.5rem", lineHeight: "2rem" },
    title: { fontSize: "3.5rem", lineHeight: "4rem" },
    display: { fontSize: "5.5rem", lineHeight: "5.75rem" },
  },
} as const

const radius = {
  xs: "0.125rem",
  sm: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  "3xl": "1.5rem",
  "4xl": "2rem",
} as const

const spacing = {
  unit: "0.25rem",
} as const

const effects = {
  blur: {
    glass: "25px",
  },
  shadow: {
    xs: "0 1px 2px 0 rgb(0 0 0 / 0.24)",
    sm: "0 8px 24px -16px rgb(0 0 0 / 0.4)",
    md: "0 16px 48px -28px rgb(0 0 0 / 0.55)",
    lg: "0 24px 72px -36px rgb(0 0 0 / 0.7)",
  },
} as const

const semantic = {
  background: colors.black,
  foreground: colors.white,
  card: colors.gray.background,
  cardForeground: colors.white,
  popover: "#111214",
  popoverForeground: colors.white,
  primary: colors.white,
  primaryForeground: colors.black,
  secondary: colors.gray.background,
  secondaryForeground: colors.white,
  muted: "#16171A99",
  mutedForeground: colors.gray.foreground,
  accent: colors.blue.background,
  accentForeground: colors.blue.foreground,
  destructive: colors.red.background,
  destructiveForeground: colors.red.foreground,
  warning: colors.amber.background,
  warningForeground: colors.amber.foreground,
  success: colors.green.background,
  successForeground: colors.green.foreground,
  info: colors.blue.background,
  infoForeground: colors.blue.foreground,
  border: "rgb(253 253 253 / 0.1)",
  input: "rgb(253 253 253 / 0.15)",
  ring: colors.blue.foreground,
} as const

export const mavryTokens = {
  colors,
  typography,
  radius,
  spacing,
  effects,
  semantic,
} as const

export type MavryTokens = typeof mavryTokens

export { colors, effects, radius, semantic, spacing, typography }
