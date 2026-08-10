import { z } from "zod";
import { profileFields } from "./userProfile";

// An empty input is the absence of a value, not a value of "". Without
// this every optional field would arrive as "" and fail its own
// `.min(1)` the moment someone tabbed through it, and `avatarUrl`
// would fail `.url()`. Undefined instead means the key is dropped by
// JSON.stringify and never reaches the API.
//
// Note what that costs: because the API's profile fields are
// `.optional()` and not `.nullable()` (userProfile.validators.js),
// there is no value this endpoint accepts that CLEARS a column.
// Emptying a phone number here therefore leaves the stored one alone
// rather than erasing it. Clearing needs the API to accept null first.
function blankToUndefined(field) {
  return z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    field,
  );
}

// The self-service subset of the API's updateUserSchema: every profile
// column a person may edit about themselves. email, role and status
// are absent because they're administrator-owned -- each has its own
// endpoint, and the profile screen shows them read-only.
//
// firstName/lastName keep their required-ness from profileFields; the
// rest are optional, so a partial save sends only what's filled in.
export const updateProfileSchema = z.object({
  firstName: profileFields.firstName,
  middleName: blankToUndefined(profileFields.middleName),
  lastName: profileFields.lastName,
  phone: blankToUndefined(profileFields.phone),
  dateOfBirth: blankToUndefined(profileFields.dateOfBirth),
  timezone: blankToUndefined(profileFields.timezone),
  locale: blankToUndefined(profileFields.locale),
});

// There is no avatar schema here: the identity card sends a file, not
// a URL, and the URL it eventually PATCHes came from Cloudinary rather
// than from anything typed. What needs checking on that path is the
// file itself -- see lib/validation/avatarFile.js.
