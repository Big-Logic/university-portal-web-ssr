"use client";

import { APP_NAME } from "@/lib/branding";
import S from "./VisualPanel.style";

/**
 * The dark half beside the form. Static copy, no props -- it takes no
 * part in signing in, and lives in its own folder so PageShell reads as
 * layout rather than as layout plus a paragraph of marketing.
 */
export default function VisualPanel() {
  return (
    <S.Side>
      <S.Pattern />
      <S.Content>
        <S.Quote>
          Every <span>record</span>, one ledger.
        </S.Quote>
        <S.Caption>
          Courses, offerings, and enrollment, kept in the same system of
          record across every institution that runs on {APP_NAME}.
        </S.Caption>
      </S.Content>
    </S.Side>
  );
}
