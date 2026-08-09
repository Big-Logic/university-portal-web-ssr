"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { homePathForRole } from "@/lib/navigation";
import { clientRequest } from "@/lib/api/client";
import PageShell from "./PageShell";
import LoginForm from "./LoginForm";

/**
 * Holds the mutation and nothing else -- the fields and their
 * validation live in LoginForm, the layout in PageShell. Same shape as
 * PasswordReset next door, minus the panel switch: there's only one
 * outcome that keeps you on this screen, and success leaves the app
 * entirely (see below).
 */
export default function Login() {
  const [formError, setFormError] = useState(null);

  const loginMutation = useMutation({
    mutationFn: (values) =>
      clientRequest("/api/auth/login", {
        method: "POST",
        body: values,
      }),
    onSuccess: (data) => {
      // Full navigation, not router.push -- the httpOnly cookie was
      // just set on this response, and Proxy needs a fresh request to
      // see it before the destination page's server-side fetch will
      // succeed. A client-side route transition wouldn't guarantee that.
      window.location.href = homePathForRole(data?.user?.role);
    },
    onError: (err) => setFormError(err.message),
  });

  function onSubmit(values) {
    setFormError(null);
    loginMutation.mutate(values);
  }

  return (
    <PageShell>
      <LoginForm
        onSubmit={onSubmit}
        isPending={loginMutation.isPending}
        formError={formError}
      />
    </PageShell>
  );
}
