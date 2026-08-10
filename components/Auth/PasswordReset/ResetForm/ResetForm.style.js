import styled from "styled-components";
import { rt } from "@/lib/style/theme";

const FormEl = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => rt(theme).space[4]};
`;

export default {
  FormEl,
};
