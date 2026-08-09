import styled from "styled-components";
import { rt } from "@/lib/style/theme";
import { Card } from "@/components/ui/primitives";

// Two columns rather than /reset-password's centred single one: this is
// the front door, so it gets the marketing half. Below 860px that half
// is dropped entirely (see VisualPanel.style.js) and what's left is the
// same centred card as the recovery screens.
const Screen = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: ${({ theme }) => rt(theme).color.ink50};

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const FormSide = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => rt(theme).space[3]};
  padding: ${({ theme }) => rt(theme).space[4]}
    ${({ theme }) => rt(theme).space[6]};
  border-bottom: 1px solid ${({ theme }) => rt(theme).color.ink150};
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

const FormCenter = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => rt(theme).space[6]};
`;

const FormCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  box-shadow: ${({ theme }) => rt(theme).shadow.md};
`;

export default {
  Screen,
  FormSide,
  Header,
  Mark,
  WordmarkText,
  FormCenter,
  FormCard,
};
