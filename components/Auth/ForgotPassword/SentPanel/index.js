"use client";

import { Mail } from "lucide-react";
import Button from "@/components/ui/Button";
import { Alert } from "@/components/ui/primitives";
import AuthIntro from "@/components/Auth/reusables/AuthIntro";
import { TOKEN_TTL_COPY } from "../constants";
import Shared from "../ForgotPassword.style";
import S from "./SentPanel.style";

/**
 * Shown once the API has accepted the request. Note it says the link
 * was sent to the address that was typed, not that an account exists at
 * it -- the API answers identically either way, on purpose, and this
 * panel must not leak the difference.
 *
 * The cooldown is owned by the view above rather than here: it's armed
 * by the first send, which happened before this panel mounted.
 */
export default function SentPanel({
  sentTo,
  formError,
  isPending,
  cooldown,
  onResend,
  onUseAnotherEmail,
}) {
  return (
    <>
      <S.SuccessIcon>
        <Mail size={22} aria-hidden="true" />
      </S.SuccessIcon>

      {/* announce: this panel swaps in over the form, so without a live
          region a screen reader gets no signal that the form it was
          filling in has been replaced. */}
      <AuthIntro
        announce
        heading="Check your email"
        sub={
          <>
            We sent a reset link to <S.Strong>{sentTo}</S.Strong>. The link
            works once and expires in {TOKEN_TTL_COPY}.
          </>
        }
      />

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
            Check your spam folder &mdash; delivery can take a minute or two.
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
        onClick={onResend}
        disabled={cooldown > 0}
        loading={isPending}
        loadingText="Sending link…"
      >
        {cooldown > 0 ? `Resend available in ${cooldown}s` : "Resend the link"}
      </Button>

      <Shared.Divider />

      <Shared.FootRow>
        <Shared.BackLink href="/login">Back to sign in</Shared.BackLink>
        <S.LinkAction type="button" onClick={onUseAnotherEmail}>
          Use a different email
        </S.LinkAction>
      </Shared.FootRow>
    </>
  );
}
