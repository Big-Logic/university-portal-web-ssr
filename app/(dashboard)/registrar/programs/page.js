import { getCurrentUser } from "@/lib/server-api";
import { assertRole } from "@/lib/navigation";
import ProgramsView from "./ProgramsView";

export default async function ProgramsPage() {
  const user = await getCurrentUser();
  assertRole(user, "registrar");

  return <ProgramsView />;
}
