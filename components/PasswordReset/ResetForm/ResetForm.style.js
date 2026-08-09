import styled from "styled-components";
import { rt } from "@/lib/theme";

const Eyebrow = styled.p`
  font-size: 12.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => rt(theme).color.ink500};
  margin: 0 0 ${({ theme }) => rt(theme).space[2]};
`;

const FormEl = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => rt(theme).space[4]};
`;

export default {
  Eyebrow,
  FormEl,
};
