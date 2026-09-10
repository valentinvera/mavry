import { colors, semantic, typography } from "@mavry/tokens"
import { pixelBasedPreset, type TailwindConfig } from "@react-email/components"

export const mavryEmailTheme = {
  presets: [pixelBasedPreset],
  theme: {
    extend: {
      colors: {
        mavry: {
          black: colors.black,
          border: semantic.border,
          canvas: semantic.popover,
          muted: colors.gray.foreground,
          white: colors.white,
        },
      },
      fontFamily: {
        sans: typography.fontFamily.sans,
      },
    },
  },
} satisfies TailwindConfig
