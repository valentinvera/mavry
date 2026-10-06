import { createPolarCore, type PolarCore } from "@polar-sh/sdk/2026-10"

export const createPolarClient = (accessToken: string): PolarCore =>
  createPolarCore({
    accessToken,
    environment: "sandbox",
  })
