// Display formatting for the timestamps the API hands back
// (createdAt/updatedAt/lastLoginAt as ISO datetimes, dateOfBirth as a
// plain "YYYY-MM-DD" string).
//
// Locale and time zone are always passed explicitly, never left to the
// environment, and that's load-bearing rather than fussy: these render
// inside Client Components that are server-rendered first, so a format
// that reads the machine's locale would produce one string in Node and
// a different one in the browser -- a hydration mismatch, and a date
// that visibly changes after the page settles. Fixing both inputs
// means the two passes agree by construction.
//
// The time zone therefore has to come from data. Callers pass the
// account's own `timezone` (a profile column), so a person sees their
// timestamps where they actually happened; UTC is the fallback for a
// profile that hasn't set one.

const LOCALE = "en-US";

function toDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

// `timeZone || "UTC"` rather than a default parameter, which only
// covers undefined: an account with no zone set hands us null, and
// Intl coerces that to the string "null" and throws RangeError. UTC is
// also the right fallback for a date-only value ("YYYY-MM-DD" parses
// as UTC midnight, so rendering it in a behind-UTC zone would show the
// day before -- a birthday off by one).
function format(value, options, { timeZone } = {}) {
  const date = toDate(value);
  if (!date) return null;

  return new Intl.DateTimeFormat(LOCALE, {
    ...options,
    timeZone: timeZone || "UTC",
  }).format(date);
}

/** "March 2, 2021" */
export function formatDate(value, opts) {
  return format(value, { year: "numeric", month: "long", day: "numeric" }, opts);
}

/** "March 2021" -- for spans of membership, where the day is noise. */
export function formatMonthYear(value, opts) {
  return format(value, { year: "numeric", month: "long" }, opts);
}

/** "March 2, 2021 at 8:14 AM" */
export function formatDateTime(value, opts) {
  return format(
    value,
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    },
    opts,
  );
}
