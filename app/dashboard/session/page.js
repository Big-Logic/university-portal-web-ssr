import { serverApiRequest } from "@/lib/server-api";
import SessionView from "./SessionView";

export default async function SessionPage() {
  const user = await serverApiRequest("/api/v1/users/me");
  return <SessionView user={user} />;
}
