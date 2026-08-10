import { getCurrentUser } from "@/lib/auth/currentUser";
import { assertRole } from "@/lib/navigation";
import ModuleHub from "@/components/dashboard/ModuleHub";

export default async function FacultyHomePage() {
  const user = await getCurrentUser();
  assertRole(user, "faculty");

  return <ModuleHub user={user} />;
}
