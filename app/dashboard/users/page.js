import { serverApiRequest } from "@/lib/server-api";
import { assertRole } from "@/lib/navigation";
import UsersView from "./UsersView";

export default async function UsersPage() {
  const user = await serverApiRequest("/api/v1/users/me");
  assertRole(user, "admin");

  return <UsersView />;
}
