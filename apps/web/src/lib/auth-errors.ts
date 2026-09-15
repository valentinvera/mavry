interface AuthClientError {
  code?: string
  status?: number
}

export type AuthErrorTarget =
  | "confirmPassword"
  | "credentials"
  | "email"
  | "form"
  | "password"

export interface AuthErrorDetails {
  message: string
  target: AuthErrorTarget
}

const AUTH_ERRORS: Record<string, AuthErrorDetails> = {
  EXPIRED_TOKEN: {
    message: "This reset link has expired. Request a new one to continue.",
    target: "form",
  },
  INVALID_EMAIL: {
    message: "Enter a valid email address.",
    target: "email",
  },
  INVALID_EMAIL_OR_PASSWORD: {
    message: "Incorrect email or password.",
    target: "credentials",
  },
  INVALID_PASSWORD: {
    message: "Incorrect email or password.",
    target: "credentials",
  },
  INVALID_TOKEN: {
    message:
      "This reset link is invalid or has expired. Request a new one to continue.",
    target: "form",
  },
  PASSWORD_TOO_LONG: {
    message: "Use a password with no more than 128 characters.",
    target: "password",
  },
  PASSWORD_TOO_SHORT: {
    message: "Use a password with at least 8 characters.",
    target: "password",
  },
  USER_ALREADY_EXISTS: {
    message: "An account already exists for this email.",
    target: "email",
  },
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: {
    message: "An account already exists for this email.",
    target: "email",
  },
} as const

export const getAuthError = (
  error: AuthClientError | null,
  fallbackMessage: string,
  fallbackTarget: AuthErrorTarget = "form"
): AuthErrorDetails => {
  if (error?.status === 429) {
    return {
      message: "Too many attempts. Wait a moment and try again.",
      target: "form",
    }
  }

  const errorCode = error?.code?.toUpperCase()

  if (!errorCode) {
    return { message: fallbackMessage, target: fallbackTarget }
  }

  return (
    AUTH_ERRORS[errorCode] ?? {
      message: fallbackMessage,
      target: fallbackTarget,
    }
  )
}
