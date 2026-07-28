import { NextResponse } from "next/server";
import { forwardApiRequest } from "@/lib/server-api";

// Same-origin proxy for DashboardShell's client-side identity fetch
// (useQuery, not a Server Component render) -- the browser still
// never calls the Express API directly. Uses forwardApiRequest, not
// apiRequest: apiRequest calls redirect() on a missing/401 token,
// which is meant for a Server Component render, not a Route Handler
// a fetch() call is reading the JSON body of -- redirecting here
// would make the client try to parse the login page's HTML as JSON.
// A plain 401 lets the caller's own error handling decide what to do.
export async function GET() {
  const { data, status } = await forwardApiRequest("/api/v1/users/me");
  return NextResponse.json(data, { status });
}
