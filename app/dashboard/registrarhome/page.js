import { serverApiRequest } from "@/lib/server-api";
import { assertRole } from "@/lib/navigation";
import ModuleHub from "@/components/dashboard/ModuleHub";

export default async function RegistrarHomePage() {
  const user = await serverApiRequest("/api/v1/users/me");
  assertRole(user, "registrar");

  return <ModuleHub user={user} />;
}
