"use client";

import S from "./PageIntro.style";

export default function PageIntro({ eyebrow, heading, sub }) {
  return (
    <div>
      {eyebrow && <S.Eyebrow>{eyebrow}</S.Eyebrow>}
      <S.Heading>{heading}</S.Heading>
      {sub && <S.Sub>{sub}</S.Sub>}
    </div>
  );
}
