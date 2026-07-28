import { apiRequest } from "@/lib/server-api";
import SessionView from "./SessionView";

// Deliberately uses apiRequest (a real, live round trip) instead of
// getCurrentUser's cookie-shortcut -- this page's whole point is
// proving the SSR/httpOnly-cookie model actually works, and a cached
// read wouldn't demonstrate that.
export default async function SessionPage() {
  const user = await apiRequest("/api/v1/users/me");
  return <SessionView user={user} />;
}
