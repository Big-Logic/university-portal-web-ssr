import { getCurrentUser } from "@/lib/auth/currentUser";
import { assertRole } from "@/lib/navigation";
import CourseOfferingsView from "./CourseOfferingsView";

export default async function CourseOfferingsPage() {
  const user = await getCurrentUser();
  assertRole(user, "registrar");

  return <CourseOfferingsView />;
}
