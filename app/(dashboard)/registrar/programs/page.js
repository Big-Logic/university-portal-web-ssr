import { getCurrentUser, apiRequest } from "@/lib/server-api";
import { assertRole } from "@/lib/navigation";
import ProgramsView from "./ProgramsView";

export default async function ProgramsPage() {
  const user = await getCurrentUser();
  assertRole(user, "registrar");

  const programs = await apiRequest("/api/v1/programs");
  return <ProgramsView programs={programs} />;
}
