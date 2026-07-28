import { getCurrentUser } from "@/lib/server-api";
import { assertRole } from "@/lib/navigation";
import CourseOfferingsView from "./CourseOfferingsView";

export default async function CourseOfferingsPage() {
  const user = await getCurrentUser();
  assertRole(user, "registrar");

  return <CourseOfferingsView />;
}
