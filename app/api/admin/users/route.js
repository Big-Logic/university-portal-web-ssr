import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_COOKIE } from "@/lib/session";
import { forwardApiRequest } from "@/lib/server-api";

// Same-origin proxy for the admin "create user" form -- a Client
// Component can't read the httpOnly access-token cookie itself, so it
// posts here instead of straight to Express, and this attaches the
// Bearer token server-side.
export async function POST(request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;

  if (!accessToken) {
    return NextResponse.json({ error: { message: "Not signed in" } }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const { data, status } = await forwardApiRequest("/api/v1/users", {
    method: "POST",
    accessToken,
    body,
  });

  return NextResponse.json(data, { status });
}
