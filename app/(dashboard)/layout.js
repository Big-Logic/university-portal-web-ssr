import { getCurrentUser } from "@/lib/server-api";
import DashboardShell from "@/components/dashboard/DashboardShell";

// Server Component, shared by every role-namespaced route (/admin,
// /faculty, /registrar, /student, /account) via this route group --
// (dashboard) doesn't add a URL segment, it's just how these otherwise
// unrelated top-level paths share one layout. Only `user` (plain,
// serializable data) crosses into the Client Component below -- the
// nav list is derived from user.role *inside* DashboardShell instead
// of being built here and passed down, because its icon fields are
// React components, and functions can't be passed as props across the
// server/client boundary.
//
// Uses apiRequest (a real fetch), not getCurrentUser -- the shell
// displays fullName/email, and those were never in the access token
// to begin with (it only carries { sub, role }), so there's nothing
// for a token-derived helper to read them from.
export default async function DashboardLayout({ children }) {
  const user = await getCurrentUser();

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
