import { z } from "zod";

// Matches the backend's loginSchema (auth.validators.js) exactly --
// keeping both in sync means a validation error never surprises the
// user by disagreeing between client and server.
export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

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

// Matches the backend's STAFF_ROLES (users.validators.js) -- "student"
// is deliberately excluded, student accounts are created exclusively
// through /api/v1/students.
export const STAFF_ROLES = ["faculty", "registrar", "finance", "admin"];

// A real calendar date, not just a well-shaped string -- V8 rolls
// "2023-02-30" over into March rather than rejecting it, so round-trip
// it. Mirrors isRealCalendarDate in the backend's
// userProfile.validators.js.
function isRealCalendarDate(value) {
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return false;
  return parsed.toISOString().slice(0, 10) === value;
}

// Mirrors the backend's profileFields (userProfile.validators.js),
// including the max lengths, which are the SQL column widths. The
// backend dropped `full_name` for these parts when the users table was
// reshaped -- a single name field here would now be rejected outright.
//
// Unlike the backend's copy, dateOfBirth stays a "YYYY-MM-DD" string:
// it's about to be JSON, and the server does its own parsing to a Date.
const profileFields = {
  firstName: z.string().trim().min(1, "First name is required").max(100),
  middleName: z.string().trim().max(100).optional(),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  avatarUrl: z.string().url("Enter a valid URL").optional(),
  phone: z.string().trim().min(1).max(30).optional(),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use the format YYYY-MM-DD")
    .refine(isRealCalendarDate, "Enter a real calendar date")
    .optional(),
  timezone: z.string().trim().min(1).max(64).optional(),
  locale: z.string().trim().min(1).max(10).optional(),
};

export const createUserSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  ...profileFields,
  role: z.enum(STAFF_ROLES, { error: `Role must be one of: ${STAFF_ROLES.join(", ")}` }),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(STAFF_ROLES, { error: `Role must be one of: ${STAFF_ROLES.join(", ")}` }),
});
