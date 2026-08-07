"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { GraduationCap, Mail } from "lucide-react";
import { forgotPasswordSchema } from "@/lib/validation";
import { clientRequest } from "@/lib/api/client";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import { Alert } from "@/components/ui/primitives";
import S from "./forgotPassword.style";

// Long enough that a double-click can't spend two tokens, short enough
// that someone whose mail genuinely didn't arrive isn't stuck waiting.
// Every send invalidates nothing -- the API issues an additional token
// rather than rotating the last one -- so this is a courtesy, not a
// correctness guard.
const RESEND_COOLDOWN_SECONDS = 30;

// The 30 minutes quoted on the confirmation screen is
// RESET_TOKEN_TTL_MINUTES in the API's auth.forgotPassword.js. If that
// changes, this copy is wrong and nothing will fail to tell us.
const TOKEN_TTL_COPY = "30 minutes";

export default function ForgotPasswordView() {
  // `sentTo` doubles as the step: null is the form, an address is the
  // confirmation. One piece of state instead of two that could
  // disagree about which screen we're on.
  const [sentTo, setSentTo] = useState(null);
  const [formError, setFormError] = useState(null);
  const [cooldown, setCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) });

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
    <S.Screen>
      <S.Wordmark>
        <S.Mark>
          <GraduationCap size={20} aria-hidden="true" />
        </S.Mark>
        <S.WordmarkText>Basecourse</S.WordmarkText>
      </S.Wordmark>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{ width: "100%", maxWidth: 440 }}
      >
        <S.Panel>
          {sentTo === null ? (
            <>
              <div>
                <S.Eyebrow>Account recovery</S.Eyebrow>
                <S.Heading>Reset your password</S.Heading>
                <S.Sub>
                  Enter the email address on your account. We&rsquo;ll send you
                  a link to set a new password.
                </S.Sub>
              </div>

              <S.FormEl onSubmit={handleSubmit(onSubmit)} noValidate>
                {formError && (
                  <Alert $tone="danger" role="alert">
                    {formError}
                  </Alert>
                )}

                <div>
                  <Field
                    label="Email address"
                    type="email"
                    placeholder="you@university.edu"
                    autoComplete="email"
                    error={errors.email?.message}
                    {...register("email")}
                  />
                  <S.Hint>
                    Students: use the address your institution issued you(if
                    any).
                  </S.Hint>
                </div>

                <Button
                  type="submit"
                  block
                  loading={requestReset.isPending}
                  loadingText="Sending link…"
                >
                  Send reset link
                </Button>
              </S.FormEl>

              <S.Divider />

              <S.FootRow>
                <S.BackLink href="/login">Back to sign in</S.BackLink>
                <span>Need help? Contact your registrar&rsquo;s office.</span>
              </S.FootRow>
            </>
          ) : (
            <>
              <S.SuccessIcon>
                <Mail size={22} aria-hidden="true" />
              </S.SuccessIcon>

              <div>
                <S.Heading>Check your email</S.Heading>
                {/* Announced rather than silent: the panel swaps in
                    place, so without this a screen reader gets no signal
                    that the form it was filling in has been replaced. */}
                <S.Sub aria-live="polite">
                  We sent a reset link to <S.Strong>{sentTo}</S.Strong>. The
                  link works once and expires in {TOKEN_TTL_COPY}.
                </S.Sub>
              </div>

              {formError && (
                <Alert $tone="danger" role="alert">
                  {formError}
                </Alert>
              )}

              <S.Steps>
                <S.StepsTitle>If it doesn&rsquo;t arrive</S.StepsTitle>
                <S.Step>
                  <S.StepNum aria-hidden="true">1</S.StepNum>
                  <S.StepText>
                    Check your spam folder &mdash; delivery can take a minute or
                    two.
                  </S.StepText>
                </S.Step>
                <S.Step>
                  <S.StepNum aria-hidden="true">2</S.StepNum>
                  <S.StepText>
                    Confirm the address above is the one on your account.
                  </S.StepText>
                </S.Step>
              </S.Steps>

              <Button
                variant="secondary"
                block
                type="button"
                onClick={resend}
                disabled={cooldown > 0}
                loading={requestReset.isPending}
                loadingText="Sending link…"
              >
                {cooldown > 0
                  ? `Resend available in ${cooldown}s`
                  : "Resend the link"}
              </Button>

              <S.Divider />

              <S.FootRow>
                <S.BackLink href="/login">Back to sign in</S.BackLink>
                <S.LinkAction type="button" onClick={useAnotherEmail}>
                  Use a different email
                </S.LinkAction>
              </S.FootRow>
            </>
          )}
        </S.Panel>
      </motion.div>

      <S.Footer>Basecourse &middot; Student record system</S.Footer>
    </S.Screen>
  );
}
