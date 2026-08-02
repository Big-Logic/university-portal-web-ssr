import { getCurrentUser } from "@/lib/api/current-user";
import { assertRole } from "@/lib/navigation";
import UsersView from "./UsersView";

export default async function UsersPage() {
  const user = await getCurrentUser();
  assertRole(user, "admin");

  return <UsersView />;
}
