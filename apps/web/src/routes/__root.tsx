import type { AppRouter } from "@mavry/trpc/generated/server"
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
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Mavry",
      },
      {
        name: "description",
        content: "Product clarity for focused builders.",
      },
      {
        name: "theme-color",
        content: "#000000",
      },
      {
        name: "application-name",
        content: "Mavry",
      },
      {
        name: "apple-mobile-web-app-title",
        content: "Mavry",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        href: "/brand/mavry-favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        rel: "icon",
        href: "/brand/mavry-favicon-32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        rel: "icon",
        href: "/brand/mavry-favicon-16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        rel: "apple-touch-icon",
        href: "/brand/mavry-touch-icon-180.png",
        sizes: "180x180",
      },
      {
        rel: "manifest",
        href: "/manifest.webmanifest",
      },
    ],
  }),

  component: RootDocument,
})

function RootDocument() {
  return (
    <html className="dark" lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>
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
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
