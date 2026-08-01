import { getCurrentUser } from "@/lib/server-api";
import { assertRole } from "@/lib/navigation";
import ModuleHub from "@/components/dashboard/ModuleHub";

export default async function RegistrarHomePage() {
  const user = await getCurrentUser();
  assertRole(user, "registrar");

  return <ModuleHub user={user} />;
}
