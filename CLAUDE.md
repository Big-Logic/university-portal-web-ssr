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
- **Data fetching for protected pages happens server-side.** Every
  page under the `(dashboard)` route group is a Server Component (no
  `"use client"`) that calls the Express API directly, server-to-server,
  using `lib/api/server.js`. There is no client-side `authFetch`
  equivalent for *page* data in this project -- if you're tempted to add
  one, that's a sign you're accidentally reintroducing Version A's
  pattern here.
  - **One deliberate exception:** the signed-in user's *full profile*
    (fullName/email/role, for display) is fetched client-side, via
    React Query (`useQuery` calling `GET /api/users/me`, a same-origin
    Route Handler that proxies `serverRequest` -- the browser
    still never touches the Express API directly). `UserIdentity` and
    `AccountMenuItems` (in `AccountMenuPanel.js`) each call this
    themselves through the shared `useCurrentUser` hook
    (`hooks/useCurrentUser.js`) rather than receiving it as a prop
    from a parent -- a shared `queryKey` means React Query dedupes
    every caller onto one network request, so this still isn't
    per-page re-fetching. `DashboardHeader` doesn't touch `user` at all since it only ever
    forwarded it.
  - **Separately, `Sidebar`'s nav does NOT use that hook.** It only
    needs `role`, and `app/(dashboard)/layout.js` already calls
    `getCurrentUser()` (headers Proxy set, no network call) to gate
    access to the whole route group -- that lightweight `{ id, role }`
    is passed down as a `user` prop through `DashboardShell` to
    `Sidebar` to `Sidebar/Nav.js` (a Client Component; it just renders
    styled nav links, `getCurrentUser` itself can't be called from a
    Client Component since it uses `next/headers`). This is a
    different data source than the React Query profile fetch above --
    one's a header read for role-gating, the other's a network call
    for display data -- so the two don't race each other.
- **`proxy.js`** (Next.js 16 renamed Middleware to Proxy -- same
  mechanism, new file convention) handles route protection AND
  proactive token refresh, since it's the one place in the whole app
  that can both read and write cookies on the way through a request.
  See the large comment at the top of that file for why it
  deliberately does more than Next's own "optimistic checks only"
  guidance recommends, and what the trade-off is.
- **Reactive refresh (on a 401) lives in `lib/api/client.js`, not on
  the server.** `clientRequest` retries once after refreshing;
  `serverRequest` passes 401s straight through. This looks
  backwards for a server-auth variant, so the reason matters: the API
  rotates refresh tokens on every use with **no grace period**, so two
  concurrent requests spending the same token means the second is
  logged out. Deduping that needs one coordination point per session,
  and the browser is the only place that exists -- a module-scoped
  promise dedupes within a tab, and the Web Locks API
  (`navigator.locks`) dedupes across tabs. A server-side equivalent
  had to key its Map by the refresh token (module scope is shared by
  every request a Node process serves, so a single shared promise
  would hand one user's new token to another) and still only deduped
  within one process, breaking under multi-instance or serverless
  deployment. Note `/api/auth/*` is excluded from the retry -- a 401
  from login means bad credentials, and retrying `/api/auth/refresh`
  would recurse.
- **The browser never calls the Express API directly.** Every call is
  same-origin (to this app's own Route Handlers) or server-to-server
  (Proxy, Server Components). This is also why `API_URL` in `.env.local`
  is NOT prefixed `NEXT_PUBLIC_` -- it never needs to reach the client
  bundle, unlike the sibling project where it's unavoidable.

## Routes are namespaced by role, not by a shared `/dashboard` prefix

Protected pages live under the top-level role segments --
`/admin`, `/faculty`, `/registrar`, `/student` -- plus `/account` for
pages every role shares (profile, settings, transcript, session
diagnostics). All of them sit in the `app/(dashboard)` route group so
they share one layout (the sidebar/header shell) without that group
name becoming part of the URL. `lib/navigation.js`'s `NAV_BY_ROLE` is
the single source of truth for which paths exist per role --
`homePathForRole`/`assertRole` both read from it, as does `proxy.js`'s
own redirect-after-login logic.

## Pattern for a new protected page with real data

```js
// app/(dashboard)/{role}/something/page.js -- Server Component, no "use client"
import { apiRequest } from "@/lib/api/server";
import { assertRole } from "@/lib/navigation";
import { getCurrentUser } from "@/lib/api/current-user";
import SomethingView from "./SomethingView";

export default async function SomethingPage() {
  const user = await getCurrentUser();
  assertRole(user, "{role}");

  const data = await apiRequest("/api/v1/whatever");
  return <SomethingView data={data} />;
}
```

```js
// app/(dashboard)/{role}/something/SomethingView.js -- Client Component
"use client";
// All styled-components JSX goes here, receiving `data` as a prop.
// styled-components fundamentally needs client-side JS (theme
// context, dynamic class generation) -- a Server Component cannot
// define new styled.* elements directly, only render pre-built
// Client Components that do.
```

Don't try to add `"use client"` to a page that needs `apiRequest` or
`getCurrentUser` -- both use `next/headers` (`cookies()` and
`headers()` respectively), which only works in Server
Components/Route Handlers/Proxy, not Client Components.

The two are in separate files because they do fundamentally different
things. `getCurrentUser()` (`lib/api/current-user.js`) makes **no
network call at all** -- it reads back the `x-user-id`/`x-user-role`
request headers Proxy already set after verifying the token's
signature, so it only ever yields `{ id, role }`. Everything in
`lib/api/server.js` (`apiRequest`, `serverRequest`) is a real HTTP
round trip to Express. Anything needing the full profile
(name/email) therefore goes through `apiRequest("/api/v1/users/me")`,
not `getCurrentUser()`.

## Extending route protection to a new path

Add the new prefix to **both** `PROTECTED_PREFIXES` and
`config.matcher` in `proxy.js` -- unlike the old single-`/dashboard`
setup, each role prefix (`/admin`, `/faculty`, `/registrar`,
`/student`, `/account`) needs its own entry in both places since
there's no longer one parent segment that covers all of them.

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
  `login/page.js` and `hooks/useLogout.js` -- called by
  `AccountMenuItems` (`components/DashboardShell/AccountMenuPanel`),
  the actual "Log out" button both `UserIdentity`'s and `Sidebar`'s
  dropdowns render, same self-fetching pattern as `useCurrentUser`.
- **Same `rt(theme)` fallback pattern as the sibling project** for
  Next.js 16's `/_not-found` prerender issue -- see that project's
  CLAUDE.md for the full explanation if you hit "Cannot read
  properties of undefined" during a build.

## Sample content on the student dashboard

`lib/sample-data.js` holds every piece of placeholder content on
`/student/home` and in the header popovers (checklist, term
calendar, documents, notifications, GPA/credits, course progress).
None of it comes from the API, because none of it has an endpoint yet.

Two rules when working on this:

- **Everything sourced from that file renders behind a visible
  "Sample" badge.** Don't remove those badges while the data is still
  fabricated -- a student seeing a made-up GPA presented as their own
  record is the failure mode being guarded against.
- **When a real endpoint lands, delete the matching export from
  `lib/sample-data.js`** and fetch it in the Server Component
  (`app/(dashboard)/student/home/page.js`) instead of adding a
  client-side fetch. Note that `apiRequest` throws on a non-OK
  response, which takes the whole page to the error boundary -- so
  don't wire up an endpoint until it's actually deployed.
