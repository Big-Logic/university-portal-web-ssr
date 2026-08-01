"use client";

import { GraduationCap } from "lucide-react";
import S from "./Brand.style";

export default function Brand() {
  return (
    <>
      <S.Mark>
        <GraduationCap size={18} aria-hidden="true" />
      </S.Mark>
      <S.Name>Basecourse</S.Name>
    </>
  );
}
