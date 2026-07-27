import { serverApiRequest } from "@/lib/server-api";
import { assertRole } from "@/lib/navigation";
import CourseOfferingsView from "./CourseOfferingsView";

export default async function CourseOfferingsPage() {
  const user = await serverApiRequest("/api/v1/users/me");
  assertRole(user, "registrar");

  const offerings = await serverApiRequest("/api/v1/course-offerings");
  return <CourseOfferingsView offerings={offerings} />;
}
