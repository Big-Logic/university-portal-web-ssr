import styled from "styled-components";
import { rt } from "@/lib/theme";
import { Card } from "@/components/ui/primitives";

// Same centred single column as /forgot-password -- this is the second
// half of that errand, and the two screens sit back to back in the
// flow, so they share a silhouette rather than each inventing one.
const Screen = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => rt(theme).color.ink50};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => rt(theme).space[6]};
  padding: ${({ theme }) => rt(theme).space[8]}
    ${({ theme }) => rt(theme).space[6]};
`;

const Wordmark = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => rt(theme).space[3]};
`;

const Mark = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => rt(theme).radius.md};
  background: ${({ theme }) => rt(theme).color.ink900};
  color: ${({ theme }) => rt(theme).color.white};
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
`;

const WordmarkText = styled.div`
  font-weight: 800;
  font-size: 17px;
  letter-spacing: -0.01em;
`;

const Panel = styled(Card)`
  padding: ${({ theme }) => rt(theme).space[8]};
  box-shadow: ${({ theme }) => rt(theme).shadow.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => rt(theme).space[6]};
`;

const Footer = styled.p`
  font-size: 12.5px;
  color: ${({ theme }) => rt(theme).color.ink500};
  margin: 0;
`;

export default {
  Screen,
  Wordmark,
  Mark,
  WordmarkText,
  Panel,
  Footer,
};
