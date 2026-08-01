---
name: playwright-browser-testing
description: Use when testing Mavry landing pages, product flows, browser behavior, Playwright tests, Chromium, Brave, MCP browser access, screenshots, videos, or end-to-end verification.
---

# Playwright Browser Testing

Use this skill whenever the user asks to test the landing, product UI, browser flows, visual behavior, or API/web integration.

## Default Workflow

1. Run repeatable checks first with `bun run test:e2e`.
2. Use headed mode with `bun run test:e2e:headed` when visual behavior matters.
3. Use the Playwright CLI for exploratory browser interaction:
   - `bunx --bun playwright cli open http://localhost:8080 --headed`
   - `bunx --bun playwright cli snapshot`
   - `bunx --bun playwright cli click <ref>`
   - `bunx --bun playwright cli fill <ref> <text>`
   - `bunx --bun playwright cli console error`
   - `bunx --bun playwright cli requests`
   - `bunx --bun playwright cli screenshot --filename=.playwright-output/<name>.png`
4. Check both desktop and narrow responsive viewports when the task touches layout.
5. Serve generated videos, screenshots, and reports for tablet/phone review with `bun run browser:serve-artifacts`.

## Local App Defaults

- Web: `http://localhost:8080`
- API: `http://localhost:4040`
- tRPC health: `http://localhost:4040/api/trpc/app.healthCheck?batch=1&input=%7B%7D`

For Tailscale devices, open `http://<tailscale-ip>:8080` for web and `http://<tailscale-ip>:4040` for API.

The root Playwright config starts `apps/api` and `apps/web` automatically unless `PLAYWRIGHT_SKIP_WEBSERVER=true` is set. If `4040` or `8080` are occupied, Playwright uses `4041` or `8081`.

## Browser Selection

The default project uses Playwright's managed Chromium.

To run tests with Brave, set the executable path before invoking Playwright:

```bash
PLAYWRIGHT_BRAVE_EXECUTABLE_PATH=/path/to/brave-browser bun run test:e2e:headed
```

For the Playwright MCP server, start Codex with:

```bash
PLAYWRIGHT_MCP_EXECUTABLE_PATH=/path/to/brave-browser
```

If Brave is not available in `PATH`, detect it with `command -v brave-browser || command -v brave` or ask the user for the installed path.

## Verification Standard

Before reporting success, include what was run and whether the browser could load the web app, reach `/api/trpc`, and surface console/network errors. Keep screenshots, videos, and reports under `.playwright-output`.

## Artifact Review

Use `bun run browser:serve-artifacts` to serve `.playwright-output` over HTTP. The script binds to `0.0.0.0`, prints `localhost`, and prints any Tailscale IPv4 address detected by `tailscale ip -4`.

For Android/Brave review, open the printed Tailscale URL. Videos, screenshots, and the Playwright HTML report open directly.
