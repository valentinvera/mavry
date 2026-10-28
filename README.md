# mavry

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines React, TanStack Start, NestJS, TRPC, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **TanStack Start** - SSR framework with TanStack Router
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **Shared UI package** - shadcn/ui primitives live in `packages/ui`
- **NestJS** - Structured backend API framework
- **tRPC** - End-to-end type-safe APIs
- **Bun** - Runtime environment
- **Drizzle** - TypeScript-first ORM
- **PostgreSQL** - Database engine
- **Authentication** - Better-Auth
- **Biome** - Linting and formatting
- **Turborepo** - Optimized monorepo build system

## Getting Started

First, install the dependencies:

```bash
bun install
```

## Database Setup

This project uses PostgreSQL with Drizzle ORM.

1. Make sure you have a PostgreSQL database set up.
2. Update your `apps/api/.env` file with your PostgreSQL connection details.

3. Apply the schema to your database:

```bash
bun run db:push
```

Then, run the development server:

```bash
bun run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser to see the web application.
From Tailscale devices, use `http://<tailscale-ip>:8080`.
The API is running at [http://localhost:4040](http://localhost:4040), or `http://<tailscale-ip>:4040` from Tailscale devices.

## Waitlist Email Confirmation

The API sends waitlist confirmation emails through Resend when the provider is enabled. Configure `apps/api/.env` with:

```dotenv
WAITLIST_EMAIL_PROVIDER=resend
RESEND_API_KEY=re_replace_me
WAITLIST_FROM_EMAIL=waitlist@your-verified-domain.com
WAITLIST_REPLY_TO_EMAIL=hello@your-domain.com
WAITLIST_CONFIRMATION_URL=https://api.your-domain.com/api/waitlist/confirm
WAITLIST_CONFIRMATION_REDIRECT_URL=https://your-domain.com/waitlist/confirmation
```

Create a domain-scoped, sending-only API key in Resend and verify the exact domain used by `WAITLIST_FROM_EMAIL`. `WAITLIST_REPLY_TO_EMAIL` is optional; when omitted, replies go to `WAITLIST_FROM_EMAIL`. Use `WAITLIST_EMAIL_PROVIDER=noop` only when email delivery should be explicitly disabled, such as local development without provider credentials.

The confirmation email is transactional and uses React Email. Its production implementation lives in `packages/email`. Preview it locally with:

```bash
bun run email:preview
```

Check the Resend CLI, credentials, and domain status without sending an email with:

```bash
bun --env-file=apps/api/.env run resend:doctor
```

For production deliverability, keep SPF and DKIM verified, publish a DMARC policy, use HTTPS confirmation URLs, and leave open/click tracking disabled for this transactional flow. The send includes a deterministic idempotency key and retries only transient Resend failures.

## Authentication API

Better Auth is mounted at `/api/auth/*` before NestJS body parsing, while JSON and URL-encoded parsing remain enabled for tRPC and the rest of the API. The API supports email/password, Google, and GitHub sign-in, email OTP codes, magic links, passkeys, TOTP two-factor, sign-out, and session retrieval/revocation. Email verification is sent on sign-up as an OTP but is not required to sign in. The `/account` screen handles email verification, password and email changes, two-factor setup with backup codes, passkey registration, and session management. Sign-up also supports passkey-first account creation.

Keep browser CORS origins separate from native deep-link origins:

```dotenv
CORS_ORIGIN=https://mavry.app
```

Configure exact HTTP(S) origins in `CORS_ORIGIN`. Better Auth trusts those web origins and the fixed `mavry://` origin used by the Expo app for native OAuth callbacks, without exposing the custom scheme through browser CORS.

Auth rate limits use Better Auth's built-in in-memory storage. Sensitive auth endpoints keep Better Auth's stricter default rules. Counters are local to each API process, reset when it restarts, and are not shared across replicas. The API behaves the same in every environment: Better Auth resolves the client IP from `x-forwarded-for` or `x-real-ip`, and a middleware fills it from the socket address when no proxy header is present, so development and production share one code path. When the proxy forwards a chain of IPs (or you run behind multiple hops), set the proxy addresses so Better Auth walks the chain and picks the first untrusted address:

```dotenv
TRUSTED_PROXIES=203.0.113.10,10.0.0.0/24
```

Extra trusted origins (for example native development schemes) are configured without environment-specific code:

```dotenv
TRUSTED_ORIGINS=exp://,exp://**
```

Google and GitHub are enabled independently when both credentials for a provider are present:

```dotenv
GOOGLE_CLIENT_ID=replace_me
GOOGLE_CLIENT_SECRET=replace_me
GITHUB_CLIENT_ID=replace_me
GITHUB_CLIENT_SECRET=replace_me
```

Register the OAuth callbacks as `https://api.mavry.app/api/auth/callback/<provider>` for `google` and `github`. GitHub OAuth apps need access to the user email.

Configure one secret of at least 32 characters:

```dotenv
BETTER_AUTH_SECRET=replace-with-a-secret-of-at-least-32-characters
```

In production, configure HTTPS origins. The Expo origin is fixed to `mavry://`, and verification identifiers are stored hashed in PostgreSQL.

### Auth email

Email OTP codes, magic links, and verification use Resend when configured; otherwise they fall back to a no-op provider.

```dotenv
AUTH_EMAIL_PROVIDER=resend
AUTH_FROM_EMAIL=hello@mavry.app
AUTH_REPLY_TO_EMAIL=hello@mavry.app
RESEND_API_KEY=replace_me
```

### Captcha (Cloudflare Turnstile)

Sign-up, email sign-in, magic link, and email OTP requests are protected by Cloudflare Turnstile when both keys are set. Use the Turnstile test keys for local development and replace them with real keys from the Cloudflare dashboard for production.

```dotenv
# API
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

```dotenv
# Web
VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA
```

Set both keys together: if the secret key is set without the site key, the API enforces the captcha but the web app cannot produce a token, so protected auth requests fail. Create a Turnstile widget in the Cloudflare dashboard and use its site key and secret key in production. Native clients must also produce a Turnstile token for the protected endpoints.

### Passkeys

Passkeys are bound to a registrable domain. Set `PASSKEY_RP_ID` to the domain shared by the web app and the API (not the API host), and keep `BETTER_AUTH_URL` on HTTPS so cookies are secure and `SameSite=None`.

```dotenv
BETTER_AUTH_URL=https://api.mavry.app
PASSKEY_RP_ID=mavry.app
PASSKEY_RP_NAME=Mavry
```

The web app reads the API base URL from its own environment:

```dotenv
VITE_API_URL=https://api.mavry.app
```

## UI Customization

React web apps in this stack share shadcn/ui primitives through `packages/ui`.

- Change design tokens and global styles in `packages/ui/src/styles/globals.css`
- Update shared primitives in `packages/ui/src/components/*`
- Adjust shadcn aliases or style config in `packages/ui/components.json` and `apps/web/components.json`

### Add more shared components

Run this from the project root to add more primitives to the shared UI package:

```bash
npx shadcn@latest add accordion dialog popover sheet table -c packages/ui
```

Import shared components like this:

```tsx
import { Button } from "@mavry/ui/components/button";
```

### Add app-specific blocks

If you want to add app-specific blocks instead of shared primitives, run the shadcn CLI from `apps/web`.

## Git Hooks and Formatting

- Run checks: `bun run check`

## Project Structure

```
mavry/
├── apps/
│   ├── web/         # Frontend application (React + TanStack Start)
│   └── api/         # Backend API (NestJS, TRPC)
├── packages/
│   ├── ui/          # Shared shadcn/ui components and styles
│   ├── trpc/        # Shared NestJS tRPC module and generated router types
│   ├── auth/        # Authentication configuration & logic
│   └── db/          # Database schema & queries
```

## Available Scripts

- `bun run dev`: Start all applications in development mode
- `bun run build`: Build all applications
- `bun run dev:web`: Start only the web application
- `bun run dev:api`: Start only the API
- `bun run dev:server`: Start only the API (compatibility alias)
- `bun run check-types`: Check TypeScript types across all apps
- `bun run db:push`: Push schema changes to database
- `bun run db:generate`: Generate database client/types
- `bun run db:migrate`: Run database migrations
- `bun run db:studio`: Open database studio UI
- `bun run check`: Run Biome formatting and linting
