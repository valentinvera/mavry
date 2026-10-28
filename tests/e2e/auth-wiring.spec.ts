import { expect, type Page, test } from "@playwright/test"

const UNKNOWN_EMAIL = "nobody-auth-wiring@example.com"
const DEVTOOLS_BUTTON_NAME = /Open TanStack Router Devtools/
const RESET_PASSWORD_URL = /\/reset-password\?email=/

const waitForHydration = async (page: Page): Promise<void> => {
  await page
    .getByRole("button", { name: DEVTOOLS_BUTTON_NAME })
    .waitFor({ timeout: 15_000 })
}

const waitForCaptcha = async (page: Page): Promise<void> => {
  const captchaInput = page.locator('input[name="captchaToken"]')

  if ((await captchaInput.count()) === 0) {
    return
  }

  await page.waitForFunction(
    () => {
      const input = document.querySelector('input[name="captchaToken"]')
      return input instanceof HTMLInputElement && input.value.length > 0
    },
    undefined,
    { timeout: 15_000 }
  )
}

test("sign-in reaches the API and surfaces credential errors", async ({
  page,
}) => {
  await page.goto("/sign-in")
  await waitForHydration(page)

  await expect(
    page.getByRole("heading", { name: "Log in to Mavry" })
  ).toBeVisible()

  await page.getByRole("button", { name: "Continue with email" }).click()
  await expect(page.getByRole("form", { name: "Log in" })).toBeVisible()

  await page.locator("#email").fill(UNKNOWN_EMAIL)
  await page.locator("#password").fill("WrongPassword123!")
  await waitForCaptcha(page)
  await page.getByRole("button", { name: "Log in" }).click()

  await expect(page.getByText("Incorrect email or password.")).toBeVisible({
    timeout: 15_000,
  })
})

test("password recovery requests a code and navigates to reset", async ({
  page,
}) => {
  await page.goto("/forgot-password")
  await waitForHydration(page)

  await expect(
    page.getByRole("heading", { name: "Reset your password" })
  ).toBeVisible()

  await page.locator("#recovery-email").fill(UNKNOWN_EMAIL)
  await waitForCaptcha(page)
  await page.getByRole("button", { name: "Send code" }).click()

  await expect(page).toHaveURL(RESET_PASSWORD_URL, { timeout: 15_000 })
})
