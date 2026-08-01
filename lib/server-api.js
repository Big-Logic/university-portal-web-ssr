import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  COOKIE_OPTIONS,
  ACCESS_MAX_AGE,
  REFRESH_MAX_AGE,
} from "./session";

const API_URL = process.env.API_URL;

/**
 * Server Components/Route Handlers only -- reads the access token
 * cookie and calls the Express API directly (server-to-server, so
 * this never touches the browser and never hits a CORS check; CORS is
 * a browser-enforced mechanism, irrelevant to this call).
 *
 * Deliberately does NOT attempt a token refresh here: Server
 * Components can read cookies but cannot set them (only Route
 * Handlers and Middleware can), so there's nowhere to persist a
 * refreshed token from inside this function. The proactive refresh
 * happens once, centrally, in middleware.js -- by the time this runs,
 * the cookie should already be fresh. If it somehow isn't (clock
 * skew, a request that slipped past Middleware), the honest recovery
 * is to send the user back through login, not to silently retry.
 */
export async function apiRequest(path, { method = "GET", body } = {}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;

  if (!accessToken) {
    redirect("/login");
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store", // this is per-user data, never cache across requests
  });

  const data = await res.json().catch(() => null);

  if (res.status === 401) {
    // Access token rejected outright -- Middleware's proactive refresh
    // should make this rare. No cookie-clearing here either, for the
    // same reason as above (Server Components can't write cookies);
    // Middleware clears stale cookies on the next request instead.
    redirect("/login");
  }

  if (!res.ok) {
    // Anything else (validation error, server error) becomes a thrown
    // error, which Next.js's app/error.js boundary catches -- the
    // same "let the framework's error boundary handle it" pattern the
    // client version used via NetworkError/ApiRequestError, just
    // surfacing through a different mechanism on the server.
    throw new Error(
      data?.error?.message || `Request failed with status ${res.status}`,
    );
  }

  return data;
}

/**
 * Lightweight identity ({ id, role } only, NOT email/fullName) for
 * role-gating (assertRole) and the handful of places that need
 * `user.id` (e.g. myteaching's instructor_id filter). No network call
 * and no cookie of its own: Proxy already verified the access token's
 * signature via jose (lib/jwt.js) and forwarded `sub`/`role` as
 * request headers, so this just reads those back -- they're
 * cryptographically trustworthy by the time they get here.
 *
 * This is NOT the full user profile. Anything that needs to *display*
 * the user's name/email (the dashboard shell, the home pages'
 * "Welcome back, {name}" greeting, session diagnostics) should call
 * `apiRequest("/api/v1/users/me")` directly instead, since that data
 * was never in the token to begin with.
 */
export async function getCurrentUser() {
  const headerStore = await headers();
  const id = headerStore.get("x-user-id");
  const role = headerStore.get("x-user-role");

  if (id && role) {
    return { id: Number(id), role };
  }

  // Proxy didn't run for this request, or the token didn't verify --
  // shouldn't happen for any route its matcher covers, but the honest
  // recovery if it somehow does is to send the user back through
  // login rather than guess.
  redirect("/login");
}

// In-flight refreshes, keyed by the refresh token being spent.
//
// The key matters: module scope in Next.js is shared by every request
// this process handles, so a single shared promise would hand one
// user's freshly-minted access token to a *different* user who
// happened to 401 while that refresh was in flight. Keying by the
// token means only requests actually carrying the same cookie -- i.e.
// the same session -- ever share an attempt.
//
// Sharing matters too: if the API rotates refresh tokens on use, two
// concurrent requests spending the same token would leave the second
// one failing against a token the first already invalidated, even
// though the user is perfectly signed in.
//
// Note this dedupes within one process only, not across instances
// behind a load balancer -- an accepted gap. Proxy's proactive
// refresh (see proxy.js) is the primary defense; this is the rare
// fallback for a token going stale mid-request, and a cross-instance
// lock would need shared storage (Redis etc.) this app doesn't have.
const refreshesInFlight = new Map();

// Bounds how long a cached entry can live. Without it a hung Express
// connection would leave the promise pending forever -- and because
// every later caller with this token joins that same promise, the
// session would freeze (not merely leak) until the process restarts.
// The timeout guarantees the promise settles, which guarantees the
// .finally below runs and the entry is evicted.
const REFRESH_TIMEOUT_MS = 10_000;

// Deliberately pure -- token in, tokens out, no cookie access. Cookie
// reads/writes are request-scoped (they resolve against whichever
// request is on the async context), so doing them in here would mean
// a second caller sharing this promise never gets its own Set-Cookie
// on the response. Callers handle their own cookies below instead.
//
// Resolves to the new tokens, or null when the API *definitively*
// refused them. Rejects when we couldn't get an answer at all
// (network down, timeout) -- a distinction refreshAccessToken relies
// on to decide whether the session is actually over.
function requestNewTokens(refreshToken) {
  let inFlight = refreshesInFlight.get(refreshToken);
  if (inFlight) return inFlight;

  inFlight = (async () => {
    const res = await fetch(`${API_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      signal: AbortSignal.timeout(REFRESH_TIMEOUT_MS),
    });
    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.accessToken || !data?.refreshToken) {
      return null;
    }
    return { accessToken: data.accessToken, refreshToken: data.refreshToken };
  })().finally(() => {
    refreshesInFlight.delete(refreshToken);
  });

  refreshesInFlight.set(refreshToken, inFlight);
  return inFlight;
}

/**
 * Spends the refresh cookie for a new token pair and persists it on
 * *this* request's response. Returns the new access token, or null if
 * the session is genuinely over (in which case the stale cookies are
 * cleared so Proxy sends the user to login on the next request).
 *
 * Route Handlers only -- Server Components can read cookies but can't
 * write them, which is why apiRequest above doesn't do any of this.
 */
async function refreshAccessToken(cookieStore) {
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) return null;

  let tokens;
  try {
    tokens = await requestNewTokens(refreshToken);
  } catch {
    // Couldn't reach the auth server (network blip, timeout). The
    // tokens may well still be valid, so deliberately do NOT clear
    // them -- forcing a logout over a transient failure is worse than
    // failing this one request. Proxy re-checks on the next
    // navigation anyway. Returning null just skips the retry below.
    return null;
  }

  if (!tokens) {
    // A real refusal from the API -- the refresh token is spent or
    // revoked, so the session genuinely is over. Clear the stale
    // cookies and Proxy will route to /login on the next request.
    cookieStore.delete(ACCESS_COOKIE);
    cookieStore.delete(REFRESH_COOKIE);
    return null;
  }

  cookieStore.set(ACCESS_COOKIE, tokens.accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: ACCESS_MAX_AGE,
  });
  cookieStore.set(REFRESH_COOKIE, tokens.refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: REFRESH_MAX_AGE,
  });
  return tokens.accessToken;
}

/**
 * For Route Handlers proxying a Client Component's mutation (a form
 * submit, not a page render). Unlike apiRequest, this never redirects
 * or throws -- it hands back whatever status/body Express returned so
 * the caller can show the admin a real validation error instead of a
 * generic failure.
 *
 * Reads the access token cookie itself (every call site was repeating
 * the same "missing cookie -> 401" check), so callers just get back a
 * { data, status } pair regardless of whether the token was even
 * present.
 *
 * On a 401, tries exactly one refresh-and-retry before giving up (see
 * refreshAccessToken above for how concurrent callers share a single
 * in-flight refresh instead of racing each other).
 */
export async function forwardApiRequest(path, { method = "GET", body } = {}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;

  if (!accessToken) {
    return { data: { error: { message: "Not signed in" } }, status: 401 };
  }

  const call = (token) =>
    fetch(`${API_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

  let res = await call(accessToken);

  if (res.status === 401) {
    const newAccessToken = await refreshAccessToken(cookieStore);
    if (newAccessToken) {
      res = await call(newAccessToken);
    }
  }

  const data = await res.json().catch(() => null);
  return { data, status: res.status };
}
