import styled, { keyframes } from "styled-components";
import { rt } from "@/lib/theme";
import { AccountMenuPanel } from "../AccountMenuPanel";
import { BREAKPOINT } from "../constants";

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Avatar = styled.div`
  width: 34px;
  height: 34px;
  flex: none;
  border-radius: ${({ theme }) => rt(theme).radius.pill};
  background: ${({ theme }) => rt(theme).color.blue100};
  color: ${({ theme }) => rt(theme).color.blue700};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Text = styled.div`
  min-width: 0;
`;

const Name = styled.div`
  font-size: 13.5px;
  font-weight: 700;
  white-space: nowrap;
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

export const SkeletonAvatar = styled.div`
  width: 34px;
  height: 34px;
  flex: none;
  border-radius: ${({ theme }) => rt(theme).radius.pill};
  background: ${({ theme }) => rt(theme).color.ink150};
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

export const SkeletonLines = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const SkeletonLine = styled.div`
  height: ${({ $height = "10px" }) => $height};
  width: ${({ $width = "60px" }) => $width};
  border-radius: ${({ theme }) => rt(theme).radius.sm};
  background: ${({ theme }) => rt(theme).color.ink150};
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

export const KebabButton = styled.button`
  width: 34px;
  height: 34px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: ${({ theme }) => rt(theme).radius.pill};
  background: ${({ theme, $open }) =>
    $open ? rt(theme).color.ink100 : rt(theme).color.ink50};
  color: ${({ theme }) => rt(theme).color.ink700};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => rt(theme).color.ink100};
  }
`;

// Header's self-contained identity chip -- background + padding
// around the row plus its own kebab anchor, as opposed to Sidebar's
// bare row where the kebab and dropdown are laid out by the caller.
export const IdentityGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 8px 5px 12px;
  border-radius: ${({ theme }) => rt(theme).radius.md};
  background: ${({ theme }) => rt(theme).color.ink50};

  @media (max-width: ${BREAKPOINT}) {
    display: none;
  }
`;

export const MenuAnchor = styled.div`
  position: relative;
`;

export const HeaderMenuPanel = styled(AccountMenuPanel)`
  position: absolute;
  top: 42px;
  right: 0;
  width: 240px;
`;

export default {
  Row,
  Avatar,
  Text,
  Name,
  SkeletonAvatar,
  SkeletonLines,
  SkeletonLine,
  KebabButton,
  IdentityGroup,
  MenuAnchor,
  HeaderMenuPanel,
};
