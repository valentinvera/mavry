import { Button } from "@mavry/ui/components/button"
import { CheckIcon, QrCodeIcon, SmartphoneIcon } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { Frame } from "@/components/demo/frame"
import type { Content } from "@/components/demo/page-data"

const MOBILE_CAPTURE_HANDOFF = "mavry://capture?project=mavry-beta"

export const MobileCapture = ({ content }: { content: Content }) => (
  <Frame content={content}>
    <div className="grid min-h-[29rem] lg:grid-cols-[minmax(18rem,1fr)_minmax(15rem,0.72fr)]">
      <section className="mx-auto w-full max-w-[17rem] self-start justify-self-center rounded-[1.75rem] border border-border/70 bg-background p-2 lg:self-center">
        <div className="rounded-[1.35rem] border border-border/70 bg-card/70 p-3">
          <div className="flex items-center justify-between gap-3">
            <p className="font-semibold text-demo-control!">Quick capture</p>
            <SmartphoneIcon
              aria-hidden="true"
              className="size-4 text-muted-foreground"
            />
          </div>
          <button
            className="mt-4 min-h-28 w-full rounded-lg border border-border/70 bg-background/70 p-3 text-left transition-colors hover:bg-muted/35 active:translate-y-px"
            type="button"
          >
            <p className="text-demo-metadata! text-muted-foreground">
              Mobile idea
            </p>
            <p className="mt-2 font-medium text-demo-control!">
              Should mobile capture become a feature?
            </p>
          </button>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {["Clarify", "Save"].map((action) => (
              <Button
                className="rounded-md text-demo-control!"
                key={action}
                size="sm"
                type="button"
                variant="outline"
              >
                {action}
              </Button>
            ))}
          </div>
          <div className="mt-3 flex items-start gap-2 border-border/70 border-t pt-3">
            <CheckIcon
              aria-hidden="true"
              className="mt-0.5 size-4 text-success-foreground"
            />
            <div>
              <p className="font-medium text-demo-metadata!">
                Saved to Idea Inbox
              </p>
              <p className="mt-0.5 text-demo-metadata! text-muted-foreground">
                Needs clarity
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="flex items-center justify-center border-border/70 border-t p-5 lg:border-t-0 lg:border-l lg:p-6">
        <div className="w-full max-w-[17rem]">
          <div className="flex items-center gap-2">
            <QrCodeIcon
              aria-hidden="true"
              className="size-4 text-muted-foreground"
            />
            <p className="font-medium text-demo-metadata!">
              QR handoff preview
            </p>
          </div>
          <div
            className="mt-3 aspect-square overflow-hidden rounded-lg border border-border/70 p-2"
            data-qr-handoff=""
          >
            <QRCodeSVG
              bgColor="transparent"
              className="size-full dark:hidden"
              fgColor="var(--mavry-black)"
              imageSettings={{
                excavate: true,
                height: 40,
                src: "/brand/mavry-symbol-black.svg",
                width: 40,
              }}
              level="H"
              marginSize={4}
              minVersion={4}
              size={224}
              title="Scan to preview opening this project in Mavry mobile"
              value={MOBILE_CAPTURE_HANDOFF}
            />
            <QRCodeSVG
              bgColor="transparent"
              className="hidden size-full dark:block"
              fgColor="var(--mavry-white)"
              imageSettings={{
                excavate: true,
                height: 40,
                src: "/brand/mavry-symbol-white.svg",
                width: 40,
              }}
              level="H"
              marginSize={4}
              minVersion={4}
              size={224}
              title="Scan to preview opening this project in Mavry mobile"
              value={MOBILE_CAPTURE_HANDOFF}
            />
          </div>
          <p className="mt-3 text-demo-metadata! text-muted-foreground">
            Preview opening this project on mobile for quick capture.
          </p>
        </div>
      </section>
    </div>
  </Frame>
)
