import { getCurrentUser } from "@/lib/api/current-user";
import { assertRole } from "@/lib/navigation";
import CourseOfferingsView from "./CourseOfferingsView";

export default async function CourseOfferingsPage() {
  const user = await getCurrentUser();
  assertRole(user, "registrar");

  return <CourseOfferingsView />;
}
