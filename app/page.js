import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_COOKIE } from "@/lib/session";
import { verifyAccessToken, TOKEN_VALID } from "@/lib/jwt";
import { homePathForRole } from "@/lib/navigation";

// Server Component, no client-side redirect flash. Proxy's matcher
// covers /login and each role prefix (/admin, /faculty, etc.) but not
// / itself, so this route does its own (much simpler) check directly
// -- just enough to verify the token and pick a direction, not the
// full refresh-redirect dance Proxy does for the routes that actually
// render protected content.
export default async function RootPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
  const { status, payload } = await verifyAccessToken(accessToken);

  // Only TOKEN_VALID routes onward -- expired or invalid both fall
  // through to /login, where Proxy takes over and decides whether a
  // refresh is warranted.
  if (status === TOKEN_VALID) {
    redirect(homePathForRole(payload.role));
  }

  redirect("/login");
}
