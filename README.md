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

The API sends waitlist confirmation emails through Plunk when the provider is enabled. Configure `apps/api/.env` with:

```dotenv
WAITLIST_EMAIL_PROVIDER=plunk
PLUNK_SECRET_KEY=sk_replace_me
WAITLIST_FROM_EMAIL=waitlist@your-verified-domain.com
WAITLIST_CONFIRMATION_URL=https://api.your-domain.com/api/waitlist/confirm
WAITLIST_CONFIRMATION_REDIRECT_URL=https://your-domain.com/waitlist/confirmation
```

Create the secret key in Plunk under Settings → API Keys and verify the domain used by `WAITLIST_FROM_EMAIL` before sending. Use `WAITLIST_EMAIL_PROVIDER=noop` only when email delivery should be explicitly disabled, such as local development without provider credentials.

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
