"use client";

import { ShieldCheck } from "lucide-react";
import AuthIntro from "@/components/Auth/reusables/AuthIntro";
import Shared from "../PasswordReset.style";
import S from "./SuccessPanel.style";

/**
 * The password is changed and both cookies were cleared on the way back
 * (see app/api/auth/reset-password/route.js), so there is no signed-in
 * state to return to -- the only way on is a fresh sign-in.
 *
 * Deliberately says nothing about which account this was. The API
 * returns a bare message, and no endpoint resolves a reset token to an
 * email, so naming one here would mean inventing it.
 */
export default function SuccessPanel() {
  return (
    <>
      <Shared.PanelIcon $tone="success">
        <ShieldCheck size={22} aria-hidden="true" />
      </Shared.PanelIcon>

      {/* announce: this swaps in over the form, so without a live region
          a screen reader gets no signal that the thing it was filling in
          is gone. */}
      <AuthIntro
        announce
        heading="Your password is updated"
        sub={
          <>
            Sign in with your new password. We signed you out everywhere else
            too, so you&rsquo;ll need to sign in again on your other devices.
          </>
        }
      />

      <Shared.PrimaryLink href="/login">Go to sign in</Shared.PrimaryLink>

      <Shared.Divider />

      <S.Note>
        Didn&rsquo;t make this change? Contact your registrar&rsquo;s office
        right away.
      </S.Note>
    </>
  );
}
