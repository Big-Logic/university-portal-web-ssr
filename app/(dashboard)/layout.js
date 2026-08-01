import { getCurrentUser } from "@/lib/server-api";
import DashboardShell from "@/components/DashboardShell";

// Server Component, shared by every role-namespaced route (/admin,
// /faculty, /registrar, /student, /account) via this route group --
// (dashboard) doesn't add a URL segment, it's just how these otherwise
// unrelated top-level paths share one layout.
//
// getCurrentUser() was already being called here just to gate access
// -- its result ({ id, role }, read straight off headers Proxy set,
// no network call) is passed down too now, since Sidebar's nav needs
// exactly that and nothing more. This is NOT the same fetch as
// DashboardShell's client-side identity data (full profile --
// fullName/email -- via React Query for the avatar/name/account
// menu): different data, different source, no race between them.
export default async function DashboardLayout({ children }) {
  const user = await getCurrentUser();

  // Passed down for Sidebar's nav (role-gated via navForRole) --
  // everything else identity-related still fetches its own full
  // profile client-side, see the comment above.
  return <DashboardShell user={user}>{children}</DashboardShell>;
}
