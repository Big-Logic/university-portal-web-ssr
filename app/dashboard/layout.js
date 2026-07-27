import { serverApiRequest } from "@/lib/server-api";
import DashboardShell from "@/components/dashboard/DashboardShell";

// Server Component, shared by every route under /dashboard. Only
// `user` (plain, serializable data) crosses into the Client Component
// below -- the nav list is derived from user.role *inside*
// DashboardShell instead of being built here and passed down, because
// its icon fields are React components, and functions can't be passed
// as props across the server/client boundary.
export default async function DashboardLayout({ children }) {
  const user = await serverApiRequest("/api/v1/users/me");

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
