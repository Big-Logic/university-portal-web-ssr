import { getCurrentUser } from "@/lib/server-api";
import DashboardShell from "@/components/dashboard/DashboardShell";

// Server Component, shared by every role-namespaced route (/admin,
// /faculty, /registrar, /student, /account) via this route group --
// (dashboard) doesn't add a URL segment, it's just how these otherwise
// unrelated top-level paths share one layout. No server-side fetch
// here: DashboardShell fetches its own identity data client-side (via
// React Query, see its own file) instead of receiving `user` as a
// prop, so this layout has nothing left to do but render the shell
// around whichever page is active.
export default async function DashboardLayout({ children }) {
  await getCurrentUser(); // ensure the user is logged in before rendering the shell

  return <DashboardShell>{children}</DashboardShell>;
}
