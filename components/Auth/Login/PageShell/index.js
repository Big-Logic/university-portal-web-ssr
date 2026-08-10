"use client";

import Wordmark from "@/components/Auth/reusables/Wordmark";
import RiseIn from "@/components/Auth/reusables/RiseIn";
import VisualPanel from "../VisualPanel";
import S from "./PageShell.style";

/**
 * The chrome around the sign-in form: wordmark bar, the card itself,
 * and the visual half beside it.
 *
 * Stays a local shell rather than using AuthShell like the recovery
 * screens do -- this is a two-column grid with a header bar across the
 * form side, not a centred column, so what the two have in common is
 * the wordmark and the entrance, both of which are imported.
 */
export default function PageShell({ children }) {
  return (
    <S.Screen>
      <S.FormSide>
        <S.Header>
          <Wordmark />
        </S.Header>

        <S.FormCenter>
          <RiseIn maxWidth={400}>
            <S.FormCard>{children}</S.FormCard>
          </RiseIn>
        </S.FormCenter>
      </S.FormSide>

      <VisualPanel />
    </S.Screen>
  );
}
