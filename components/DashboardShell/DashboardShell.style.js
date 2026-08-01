import styled from "styled-components";
import { rt } from "@/lib/theme";
import { BREAKPOINT, CONTENT_MAX_WIDTH } from "./constants";

const Shell = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ theme }) => rt(theme).color.ink50};
`;

const Scrim = styled.div`
  display: none;
  position: fixed;
  inset: 0;
  z-index: 45;
  background: rgba(26, 32, 41, 0.4);

  @media (max-width: ${BREAKPOINT}) {
    display: ${({ $open }) => ($open ? "block" : "none")};
  }
`;

const Main = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

const ContentArea = styled.main`
  flex: 1;
  width: 100%;
  max-width: ${CONTENT_MAX_WIDTH};
  margin: 0 auto;
  padding: ${({ theme }) => rt(theme).space[8]};

  @media (max-width: ${BREAKPOINT}) {
    padding: ${({ theme }) => rt(theme).space[4]};
  }
`;

export default {
  Shell,
  Scrim,
  Main,
  ContentArea,
};
