// The single entry point for every browser -> same-origin Route
// Handler call. Throws on failure rather than returning an error
// value, because that's the contract React Query's `queryFn`/
// `mutationFn` expect (throw = error state, resolve = success state).
//
// It also owns reactive token refresh for the whole app -- see
// withRefreshLock below for why that lives here and not on the server.

const REFRESH_ENDPOINT = "/api/auth/refresh";
const REFRESH_LOCK = "bc-token-refresh";

// A hung refresh would hold the cross-tab lock below until the tab is
// closed, blocking every other tab's retry behind it. The timeout
// guarantees the lock is always released.
const REFRESH_TIMEOUT_MS = 10_000;

// Per-tab dedup: concurrent 401s in this tab collapse onto one refresh.
// A plain module-level singleton is safe here precisely because this is
// the browser -- a JS context belongs to exactly one user, so there's
// no risk of handing one session's token to another. (The same pattern
// on the server would need keying, since module scope there is shared
// by every request the process serves.)
let inFlightRefresh = null;

// Cross-tab dedup. The API rotates refresh tokens on every use with no
// grace period, so if two tabs' access tokens expire together and both
// POST /api/auth/refresh, the second spends a token the first already
// revoked -- and that tab gets logged out despite a perfectly live
// session. The Web Lock serializes them: the second tab runs only
// after the first has committed its new cookie, so it rotates the
// *current* token rather than a dead one.
//
// Serialized, not skipped: the waiting tab still performs its own
// rotation. That's one extra round trip in a rare race, which is worth
// far less than the machinery required to detect that a sibling tab
// already refreshed (the cookies are httpOnly, so there's nothing
// readable here to check).
//
// Falls back to running unlocked where Web Locks is unavailable
// (notably non-secure contexts), which just means tabs can race there
// exactly as they would with no lock at all.
function withRefreshLock(fn) {
  if (typeof navigator !== "undefined" && navigator.locks?.request) {
    return navigator.locks.request(REFRESH_LOCK, fn);
  }
  return fn();
}

// Resolves true if the refresh succeeded, false otherwise. Never
// throws -- callers branch on the boolean.
//
// NOTE false conflates two different situations: the API refusing the
// refresh token (session really is over) and never getting an answer
// at all (offline, timeout). The caller treats both as "log out", so a
// network blip mid-refresh signs the user out even though their tokens
// may still be perfectly valid. Splitting them would mean returning a
// tri-state here and only redirecting on a definite refusal.
function refreshSession() {
  if (inFlightRefresh) return inFlightRefresh;

  inFlightRefresh = withRefreshLock(async () => {
    try {
      const res = await fetch(REFRESH_ENDPOINT, {
        method: "POST",
        signal: AbortSignal.timeout(REFRESH_TIMEOUT_MS),
      });
      // The endpoint clears both cookies itself when it refuses, so a
      // false here usually means they're already gone.
      return res.ok;
    } catch {
      // Offline or timed out -- no response, so nothing was cleared.
      return false;
    }
  }).finally(() => {
    inFlightRefresh = null;
  });

  return inFlightRefresh;
}

// The auth endpoints must never trigger a refresh-and-retry: a 401
// from /api/auth/login means bad credentials, and refreshing on
// /api/auth/refresh itself would recurse.
function isAuthEndpoint(path) {
  return path.startsWith("/api/auth/");
}

export async function clientRequest(
  path,
  {
    method = "GET",
    body,
    fallbackMessage = "Request failed! Connect to the internet and try again!",
  } = {},
) {
  const send = () =>
    fetch(path, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

  let res;
  try {
    res = await send();
  } catch (err) {
    throw new Error(
      "Couldn't reach the server. Check your connection and try again.",
    );
  }

  // Exactly one refresh-and-retry, never a loop: if the retry 401s
  // again, stop rather than refreshing a second time.
  if (res.status === 401 && !isAuthEndpoint(path)) {
    // Safe to consume the body here: every path out of this block
    // either replaces `res` with a fresh response or throws.
    const authBody = await res.json().catch(() => null);

    // INVALID_TOKEN (see lib/api/server.js) means the signature didn't
    // verify -- a freshly-minted token would fail the identical check,
    // so refreshing would spend a refresh token to land in the same
    // place. Missing and expired tokens, by contrast, are the ordinary
    // 15-minute-idle case and refresh cleanly.
    const worthRefreshing = authBody?.error?.code !== "INVALID_TOKEN";

    const renewed = worthRefreshing ? await refreshSession() : false;

    if (renewed) {
      try {
        res = await send();
      } catch {
        throw new Error(
          "Couldn't reach the server. Check your connection and try again.",
        );
      }
    }

    if (!renewed || res.status === 401) {
      // Full navigation, not router.push -- Proxy has to see a fresh
      // request to re-evaluate the cookies before deciding where to
      // send us, the same reasoning as login and logout.
      window.location.href = "/login";

      // Throwing here isn't what makes this an error -- falling through
      // would hit `if (!res.ok) throw` below anyway, since res is still
      // a 401. It's for the message: the tail can no longer read a body
      // (consumed above), so it would fall back to the generic
      // fallbackMessage. These say something true about *why* in the
      // moment before the navigation above takes effect.
      throw new Error(
        worthRefreshing
          ? "Your session has expired. Please log in again."
          : "Your session is no longer valid. Please log in again.",
      );
    }
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error?.message || fallbackMessage);
  }

  return data;
}
