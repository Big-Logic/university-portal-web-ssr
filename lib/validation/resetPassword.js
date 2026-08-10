import { z } from "zod";

// The token carried by a reset link: 32 random bytes, hex-encoded
// (crypto.randomBytes(32).toString("hex") in the API's
// utils/resetToken.js). Checked only to tell a truncated or mangled
// link apart from a plausible one before spending a round trip -- the
// API stores the hash, so it alone can say whether a well-formed token
// is actually live.
export const RESET_TOKEN_PATTERN = /^[0-9a-f]{64}$/;

// Deliberately STRICTER than the backend, which asks only for 8
// characters (resetPasswordSchema in auth.validators.js). These three
// rules and the strength meter that reads them come from the design:
// they're a decision about what we ask people to choose, not a mirror
// of what the API will accept. The divergence runs in the safe
// direction -- everything accepted here the API accepts too -- but it
// does mean an 8-character password is refused at this form and would
// have gone through against the API directly.
//
// Exported as data, not baked into the schema, because the form
// renders the same list as a live checklist. One definition, so a rule
// can't be enforced without being shown or shown without being enforced.
export const PASSWORD_RULES = [
  {
    id: "length",
    label: "At least 10 characters",
    test: (value) => value.length >= 10,
  },
  {
    id: "case",
    label: "An uppercase and a lowercase letter",
    test: (value) => /[a-z]/.test(value) && /[A-Z]/.test(value),
  },
  {
    id: "variety",
    label: "A number or symbol",
    test: (value) => /[0-9\W_]/.test(value),
  },
];

// `token` is deliberately absent: it comes from the URL, not the form,
// and is merged in at submit. confirmPassword never leaves the browser
// -- there's nothing for the API to do with it.
export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, "Enter a new password.")
      .refine(
        (value) => PASSWORD_RULES.every((rule) => rule.test(value)),
        "That password doesn't meet all the requirements below yet.",
      ),
    confirmPassword: z.string().min(1, "Re-enter your new password."),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Both passwords must match.",
    path: ["confirmPassword"],
  });
