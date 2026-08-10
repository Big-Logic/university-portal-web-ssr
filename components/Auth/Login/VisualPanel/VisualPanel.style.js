import styled from "styled-components";
import { rt } from "@/lib/style/theme";

// Decoration only, so it's the half that goes when there isn't room for
// both. Hidden rather than stacked below the form: pushed under the
// fold it would add scroll to a screen whose whole job is one short
// form.
const Side = styled.div`
  position: relative;
  overflow: hidden;
  background: ${({ theme }) => rt(theme).color.ink900};

  @media (max-width: 860px) {
    display: none;
  }
`;

const Pattern = styled.div`
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    ${({ theme }) => rt(theme).color.blue700} 1px,
    transparent 1px
  );
  background-size: 28px 28px;
  opacity: 0.25;
`;

const Content = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: ${({ theme }) => rt(theme).space[12]};
`;

const Quote = styled.p`
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

const Caption = styled.p`
  color: ${({ theme }) => rt(theme).color.ink300};
  font-size: 14px;
  max-width: 420px;
  margin: 0;
`;

export default {
  Side,
  Pattern,
  Content,
  Quote,
  Caption,
};
