# Deployment notes

## Reverse proxy

Run the API and web app behind a reverse proxy that terminates TLS. The API
already reads the client address from `x-forwarded-for` or `x-real-ip`; when no
proxy header is present it falls back to the socket address.

- If the proxy forwards a **single** client IP (recommended), no extra config is
  needed. See `deploy/Caddyfile.example` for a Caddy setup that overwrites the
  header with the real remote host.
- If the proxy forwards a **chain** of IPs, set `TRUSTED_PROXIES` on the API to
  the proxy IPs/CIDRs (comma-separated). Better Auth then walks the chain and
  uses the first untrusted address.

## Production environment

```dotenv
# API
BETTER_AUTH_URL=https://api.mavry.app
CORS_ORIGIN=https://mavry.app
PASSKEY_RP_ID=mavry.app
PASSKEY_RP_NAME=Mavry
TRUSTED_ORIGINS=
TRUSTED_PROXIES=
TURNSTILE_SECRET_KEY=

# Web
VITE_API_URL=https://api.mavry.app
VITE_TURNSTILE_SITE_KEY=
```

OAuth callbacks:

- `https://api.mavry.app/api/auth/callback/google`
- `https://api.mavry.app/api/auth/callback/github`

Cookies are `HttpOnly`. When `BETTER_AUTH_URL` uses HTTPS they are also
`Secure` with `SameSite=None`, which works for `mavry.app` calling
`api.mavry.app`.
