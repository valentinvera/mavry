import { expect, test } from "@playwright/test"

test("loads the app and checks the API", async ({
  page,
  request,
}, testInfo) => {
  const apiBaseUrl = testInfo.config.metadata.apiBaseUrl as string
  const browserErrors: string[] = []
  const failedRequests: string[] = []

  page.on("console", (message) => {
    if (message.type() === "error") {
      browserErrors.push(message.text())
    }
  })
  page.on("pageerror", (error) => {
    browserErrors.push(error.message)
  })
  page.on("requestfailed", (request) => {
    failedRequests.push(request.url())
  })

  await page.goto("/")
  await page.waitForLoadState("networkidle")
  await expect(
    page.getByRole("heading", {
      name: "Know what belongs in your first release.",
    })
  ).toBeVisible()
  await expect(
    page.getByRole("form", { name: "Join the Mavry waitlist" })
  ).toBeVisible()

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
  expect(browserErrors).toEqual([])
  expect(failedRequests).toEqual([])
})

test("submits the waitlist locally and exposes loading and success", async ({
  page,
}) => {
  const mutationRequests: string[] = []

  page.on("request", (request) => {
    if (["DELETE", "PATCH", "POST", "PUT"].includes(request.method())) {
      mutationRequests.push(request.url())
    }
  })

  await page.goto("/")
  await page.waitForLoadState("networkidle")

  const form = page.getByRole("form", { name: "Join the Mavry waitlist" })
  const email = form.getByRole("textbox", { name: "Email" })

  await email.fill("builder@mavry.test")
  await email.press("Enter")

  await expect(form).toHaveAttribute("aria-busy", "true")
  await expect(email).toBeDisabled()
  await expect(form.getByRole("button", { name: "Joining..." })).toBeDisabled()
  await expect(form.getByText("You’re on the waitlist.")).toBeVisible()
  await expect(form.getByRole("button", { name: "Joined" })).toBeDisabled()
  expect(mutationRequests).toEqual([])
})

test("shows an accessible waitlist error and allows a retry", async ({
  page,
}) => {
  await page.goto("/")
  await page.waitForLoadState("networkidle")

  const form = page.getByRole("form", { name: "Join the Mavry waitlist" })
  const email = form.getByRole("textbox", { name: "Email" })
  const submit = form.getByRole("button", { name: "Join waitlist" })

  await email.fill("builder@mavry.invalid")
  await submit.click()

  await expect(
    form.getByText("Could not join the waitlist. Try again.")
  ).toBeVisible()
  await expect(email).toHaveAttribute("aria-invalid", "true")
  await expect(submit).toBeEnabled()

  await email.fill("builder@mavry.test")

  await expect(
    form.getByText("Early access for founders shaping a focused first release.")
  ).toBeVisible()
  await expect(email).not.toHaveAttribute("aria-invalid", "true")
})

test("keeps the waitlist controls inside a narrow mobile viewport", async ({
  page,
}) => {
  await page.setViewportSize({ height: 720, width: 320 })
  await page.goto("/")
  await page.waitForLoadState("networkidle")

  const form = page.getByRole("form", { name: "Join the Mavry waitlist" })
  const email = form.getByRole("textbox", { name: "Email" })
  const submit = form.getByRole("button", { name: "Join waitlist" })

  await expect(email).toBeVisible()
  await expect(submit).toBeVisible()

  const emailBox = await email.boundingBox()
  const submitBox = await submit.boundingBox()

  expect(emailBox).not.toBeNull()
  expect(submitBox).not.toBeNull()

  if (!(emailBox && submitBox)) {
    return
  }

  expect(emailBox.x).toBeGreaterThanOrEqual(0)
  expect(submitBox.x + submitBox.width).toBeLessThanOrEqual(320)
})
