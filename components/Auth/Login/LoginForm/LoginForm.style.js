import styled from "styled-components";
import { rt } from "@/lib/style/theme";

// FormCard is plain block flow, unlike the recovery panels' flex
// column, so there's no gap to inherit -- this is where the space
// between the intro and the form comes from on this screen.
const Intro = styled.div`
  margin-bottom: ${({ theme }) => rt(theme).space[6]};
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

export default {
  Intro,
  FormEl,
  RememberRow,
  Footer,
};
