import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@mavry/ui/components/input-group"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { type ComponentProps, useCallback, useState } from "react"

type PasswordInputProps = Omit<ComponentProps<typeof InputGroupInput>, "type">

export const PasswordInput = ({
  className,
  disabled,
  ...props
}: PasswordInputProps) => {
  const [passwordIsVisible, setPasswordIsVisible] = useState(false)
  const toggleLabel = passwordIsVisible ? "Hide password" : "Show password"

  const handleToggleVisibility = useCallback((): void => {
    setPasswordIsVisible((isVisible) => !isVisible)
  }, [])

  return (
    <InputGroup
      className="h-12 rounded-full border-border/80 bg-card/70 shadow-sm"
      data-disabled={disabled || undefined}
      invalidAppearance="message-only"
    >
      <InputGroupInput
        className={className}
        disabled={disabled}
        type={passwordIsVisible ? "text" : "password"}
        {...props}
      />
      <InputGroupAddon align="inline-end" className="pr-4 has-[>button]:mr-0">
        <InputGroupButton
          aria-label={toggleLabel}
          aria-pressed={passwordIsVisible}
          className="cursor-pointer hover:bg-transparent dark:hover:bg-transparent"
          disabled={disabled}
          onClick={handleToggleVisibility}
          size="icon-sm"
          title={toggleLabel}
        >
          {passwordIsVisible ? (
            <EyeOffIcon aria-hidden="true" />
          ) : (
            <EyeIcon aria-hidden="true" />
          )}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
