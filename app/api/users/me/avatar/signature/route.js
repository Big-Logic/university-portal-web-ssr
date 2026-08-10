import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_COOKIE } from "@/lib/auth/session";
import { verifyAccessToken, TOKEN_VALID } from "@/lib/auth/jwt";
import { authFailureBody } from "@/lib/api/server";
import { signAvatarUpload } from "@/lib/cloudinary";

// Mints a one-shot Cloudinary upload signature for the caller's own
// avatar. The browser then posts the file straight to Cloudinary --
// the only browser-to-third-party call in this variant, and the reason
// it's acceptable is that it carries no credential of ours: the
// signature is scoped to one public_id, and that public_id is chosen
// here from the verified session, never sent up by the client.
//
// The token is verified in this handler rather than read via
// getCurrentUser(), which would always fail here: that reads the
// x-user-id header Proxy attaches, and `/api/*` is outside proxy.js's
// matcher, so Proxy never runs for this route. This is the same check
// serverRequest performs for the calls it proxies.
//
// POST, not GET, for two reasons: it mints a credential, so it should
// never land in a cache or a browser history entry, and every response
// is different even though nothing on the server changed.
export async function POST() {
  const cookieStore = await cookies();
  const { status, payload } = await verifyAccessToken(
    cookieStore.get(ACCESS_COOKIE)?.value,
  );

  if (status !== TOKEN_VALID) {
    // Same codes serverRequest returns, so a signature requested with
    // a merely-expired token gets refreshed and retried by
    // lib/api/client.js rather than logging the user out mid-upload.
    return NextResponse.json(authFailureBody(status), { status: 401 });
  }

  try {
    return NextResponse.json(signAvatarUpload(payload.sub));
  } catch (err) {
    // The only thing signAvatarUpload throws for is missing
    // configuration, which is an operator error rather than anything
    // the person uploading did -- so it's logged in full here and
    // described plainly to them.
    console.error("Avatar upload signature failed:", err);

    return NextResponse.json(
      {
        error: {
          code: "UPLOADS_UNAVAILABLE",
          message: "Photo uploads aren't available right now.",
        },
      },
      { status: 503 },
    );
  }
}
