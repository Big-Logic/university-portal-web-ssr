import { NextResponse } from "next/server";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/session";

const API_URL = process.env.API_URL;

// Same-origin proxy for the reset form, the same shape as the
// forgot-password handler next door: unauthenticated, so a plain fetch
// with no cookie to read and no Bearer token to attach. It exists
// because the browser never calls the Express API directly in this
// variant (see CLAUDE.md).
export async function POST(request) {
  const body = await request.json().catch(() => null);

  const apiRes = await fetch(`${API_URL}/api/v1/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await apiRes.json().catch(() => null);

  if (!apiRes.ok) {
    // Forwarded untouched, unlike forgot-password's success path --
    // there's no dev-only secret in an error body, and the client needs
    // to read `error.code` off it. INVALID_RESET_TOKEN covers expired,
    // already-used and forged alike, and it's the one failure that
    // resubmitting the form cannot fix.
    return NextResponse.json(data, { status: apiRes.status });
  }

  const response = NextResponse.json({ message: data?.message });

  // The API returns no tokens here, so there is nothing to store -- but
  // there is something to clear, and this is the only place that can.
  // resetPassword revokes every refresh token for the user
  // (setUserPassword, utils/credentials.js) while the access token is a
  // stateless JWT that Proxy never re-checks against the database. A
  // signed-in user resetting their own password would otherwise keep
  // browsing for up to ACCESS_MAX_AGE on a session the API already
  // considers over.
  response.cookies.delete(ACCESS_COOKIE);
  response.cookies.delete(REFRESH_COOKIE);
  return response;
}
