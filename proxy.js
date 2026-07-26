import { NextResponse } from "next/server";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/session";

/**
 * Decodes a JWT's payload WITHOUT verifying its signature. Deliberate
 * choice, not an oversight: verifying properly would mean either
 * sharing the API's signing secret with this app (new coupling -- if
 * the API rotates its secret, this app silently breaks too) or
 * switching the API to asymmetric signing so this app only needs a
 * public key. Neither is warranted for what this check actually
 * needs to do -- decide whether it's worth rendering a protected
 * page -- since the API independently verifies the signature on every
 * real request regardless of what Middleware decides here. This is a
 * UX gate, not the security boundary.
 */
function decodeJwtPayload(token) {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function isExpired(payload) {
  if (!payload?.exp) return true;
  return Date.now() >= payload.exp * 1000;
}

export async function proxy(request) {
  const { pathname, search } = request.nextUrl;
  const isProtected = pathname.startsWith("/dashboard");
  const isLoginPage = pathname === "/login";

  if (!isProtected && !isLoginPage) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;

  const accessPayload = accessToken ? decodeJwtPayload(accessToken) : null;
  const accessValid = accessPayload && !isExpired(accessPayload);

  if (accessValid) {
    return isLoginPage
      ? NextResponse.redirect(new URL("/dashboard", request.url))
      : NextResponse.next();
  }

  if (refreshToken) {
    const refreshUrl = new URL("/api/auth/refresh", request.url);
    refreshUrl.searchParams.set(
      "returnTo",
      isLoginPage ? "/dashboard" : `${pathname}${search}`,
    );
    return NextResponse.redirect(refreshUrl);
  }

  if (isLoginPage) {
    return NextResponse.next();
  }

  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.delete(ACCESS_COOKIE);
  response.cookies.delete(REFRESH_COOKIE);
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
