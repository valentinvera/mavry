import { Button } from "@mavry/ui/components/button"
import { cn } from "@mavry/ui/lib/utils"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

export const ThemeToggle = ({ className }: { className?: string }) => {
  const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light")
  }

  return (
    <Button
      aria-label="Toggle color theme"
      className={cn(
        "cursor-pointer rounded-md text-muted-foreground hover:text-foreground",
        className
      )}
      onClick={toggleTheme}
      size="icon"
      title="Toggle color theme"
      type="button"
      variant="ghost"
    >
      <SunIcon aria-hidden="true" className="size-4 dark:hidden" />
      <MoonIcon aria-hidden="true" className="hidden size-4 dark:block" />
    </Button>
  )
}
