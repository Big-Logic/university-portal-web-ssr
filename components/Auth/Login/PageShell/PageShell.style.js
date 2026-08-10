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

// The rule under the wordmark is this screen's alone: the recovery
// screens float their wordmark over the page background, while here it
// caps a column that has a second column beside it.
const Header = styled.div`
  padding: ${({ theme }) => rt(theme).space[4]}
    ${({ theme }) => rt(theme).space[6]};
  border-bottom: 1px solid ${({ theme }) => rt(theme).color.ink150};
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
  FormCenter,
  FormCard,
};
