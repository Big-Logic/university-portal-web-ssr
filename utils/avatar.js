// Cloudinary delivery URLs carry their transformations in the path,
// between `/upload/` and the version segment. Inserting them at render
// time rather than baking them in at upload time is what lets the
// 34px header chip and the 72px profile card ask for different sizes
// from the same stored URL -- and what lets `f_auto` do its job, which
// it can't if the format is decided once, at upload, with no browser
// to negotiate with.

// Anything that isn't one of ours is returned untouched. Photos set
// through the URL field this feature replaced are still in the
// database and still have to render.
const CLOUDINARY_UPLOAD_PATH = "/image/upload/";

function isCloudinaryUrl(url) {
  return (
    url.startsWith("https://res.cloudinary.com/") &&
    url.includes(CLOUDINARY_UPLOAD_PATH)
  );
}

/**
 * `avatarSrc(user.avatarUrl, 72)` -> a square, face-cropped, 144px
 * (2x) version of that photo in whatever format the browser prefers.
 *
 * - c_thumb,g_face crops to the face rather than the middle, which is
 *   the difference between a portrait and a picture of someone's
 *   collar.
 * - The 2x is for retina: a 72px circle drawn from a 72px source is
 *   visibly soft on the machines most of this app is used on.
 * - f_auto,q_auto let Cloudinary pick AVIF/WebP and a quality level,
 *   which is most of why a 4MB upload arrives as a few KB.
 */
export function avatarSrc(url, size) {
  if (!url || !isCloudinaryUrl(url)) return url;

  const dimension = size * 2;
  const transformation = `c_thumb,g_face,w_${dimension},h_${dimension},f_auto,q_auto`;

  return url.replace(
    CLOUDINARY_UPLOAD_PATH,
    `${CLOUDINARY_UPLOAD_PATH}${transformation}/`,
  );
}
