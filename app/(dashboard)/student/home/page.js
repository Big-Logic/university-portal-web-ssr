import { getCurrentUser } from "@/lib/server-api";
import { assertRole } from "@/lib/navigation";
import StudentHomeView from "./StudentHomeView";

export default async function StudentHomePage() {
  const user = await getCurrentUser();
  assertRole(user, "student");

  return <StudentHomeView user={user} />;
}
