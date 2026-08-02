import { getCurrentUser } from "@/lib/api/current-user";
import { assertRole } from "@/lib/navigation";
import StudentHomeView from "./StudentHomeView";

export default async function StudentHomePage() {
  const user = await getCurrentUser();
  assertRole(user, "student");

  return <StudentHomeView />;
}
