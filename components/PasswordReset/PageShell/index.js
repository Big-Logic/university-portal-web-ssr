"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import S from "./PageShell.style";

/**
 * The chrome all three panels sit in: wordmark, the card itself, and
 * the footer. Extracted so each panel only describes what's different
 * about it -- and so the entrance animation plays once on mount rather
 * than replaying every time the panel inside swaps.
 */
export default function PageShell({ children }) {
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
        <S.Panel>{children}</S.Panel>
      </motion.div>

      <S.Footer>Basecourse &middot; Student record system</S.Footer>
    </S.Screen>
  );
}
