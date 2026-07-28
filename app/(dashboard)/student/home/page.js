import { getCurrentUser } from "@/lib/server-api";
import { assertRole } from "@/lib/navigation";
import StudentHomeView from "./StudentHomeView";

// Only /users/me is fetched here -- deliberately. The dashboard design
// also shows a checklist, calendar, documents, notifications, GPA and
// course progress, none of which have endpoints yet (see
// lib/sample-data.js). Calling an endpoint that doesn't exist would
// throw inside apiRequest and take the whole page down to the
// error boundary, so those stay as clearly-badged sample content until
// there's something real to fetch.
//
// Uses apiRequest, not getCurrentUser -- the "Welcome back, {name}"
// greeting needs fullName, which was never in the access token.
export default async function StudentHomePage() {
  const user = await getCurrentUser();
  assertRole(user, "student");

  return <StudentHomeView user={user} />;
}
