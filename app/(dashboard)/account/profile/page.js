import { apiRequest } from "@/lib/api/server";
import { getCurrentUser } from "@/lib/auth/currentUser";
import Profile from "@/components/Account/Profile";
import { APP_NAME } from "@/lib/branding";

export const metadata = {
  title: "Your profile",
  description: `Your name, contact details, and sign-in settings on ${APP_NAME}.`,
};

// No assertRole: /account is the one branch of (dashboard) every role
// shares, and the record fetched below is whoever the token says it
// is.
export default async function ProfilePage() {
  // The gate, and it runs first on purpose: getCurrentUser reads back
  // the x-user-id/x-user-role headers Proxy set after verifying the
  // token's signature, so it costs a header read and no network call,
  // and it redirects to /login by itself when they're absent. A
  // request that somehow reached this page without a verified session
  // therefore never becomes a call to the Express API.
  //
  // Its return value is deliberately unused: { id, role } is all it
  // carries, and both come back on the full record below. It's here to
  // fail closed, not to supply data.
  await getCurrentUser();

  // The profile itself needs a real round trip -- name, phone,
  // timezone and the timestamps were never in the token.
  const user = await apiRequest("/api/v1/users/me");

  return <Profile user={user} />;
}
