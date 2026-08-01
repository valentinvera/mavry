import { expect, test } from "@playwright/test"

test("loads the app and checks the API", async ({
  page,
  request,
}, testInfo) => {
  const apiBaseUrl = testInfo.config.metadata.apiBaseUrl as string

  await page.goto("/")
  await expect(page.getByRole("heading", { name: "Hello World" })).toBeVisible()

  const response = await request.get(
    `${apiBaseUrl}/api/trpc/app.healthCheck?batch=1&input=%7B%7D`
  )

  await expect(response).toBeOK()
  await expect(response.json()).resolves.toEqual([
    {
      result: {
        data: "OK",
      },
    },
  ])
})
