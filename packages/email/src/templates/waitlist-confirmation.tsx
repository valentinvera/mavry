import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"
import { render } from "@react-email/render"
import { MAVRY_EMAIL_LOGO_CONTENT_ID } from "../assets/mavry-email-assets"
import { mavryEmailTheme } from "../theme/mavry-email-theme"

export const WAITLIST_CONFIRMATION_EMAIL_SUBJECT =
  "Confirm your Mavry waitlist spot"

export const WAITLIST_CONFIRMATION_EMAIL_PREVIEW =
  "Confirm your email to finish joining the Mavry waitlist."

const EMAIL_PREVIEW_MAX_LENGTH = 200
const EMAIL_PREVIEW_WHITESPACE = "\u00a0\u200c\u200b\u200d\u200e\u200f\ufeff"

const createPlainTextPreview = (): string => {
  const remainingPreviewLength = Math.max(
    0,
    EMAIL_PREVIEW_MAX_LENGTH - WAITLIST_CONFIRMATION_EMAIL_PREVIEW.length
  )

  return `${WAITLIST_CONFIRMATION_EMAIL_PREVIEW}${EMAIL_PREVIEW_WHITESPACE.repeat(remainingPreviewLength)}`
}

export interface WaitlistConfirmationEmailProps {
  confirmationUrl: string
  expirationHours: number
  logoUrl?: string
}

export const WaitlistConfirmationEmail = ({
  confirmationUrl,
  expirationHours,
  logoUrl = `cid:${MAVRY_EMAIL_LOGO_CONTENT_ID}`,
}: WaitlistConfirmationEmailProps) => (
  <Html dir="ltr" lang="en">
    <Tailwind config={mavryEmailTheme}>
      <Head>
        <title>{WAITLIST_CONFIRMATION_EMAIL_SUBJECT}</title>
      </Head>
      <Body className="m-0 bg-mavry-canvas font-sans">
        <Preview>{WAITLIST_CONFIRMATION_EMAIL_PREVIEW}</Preview>
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
                  Confirm your place on the Mavry waitlist.
                </Heading>

                <Text className="mt-0 mb-6 text-mavry-muted text-sm leading-5">
                  You’re one step away from early access. Confirm your email so
                  we know this address belongs to you.
                </Text>

                <Button
                  className="box-border block bg-mavry-white px-5 py-3 text-center font-semibold text-mavry-black text-sm no-underline"
                  href={confirmationUrl}
                >
                  Confirm my email
                </Button>

                <Text className="mt-4 mb-0 text-mavry-muted text-xs leading-5">
                  This secure link expires in {expirationHours} hours. If the
                  button does not work,{" "}
                  <Link
                    className="font-medium text-mavry-white underline"
                    href={confirmationUrl}
                  >
                    open the confirmation link
                  </Link>
                  .
                </Text>

                <Text className="mt-4 mb-0 text-mavry-muted text-xs leading-5">
                  Didn’t request this? Ignore this email. Nothing will be added
                  to the waitlist unless you confirm.
                </Text>

                <Hr className="my-7 border-mavry-border border-solid" />

                <Heading
                  as="h2"
                  className="mt-0 mb-2 font-semibold text-base text-mavry-white leading-6"
                >
                  Clarity before more code.
                </Heading>

                <Text className="mt-0 mb-5 text-mavry-muted text-xs leading-5">
                  Mavry helps focused builders turn early product ambiguity into
                  a clear, defensible plan. Inside Mavry, you’ll decide:
                </Text>

                <Section className="border-mavry-border border-t border-solid">
                  <Row className="border-mavry-border border-b border-solid">
                    <Column className="w-10 py-3 align-top">
                      <Text className="m-0 font-medium text-mavry-muted text-xs leading-5">
                        01
                      </Text>
                    </Column>
                    <Column className="py-3 align-top">
                      <Text className="m-0 font-medium text-mavry-white text-xs leading-5">
                        What belongs in the MVP.
                      </Text>
                    </Column>
                  </Row>
                  <Row className="border-mavry-border border-b border-solid">
                    <Column className="w-10 py-3 align-top">
                      <Text className="m-0 font-medium text-mavry-muted text-xs leading-5">
                        02
                      </Text>
                    </Column>
                    <Column className="py-3 align-top">
                      <Text className="m-0 font-medium text-mavry-white text-xs leading-5">
                        What gets cut for now.
                      </Text>
                    </Column>
                  </Row>
                  <Row className="border-mavry-border border-b border-solid">
                    <Column className="w-10 py-3 align-top">
                      <Text className="m-0 font-medium text-mavry-muted text-xs leading-5">
                        03
                      </Text>
                    </Column>
                    <Column className="py-3 align-top">
                      <Text className="m-0 font-medium text-mavry-white text-xs leading-5">
                        What should happen next.
                      </Text>
                    </Column>
                  </Row>
                </Section>

                <Text className="mt-7 mb-0 text-center text-mavry-muted text-xs leading-5">
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
              </Section>
            </Section>
          </Container>
        </Section>
      </Body>
    </Tailwind>
  </Html>
)

WaitlistConfirmationEmail.PreviewProps = {
  confirmationUrl: "https://api.mavry.app/api/waitlist/confirm?token=preview",
  expirationHours: 48,
  logoUrl: "http://localhost:8080/brand/mavry-logo-white.png",
} satisfies WaitlistConfirmationEmailProps

export default WaitlistConfirmationEmail

export interface RenderedWaitlistConfirmationEmail {
  html: string
  text: string
}

export const renderWaitlistConfirmationEmail = async (
  props: WaitlistConfirmationEmailProps
): Promise<RenderedWaitlistConfirmationEmail> => {
  const email = <WaitlistConfirmationEmail {...props} />
  const [html, renderedText] = await Promise.all([
    render(email),
    render(email, { plainText: true }),
  ])
  const text = `${createPlainTextPreview()}\n\n${renderedText}`

  return { html, text }
}
