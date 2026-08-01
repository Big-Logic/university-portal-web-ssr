import styled from "styled-components";
import { rt } from "@/lib/theme";
import { BREAKPOINT, CONTENT_MAX_WIDTH } from "../constants";

const HeaderEl = styled.header`
  padding: ${({ theme }) => rt(theme).space[4]}
    ${({ theme }) => rt(theme).space[8]};
  background: ${({ theme }) => rt(theme).color.white};
  border-bottom: 1px solid ${({ theme }) => rt(theme).color.ink150};

  @media (max-width: ${BREAKPOINT}) {
    padding: 12px 16px;
  }
`;

const Inner = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: ${CONTENT_MAX_WIDTH};
  margin: 0 auto;
`;

// Sidebar (and its brand mark) goes off-canvas below BREAKPOINT --
// this is the one place the brand still shows once that happens.
const HeaderBrand = styled.div`
  display: none;
  align-items: center;
  gap: 10px;

  @media (max-width: ${BREAKPOINT}) {
    display: flex;
  }
`;

const MenuBtn = styled.button`
  display: none;
  width: 36px;
  height: 36px;
  flex: none;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => rt(theme).color.ink150};
  border-radius: ${({ theme }) => rt(theme).radius.pill};
  background: ${({ theme }) => rt(theme).color.white};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => rt(theme).color.ink100};
  }

  @media (max-width: ${BREAKPOINT}) {
    display: flex;
  }
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
`;

const MetaGroup = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: ${BREAKPOINT}) {
    display: none;
  }
`;

const VDivider = styled.div`
  width: 1px;
  height: 24px;
  flex: none;
  background: ${({ theme }) => rt(theme).color.ink150};

  @media (max-width: ${BREAKPOINT}) {
    display: none;
  }
`;

export default {
  HeaderEl,
  Inner,
  HeaderBrand,
  MenuBtn,
  RightGroup,
  MetaGroup,
  VDivider,
};
