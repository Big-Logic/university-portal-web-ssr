import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_COOKIE, REFRESH_COOKIE, COOKIE_OPTIONS } from "@/lib/session";

const API_URL = process.env.API_URL;
const ACCESS_MAX_AGE = 15 * 60;
const REFRESH_MAX_AGE = 30 * 24 * 60 * 60;

function getReturnTo(request) {
  const returnTo = request.nextUrl.searchParams.get("returnTo");
  if (!returnTo || !returnTo.startsWith("/")) {
    return "/dashboard";
  }
  return returnTo;
}

export async function GET(request) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

  if (!refreshToken) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete(ACCESS_COOKIE);
    response.cookies.delete(REFRESH_COOKIE);
    return response;
  }

  const apiRes = await fetch(`${API_URL}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await apiRes.json().catch(() => null);

  if (!apiRes.ok || !data?.accessToken || !data?.refreshToken) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete(ACCESS_COOKIE);
    response.cookies.delete(REFRESH_COOKIE);
    return response;
  }

  const response = NextResponse.redirect(
    new URL(getReturnTo(request), request.url),
  );
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

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

  if (!refreshToken) {
    const response = NextResponse.json({ refreshed: false }, { status: 401 });
    response.cookies.delete(ACCESS_COOKIE);
    response.cookies.delete(REFRESH_COOKIE);
    return response;
  }

  const apiRes = await fetch(`${API_URL}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await apiRes.json().catch(() => null);

  if (!apiRes.ok || !data?.accessToken || !data?.refreshToken) {
    const response = NextResponse.json({ refreshed: false }, { status: 401 });
    response.cookies.delete(ACCESS_COOKIE);
    response.cookies.delete(REFRESH_COOKIE);
    return response;
  }

  const response = NextResponse.json({ refreshed: true });
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
