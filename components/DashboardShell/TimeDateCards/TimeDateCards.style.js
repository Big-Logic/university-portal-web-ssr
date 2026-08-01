import styled from "styled-components";
import { rt } from "@/lib/theme";

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => rt(theme).space[2]};
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 5px 12px;
  border-radius: ${({ theme }) => rt(theme).radius.md};
  background: ${({ theme }) => rt(theme).color.ink50};
`;

const Label = styled.span`
  font-size: 11px;
  color: ${({ theme }) => rt(theme).color.ink500};
`;

const Value = styled.span`
  font-size: 13.5px;
  font-weight: 500;
  color: ${({ theme }) => rt(theme).color.ink900};
`;

const ValueMono = styled(Value)`
  font-family: ${({ theme }) => rt(theme).font.mono};
`;

export default {
  Row,
  Card,
  Label,
  Value,
  ValueMono,
};
