// Cookie names shared between the Route Handlers (which set/clear
// them) and middleware.js (which reads them). Centralized here so
// they can't drift out of sync between the two.
export const ACCESS_COOKIE = "bc_access_token";
export const REFRESH_COOKIE = "bc_refresh_token";

// httpOnly: not readable by client JS at all (the whole point of this
// version) -- an XSS payload can't read these out and exfiltrate them
// for reuse later. It does NOT stop an XSS script from riding the
// current session while the user is on the page; that's a different
// problem this doesn't solve.
//
// sameSite: "lax" rather than "strict" -- strict would also block the
// cookie being sent when a user arrives via an external link (e.g.
// clicking a link to the portal from an email), which is a real
// student-facing flow worth not breaking.
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};
