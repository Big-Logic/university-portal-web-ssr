import { serverApiRequest } from "@/lib/server-api";
import { assertRole } from "@/lib/navigation";
import MyTeachingView from "./MyTeachingView";

export default async function MyTeachingPage() {
  const user = await serverApiRequest("/api/v1/users/me");
  assertRole(user, "faculty");

  // course_offerings.instructor_id is a foreign key straight to
  // users.id, so "my" offerings is just this filter -- no separate
  // instructor/faculty id to look up first.
  const offerings = await serverApiRequest(`/api/v1/course-offerings?instructor_id=${user.id}`);
  return <MyTeachingView offerings={offerings} />;
}
