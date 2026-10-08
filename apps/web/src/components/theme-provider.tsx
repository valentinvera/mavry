import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import { type ReactNode, useEffect } from "react"

const themeColors = {
  dark: "#000000",
  light: "#fdfdfd",
} as const

const ThemeColorSync = () => {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const usesFixedLightScheme =
      document.querySelector("[data-fixed-color-scheme]") !== null
    const themeColor =
      usesFixedLightScheme || resolvedTheme === "light"
        ? themeColors.light
        : themeColors.dark
    const themeColorMeta = document.querySelector('meta[name="theme-color"]')

    themeColorMeta?.setAttribute("content", themeColor)
  }, [resolvedTheme])

  return null
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => (
  <NextThemesProvider
    attribute="class"
    defaultTheme="light"
    disableTransitionOnChange
    enableSystem={false}
    storageKey="mavry-theme"
  >
    <ThemeColorSync />
    {children}
  </NextThemesProvider>
)
