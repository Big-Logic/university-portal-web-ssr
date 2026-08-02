"use client";

import { useState } from "react";
import { Info, ChevronLeft, ChevronRight } from "lucide-react";
import { NOTICES } from "@/lib/sample-data";
import S from "./NoticeBanner.style";

export default function NoticeBanner() {
  const [noticeIndex, setNoticeIndex] = useState(0);

  return (
    <S.Notice>
      <S.NoticeIcon>
        <Info size={17} aria-hidden="true" />
      </S.NoticeIcon>
      <S.NoticeText>{NOTICES[noticeIndex]}</S.NoticeText>
      <S.NoticeNav>
        <S.NoticeBtn
          type="button"
          aria-label="Previous notice"
          onClick={() =>
            setNoticeIndex((i) => (i + NOTICES.length - 1) % NOTICES.length)
          }
        >
          <ChevronLeft size={15} aria-hidden="true" />
        </S.NoticeBtn>
        <S.NoticeBtn
          type="button"
          aria-label="Next notice"
          onClick={() => setNoticeIndex((i) => (i + 1) % NOTICES.length)}
        >
          <ChevronRight size={15} aria-hidden="true" />
        </S.NoticeBtn>
      </S.NoticeNav>
    </S.Notice>
  );
}
