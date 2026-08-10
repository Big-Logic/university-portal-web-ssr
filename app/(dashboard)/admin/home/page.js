import { getCurrentUser } from "@/lib/auth/currentUser";
import { assertRole } from "@/lib/navigation";
import ModuleHub from "@/components/dashboard/ModuleHub";

export default async function AdminHomePage() {
  const user = await getCurrentUser();
  assertRole(user, "admin");

  return <ModuleHub />;
}
