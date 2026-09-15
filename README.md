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

Better Auth is mounted at `/api/auth/*` before NestJS body parsing, while JSON and URL-encoded parsing remain enabled for tRPC and the rest of the API. The web auth screens use the Better Auth client for email/password sign-up and sign-in, Google and GitHub OAuth, session cookies, and password-reset requests and submissions. Password-reset email delivery is intentionally not configured in this branch, so requesting a reset does not send an email. The API also exposes Better Auth's sign-out and session-management endpoints. Authentication email verification is not required in this branch.

Keep browser CORS origins separate from native deep-link origins:

```dotenv
CORS_ORIGIN=https://app.your-domain.com
```

Configure exact HTTP(S) origins in `CORS_ORIGIN`. Better Auth trusts those web origins and the fixed `mavry://` origin used by the Expo app for native OAuth callbacks, without exposing the custom scheme through browser CORS.

Auth rate limits use Better Auth's built-in in-memory storage. Sensitive auth endpoints keep Better Auth's stricter default rules. Counters are local to each API process, reset when it restarts, and are not shared across replicas.

Google and GitHub are enabled independently when both credentials for a provider are present:

```dotenv
GOOGLE_CLIENT_ID=replace_me
GOOGLE_CLIENT_SECRET=replace_me
GITHUB_CLIENT_ID=replace_me
GITHUB_CLIENT_SECRET=replace_me
```

Configure the OAuth callbacks as `https://your-api-domain.com/api/auth/callback/google` and `https://your-api-domain.com/api/auth/callback/github`. GitHub OAuth apps need access to the user email. The auth API includes email sign-up/sign-in, social sign-in, sign-out, session retrieval and revocation, verification email, password reset, and account linking.

Configure one secret of at least 32 characters:

```dotenv
BETTER_AUTH_SECRET=replace-with-a-secret-of-at-least-32-characters
```

In production, configure HTTPS origins. The Expo origin is fixed to `mavry://`, and verification identifiers are stored hashed in PostgreSQL.

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
