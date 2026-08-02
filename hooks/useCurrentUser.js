"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { clientRequest } from "@/lib/api/client";

// Client-side fetch, deliberately -- every piece of chrome under this
// shell needs the same identity data, and a shared queryKey means
// React Query dedupes every caller onto a single network request
// (cached, not re-fetched per component or per route). Goes through a
// same-origin Route Handler (app/api/users/me), never the Express API
// directly.
export default function useCurrentUser() {
  const { data: user, isError } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => clientRequest("/api/users/me", { method: "GET" }),
  });

  // Shouldn't normally happen -- Proxy already gates every route this
  // shell renders under -- but if the client-side fetch itself comes
  // back unauthorized (e.g. the cookie expired mid-session), send the
  // user back through login rather than show broken chrome.
  useEffect(() => {
    if (isError) {
      window.location.href = "/login";
    }
  }, [isError]);

  return user;
}
