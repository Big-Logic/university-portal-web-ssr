import { getCurrentUser } from "@/lib/api/current-user";
import { assertRole } from "@/lib/navigation";
import ModuleHub from "@/components/dashboard/ModuleHub";

export default async function AdminHomePage() {
  const user = await getCurrentUser();
  assertRole(user, "admin");

  return <ModuleHub />;
}
