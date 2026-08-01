import { NextResponse } from "next/server";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/session";
import { verifyAccessToken } from "@/lib/jwt";
import { homePathForRole } from "@/lib/navigation";

// Routes are namespaced by role at the top level rather than under a
// shared /dashboard prefix -- each role's prefix needs its own entry
// here (and in config.matcher below) since there's no longer one
// parent segment that covers all of them.
const PROTECTED_PREFIXES = [
  "/admin",
  "/faculty",
  "/registrar",
  "/student",
  "/account",
];

export async function proxy(request) {
  const { pathname, search } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );
  const isLoginPage = pathname === "/login";

  if (!isProtected && !isLoginPage) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;

  const payload = await verifyAccessToken(accessToken);

  if (payload) {
    if (isLoginPage) {
      return NextResponse.redirect(
        new URL(homePathForRole(payload.role), request.url),
      );
    }

    // Forward the now cryptographically-verified identity to Server
    // Components via request headers -- getCurrentUser() reads these
    // instead of re-verifying the token or hitting the API again.
    // These are internal, request-scoped headers Next.js passes along
    // its own server-side pipeline; they never reach the browser as
    // response headers.
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", String(payload.sub));
    requestHeaders.set("x-user-role", payload.role);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (refreshToken) {
    const refreshUrl = new URL("/api/auth/refresh", request.url);
    refreshUrl.searchParams.set(
      // Role isn't known yet here (the access token is missing/invalid,
      // which is why we're refreshing) -- "/" does its own lightweight
      // verify-and-redirect once the refresh sets a fresh cookie.
      "returnTo",
      isLoginPage ? "/" : `${pathname}${search}`,
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
  matcher: [
    "/admin/:path*",
    "/faculty/:path*",
    "/registrar/:path*",
    "/student/:path*",
    "/account/:path*",
    "/login",
  ],
};
