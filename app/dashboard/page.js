import { serverApiRequest } from "@/lib/server-api";
import DashboardView from "./DashboardView";

// No "use client" here -- this runs on the server. The fetch below
// happens server-to-server against the Express API, using the
// httpOnly cookie Middleware guaranteed was fresh before this ever
// ran. There's no client-side "verify the token" step to demonstrate
// separately, the way the cookie-free version had one: this page
// simply could not have rendered if that fetch had failed
// (serverApiRequest redirects to /login on a rejected token instead
// of returning an error to display). Successfully reaching this
// render IS the proof, not a follow-up check.
export default async function DashboardPage() {
  const user = await serverApiRequest("/api/v1/users/me");
  return <DashboardView user={user} />;
}
