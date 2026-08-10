"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { clientRequest } from "@/lib/api/client";
import AuthShell from "@/components/Auth/reusables/AuthShell";
import { RESEND_COOLDOWN_SECONDS } from "./constants";
import RequestForm from "./RequestForm";
import SentPanel from "./SentPanel";

/**
 * Holds the mutation and the cooldown, and nothing else. Which of the
 * two panels renders is the only decision here -- the form's own field
 * and validation live inside RequestForm, and the confirmation is a
 * presentation of state this component owns.
 */
export default function ForgotPassword() {
  // `sentTo` doubles as the step: null is the form, an address is the
  // confirmation. One piece of state instead of two that could
  // disagree about which screen we're on.
  const [sentTo, setSentTo] = useState(null);
  const [formError, setFormError] = useState(null);
  const [cooldown, setCooldown] = useState(0);

  const requestReset = useMutation({
    mutationFn: (values) =>
      clientRequest("/api/auth/forgot-password", {
        method: "POST",
        body: values,
      }),
    // The API answers the same way whether or not the address belongs
    // to an account, so there is deliberately nothing in `data` to
    // branch on -- a success here means "the request was accepted",
    // not "an email is on its way".
    // Arming the cooldown here rather than inside `resend` covers the
    // first send too. Set it there and the confirmation panel opens
    // with resend already live, so the countdown only ever appears from
    // the second send onward.
    onSuccess: (_data, values) => {
      setSentTo(values.email);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    },
    onError: (err) => setFormError(err.message),
  });

  // One timeout per tick rather than a single interval: each tick
  // schedules the next, so the countdown stops on its own at zero and
  // the cleanup covers an unmount mid-count without a ref to clear.
  useEffect(() => {
    if (cooldown === 0) return undefined;
    const id = setTimeout(() => setCooldown((n) => n - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  function onSubmit(values) {
    setFormError(null);
    requestReset.mutate(values);
  }

  function resend() {
    if (cooldown > 0) return;
    setFormError(null);
    requestReset.mutate({ email: sentTo });
  }

  function useAnotherEmail() {
    setSentTo(null);
    setFormError(null);
    setCooldown(0);
  }

  return (
    <AuthShell>
      {sentTo === null ? (
        <RequestForm
          onSubmit={onSubmit}
          isPending={requestReset.isPending}
          formError={formError}
        />
      ) : (
        <SentPanel
          sentTo={sentTo}
          formError={formError}
          isPending={requestReset.isPending}
          cooldown={cooldown}
          onResend={resend}
          onUseAnotherEmail={useAnotherEmail}
        />
      )}
    </AuthShell>
  );
}
