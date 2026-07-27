"use client";

import { useState } from "react";
import styled from "styled-components";
import { Info, ChevronLeft, ChevronRight } from "lucide-react";
import { rt } from "@/lib/theme";
import { NOTICES } from "@/lib/sample-data";

const Notice = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => rt(theme).space[3]};
  padding: 12px 16px;
  border-radius: ${({ theme }) => rt(theme).radius.lg};
  background: ${({ theme }) => rt(theme).color.blue100};
  border: 1px solid #cfdcf8;
  color: ${({ theme }) => rt(theme).color.blue700};
`;

const NoticeText = styled.div`
  flex: 1;
  min-width: 0;
  font-size: 14px;
  font-weight: 600;
`;

const NoticeNav = styled.div`
  display: flex;
  gap: 6px;
  flex: none;
`;

const NoticeBtn = styled.button`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: ${({ theme }) => rt(theme).radius.pill};
  background: ${({ theme }) => rt(theme).color.white};
  color: ${({ theme }) => rt(theme).color.blue700};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => rt(theme).color.blue50};
  }
`;

export default function NoticeBanner() {
  const [noticeIndex, setNoticeIndex] = useState(0);

  return (
    <Notice>
      <Info size={17} aria-hidden="true" style={{ flex: "none" }} />
      <NoticeText>{NOTICES[noticeIndex]}</NoticeText>
      <NoticeNav>
        <NoticeBtn
          type="button"
          aria-label="Previous notice"
          onClick={() =>
            setNoticeIndex((i) => (i + NOTICES.length - 1) % NOTICES.length)
          }
        >
          <ChevronLeft size={15} aria-hidden="true" />
        </NoticeBtn>
        <NoticeBtn
          type="button"
          aria-label="Next notice"
          onClick={() => setNoticeIndex((i) => (i + 1) % NOTICES.length)}
        >
          <ChevronRight size={15} aria-hidden="true" />
        </NoticeBtn>
      </NoticeNav>
    </Notice>
  );
}
