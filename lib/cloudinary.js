import crypto from "node:crypto";

// Server-only. CLOUDINARY_API_SECRET is the one true secret here and
// it never leaves this process -- the browser gets a signature derived
// from it, never the secret itself. The cloud name and API key are not
// secrets (Cloudinary treats the key as public in browser upload
// flows), but they still ride back in the signature response rather
// than a NEXT_PUBLIC_ variable, so nothing Cloudinary-related is baked
// into the client bundle at build time. Same posture as API_URL.
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

// This deployment's institution folder -- "development" while
// building, a school's own folder in production. One value per
// deployment rather than per request, because that's how the rest of
// the app is already tenanted: one institution runs one copy, the same
// model as APP_NAME in lib/branding.js.
const FOLDER = process.env.CLOUDINARY_FOLDER;

/**
 * One asset per account, forever, inside this institution's folder:
 * `development/avatars/user_12`.
 *
 * Derived from the session's user id and covered by the signature
 * below, which is the security crux of a direct-from-browser upload:
 * the client picks the bytes, never the destination. A tampered
 * public_id doesn't match the signature and Cloudinary refuses it, so
 * nobody can overwrite somebody else's avatar -- and since the
 * institution is part of that id, that holds across tenants too.
 *
 * It also means `overwrite: true` is enough housekeeping -- changing
 * your photo replaces the old object instead of leaving it orphaned,
 * so there's no cleanup job and no delete step to forget.
 */
export function avatarPublicId(userId) {
  return `${FOLDER}/avatars/user_${userId}`;
}

/**
 * The delivered URL carries a `/v<version>/` segment that changes on
 * every overwrite, so a new photo is a new URL and no CDN or browser
 * cache has to be persuaded to let go of the old one. That's why
 * `invalidate` isn't in the signed params: the version bump does the
 * job already.
 */
export function signAvatarUpload(userId) {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET || !FOLDER) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET and CLOUDINARY_FOLDER (see .env.local.example).",
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const publicId = avatarPublicId(userId);

  // Every param the browser will send apart from `file`, `api_key`,
  // `cloud_name`, `resource_type` and `signature` itself has to be
  // signed, and signed in exactly this shape: keys sorted, joined
  // `k=v` with `&`, secret appended, SHA-1. Add a param to the upload
  // in lib/api/avatar.js and it must be added here too, or Cloudinary
  // rejects the whole request.
  //
  // asset_folder AND public_id, which looks redundant and isn't: this
  // account is in Cloudinary's *dynamic* folder mode (confirmed via
  // the Admin API's config?settings=true), where the two are
  // decoupled. asset_folder is where the asset files itself in the
  // Media Library tree; public_id is its identity and what appears in
  // the delivery URL. Setting only asset_folder would leave every
  // institution's `avatars/user_12` colliding on one public_id;
  // setting only public_id would put the asset in the right URL but
  // the root of the folder tree.
  //
  // Worth knowing if this ever moves to a fixed-folder account: there,
  // `folder` prefixes the public_id, so passing both would nest it
  // twice (development/development/avatars/...).
  const params = {
    asset_folder: FOLDER,
    overwrite: "true",
    public_id: publicId,
    timestamp: String(timestamp),
  };

  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  const signature = crypto
    .createHash("sha1")
    .update(toSign + API_SECRET)
    .digest("hex");

  return {
    cloudName: CLOUD_NAME,
    apiKey: API_KEY,
    timestamp,
    publicId,
    assetFolder: FOLDER,
    signature,
    // Cloudinary honours a signed upload for an hour; ours is spent
    // within seconds. Not returned, because nothing in the browser has
    // anything to do with the number.
    uploadUrl: `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
  };
}
