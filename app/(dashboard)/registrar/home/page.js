import { getCurrentUser } from "@/lib/server-api";
import { assertRole } from "@/lib/navigation";
import ModuleHub from "@/components/dashboard/ModuleHub";

// Uses apiRequest, not getCurrentUser -- ModuleHub's greeting needs
// fullName, which was never in the access token.
export default async function RegistrarHomePage() {
  const user = await getCurrentUser();
  assertRole(user, "registrar");

  return <ModuleHub user={user} />;
}
