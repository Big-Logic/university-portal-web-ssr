import { getCurrentUser, apiRequest } from "@/lib/server-api";
import { assertRole } from "@/lib/navigation";
import CoursesView from "./CoursesView";

export default async function CoursesPage() {
  const user = await getCurrentUser();
  assertRole(user, "registrar");

  const courses = await apiRequest("/api/v1/courses");
  return <CoursesView courses={courses} />;
}
