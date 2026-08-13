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

test("reveals landing sections after React replaces their DOM nodes", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.setViewportSize({ height: 600, width: 1280 })
  await page.goto("/")
  await page.waitForLoadState("networkidle")

  const firstSection = page.locator("[data-section-reveal]").first()

  await expect(firstSection).not.toHaveAttribute("data-revealed", "true")
  await expect(firstSection).toHaveCSS("opacity", "0")

  await firstSection.evaluate((section) => {
    const replacement = section.cloneNode(true)

    if (replacement instanceof HTMLElement) {
      replacement.removeAttribute("data-revealed")
      section.replaceWith(replacement)
    }
  })

  const replacementSection = page.locator("[data-section-reveal]").first()

  await replacementSection.scrollIntoViewIfNeeded()
  await expect(replacementSection).toHaveAttribute("data-revealed", "true")
  await expect(replacementSection).toHaveCSS("opacity", "1")
})

test("submits the waitlist through tRPC and exposes submitting and success", async ({
  page,
}) => {
  let mutationInput: unknown

  await page.route("**/api/trpc/waitlist.join?**", async (route) => {
    mutationInput = route.request().postDataJSON()

    await new Promise((resolve) => {
      setTimeout(resolve, 250)
    })

    await route.fulfill({
      contentType: "application/json",
      json: [
        {
          result: {
            data: {
              status: "joined",
              success: true,
            },
          },
        },
      ],
      status: 200,
    })
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
  expect(mutationInput).toEqual({
    0: {
      email: "builder@mavry.test",
      source: "landing",
    },
  })
})

test("shows the duplicate response returned by the API", async ({ page }) => {
  await page.route("**/api/trpc/waitlist.join?**", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      json: [
        {
          result: {
            data: {
              status: "already_joined",
              success: true,
            },
          },
        },
      ],
      status: 200,
    })
  })

  await page.goto("/")
  await page.waitForLoadState("networkidle")

  const form = page.getByRole("form", { name: "Join the Mavry waitlist" })

  await form.getByRole("textbox", { name: "Email" }).fill("builder@mavry.test")
  await form.getByRole("button", { name: "Join waitlist" }).click()

  await expect(form.getByText("You’re already on the waitlist.")).toBeVisible()
  await expect(
    form.getByRole("button", { name: "Already joined" })
  ).toBeDisabled()
})

test("validates email locally without calling the API", async ({ page }) => {
  const mutationRequests: string[] = []

  page.on("request", (request) => {
    if (request.url().includes("/api/trpc/waitlist.join")) {
      mutationRequests.push(request.url())
    }
  })

  await page.goto("/")
  await page.waitForLoadState("networkidle")

  const form = page.getByRole("form", { name: "Join the Mavry waitlist" })
  const email = form.getByRole("textbox", { name: "Email" })
  const submit = form.getByRole("button", { name: "Join waitlist" })

  await email.fill("not-an-email")
  await submit.click()

  await expect(form.getByText("Enter a valid email address.")).toBeVisible()
  await expect(email).toHaveAttribute("aria-invalid", "true")
  expect(mutationRequests).toEqual([])

  await email.fill("builder@mavry.test")

  await expect(
    form.getByText("Early access for founders shaping a focused first release.")
  ).toBeVisible()
  await expect(email).not.toHaveAttribute("aria-invalid", "true")
})

test("shows an accessible network error and allows a retry", async ({
  page,
}) => {
  await page.route("**/api/trpc/waitlist.join?**", async (route) => {
    await route.abort("connectionfailed")
  })

  await page.goto("/")
  await page.waitForLoadState("networkidle")

  const form = page.getByRole("form", { name: "Join the Mavry waitlist" })
  const email = form.getByRole("textbox", { name: "Email" })
  const submit = form.getByRole("button", { name: "Join waitlist" })

  await email.fill("builder@mavry.test")
  await submit.click()

  await expect(
    form.getByText("Could not join the waitlist. Try again.")
  ).toBeVisible()
  await expect(email).not.toHaveAttribute("aria-invalid", "true")
  await expect(submit).toBeEnabled()

  await email.fill("another-builder@mavry.test")

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
