import { getCurrentUser } from "@/lib/auth/currentUser";
import { assertRole } from "@/lib/navigation";
import StudentHomeView from "./StudentHomeView";

export default async function StudentHomePage() {
  const user = await getCurrentUser();
  assertRole(user, "student");

  return <StudentHomeView />;
}
