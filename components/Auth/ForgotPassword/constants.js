// Long enough that a double-click can't spend two tokens, short enough
// that someone whose mail genuinely didn't arrive isn't stuck waiting.
// Every send invalidates nothing -- the API issues an additional token
// rather than rotating the last one -- so this is a courtesy, not a
// correctness guard.
export const RESEND_COOLDOWN_SECONDS = 30;

// RESET_TOKEN_TTL_MINUTES in the API's auth.forgotPassword.js. If that
// changes, this copy is wrong and nothing will fail to tell us.
//
// Deliberately a second copy of PasswordReset's constant of the same
// name rather than an import across folders: the two screens quote the
// same policy, but neither owns the other's copy, and a shared module
// would only be a place for one of them to change it out from under the
// other.
export const TOKEN_TTL_COPY = "30 minutes";
