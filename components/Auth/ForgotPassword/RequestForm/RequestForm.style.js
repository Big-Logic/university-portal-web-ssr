import styled from "styled-components";
import { rt } from "@/lib/style/theme";

const FormEl = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => rt(theme).space[4]};
`;

const Hint = styled.p`
  font-size: 12.5px;
  color: ${({ theme }) => rt(theme).color.ink500};
  margin: ${({ theme }) => rt(theme).space[2]} 0 0;
`;

export default {
  FormEl,
  Hint,
};
