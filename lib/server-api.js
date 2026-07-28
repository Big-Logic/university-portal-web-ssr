import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_COOKIE } from "./session";

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
    throw new Error(data?.error?.message || `Request failed with status ${res.status}`);
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

/**
 * For Route Handlers proxying a Client Component's mutation (a form
 * submit, not a page render). Unlike apiRequest, this never redirects
 * or throws -- it hands back whatever status/body Express returned so
 * the caller can show the admin a real validation error instead of a
 * generic failure.
 */
export async function forwardApiRequest(path, { method = "POST", accessToken, body } = {}) {
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
