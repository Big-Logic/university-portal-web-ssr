"use client";

import Wordmark from "@/components/Auth/reusables/Wordmark";
import RiseIn from "@/components/Auth/reusables/RiseIn";
import { APP_NAME, APP_TAGLINE } from "@/lib/branding";
import S from "./AuthShell.style";

/**
 * The chrome the password screens sit in: wordmark, the card itself,
 * and the footer. /forgot-password and /reset-password are two halves
 * of one errand and sit back to back in the flow, so they share a
 * silhouette rather than each inventing one -- they had a byte-identical
 * copy of this file apiece before it moved here.
 *
 * /login deliberately doesn't use it. That screen is a two-column grid
 * with a marketing panel beside the form, which is a different layout
 * rather than this one with options, so it keeps its own shell and
 * shares the pieces that genuinely are the same (Wordmark, RiseIn).
 *
 * Panel's gap is what spaces the rows inside: each panel renders a flat
 * list of children and never has to space them itself.
 */
export default function AuthShell({ children }) {
  return (
    <S.Screen>
      <Wordmark />

      <RiseIn maxWidth={440}>
        <S.Panel>{children}</S.Panel>
      </RiseIn>

      <S.Footer>
        {APP_NAME} &middot; {APP_TAGLINE}
      </S.Footer>
    </S.Screen>
  );
}
