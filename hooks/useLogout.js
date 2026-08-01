"use client";

import { useMutation } from "@tanstack/react-query";
import { clientRequest } from "@/lib/client-api";

// Shared by every place that renders a "Log out" control (UserIdentity's
// account menu, Sidebar's mobile one) -- each caller gets its own
// mutation instance, same as useCurrentUser.
export default function useLogout() {
  const logoutMutation = useMutation({
    mutationFn: () => clientRequest("/api/auth/logout", { method: "POST" }),
    // onSettled (not onSuccess) -- redirect regardless of outcome: a
    // failed server-side revoke isn't something the user needs to see
    // or act on.
    onSettled: () => {
      // Full navigation, not router.push -- Proxy needs a fresh
      // request to see the now-cleared cookies before it decides
      // where to send us.
      window.location.href = "/login";
    },
  });

  return {
    handleLogout: () => logoutMutation.mutate(),
    signingOut: logoutMutation.isPending,
  };
}
