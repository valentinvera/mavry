import type { AppRouter } from "@mavry/trpc/generated/server"
import { TooltipProvider } from "@mavry/ui/components/tooltip"
import type { QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  ScriptOnce,
  Scripts,
} from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query"
import { ThemeProvider } from "@/components/theme-provider"
import { LANDING_HASH_RESTORATION_SCRIPT } from "@/lib/landing-navigation"
import appCss from "../styles/globals.css?url"

export interface RouterAppContext {
  queryClient: QueryClient
  trpc: TRPCOptionsProxy<AppRouter>
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootDocument,
  head: () => ({
    links: [
      {
        href: appCss,
        rel: "stylesheet",
      },
      {
        href: "/brand/mavry-favicon.svg",
        rel: "icon",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        href: "/brand/mavry-favicon-32.png",
        rel: "icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        href: "/brand/mavry-favicon-16.png",
        rel: "icon",
        sizes: "16x16",
        type: "image/png",
      },
      {
        href: "/brand/mavry-touch-icon-180.png",
        rel: "apple-touch-icon",
        sizes: "180x180",
      },
      {
        href: "/manifest.webmanifest",
        rel: "manifest",
      },
      {
        href: "https://mavry.app",
        rel: "canonical",
      },
    ],
    meta: [
      {
        charSet: "utf-8",
      },
      {
        content: "width=device-width, initial-scale=1",
        name: "viewport",
      },
      {
        title: "Mavry",
      },
      {
        content: "Product clarity for focused builders.",
        name: "description",
      },
      {
        content: "#000000",
        name: "theme-color",
      },
      {
        content: "Mavry",
        name: "application-name",
      },
      {
        content: "Mavry",
        name: "apple-mobile-web-app-title",
      },
      {
        content: "website",
        property: "og:type",
      },
      {
        content: "https://mavry.app",
        property: "og:url",
      },
      {
        content: "Mavry",
        property: "og:site_name",
      },
      {
        content: "Mavry — Product clarity for focused builders",
        property: "og:title",
      },
      {
        content: "Know what to build next, what to cut, and when to ship.",
        property: "og:description",
      },
      {
        content: "https://mavry.app/opengraph-image.png",
        property: "og:image",
      },
      {
        content: "1200",
        property: "og:image:width",
      },
      {
        content: "630",
        property: "og:image:height",
      },
      {
        content: "Mavry product decision workspace on the Madeira coast.",
        property: "og:image:alt",
      },
      {
        content: "summary_large_image",
        name: "twitter:card",
      },
      {
        content: "Mavry — Product clarity for focused builders",
        name: "twitter:title",
      },
      {
        content: "Know what to build next, what to cut, and when to ship.",
        name: "twitter:description",
      },
      {
        content: "https://mavry.app/opengraph-image.png",
        name: "twitter:image",
      },
      {
        content: "Mavry product decision workspace on the Madeira coast.",
        name: "twitter:image:alt",
      },
    ],
  }),
})

function RootDocument() {
  return (
    <html className="dark" lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>
          <TooltipProvider>
            <div className="min-h-svh">
              <Outlet />
              <ScriptOnce>{LANDING_HASH_RESTORATION_SCRIPT}</ScriptOnce>
            </div>
            {process.env.NODE_ENV === "development" ? (
              <>
                <TanStackRouterDevtools position="bottom-left" />
                <ReactQueryDevtools
                  buttonPosition="bottom-right"
                  position="bottom"
                />
              </>
            ) : null}
          </TooltipProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
