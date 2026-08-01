import { Polar } from "@polar-sh/sdk"

export const createPolarClient = (accessToken: string) =>
  new Polar({
    accessToken,
    server: "sandbox",
  })
