import { redirect } from "next/navigation";
import { serverApiRequest } from "@/lib/server-api";
import { homePathForRole } from "@/lib/navigation";

// Bare /dashboard has no content of its own -- it exists only to send
// each role to its own home module (/dashboard/adminhome,
// /dashboard/home, etc.) so every other link into "the dashboard"
// (e.g. a bookmarked /dashboard URL) still lands somewhere useful.
export default async function DashboardPage() {
  const user = await serverApiRequest("/api/v1/users/me");
  redirect(homePathForRole(user.role));
}
