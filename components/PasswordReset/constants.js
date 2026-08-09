// RESET_TOKEN_TTL_MINUTES in the API's auth.forgotPassword.js. The
// design showed a live countdown of the time left on this particular
// link, which we can't honour -- the token is opaque to us and the API
// hands back no expiry -- so this states the policy instead of
// inventing a number.
//
// Lives here rather than in either component because both the form and
// the dead-link panel quote it, and a figure that drifted between the
// two would be worse than one that's merely out of date.
export const TOKEN_TTL_COPY = "30 minutes";
