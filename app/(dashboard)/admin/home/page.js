import { apiRequest } from "@/lib/server-api";
import { assertRole } from "@/lib/navigation";
import ModuleHub from "@/components/dashboard/ModuleHub";

// Uses apiRequest, not getCurrentUser -- ModuleHub's greeting needs
// fullName, which was never in the access token.
export default async function AdminHomePage() {
  const user = await apiRequest("/api/v1/users/me");
  assertRole(user, "admin");

  return <ModuleHub user={user} />;
}
