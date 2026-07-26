@AGENTS.md

# Basecourse — University Portal (Web) — Server-Auth Variant

**This is Version B of a two-way architecture comparison.** The
sibling project (`university-portal-web`, without `-ssr`) implements
the same app with client-side token storage. This one uses httpOnly
cookies and server-side data fetching instead. Same design system,
same visual output, same UI components -- the *only* difference
between the two projects is how auth and data-fetching are wired.
Read that project's CLAUDE.md too if you want the full comparison; it
still applies to anything NOT related to auth (design tokens, UI
primitives, form/validation conventions, animation, toasts).

## The core architectural difference

- **Tokens live in httpOnly cookies**, set by this app's own Route
  Handlers (`app/api/auth/login`, `app/api/auth/logout`) -- never
  exposed to client JS, unlike the sibling project's in-memory/
  localStorage approach.
- **Data fetching for protected pages happens server-side.**
  `app/dashboard/page.js` is a Server Component (no `"use client"`)
  that calls the Express API directly, server-to-server, using
  `lib/server-api.js`. There is no client-side `authFetch` equivalent
  in this project -- if you're tempted to add one, that's a sign
  you're accidentally reintroducing Version A's pattern here.
- **`proxy.js`** (Next.js 16 renamed Middleware to Proxy -- same
  mechanism, new file convention) handles route protection AND
  proactive token refresh, since it's the one place in the whole app
  that can both read and write cookies on the way through a request.
  See the large comment at the top of that file for why it
  deliberately does more than Next's own "optimistic checks only"
  guidance recommends, and what the trade-off is.
- **The browser never calls the Express API directly.** Every call is
  same-origin (to this app's own Route Handlers) or server-to-server
  (Proxy, Server Components). This is also why `API_URL` in `.env.local`
  is NOT prefixed `NEXT_PUBLIC_` -- it never needs to reach the client
  bundle, unlike the sibling project where it's unavoidable.

## Pattern for a new protected page with real data

```js
// app/dashboard/something/page.js -- Server Component, no "use client"
import { serverApiRequest } from "@/lib/server-api";
import SomethingView from "./SomethingView";

export default async function SomethingPage() {
  const data = await serverApiRequest("/api/v1/whatever");
  return <SomethingView data={data} />;
}
```

```js
// app/dashboard/something/SomethingView.js -- Client Component
"use client";
// All styled-components JSX goes here, receiving `data` as a prop.
// styled-components fundamentally needs client-side JS (theme
// context, dynamic class generation) -- a Server Component cannot
// define new styled.* elements directly, only render pre-built
// Client Components that do.
```

Don't try to add `"use client"` to a page that needs `serverApiRequest`
-- that function uses `next/headers`, which only works in Server
Components/Route Handlers/Proxy, not Client Components.

## Extending route protection to a new path

Add it to `proxy.js`'s `config.matcher`. Everything under `/dashboard`
is already covered by `/dashboard/:path*`.

## Commands

Same as the sibling project:

```bash
npm install
cp .env.local.example .env.local   # set API_URL (not NEXT_PUBLIC_API_URL -- see above)
npm run dev
npm run build   # always run this before considering a change done
```

## Gotchas specific to this variant

- **`proxy.js`, not `middleware.js`.** Next.js 16 renamed the
  convention; the old filename is deprecated (still works with a
  warning at the time this was built, but don't reintroduce it).
- **Proxy's token verification is unverified-signature.** It decodes
  the JWT payload to check expiry but doesn't verify the signature --
  documented in `proxy.js` directly. The real security boundary is
  still the Express API, which does verify signatures on every real
  request. Don't treat Proxy's check as sufcient on its own.
- **Full navigations (`window.location.href`), not `router.push`, after
  login/logout.** A client-side route transition wouldn't guarantee
  Proxy sees the newly-set (or newly-cleared) cookie before the next
  page's server-side fetch runs. This is deliberate in both
  `login/page.js` and `dashboard/DashboardView.js`.
- **Same `rt(theme)` fallback pattern as the sibling project** for
  Next.js 16's `/_not-found` prerender issue -- see that project's
  CLAUDE.md for the full explanation if you hit "Cannot read
  properties of undefined" during a build.
