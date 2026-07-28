import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_COOKIE } from "@/lib/session";
import { verifyAccessToken } from "@/lib/jwt";
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
  const payload = await verifyAccessToken(accessToken);

  if (payload) {
    redirect(homePathForRole(payload.role));
  }

  redirect("/login");
}
