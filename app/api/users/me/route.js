import { NextResponse } from "next/server";
import { serverRequest } from "@/lib/api/server";

// Same-origin proxy for DashboardShell's client-side identity fetch
// (useQuery, not a Server Component render) -- the browser still
// never calls the Express API directly. Uses serverRequest, not
// apiRequest: apiRequest calls redirect() on a missing/401 token,
// which is meant for a Server Component render, not a Route Handler
// a fetch() call is reading the JSON body of -- redirecting here
// would make the client try to parse the login page's HTML as JSON.
// A plain 401 lets the caller's own error handling decide what to do.
export async function GET() {
  const { data, status } = await serverRequest("/api/v1/users/me");
  return NextResponse.json(data, { status });
}

// Self-service profile edit, from the form on /account/profile. Which
// account gets edited is decided by the token, not the body, so there
// is no id to check here and nobody else to reach.
//
// The body is forwarded as-is: the API validates it again (and owns
// the real rules), so re-checking here would only duplicate a schema
// that could drift. A validation failure comes back as Express's
// { error: { code, message } }, which clientRequest surfaces to the
// form.
export async function PATCH(request) {
  const body = await request.json().catch(() => null);

  const { data, status } = await serverRequest("/api/v1/users/me", {
    method: "PATCH",
    body,
  });

  return NextResponse.json(data, { status });
}
