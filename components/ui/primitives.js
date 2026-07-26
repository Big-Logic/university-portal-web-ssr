"use client";

import styled from "styled-components";
import { rt } from "@/lib/theme";

export const Card = styled.div`
  background: ${({ theme }) => rt(theme).color.white};
  border: 1px solid ${({ theme }) => rt(theme).color.ink150};
  border-radius: ${({ theme }) => rt(theme).radius.lg};
  padding: ${({ theme, $pad }) => $pad || rt(theme).space[6]};
`;

const badgeColors = {
  neutral: (t) => ({ bg: t.color.ink100, fg: t.color.ink700 }),
  accent: (t) => ({ bg: t.color.blue100, fg: t.color.blue700 }),
  success: (t) => ({ bg: t.color.green100, fg: t.color.green600 }),
  warning: (t) => ({ bg: t.color.amber100, fg: t.color.amber600 }),
  danger: (t) => ({ bg: t.color.red100, fg: t.color.red600 }),
};

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 11px;
  border-radius: ${({ theme }) => rt(theme).radius.pill};
  background: ${({ theme, $tone = "neutral" }) => badgeColors[$tone](rt(theme)).bg};
  color: ${({ theme, $tone = "neutral" }) => badgeColors[$tone](rt(theme)).fg};
`;

const alertColors = {
  info: (t) => ({ bg: t.color.blue50, fg: t.color.blue700 }),
  success: (t) => ({ bg: t.color.green100, fg: t.color.green600 }),
  warning: (t) => ({ bg: t.color.amber100, fg: t.color.amber600 }),
  danger: (t) => ({ bg: t.color.red100, fg: t.color.red600 }),
};

export const Alert = styled.div`
  border-radius: ${({ theme }) => rt(theme).radius.md};
  padding: 12px 16px;
  font-size: 13.5px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
  background: ${({ theme, $tone = "info" }) => alertColors[$tone](rt(theme)).bg};
  color: ${({ theme, $tone = "info" }) => alertColors[$tone](rt(theme)).fg};
`;
