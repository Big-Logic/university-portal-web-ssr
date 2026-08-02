import { NextResponse } from "next/server";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/session";
import {
  verifyAccessToken,
  TOKEN_VALID,
  TOKEN_INVALID,
  TOKEN_EXPIRED,
  TOKEN_MISSING,
} from "@/lib/jwt";
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

  const { status, payload } = await verifyAccessToken(accessToken);

  if (status === TOKEN_INVALID || !refreshToken) {
    if (isLoginPage) {
      return NextResponse.next();
    }
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete(ACCESS_COOKIE);
    response.cookies.delete(REFRESH_COOKIE);
    return response;
  }

  if (status === TOKEN_VALID) {
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

  // Expired -- the routine case, and the one refreshing is actually for.
  if (refreshToken) {
    const refreshUrl = new URL("/api/auth/refresh", request.url);
    refreshUrl.searchParams.set(
      // `payload.role` is readable here even though the token expired
      // (the signature verified before the expiry check did), but this
      // still routes through "/" rather than jumping straight to the
      // role home -- "/" re-verifies against the *fresh* cookie, which
      // is the honest check. See lib/jwt.js on why expired claims are
      // safe to read but not to authorize on.
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
