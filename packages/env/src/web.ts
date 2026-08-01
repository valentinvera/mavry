import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

type ViteRuntimeEnv = Record<string, string | boolean | undefined>

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_API_URL: z.url(),
    VITE_HOST: z.string().min(1),
    VITE_PORT: z.coerce.number().int().positive(),
  },
  runtimeEnv: (import.meta as ImportMeta & { env: ViteRuntimeEnv }).env,
  emptyStringAsUndefined: true,
})
