"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import VisualPanel from "../VisualPanel";
import S from "./PageShell.style";

/**
 * The chrome around whatever the form column is showing: wordmark bar,
 * the card itself, and the visual half beside it. Same reason as
 * /reset-password's shell -- the entrance animation belongs to the
 * mount, not to the contents, so it stays out here where a swap inside
 * the card can't replay it.
 */
export default function PageShell({ children }) {
  return (
    <S.Screen>
      <S.FormSide>
        <S.Header>
          <S.Mark>
            <GraduationCap size={20} aria-hidden="true" />
          </S.Mark>
          <S.WordmarkText>Basecourse</S.WordmarkText>
        </S.Header>

        <S.FormCenter>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{ width: "100%", maxWidth: 400 }}
          >
            <S.FormCard>{children}</S.FormCard>
          </motion.div>
        </S.FormCenter>
      </S.FormSide>

      <VisualPanel />
    </S.Screen>
  );
}
