import styled from "styled-components";
import { rt } from "@/lib/style/theme";

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

export default {
  Eyebrow,
  Heading,
  Sub,
  FormEl,
  RememberRow,
  Footer,
};
