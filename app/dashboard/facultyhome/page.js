import { serverApiRequest } from "@/lib/server-api";
import { assertRole } from "@/lib/navigation";
import ModuleHub from "@/components/dashboard/ModuleHub";

export default async function FacultyHomePage() {
  const user = await serverApiRequest("/api/v1/users/me");
  assertRole(user, "faculty");

  return <ModuleHub user={user} />;
}
