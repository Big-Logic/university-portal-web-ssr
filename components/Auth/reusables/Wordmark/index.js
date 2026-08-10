"use client";

import { GraduationCap } from "lucide-react";
import { APP_NAME } from "@/lib/branding";
import S from "./Wordmark.style";

/**
 * The mark and name every signed-out screen is topped with -- /login's
 * header bar and the recovery screens' centred column.
 *
 * Not the same component as DashboardShell/Brand, which is the
 * signed-in chrome's version: it runs a size smaller to fit the
 * sidebar, and its name stretches to fill the row so the collapse
 * toggle can sit at the end. Merging them would mean a size prop and a
 * layout prop on something this small, which is worse than two files.
 */
export default function Wordmark() {
  return (
    <S.Row>
      <S.Mark>
        <GraduationCap size={20} aria-hidden="true" />
      </S.Mark>
      <S.Text>{APP_NAME}</S.Text>
    </S.Row>
  );
}
