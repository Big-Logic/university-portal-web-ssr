import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Lightweight identity ({ id, role } only, NOT email or name) for
 * role-gating (assertRole) and the handful of places that need
 * `user.id` (e.g. myteaching's instructor_id filter). No network call
 * and no cookie of its own: Proxy already verified the access token's
 * signature via jose (lib/jwt.js) and forwarded `sub`/`role` as
 * request headers, so this just reads those back -- they're
 * cryptographically trustworthy by the time they get here.
 *
 * Lives apart from ./server.js deliberately: everything in there is a
 * real HTTP call to the Express API, whereas this never leaves the
 * process -- it's a request-header read. Same reason it needs neither
 * API_URL nor the access-token cookie.
 *
 * This is NOT the full user profile. Anything that needs to *display*
 * the user's name/email (the dashboard shell, the home pages'
 * "Welcome back, {name}" greeting, session diagnostics) should call
 * `apiRequest("/api/v1/users/me")` from ./server.js instead, since
 * that data was never in the token to begin with.
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
