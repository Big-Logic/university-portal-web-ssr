"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { RESET_TOKEN_PATTERN } from "@/lib/validation";
import { clientRequest } from "@/lib/api/client";
import PageShell from "./PageShell";
import ResetForm from "./ResetForm";
import DeadLinkPanel from "./DeadLinkPanel";
import SuccessPanel from "./SuccessPanel";

/**
 * Holds the token and the mutation, and nothing else. Which of the
 * three panels renders is the only decision here -- the form's own
 * fields and validation live inside ResetForm, and the two outcome
 * panels are static.
 */
export default function PasswordReset() {
  const searchParams = useSearchParams();

  // Captured once in an initializer rather than read on every render:
  // the effect below strips the token from the URL, and a later read
  // would come back empty and pull it out from under the open form.
  const [token] = useState(() => searchParams.get("token"));

  const [done, setDone] = useState(false);
  const [linkDead, setLinkDead] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (!token) return;
    // A single-use credential shouldn't sit in the address bar or in
    // browser history, where it outlives the tab on a shared machine.
    // The cost, worth knowing: reloading this page now loses the token,
    // so someone who hits refresh needs a fresh link even though the
    // old one hadn't expired. Drop this effect to trade that back.
    window.history.replaceState(null, "", window.location.pathname);
  }, [token]);

  const resetPassword = useMutation({
    mutationFn: (values) =>
      clientRequest("/api/auth/reset-password", {
        method: "POST",
        // The token rides from the URL, not the form; confirmPassword
        // stays in the browser, since there's nothing for the API to do
        // with it.
        body: { token, newPassword: values.newPassword },
      }),
    onSuccess: () => setDone(true),
    onError: (err) => {
      // A spent link takes over the whole panel instead of showing an
      // inline error, because resubmitting cannot fix it -- the only
      // move left is requesting a new one, and an error above a form
      // invites the user to retype their password first. This is what
      // the error code carried through clientRequest buys.
      if (err.code === "INVALID_RESET_TOKEN") {
        setLinkDead(true);
        return;
      }
      setFormError(err.message);
    },
  });

  function onSubmit(values) {
    setFormError(null);
    resetPassword.mutate(values);
  }

  // A missing or malformed token is the same dead end as a rejected
  // one, so they share a panel. Note there's no way to check a good
  // token without spending it -- the API has no validate endpoint -- so
  // a live-looking link is shown the form and finds out on submit.
  const linkUnusable = !token || !RESET_TOKEN_PATTERN.test(token) || linkDead;

  return (
    <PageShell>
      {done ? (
        <SuccessPanel />
      ) : linkUnusable ? (
        <DeadLinkPanel />
      ) : (
        <ResetForm
          onSubmit={onSubmit}
          isPending={resetPassword.isPending}
          formError={formError}
        />
      )}
    </PageShell>
  );
}
