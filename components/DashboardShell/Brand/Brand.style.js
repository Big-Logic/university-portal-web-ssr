import styled from "styled-components";
import { rt } from "@/lib/theme";

const Mark = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => rt(theme).radius.md};
  background: ${({ theme }) => rt(theme).color.ink900};
  color: ${({ theme }) => rt(theme).color.white};
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
`;

const Name = styled.div`
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.01em;
  flex: 1;
`;

export default {
  Mark,
  Name,
};
