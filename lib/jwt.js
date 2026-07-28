import { jwtVerify } from "jose";

// `jose` (not `jsonwebtoken`) specifically because this needs to run
// in Proxy, which executes in the Edge runtime -- jsonwebtoken relies
// on Node's `crypto` module, which isn't available there.
const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);

/**
 * Real signature verification, unlike a plain payload decode -- this
 * requires JWT_ACCESS_SECRET to exactly match the API's own signing
 * secret (see .env.local.example), a deliberate coupling accepted so
 * Proxy and Server Components can trust `role`/`sub` without an extra
 * round trip to the API to confirm them. Returns the verified payload
 * (`{ sub, role, iat, exp }`), or null if the token is missing,
 * expired, malformed, or doesn't match the secret -- jose checks
 * expiry as part of verification, so there's no separate isExpired()
 * step needed.
 */
export async function verifyAccessToken(token) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}
