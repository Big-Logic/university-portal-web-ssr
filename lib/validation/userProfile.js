import { z } from "zod";

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
//
// Spread into whichever schema needs them rather than being a schema
// itself, because they're shared field definitions -- the same set the
// backend keeps in its own module for the same reason.
export const profileFields = {
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
