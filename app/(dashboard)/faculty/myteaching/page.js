import { getCurrentUser } from "@/lib/auth/currentUser";
import { assertRole } from "@/lib/navigation";
import MyTeachingView from "./MyTeachingView";

export default async function MyTeachingPage() {
  const user = await getCurrentUser();
  assertRole(user, "faculty");

  return <MyTeachingView />;
}
