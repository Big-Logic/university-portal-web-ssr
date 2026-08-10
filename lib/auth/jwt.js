import { jwtVerify } from "jose";

// `jose` (not `jsonwebtoken`) specifically because this needs to run
// in Proxy, which executes in the Edge runtime -- jsonwebtoken relies
// on Node's `crypto` module, which isn't available there.
const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);

// Why these are distinguished rather than collapsed into one falsy
// result: EXPIRED and INVALID need opposite handling. An expired token
// is the normal end of a 15-minute window and a refresh fixes it. A
// token that fails *signature* verification is never fixable by
// refreshing -- it means either JWT_ACCESS_SECRET here has drifted
// from the API's, or the token was forged. Refreshing on that would
// mint a token this app still can't verify, and Proxy would bounce
// between /api/auth/refresh and itself forever. See proxy.js.
export const TOKEN_VALID = "valid";
export const TOKEN_MISSING = "missing";
export const TOKEN_EXPIRED = "expired";
export const TOKEN_INVALID = "invalid";

/**
 * Real signature verification, unlike a plain payload decode -- this
 * requires JWT_ACCESS_SECRET to exactly match the API's own signing
 * secret (see .env.local.example), a deliberate coupling accepted so
 * Proxy and Server Components can trust `role`/`sub` without an extra
 * round trip to the API to confirm them.
 *
 * Returns `{ status, payload }`:
 *   TOKEN_VALID    -- payload is the verified `{ sub, role, iat, exp }`
 *   TOKEN_MISSING  -- no cookie at all; payload is null
 *   TOKEN_EXPIRED  -- signature checked out, `exp` has passed. payload
 *                     IS included: jose only reaches the expiry check
 *                     after verifying the signature, so these claims
 *                     were genuinely issued by the API and are safe to
 *                     read for *routing* decisions (e.g. where to send
 *                     the user after a refresh). Never treat them as
 *                     authorization -- the token is expired.
 *   TOKEN_INVALID  -- bad signature, malformed, or wrong algorithm.
 *                     payload is null and nothing about the token is
 *                     trustworthy.
 */
export async function verifyAccessToken(token) {
  if (!token) return { status: TOKEN_MISSING, payload: null };

  try {
    const { payload } = await jwtVerify(token, secret);
    return { status: TOKEN_VALID, payload };
  } catch (err) {
    if (err?.code === "ERR_JWT_EXPIRED") {
      // jose attaches the decoded payload to this specific error.
      return { status: TOKEN_EXPIRED, payload: err.payload ?? null };
    }

    // Not logged at all for expiry above -- that's routine, once every
    // 15 minutes per session. A signature failure is genuinely
    // abnormal and worth surfacing, since the overwhelmingly likely
    // cause is a misconfigured JWT_ACCESS_SECRET rather than an attack.
    console.error(
      `Access token failed verification (${err?.code ?? "unknown"}) -- ` +
        "check JWT_ACCESS_SECRET matches the API's signing secret.",
    );
    return { status: TOKEN_INVALID, payload: null };
  }
}
