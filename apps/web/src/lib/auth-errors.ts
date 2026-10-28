interface AuthClientError {
  code?: string
  status?: number
}

export type AuthErrorTarget =
  | "confirmPassword"
  | "credentials"
  | "email"
  | "form"
  | "otp"
  | "password"

export interface AuthErrorDetails {
  message: string
  target: AuthErrorTarget
}

const AUTH_ERRORS: Record<string, AuthErrorDetails> = {
  ACCOUNT_TEMPORARILY_LOCKED: {
    message:
      "Too many failed attempts. Your account is temporarily locked. Try again later.",
    target: "form",
  },
  INVALID_BACKUP_CODE: {
    message: "That backup code didn’t work. Try again.",
    target: "otp",
  },
  INVALID_CODE: {
    message: "That code didn’t work. Try again.",
    target: "otp",
  },
  INVALID_EMAIL: {
    message: "Enter a valid email address.",
    target: "email",
  },
  INVALID_EMAIL_OR_PASSWORD: {
    message: "Incorrect email or password.",
    target: "credentials",
  },
  INVALID_OTP: {
    message: "That code is incorrect. Check it and try again.",
    target: "otp",
  },
  INVALID_PASSWORD: {
    message: "Incorrect email or password.",
    target: "credentials",
  },
  INVALID_TWO_FACTOR_COOKIE: {
    message: "Your verification expired. Sign in again.",
    target: "form",
  },
  MISSING_RESPONSE: {
    message: "Complete the captcha check and try again.",
    target: "form",
  },
  OTP_EXPIRED: {
    message: "That code has expired. Request a new one.",
    target: "otp",
  },
  OTP_HAS_EXPIRED: {
    message: "That code has expired. Request a new one.",
    target: "otp",
  },
  OTP_NOT_FOUND: {
    message: "That code isn’t valid. Request a new one.",
    target: "otp",
  },
  PASSWORD_TOO_LONG: {
    message: "Use a password with no more than 128 characters.",
    target: "password",
  },
  PASSWORD_TOO_SHORT: {
    message: "Use a password with at least 8 characters.",
    target: "password",
  },
  TOO_MANY_ATTEMPTS: {
    message: "Too many attempts. Request a new code and try again.",
    target: "otp",
  },
  TWO_FACTOR_NOT_ENABLED: {
    message: "Two-factor authentication isn’t enabled on this account.",
    target: "form",
  },
  UNKNOWN_ERROR: {
    message: "Captcha verification failed. Try again.",
    target: "form",
  },
  USER_ALREADY_EXISTS: {
    message: "An account already exists for this email.",
    target: "email",
  },
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: {
    message: "An account already exists for this email.",
    target: "email",
  },
  VERIFICATION_FAILED: {
    message: "Captcha verification failed. Try again.",
    target: "form",
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
