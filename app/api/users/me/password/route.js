import { NextResponse } from "next/server";
import { serverRequest } from "@/lib/api/server";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/auth/session";

// Self-service password change, from the sign-in card on
// /account/profile. Separate from PATCH /api/users/me because the API
// keeps it separate: a password change needs the current password and
// has a consequence a profile edit doesn't.
//
// That consequence is why this handler exists rather than the form
// calling the profile route: changeOwnPassword revokes every refresh
// token for the account (the API's own comment: "ends every session on
// success -- the caller has to log in again"), and this is the only
// place in the request that can act on it. Clearing the cookies here
// is the same reasoning as app/api/auth/reset-password: the access
// token is a stateless JWT that Proxy never re-checks against the
// database, so without this the person who just changed their password
// would keep browsing for up to ACCESS_MAX_AGE on a session the API
// already considers over.
//
// The caller then has to do a full navigation to /login -- see the
// note in SignInCard.
export async function PATCH(request) {
  const body = await request.json().catch(() => null);

  const { data, status } = await serverRequest("/api/v1/users/me/password", {
    method: "PATCH",
    body,
  });

  // A mistyped current password is a 401/INVALID_CREDENTIALS from the
  // API, and it must not leave here as a 401. lib/api/client.js treats
  // any 401 outside /api/auth/* as a dead session: it would spend a
  // refresh token, retry, get the same answer, and send the user to
  // /login -- so a typo would sign you out instead of showing "that's
  // not your current password".
  //
  // 400 is the honest translation at this boundary. The API is
  // answering "the credential you supplied is wrong", which is what a
  // 401 means to it; to the browser this is a rejected form field on a
  // session that is still perfectly alive. The code and message are
  // passed through untouched, so the form still says exactly what the
  // API said.
  if (status === 401 && data?.error?.code === "INVALID_CREDENTIALS") {
    return NextResponse.json(data, { status: 400 });
  }

  // Anything else -- including a genuine 401 about the session itself
  // -- goes back as it came, cookies intact. Only success ends the
  // session.
  if (status !== 200) {
    return NextResponse.json(data, { status });
  }

  const response = NextResponse.json(data, { status });
  response.cookies.delete(ACCESS_COOKIE);
  response.cookies.delete(REFRESH_COOKIE);
  return response;
}
