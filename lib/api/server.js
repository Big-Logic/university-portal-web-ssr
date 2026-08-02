import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_COOKIE } from "../session";
import {
  verifyAccessToken,
  TOKEN_VALID,
  TOKEN_MISSING,
  TOKEN_EXPIRED,
} from "../jwt";

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
 * For Route Handlers proxying a Client Component's mutation (a form
 * submit, not a page render). Unlike apiRequest, this never redirects
 * or throws -- it hands back whatever status/body Express returned so
 * the caller can show the admin a real validation error instead of a
 * generic failure.
 *
 * Reads and verifies the access token cookie itself (every call site
 * was repeating the same "missing cookie -> 401" check), so callers
 * just get back a { data, status } pair regardless of whether the
 * token was even present.
 *
 * The signature check matters more here than it looks: `/api/*` is NOT
 * in proxy.js's matcher, so Proxy never runs for the Route Handlers
 * that call this -- unlike the Server Component pages, which are
 * already verified by the time apiRequest runs. This is the only
 * verification these requests get before leaving the process.
 *
 * It's an optimization and a faster failure, not a security boundary:
 * Express verifies every token itself regardless. What it buys is
 * skipping a pointless round trip when we can already tell locally
 * that the token is expired or forged.
 *
 * A 401 is passed straight through rather than refreshed-and-retried
 * here. Refresh lives in lib/api/client.js instead: the browser is the
 * only place a single session maps to a single JS context, so a plain
 * module-scoped promise plus a Web Lock dedupes concurrent refreshes
 * both within a tab and across tabs. Doing it here needed the refresh
 * token as a Map key to avoid handing one user's new token to another
 * (module scope is shared by every request a Node process serves), and
 * still only deduped within one process -- so it broke under
 * multi-instance or serverless deployment.
 */

// All three are 401 -- they're all authentication failures, and the
// Express API already speaks this { error: { code, message } } shape.
// What differs is the `code`, which tells lib/api/client.js whether a
// refresh could possibly help:
//
//   NOT_SIGNED_IN / SESSION_EXPIRED -> refreshable. These are the same
//     event seen a moment apart: the access cookie's maxAge and the
//     token's `exp` are both 15 minutes, so whether a returning user
//     hits a purged cookie or a stale token is a race. Their refresh
//     cookie is good for 30 days, so refreshing is exactly right.
//
//   INVALID_TOKEN -> NOT refreshable. The signature didn't verify, so
//     either JWT_ACCESS_SECRET has drifted from the API's or the token
//     was forged. A newly-minted token would fail the same check, so
//     retrying just burns a refresh token before logging out anyway.
const TOKEN_FAILURE = {
  [TOKEN_MISSING]: { code: "NOT_SIGNED_IN", message: "Not signed in" },
  [TOKEN_EXPIRED]: { code: "SESSION_EXPIRED", message: "Session expired" },
};

const INVALID_TOKEN_FAILURE = {
  code: "INVALID_TOKEN",
  message: "Invalid session token",
};

export async function serverRequest(path, { method = "GET", body } = {}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;

  const { status: tokenStatus } = await verifyAccessToken(accessToken);

  if (tokenStatus !== TOKEN_VALID) {
    return {
      data: { error: TOKEN_FAILURE[tokenStatus] ?? INVALID_TOKEN_FAILURE },
      status: 401,
    };
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => null);
  return { data, status: res.status };
}
