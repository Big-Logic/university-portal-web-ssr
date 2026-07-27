import { serverApiRequest } from "@/lib/server-api";
import { assertRole } from "@/lib/navigation";
import CoursesView from "./CoursesView";

export default async function CoursesPage() {
  const user = await serverApiRequest("/api/v1/users/me");
  assertRole(user, "registrar");

  const courses = await serverApiRequest("/api/v1/courses");
  return <CoursesView courses={courses} />;
}
