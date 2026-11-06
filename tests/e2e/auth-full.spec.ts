import { execFileSync } from "node:child_process"
import { createHmac } from "node:crypto"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { expect, type Page, test } from "@playwright/test"
import { parse } from "dotenv"

const API_BASE_URL = process.env.PLAYWRIGHT_API_URL ?? "http://localhost:4040"
const WEB_BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:8080"
const CAPTCHA_TOKEN = "XXXX.DUMMY.TOKEN.XXXX"
const DEVTOOLS_BUTTON_NAME = /Open TanStack Router Devtools/
const PROJECTS_URL = /\/projects$/u
const NEW_PROJECT_URL = /\/projects\/new$/u
const SIGN_IN_URL = /\/sign-in/u
const TWO_FACTOR_URL = /\/two-factor/u
const VERIFY_EMAIL_URL = /\/verify-email/u
const RESET_PASSWORD_URL = /\/reset-password\?email=/u
const PASSWORD = "MavryE2e123!"
const RESET_PASSWORD = "MavryE2e456!"

const apiDotEnv = parse(readFileSync(resolve("apps/api/.env")))
const DATABASE_URL = process.env.DATABASE_URL ?? apiDotEnv.DATABASE_URL ?? ""
const trackedEmails: string[] = []

interface LatestOtp {
  value: string
}

const runDb = (command: string, arg?: string): string =>
  execFileSync(
    "bun",
    [".auth-test-db.ts", command, ...(arg === undefined ? [] : [arg])],
    {
      cwd: resolve("packages/db"),
      encoding: "utf8",
      env: { ...process.env, DATABASE_URL },
      stdio: ["ignore", "pipe", "ignore"],
    }
  ).trim()

const sleep = (ms: number): Promise<void> =>
  new Promise((resolveSleep) => {
    setTimeout(resolveSleep, ms)
  })

const waitForHydration = async (page: Page): Promise<void> => {
  await page
    .getByRole("button", { name: DEVTOOLS_BUTTON_NAME })
    .waitFor({ timeout: 20_000 })
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
    { timeout: 20_000 }
  )
}

const waitForOtp = async (
  cutoff: Date,
  deadline = Date.now() + 25_000
): Promise<string> => {
  const raw = runDb("latest-otp", cutoff.toISOString())

  if (raw && raw !== "null") {
    const row = JSON.parse(raw) as LatestOtp
    return row.value.split(":")[0] ?? ""
  }

  if (Date.now() > deadline) {
    throw new Error("No OTP row appeared in the verification table")
  }

  await sleep(500)

  return waitForOtp(cutoff, deadline)
}

const BASE32_PADDING = /[=]+$/u

const base32Decode = (input: string): Buffer => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
  let bits = ""

  for (const char of input.replace(BASE32_PADDING, "").toUpperCase()) {
    const value = alphabet.indexOf(char)

    if (value === -1) {
      throw new Error(`Invalid base32 character: ${char}`)
    }

    bits += value.toString(2).padStart(5, "0")
  }

  const bytes: number[] = []

  for (let index = 0; index + 8 <= bits.length; index += 8) {
    bytes.push(Number.parseInt(bits.slice(index, index + 8), 2))
  }

  return Buffer.from(bytes)
}

const totpCode = (secret: string): string => {
  const counter = Buffer.alloc(8)
  counter.writeBigUInt64BE(BigInt(Math.floor(Date.now() / 1000 / 30)))
  const digest = createHmac("sha1", base32Decode(secret))
    .update(counter)
    .digest()
  // RFC 4226 dynamic truncation: the low nibble of the last byte is the
  // offset, then the 31-bit slice becomes the one-time code.
  const offset = (digest.at(-1) ?? 0) % 16
  const binary = digest.readUInt32BE(offset) % 2 ** 31

  return (binary % 1_000_000).toString().padStart(6, "0")
}

const signInWithPassword = async (
  page: Page,
  email: string,
  password: string,
  expectedUrl: RegExp = PROJECTS_URL
): Promise<void> => {
  await page.goto("/sign-in")
  await waitForHydration(page)
  await page.getByRole("button", { name: "Continue with email" }).click()
  await page.locator("#email").fill(email)
  await page.locator("#password").fill(password)
  await waitForCaptcha(page)
  await page.getByRole("button", { exact: true, name: "Log in" }).click()
  await expect(page).toHaveURL(expectedUrl, { timeout: 20_000 })
}

const createUserThroughApi = async (
  email: string,
  name: string
): Promise<Date> => {
  const cutoff = new Date()
  const response = await fetch(`${API_BASE_URL}/api/auth/sign-up/email`, {
    body: JSON.stringify({ email, name, password: PASSWORD }),
    headers: {
      "content-type": "application/json",
      origin: WEB_BASE_URL,
      "x-captcha-response": CAPTCHA_TOKEN,
    },
    method: "POST",
  })

  expect(response.ok, `sign-up API failed with ${response.status}`).toBe(true)
  runDb("verify", email)

  return cutoff
}

const SOCIAL_PROVIDERS = [
  ["google", "accounts.google.com"],
  ["github", "github.com/login/oauth/authorize"],
] as const

const getSocialAuthorizeUrl = async (provider: string): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/sign-in/social`, {
    body: JSON.stringify({
      callbackURL: `${WEB_BASE_URL}/account`,
      provider,
    }),
    headers: {
      "content-type": "application/json",
      origin: WEB_BASE_URL,
    },
    method: "POST",
  })

  expect(response.ok, `${provider} sign-in failed`).toBe(true)
  const body = (await response.json()) as { url?: string }

  return body.url ?? ""
}

const signOut = async (page: Page): Promise<void> => {
  await page.goto("/account")
  await waitForHydration(page)
  await page.locator("main > button").filter({ hasText: "Sign out" }).click()
  await expect(page).toHaveURL(SIGN_IN_URL, { timeout: 15_000 })
}

test.afterAll(() => {
  for (const email of trackedEmails) {
    runDb("cleanup", email)
  }
})

test("sign-up, email verification, session persistence and guard", async ({
  page,
}) => {
  const email = `e2e-auth-${Date.now()}@example.com`
  trackedEmails.push(email)

  await page.goto("/sign-up")
  await waitForHydration(page)
  await expect(
    page.getByRole("heading", { name: "Create your account" })
  ).toBeVisible()
  await page.getByRole("button", { name: "Continue with email" }).click()
  await page.locator("#name").fill("E2E Tester")
  await page.locator("#email").fill(email)
  await page.locator("#password").fill(PASSWORD)
  await waitForCaptcha(page)

  const signUpCutoff = new Date()
  await page.getByRole("button", { name: "Create account" }).click()
  await expect(page).toHaveURL(PROJECTS_URL, { timeout: 20_000 })
  await expect(page.getByText("Create your first project.")).toBeVisible({
    timeout: 15_000,
  })

  const otp = await waitForOtp(signUpCutoff)
  await page.getByRole("link", { name: "Verify email" }).click()
  await expect(page).toHaveURL(VERIFY_EMAIL_URL)
  await page.locator("#verify-email-code").fill(otp)
  await page.getByRole("button", { exact: true, name: "Verify email" }).click()
  await expect(page.getByText("Your email is verified.")).toBeVisible({
    timeout: 20_000,
  })

  await page.goto("/account")
  await expect(page.getByText(`Signed in as ${email}`)).toBeVisible({
    timeout: 15_000,
  })
  await expect(page.getByText("· Verified")).toBeVisible({ timeout: 15_000 })

  const session = (await page.evaluate(async (apiBaseUrl) => {
    const response = await fetch(`${apiBaseUrl}/api/auth/get-session`, {
      credentials: "include",
    })
    return { body: await response.json(), status: response.status }
  }, API_BASE_URL)) as {
    body: { user?: { email?: string } } | null
    status: number
  }

  expect(session.status).toBe(200)
  expect(session.body?.user?.email).toBe(email)

  await page.reload()
  await expect(page.getByText(`Signed in as ${email}`)).toBeVisible({
    timeout: 15_000,
  })

  await signOut(page)
  await page.goto("/account")
  await expect(page).toHaveURL(SIGN_IN_URL, { timeout: 15_000 })

  await signInWithPassword(page, email, PASSWORD)
  await page.goto("/account")
  await expect(page.getByText("· Verified")).toBeVisible({ timeout: 15_000 })
})

test("password reset with emailed code", async ({ page }) => {
  const email = `e2e-reset-${Date.now()}@example.com`
  trackedEmails.push(email)
  await createUserThroughApi(email, "Reset Tester")
  await sleep(1000)

  await page.goto("/forgot-password")
  await waitForHydration(page)
  await page.locator("#recovery-email").fill(email)
  await waitForCaptcha(page)

  const cutoff = new Date()
  await page.getByRole("button", { name: "Send code" }).click()
  await expect(page).toHaveURL(RESET_PASSWORD_URL, {
    timeout: 20_000,
  })

  const otp = await waitForOtp(cutoff)
  await page.locator("#reset-code").fill(otp)
  await page.locator("#new-password").fill(RESET_PASSWORD)
  await page.locator("#confirm-password").fill(RESET_PASSWORD)
  await waitForCaptcha(page)
  await page.getByRole("button", { name: "Reset password" }).click()
  await expect(page.getByText("Your password has been updated.")).toBeVisible({
    timeout: 20_000,
  })

  await signInWithPassword(page, email, RESET_PASSWORD)
  await page.goto("/account")
  await expect(page.getByText(`Signed in as ${email}`)).toBeVisible({
    timeout: 15_000,
  })
  await signOut(page)
})

test("two-factor enable, challenge on sign-in and disable", async ({
  page,
}) => {
  const email = `e2e-2fa-${Date.now()}@example.com`
  trackedEmails.push(email)
  await createUserThroughApi(email, "Two Factor Tester")
  await sleep(1000)

  await signInWithPassword(page, email, PASSWORD)
  await page.goto("/account")
  await waitForHydration(page)

  await page.locator("#enable-2fa-password").fill(PASSWORD)
  const enableResponse = page.waitForResponse(
    (response) =>
      response.url().includes("/two-factor/enable") &&
      response.request().method() === "POST"
  )
  await page.getByRole("button", { name: "Enable two-factor" }).click()
  await expect(page.getByText("Backup codes")).toBeVisible({
    timeout: 20_000,
  })

  const enableBody = (await (await enableResponse).json()) as {
    totpURI?: string
  }
  const totpUri = enableBody.totpURI ?? ""
  const secret = new URL(totpUri).searchParams.get("secret") ?? ""
  expect(secret.length).toBeGreaterThan(0)
  await page.locator("#enable-2fa-code").fill(totpCode(secret))
  await page.getByRole("button", { name: "Verify and enable" }).click()
  await expect(
    page.getByText("Two-factor authentication is now enabled.")
  ).toBeVisible({ timeout: 20_000 })

  await signOut(page)
  await signInWithPassword(page, email, PASSWORD, TWO_FACTOR_URL)
  await expect(page).toHaveURL(TWO_FACTOR_URL, { timeout: 20_000 })
  await waitForHydration(page)

  await page.locator("#two-factor-code").fill(totpCode(secret))
  await page.getByRole("button", { exact: true, name: "Verify" }).click()
  await expect(page).toHaveURL(PROJECTS_URL, { timeout: 20_000 })

  await page.goto("/account")
  await expect(
    page.getByText("Two-factor authentication is enabled on this account.")
  ).toBeVisible({ timeout: 15_000 })

  await page.locator("#disable-2fa-password").fill(PASSWORD)
  await page.getByRole("button", { name: "Disable two-factor" }).click()
  await expect(
    page.getByRole("button", { name: "Enable two-factor" })
  ).toBeVisible({ timeout: 20_000 })

  await signOut(page)
})

test("sign-in with an emailed one-time code", async ({ page }) => {
  const email = `e2e-otp-${Date.now()}@example.com`
  trackedEmails.push(email)
  await createUserThroughApi(email, "Otp Tester")
  await sleep(1000)

  await page.goto("/sign-in")
  await waitForHydration(page)
  await page.getByRole("button", { name: "Email me a sign-in code" }).click()
  await page.locator("#signin-code-email").fill(email)
  await waitForCaptcha(page)

  const cutoff = new Date()
  await page.getByRole("button", { name: "Send code" }).click()
  await expect(page.getByText("We sent a 6-digit code to")).toBeVisible({
    timeout: 20_000,
  })

  const otp = await waitForOtp(cutoff)
  await page.locator("#signin-code").fill(otp)
  await page.getByRole("button", { name: "Verify code" }).click()
  await expect(page).toHaveURL(PROJECTS_URL, { timeout: 20_000 })
  await expect(page.getByText("Create your first project.")).toBeVisible({
    timeout: 15_000,
  })

  await signOut(page)
})

test("passkey sign-up and passkey sign-in with a virtual authenticator", async ({
  context,
  page,
}) => {
  const email = `e2e-passkey-${Date.now()}@example.com`
  trackedEmails.push(email)

  const client = await context.newCDPSession(page)
  await client.send("WebAuthn.enable")
  await client.send("WebAuthn.addVirtualAuthenticator", {
    options: {
      automaticPresenceSimulation: true,
      hasResidentKey: true,
      hasUserVerification: true,
      isUserVerified: true,
      protocol: "ctap2",
      transport: "internal",
    },
  })

  await page.goto("/sign-up")
  await waitForHydration(page)
  await page.getByRole("button", { name: "Sign up with passkey" }).click()
  await page.locator("#passkey-signup-name").fill("Passkey Tester")
  await page.locator("#passkey-signup-email").fill(email)
  await page
    .getByRole("button", { name: "Create account with passkey" })
    .click()
  await expect(page).toHaveURL(PROJECTS_URL, { timeout: 25_000 })
  await expect(page.getByText("Create your first project.")).toBeVisible({
    timeout: 15_000,
  })

  await signOut(page)
  await waitForHydration(page)

  const passkeyResponse = page.waitForResponse(
    (response) =>
      response.url().includes("/passkey/") &&
      response.request().method() === "POST"
  )
  await page.getByRole("button", { name: "Continue with passkey" }).click()
  const passkeyResult = await passkeyResponse
  expect(passkeyResult.ok()).toBe(true)
  await expect(page).toHaveURL(PROJECTS_URL, { timeout: 20_000 })
  await expect(page.getByText("Create your first project.")).toBeVisible({
    timeout: 15_000,
  })
})

test("projects entry shows the first-project empty state", async ({ page }) => {
  const email = `e2e-projects-${Date.now()}@example.com`
  trackedEmails.push(email)
  await createUserThroughApi(email, "Projects Tester")
  await sleep(1000)

  await signInWithPassword(page, email, PASSWORD)
  await expect(page).toHaveURL(PROJECTS_URL, { timeout: 20_000 })
  await expect(page.getByRole("heading", { name: "Projects" })).toBeVisible()
  await expect(page.getByText("Create your first project.")).toBeVisible()
  await expect(
    page.getByRole("link", { name: "Create project" })
  ).toHaveAttribute("href", "/projects/new")

  await page.screenshot({
    fullPage: true,
    path: ".playwright-output/projects-empty.png",
  })

  await signOut(page)
  await page.goto("/projects")
  await expect(page).toHaveURL(SIGN_IN_URL, { timeout: 15_000 })
})

test("creates a project from the intake form", async ({ page }) => {
  const email = `e2e-intake-${Date.now()}@example.com`
  trackedEmails.push(email)
  await createUserThroughApi(email, "Intake Tester")
  await sleep(1000)

  await signInWithPassword(page, email, PASSWORD)
  await page.getByRole("link", { name: "Create project" }).click()
  await expect(page).toHaveURL(NEW_PROJECT_URL)
  await waitForHydration(page)

  await page.locator("#project-name").fill("Mavry")
  await page
    .locator("#project-description")
    .fill("Decision layer for early-stage products.")
  await page.locator("#project-stage").click()
  await page.getByRole("option", { name: "MVP scope" }).click()
  await page.locator("#project-target-user").fill("Solo technical founders")
  await page
    .locator("#project-main-problem")
    .fill("Too many ideas and no clear next step.")
  await page
    .locator("#project-hypothesis")
    .fill("Scope, cuts, and readiness in one place help builders ship sooner.")
  await page.locator("#project-goal").fill("Ship onboarding to 20 builders.")

  await page.getByRole("button", { name: "Already started" }).click()
  await expect(page.locator("#project-already-built")).toBeVisible()
  await page.locator("#project-already-built").fill("Auth and account pages.")
  await page
    .locator("#project-launch-blocker")
    .fill("Feedback ownership before opening beta.")
  await page
    .locator("#project-scope-creep")
    .fill("A public roadmap and GitHub sync.")

  await page.screenshot({
    fullPage: true,
    path: ".playwright-output/project-intake.png",
  })

  await page.getByRole("button", { name: "Create project" }).click()
  await expect(page).toHaveURL(PROJECTS_URL, { timeout: 20_000 })
  await expect(page.getByRole("heading", { name: "Mavry" })).toBeVisible({
    timeout: 15_000,
  })
  await expect(page.getByText("MVP scope", { exact: true })).toBeVisible()

  await signOut(page)
})

test("social providers return an authorize url", async () => {
  const results = await Promise.all(
    SOCIAL_PROVIDERS.map(async ([provider, expectedHost]) => ({
      expectedHost,
      url: await getSocialAuthorizeUrl(provider),
    }))
  )

  for (const { expectedHost, url } of results) {
    expect(url).toContain(expectedHost)
  }
})
