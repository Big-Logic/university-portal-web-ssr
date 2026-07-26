import { NextResponse } from "next/server";
import { ACCESS_COOKIE, REFRESH_COOKIE, COOKIE_OPTIONS } from "@/lib/session";

const API_URL = process.env.API_URL;

// These durations should match the API's own JWT_ACCESS_EXPIRES_IN /
// JWT_REFRESH_EXPIRES_IN_DAYS (see the API repo's .env). They're
// duplicated here rather than fetched at runtime -- a small, real
// coupling between the two apps worth knowing about if either value
// changes on the API side.
const ACCESS_MAX_AGE = 15 * 60; // 15 minutes, in seconds
const REFRESH_MAX_AGE = 30 * 24 * 60 * 60; // 30 days, in seconds

export async function POST(request) {
  const body = await request.json().catch(() => null);

  console.log("Login request body:", body);

  const apiRes = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await apiRes.json().catch(() => null);

  if (!apiRes.ok) {
    // Proxy the API's own error shape/status straight through -- the
    // login form's error handling on the client stays unchanged
    // either way, it's talking to the same { error: { code, message } } shape.
    return NextResponse.json(data, { status: apiRes.status });
  }

  // The tokens never reach the client at all -- only `user` does,
  // which is safe to expose (no credentials in it).
  const response = NextResponse.json({ user: data.user });
  response.cookies.set(ACCESS_COOKIE, data.accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: ACCESS_MAX_AGE,
  });
  response.cookies.set(REFRESH_COOKIE, data.refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: REFRESH_MAX_AGE,
  });
  return response;
}
