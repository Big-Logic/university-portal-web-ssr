// The API returns a name as its parts -- firstName/middleName/lastName
// -- and deliberately composes no display string of its own ("no
// derived display string; composing one is the client's call", see
// utils/userProfile.js in the API repo). This module is that call,
// made once, so the chrome and every screen that shows a person's
// name can't drift apart on how it's assembled.

// Roughly what fits the sidebar identity chip (13.5px bold, sharing a
// ~240px rail with a 34px avatar) before it starts pushing on the
// layout. A character budget is a proxy for a pixel one -- "WWWW" is
// far wider than "iiii" in a proportional face -- so treat this as a
// guard against runaway names, not as precise fitting. CSS
// `text-overflow: ellipsis` is what handles the pixel-level case.
const DEFAULT_MAX_LENGTH = 20;

// "Nkemdirim" -> "N.". Takes the first letter of the whole field, so a
// double middle name ("Kofi Mensah") abbreviates to "K." rather than
// "K. M." -- and one that's already an initial ("N.") survives
// unchanged instead of picking up a second period.
//
// Spread rather than charAt/[0] so an astral-plane first letter isn't
// sliced in half mid-surrogate-pair.
function middleInitial(middleName) {
  const trimmed = middleName?.trim();
  if (!trimmed) return null;
  return `${[...trimmed][0].toUpperCase()}.`;
}

// One character over budget, so the result never exceeds maxLength --
// "…" is a single character, not three. trimEnd keeps a cut that lands
// on a space from reading as "Alfred …".
function truncate(value, maxLength) {
  if (!maxLength || value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
}

/**
 * "Alfred N. Ngwayah" -- first name, middle initial if there is one,
 * last name.
 *
 * Capped at `maxLength` characters, ellipsis included. The middle
 * initial is part of what gets capped rather than something dropped to
 * make room, so a long name clips at the end and keeps the same shape
 * as a short one. Pass `maxLength: 0` to opt out of capping.
 *
 * Tolerates a missing or partial user by joining whatever is present
 * instead of rendering "undefined". Callers already gate on the user
 * existing at all, so that's a floor, not the expected path.
 */
export function displayName(user, { maxLength = DEFAULT_MAX_LENGTH } = {}) {
  if (!user) return "";

  const first = user.firstName?.trim();
  const last = user.lastName?.trim();
  const initial = middleInitial(user.middleName);

  return truncate([first, initial, last].filter(Boolean).join(" "), maxLength);
}
