import { expoClient } from "@better-auth/expo/client"
import { env } from "@mavry/env/mobile"
import { polarClient } from "@polar-sh/better-auth/client"
import { createAuthClient } from "better-auth/react"
import { getItem, setItem } from "expo-secure-store"

export const authClient = createAuthClient({
  baseURL: env.EXPO_PUBLIC_API_URL,
  plugins: [
    expoClient({
      scheme: "mavry",
      storage: {
        getItem,
        setItem,
      },
      storagePrefix: "mavry",
    }),
    polarClient(),
  ],
})

export const polarMobileClient = authClient
