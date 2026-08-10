import { NextResponse } from "next/server";

const API_URL = process.env.API_URL;

// Same-origin proxy for the forgot-password form. Unauthenticated, so
// there's no cookie to read and no Bearer token to attach -- this
// exists purely because the browser never calls the Express API
// directly in this variant (see CLAUDE.md), same as the login route
// next to it.
export async function POST(request) {
  const body = await request.json().catch(() => null);

  const apiRes = await fetch(`${API_URL}/api/v1/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await apiRes.json().catch(() => null);

  if (!apiRes.ok) {
    // Only a malformed address gets here -- the API answers 200 whether
    // or not the account exists, deliberately, so that this endpoint
    // can't be used to enumerate real accounts. Pass its
    // { error: { code, message } } shape straight through.
    return NextResponse.json(data, { status: apiRes.status });
  }

  // Rebuilt rather than forwarded: outside production the API spreads a
  // `devResetToken` into this body so the flow is testable without real
  // email infrastructure. That token is the whole credential -- holding
  // it is enough to take over the account -- and this is the one place
  // that can stop it reaching the browser. Picking the message out by
  // name means a field added to that response later can't ride along
  // either.
  return NextResponse.json({ message: data?.message });
}
