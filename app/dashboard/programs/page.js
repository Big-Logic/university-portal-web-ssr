import { serverApiRequest } from "@/lib/server-api";
import { assertRole } from "@/lib/navigation";
import ProgramsView from "./ProgramsView";

export default async function ProgramsPage() {
  const user = await serverApiRequest("/api/v1/users/me");
  assertRole(user, "registrar");

  const programs = await serverApiRequest("/api/v1/programs");
  return <ProgramsView programs={programs} />;
}
