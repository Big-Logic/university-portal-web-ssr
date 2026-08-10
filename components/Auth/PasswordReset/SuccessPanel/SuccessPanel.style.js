import styled from "styled-components";
import { rt } from "@/lib/style/theme";

const Note = styled.p`
  font-size: 13px;
  line-height: 1.6;
  color: ${({ theme }) => rt(theme).color.ink500};
  margin: 0;
  text-wrap: pretty;
`;

export default { Note };
