import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"
import { MAVRY_EMAIL_LOGO_CONTENT_ID } from "../assets/mavry-email-assets"
import { mavryEmailTheme } from "../theme/mavry-email-theme"
import { type RenderedEmail, renderEmail } from "./render-email"

export type AuthOtpPurpose =
  | "change-email"
  | "email-verification"
  | "forget-password"
  | "sign-in"

interface AuthOtpEmailCopy {
  description: string
  heading: string
  preview: string
  subject: string
}

const AUTH_OTP_EMAIL_COPY: Record<AuthOtpPurpose, AuthOtpEmailCopy> = {
  "change-email": {
    description:
      "Use this code to confirm your new email address for Mavry. If you did not request the change, ignore this email.",
    heading: "Confirm your new email.",
    preview: "Use your Mavry code to confirm your new email address.",
    subject: "Confirm your new Mavry email",
  },
  "email-verification": {
    description:
      "Use this code to verify your email and finish setting up your Mavry account.",
    heading: "Verify your email.",
    preview: "Use your Mavry code to verify your email address.",
    subject: "Verify your Mavry email",
  },
  "forget-password": {
    description:
      "Use this code to choose a new password for your Mavry account. If you did not request a reset, ignore this email.",
    heading: "Reset your password.",
    preview: "Use your Mavry code to reset your password.",
    subject: "Reset your Mavry password",
  },
  "sign-in": {
    description:
      "Use this single-use code to sign in to Mavry. If you did not request it, ignore this email.",
    heading: "Your sign-in code.",
    preview: "Use your Mavry sign-in code to continue.",
    subject: "Your Mavry sign-in code",
  },
}

export const getAuthOtpEmailSubject = (purpose: AuthOtpPurpose): string =>
  AUTH_OTP_EMAIL_COPY[purpose].subject

export interface AuthOtpEmailProps {
  code: string
  expiresInMinutes: number
  logoUrl?: string
  purpose: AuthOtpPurpose
}

export const AuthOtpEmail = ({
  code,
  expiresInMinutes,
  logoUrl = `cid:${MAVRY_EMAIL_LOGO_CONTENT_ID}`,
  purpose,
}: AuthOtpEmailProps) => {
  const copy = AUTH_OTP_EMAIL_COPY[purpose]

  return (
    <Html dir="ltr" lang="en">
      <Tailwind config={mavryEmailTheme}>
        <Head>
          <title>{copy.subject}</title>
        </Head>
        <Body className="m-0 bg-mavry-canvas font-sans">
          <Preview>{copy.preview}</Preview>
          <Section className="px-4 py-8" dir="ltr" lang="en">
            <Container className="mx-auto max-w-xl">
              <Section className="border border-mavry-border border-solid bg-mavry-black">
                <Section className="px-6 pt-6 pb-0">
                  <Link
                    className="inline-block no-underline"
                    href="https://mavry.app"
                  >
                    <Img
                      alt="Visit Mavry"
                      className="block"
                      height="32"
                      src={logoUrl}
                      width="98"
                    />
                  </Link>
                </Section>

                <Section className="px-6 pt-7 pb-7">
                  <Heading
                    as="h1"
                    className="mt-0 mb-3 font-semibold text-2xl text-mavry-white leading-8"
                  >
                    {copy.heading}
                  </Heading>

                  <Text className="mt-0 mb-6 text-mavry-muted text-sm leading-5">
                    {copy.description}
                  </Text>

                  <Section className="border border-mavry-border border-solid bg-mavry-canvas px-5 py-5 text-center">
                    <Text className="m-0 font-semibold text-3xl text-mavry-white tracking-[0.35em]">
                      {code}
                    </Text>
                  </Section>

                  <Text className="mt-4 mb-0 text-mavry-muted text-xs leading-5">
                    This code expires in {expiresInMinutes} minutes and can only
                    be used once. If you did not request it, you can safely
                    ignore this email.
                  </Text>
                </Section>
              </Section>

              <Text className="mt-5 mb-0 text-center text-mavry-muted text-xs leading-5">
                Mavry — Product clarity for focused builders.
              </Text>
              <Text className="mt-1 mb-0 text-center text-xs leading-5">
                <Link
                  className="text-mavry-white underline"
                  href="https://mavry.app"
                >
                  mavry.app
                </Link>
              </Text>
            </Container>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  )
}

AuthOtpEmail.PreviewProps = {
  code: "482913",
  expiresInMinutes: 5,
  logoUrl: "http://localhost:8080/brand/mavry-logo-white.png",
  purpose: "sign-in",
} satisfies AuthOtpEmailProps

const AuthOtpEmailPreview = () => (
  <AuthOtpEmail {...AuthOtpEmail.PreviewProps} />
)

AuthOtpEmailPreview.PreviewProps = AuthOtpEmail.PreviewProps

export default AuthOtpEmailPreview

export const renderAuthOtpEmail = (
  props: AuthOtpEmailProps
): Promise<RenderedEmail> =>
  renderEmail(
    <AuthOtpEmail {...props} />,
    AUTH_OTP_EMAIL_COPY[props.purpose].preview
  )
