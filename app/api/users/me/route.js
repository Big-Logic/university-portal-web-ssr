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
