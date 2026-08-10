import { z } from "zod";

// Matches the backend's forgotPasswordSchema (auth.validators.js),
// which only checks that the address is well-formed -- whether it
// belongs to a real account is deliberately never revealed. The
// messages here are ours: a request this catches never reaches the
// server, so they only ever surface client-side.
//
// Piped rather than `.string().email()` so an empty box and a
// malformed address get their own messages -- and because ZodString's
// own `.email()` is deprecated in zod 4 in favour of the top-level
// `z.email()`, which can't be chained after `.min()` directly.
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Enter your email address.")
    .pipe(
      z.email(
        "That doesn't look like an email address. Check it and try again.",
      ),
    ),
});
