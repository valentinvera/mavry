import {
  Body,
  Button,
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

export type AuthLinkPurpose = "magic-link" | "password-reset"

interface AuthLinkEmailCopy {
  buttonLabel: string
  description: string
  heading: string
  preview: string
  subject: string
}

const AUTH_LINK_EMAIL_COPY: Record<AuthLinkPurpose, AuthLinkEmailCopy> = {
  "magic-link": {
    buttonLabel: "Sign in to Mavry",
    description:
      "Open the secure link below to sign in to Mavry. It works once and does not require a password.",
    heading: "Your magic link is ready.",
    preview: "Sign in to Mavry with your secure magic link.",
    subject: "Your Mavry magic link",
  },
  "password-reset": {
    buttonLabel: "Choose a new password",
    description:
      "Open the secure link below to choose a new password for your Mavry account. If you did not request a reset, ignore this email.",
    heading: "Reset your password.",
    preview: "Choose a new password for your Mavry account.",
    subject: "Reset your Mavry password",
  },
}

export const getAuthLinkEmailSubject = (purpose: AuthLinkPurpose): string =>
  AUTH_LINK_EMAIL_COPY[purpose].subject

export interface AuthLinkEmailProps {
  expiresInMinutes: number
  logoUrl?: string
  purpose: AuthLinkPurpose
  url: string
}

export const AuthLinkEmail = ({
  expiresInMinutes,
  logoUrl = `cid:${MAVRY_EMAIL_LOGO_CONTENT_ID}`,
  purpose,
  url,
}: AuthLinkEmailProps) => {
  const copy = AUTH_LINK_EMAIL_COPY[purpose]

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

                  <Button
                    className="box-border block bg-mavry-white px-5 py-3 text-center font-semibold text-mavry-black text-sm no-underline"
                    href={url}
                  >
                    {copy.buttonLabel}
                  </Button>

                  <Text className="mt-4 mb-0 text-mavry-muted text-xs leading-5">
                    This secure link expires in {expiresInMinutes} minutes and
                    can only be used once. If the button does not work,{" "}
                    <Link
                      className="font-medium text-mavry-white underline"
                      href={url}
                    >
                      open the link directly
                    </Link>
                    .
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

AuthLinkEmail.PreviewProps = {
  expiresInMinutes: 5,
  logoUrl: "http://localhost:8080/brand/mavry-logo-white.png",
  purpose: "magic-link",
  url: "https://api.mavry.app/api/auth/magic-link/verify?token=preview",
} satisfies AuthLinkEmailProps

const AuthLinkEmailPreview = () => (
  <AuthLinkEmail {...AuthLinkEmail.PreviewProps} />
)

AuthLinkEmailPreview.PreviewProps = AuthLinkEmail.PreviewProps

export default AuthLinkEmailPreview

export const renderAuthLinkEmail = (
  props: AuthLinkEmailProps
): Promise<RenderedEmail> =>
  renderEmail(
    <AuthLinkEmail {...props} />,
    AUTH_LINK_EMAIL_COPY[props.purpose].preview
  )
