import { getCurrentUser, apiRequest } from "@/lib/server-api";
import { assertRole } from "@/lib/navigation";
import CourseOfferingsView from "./CourseOfferingsView";

export default async function CourseOfferingsPage() {
  const user = await getCurrentUser();
  assertRole(user, "registrar");

  const offerings = await apiRequest("/api/v1/course-offerings");
  return <CourseOfferingsView offerings={offerings} />;
}
