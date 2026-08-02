import styled from "styled-components";
import { rt } from "@/lib/theme";

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

const NoticeIcon = styled.span`
  display: flex;
  flex: none;
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

export default {
  Notice,
  NoticeIcon,
  NoticeText,
  NoticeNav,
  NoticeBtn,
};
