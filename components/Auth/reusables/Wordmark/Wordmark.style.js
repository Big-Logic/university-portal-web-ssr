import styled from "styled-components";
import { rt } from "@/lib/style/theme";

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => rt(theme).space[3]};
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

const Text = styled.div`
  font-weight: 800;
  font-size: 17px;
  letter-spacing: -0.01em;
`;

export default {
  Row,
  Mark,
  Text,
};
