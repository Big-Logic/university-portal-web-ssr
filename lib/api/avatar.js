import { clientRequest } from "./client";

// The third member of this folder, and the odd one out: server.js is
// server-to-server, client.js is browser -> our own Route Handlers,
// and this is the one browser -> third-party call in the app.
//
// It's here rather than buried in the component because the exception
// deserves to be visible from the same place as the rule it breaks.
// What makes it acceptable: no credential of ours crosses to
// Cloudinary that wasn't minted for this one upload, and the
// destination (`public_id`) is chosen by our server from the verified
// session, not by anything the browser can edit.

const SIGNATURE_ENDPOINT = "/api/users/me/avatar/signature";

/**
 * Uploads `file` and resolves to the hosted URL. Throws with a message
 * fit to show, which is the contract every caller of clientRequest
 * already expects.
 *
 * Two hops, in this order:
 *   1. our Route Handler, same-origin and cookie-authenticated, for a
 *      signature scoped to this account's avatar;
 *   2. Cloudinary, with the file and that signature.
 *
 * Deliberately not wrapped in a React Query mutation: the PATCH that
 * stores the resulting URL already is one (it's shared with the
 * details form), and making this a second mutation would give the card
 * two competing pending states for what is, to the person using it,
 * one action.
 */
export async function uploadAvatar(file) {
  const { apiKey, timestamp, publicId, assetFolder, signature, uploadUrl } =
    await clientRequest(SIGNATURE_ENDPOINT, { method: "POST" });

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", apiKey);
  form.append("timestamp", timestamp);
  form.append("public_id", publicId);
  // Where it files itself in the Media Library, as opposed to
  // public_id, which is its identity -- separate concerns on a
  // dynamic-folder account. Both come from the server; neither is
  // chosen here.
  form.append("asset_folder", assetFolder);
  // Every field here apart from `file`, `api_key` and `signature` is
  // covered by the hash, so adding one means adding it to
  // signAvatarUpload too.
  form.append("overwrite", "true");
  form.append("signature", signature);

  let response;
  try {
    // No Content-Type header set on purpose: fetch derives the
    // multipart boundary itself, and setting it by hand produces a
    // body Cloudinary can't parse.
    response = await fetch(uploadUrl, { method: "POST", body: form });
  } catch {
    throw new Error(
      "Couldn't reach the image host. Check your connection and try again.",
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // Cloudinary's own message is usually specific and safe to show
    // ("File size too large", "Invalid image file"). A refused
    // signature lands here too, which would mean our clock or our
    // signed params drifted -- worth logging rather than only toasting.
    console.error("Cloudinary upload failed:", response.status, data);

    throw new Error(
      data?.error?.message || "That photo couldn't be uploaded. Try another.",
    );
  }

  return data.secure_url;
}
