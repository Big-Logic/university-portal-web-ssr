"use client";

import { Link2Off } from "lucide-react";
import { TOKEN_TTL_COPY } from "../constants";
import S from "../PasswordReset.style";

/**
 * Shown for a link that is missing, malformed, or that the API refused
 * with INVALID_RESET_TOKEN -- expired, already spent and forged all
 * land here, since the API deliberately doesn't distinguish them.
 *
 * The only action is requesting a new link: this panel replaces the
 * form rather than sitting above it, because resubmitting cannot help
 * and a form left on screen invites exactly that.
 */
export default function DeadLinkPanel() {
  return (
    <>
      <S.PanelIcon $tone="warning">
        <Link2Off size={22} aria-hidden="true" />
      </S.PanelIcon>

      <div>
        <S.Heading>This link is no longer valid</S.Heading>
        {/* Announced rather than silent: when this replaces the form in
            place, a screen reader otherwise gets no signal that the
            thing it was filling in is gone. */}
        <S.Sub aria-live="polite">
          Reset links work once and expire {TOKEN_TTL_COPY} after
          they&rsquo;re sent. Request a new one and we&rsquo;ll email you a
          fresh link.
        </S.Sub>
      </div>

      <S.PrimaryLink href="/forgot-password">Request a new link</S.PrimaryLink>

      <S.Divider />

      <S.FootRow>
        <S.BackLink href="/login">Back to sign in</S.BackLink>
      </S.FootRow>
    </>
  );
}
