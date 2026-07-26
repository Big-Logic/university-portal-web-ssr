import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_COOKIE } from "@/lib/session";

// Server Component, no client-side redirect flash. Middleware's
// matcher covers /login and /dashboard/* but not / itself, so this
// route does its own (much simpler) check directly -- just enough to
// pick a direction, not a full expiry/refresh decision the way
// Middleware does for the routes that actually render protected content.
export default async function RootPage() {
  const cookieStore = await cookies();
  const hasSession = Boolean(cookieStore.get(ACCESS_COOKIE)?.value);
  redirect(hasSession ? "/dashboard" : "/login");
}
