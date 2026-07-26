# Basecourse — University Portal (Web) — Server-Auth Variant

**Version B** of a two-way architecture comparison against
`university-portal-web` (the client-side/localStorage version). Same
design system, same visual output, same UI components. The only
difference is how auth and data-fetching work under the hood.

See **CLAUDE.md** for the full architectural breakdown if you're
working in this repo with Claude Code.

## Setup

```bash
npm install
cp .env.local.example .env.local   # set API_URL (see note below)
npm run dev
```

Visit http://localhost:3000 — `proxy.js` redirects you to `/login` if
you're not signed in, `/dashboard` if you are, before any page code
even runs.

**Always run `npm run build` before considering a change done**, same
as the sibling project.

## What's actually different from the client-side version

|                             | Client-side (Version A)                                  | Server-side (Version B, this repo)                                        |
| --------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------- |
| Token storage               | Access token in memory, refresh token in `localStorage`  | Both in httpOnly cookies, never touch client JS                           |
| Route protection            | `RequireRole`-style check after JS loads                 | `proxy.js`, before any page code runs                                     |
| Data fetching               | Client `authFetch()`                                     | Server Components calling `serverApiRequest()`                            |
| Browser → API               | Direct, cross-origin, needs CORS                         | Never — same-origin to this app's own Route Handlers, or server-to-server |
| `API_URL` env var           | Must be `NEXT_PUBLIC_*` (reaches the client bundle)      | Plain server-only var (never reaches the client bundle)                   |
| XSS token theft             | Readable via `document.cookie`-equivalent (localStorage) | Not directly readable — httpOnly                                          |
| XSS session riding          | Still possible while the tab is open                     | Still possible while the tab is open — httpOnly doesn't fix this          |
| "Proves the JWT flow works" | An explicit client-side verify call/button               | Implicit: the page couldn't have rendered otherwise (fail-closed)         |

## Architecture

```
Browser
  │  same-origin only
  ▼
Next.js (this app)
  ├─ proxy.js              Route protection + proactive refresh (reads/writes cookies)
  ├─ app/api/auth/login     Route Handler: sets httpOnly cookies
  ├─ app/api/auth/logout    Route Handler: clears cookies, best-effort server-side revoke
  └─ app/dashboard/page.js  Server Component: reads cookie, calls API server-to-server
        │
        ▼  server-to-server, no CORS involved
   Express API (Railway)
```

## Known trade-offs (see CLAUDE.md / proxy.js for full reasoning)

- `proxy.js` now performs optimistic checks only. When the access
  token is expired or missing, it redirects to `/api/auth/refresh` so a
  server route can handle the refresh and update cookies before the
  protected page loads.
- Proxy's expiry check decodes the JWT without verifying its
  signature — a UX gate, not the real security boundary (that's still
  the Express API, on every request, in both versions).
