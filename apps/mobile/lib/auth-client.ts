import { expoClient } from "@better-auth/expo/client"
import { env } from "@mavry/env/mobile"
import { polarClient } from "@polar-sh/better-auth/client"
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
  ],
})

export const polarMobileClient = authClient
