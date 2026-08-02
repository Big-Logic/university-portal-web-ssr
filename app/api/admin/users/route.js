import { NextResponse } from "next/server";
import { serverRequest } from "@/lib/api/server";

// Same-origin proxy for the admin "create user" form -- a Client
// Component can't read the httpOnly access-token cookie itself, so it
// posts here instead of straight to Express, and this attaches the
// Bearer token server-side.
export async function POST(request) {
  const body = await request.json().catch(() => null);
  const { data, status } = await serverRequest("/api/v1/users", {
    method: "POST",
    body,
  });

  return NextResponse.json(data, { status });
}
