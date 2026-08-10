"use client";

import S from "./AuthIntro.style";

/**
 * The eyebrow/heading/sub block every signed-out panel opens with --
 * /login, both /forgot-password panels, and all three of
 * /reset-password's. Each of them had its own copy of the same three
 * elements before this existed, in two different type scales; there's
 * one scale now, so there's nothing to pass but the copy.
 *
 * Distinct from PageIntro, which is the dashboard's equivalent: that
 * one sits at the top of a full page, this one at the top of a card.
 *
 * `announce` marks the sub as a live region, for panels that swap in
 * over a form the user was filling in -- without it a screen reader
 * gets no signal that the form is gone. Off by default, since a region
 * that was there on first paint has nothing to announce.
 *
 * The wrapping div is load-bearing on the recovery screens: their Panel
 * is a flex column with a gap, so without it the three lines would be
 * spaced like separate sections rather than one block.
 */
export default function AuthIntro({ eyebrow, heading, sub, announce = false }) {
  return (
    <div>
      {eyebrow && <S.Eyebrow>{eyebrow}</S.Eyebrow>}
      <S.Heading>{heading}</S.Heading>
      {sub && (
        <S.Sub aria-live={announce ? "polite" : undefined}>{sub}</S.Sub>
      )}
    </div>
  );
}
