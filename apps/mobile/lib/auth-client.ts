import { expoClient } from "@better-auth/expo/client"
import { passkeyClient } from "@better-auth/passkey/client"
import { env } from "@mavry/env/mobile"
import { polarClient } from "@polar-sh/better-auth/client"
import {
  emailOTPClient,
  magicLinkClient,
  twoFactorClient,
} from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import { getItem, getItemAsync, setItem, setItemAsync } from "expo-secure-store"

export const authClient = createAuthClient({
  baseURL: env.EXPO_PUBLIC_API_URL,
  plugins: [
    expoClient({
      scheme: "mavry",
      storage: { getItem, getItemAsync, setItem, setItemAsync },
      storagePrefix: "mavry",
    }),
    polarClient(),
    emailOTPClient(),
    magicLinkClient(),
    twoFactorClient(),
    passkeyClient(),
  ],
})

export const polarMobileClient = authClient
