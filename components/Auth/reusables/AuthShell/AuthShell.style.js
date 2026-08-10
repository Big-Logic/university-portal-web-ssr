import styled from "styled-components";
import { rt } from "@/lib/style/theme";
import { Card } from "@/components/ui/primitives";

// Single centred column rather than login's split screen: there's no
// marketing panel on the recovery screens, and they're a detour off the
// sign-in flow -- keeping them narrow signals "small errand, then back"
// rather than "second front door".
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
  Panel,
  Footer,
};
