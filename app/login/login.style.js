import styled from "styled-components";
import { rt } from "@/lib/theme";
import { Card } from "@/components/ui/primitives";

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

const Eyebrow = styled.p`
  font-family: ${({ theme }) => rt(theme).font.mono};
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => rt(theme).color.blue700};
  margin: 0 0 4px;
`;

const Heading = styled.h1`
  font-size: 24px;
  margin-bottom: 4px;
`;

const Sub = styled.p`
  color: ${({ theme }) => rt(theme).color.ink500};
  font-size: 14px;
  margin: 0 0 ${({ theme }) => rt(theme).space[6]};
`;

const FormEl = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => rt(theme).space[4]};
`;

const RememberRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${({ theme }) => rt(theme).color.ink700};
  cursor: pointer;
`;

const Footer = styled.p`
  text-align: center;
  font-size: 13.5px;
  color: ${({ theme }) => rt(theme).color.ink500};
  margin-top: ${({ theme }) => rt(theme).space[4]};
`;

const VisualSide = styled.div`
  position: relative;
  overflow: hidden;
  background: ${({ theme }) => rt(theme).color.ink900};

  @media (max-width: 860px) {
    display: none;
  }
`;

const VisualPattern = styled.div`
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    ${({ theme }) => rt(theme).color.blue700} 1px,
    transparent 1px
  );
  background-size: 28px 28px;
  opacity: 0.25;
`;

const VisualContent = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: ${({ theme }) => rt(theme).space[12]};
`;

const VisualQuote = styled.p`
  color: ${({ theme }) => rt(theme).color.white};
  font-size: 30px;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.01em;
  max-width: 460px;
  margin: 0 0 ${({ theme }) => rt(theme).space[4]};

  span {
    color: ${({ theme }) => rt(theme).color.blue100};
  }
`;

const VisualCaption = styled.p`
  color: ${({ theme }) => rt(theme).color.ink300};
  font-size: 14px;
  max-width: 420px;
  margin: 0;
`;

export default {
  Screen,
  FormSide,
  Header,
  Mark,
  WordmarkText,
  FormCenter,
  FormCard,
  Eyebrow,
  Heading,
  Sub,
  FormEl,
  RememberRow,
  Footer,
  VisualSide,
  VisualPattern,
  VisualContent,
  VisualQuote,
  VisualCaption,
};
