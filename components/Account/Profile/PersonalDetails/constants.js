// Options for the two preference pickers.
//
// Not sample data, and deliberately not in lib/sample-data.js: these
// aren't standing in for an endpoint that will one day supply them.
// They're a short list of the zones and languages this institution
// actually runs in, which is a product decision rather than a record.
//
// The full IANA set is available at runtime
// (Intl.supportedValuesOf("timeZone"), ~400 entries) and was passed
// over twice: a 400-row native select is worse to use than a short
// one, and the list Node returns is not guaranteed to match the
// browser's, which would desync the server render from hydration.
//
// Whatever is stored on the account is merged in by `withCurrent`
// below, so a profile set to a zone outside this list still shows it
// rather than silently displaying someone else's.

export const TIMEZONES = [
  "America/Los_Angeles",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
  "Europe/London",
  "Africa/Lagos",
  "UTC",
];

export const LOCALES = [
  { value: "en-US", label: "English (United States)" },
  { value: "en-GB", label: "English (United Kingdom)" },
  { value: "es-ES", label: "Español" },
  { value: "fr-FR", label: "Français" },
];

/**
 * The stored value first if the list doesn't already carry it, so a
 * select can always show what the record actually holds.
 *
 * A `<select>` whose value matches no option renders as its first
 * option instead -- so without this, opening the form on a profile set
 * to an unlisted zone would display the wrong one, and saving without
 * touching it would quietly overwrite the real value with that.
 */
export function withCurrent(options, current) {
  if (!current || options.some((option) => option.value === current)) {
    return options;
  }
  return [{ value: current, label: current }, ...options];
}

export const TIMEZONE_OPTIONS = TIMEZONES.map((zone) => ({
  value: zone,
  label: zone.replace(/_/g, " "),
}));
