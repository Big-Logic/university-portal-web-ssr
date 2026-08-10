// What the file picker accepts, in one place so the `accept`
// attribute, the guard that runs on the chosen file, and the message
// the person reads can't drift apart.
//
// A browser-side check only, and deliberately so: it exists to fail
// fast, before a 20MB photo is pushed over a phone connection to be
// rejected at the far end. Cloudinary enforces its own limits on the
// upload itself, which is the check that actually counts -- the
// signature we mint says nothing about size or type.

export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// `accept` wants a comma-joined list, and it's only a filter on the
// picker's dialogue -- a determined file drop can still hand us
// anything, which is what validateAvatarFile is for.
export const ACCEPT_ATTRIBUTE = ACCEPTED_TYPES.join(",");

const MAX_MB = 5;
export const MAX_BYTES = MAX_MB * 1024 * 1024;

// Prose, not a type list: "JPEG, PNG or WebP" is what someone can act
// on; "image/webp" is what a machine wants.
const TYPE_NAMES = "JPEG, PNG or WebP";

/** Returns a message to show, or null when the file is fine. */
export function validateAvatarFile(file) {
  if (!file) return "No file was selected.";

  if (!ACCEPTED_TYPES.includes(file.type)) {
    return `That file isn't a supported image. Choose a ${TYPE_NAMES}.`;
  }

  if (file.size > MAX_BYTES) {
    return `That photo is larger than ${MAX_MB}MB. Choose a smaller one.`;
  }

  return null;
}
