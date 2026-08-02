import { getCurrentUser } from "@/lib/api/current-user";
import { assertRole } from "@/lib/navigation";
import ModuleHub from "@/components/dashboard/ModuleHub";

export default async function FacultyHomePage() {
  const user = await getCurrentUser();
  assertRole(user, "faculty");

  return <ModuleHub user={user} />;
}
