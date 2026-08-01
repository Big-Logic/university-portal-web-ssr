import styled from "styled-components";
import { rt } from "@/lib/theme";

const Card = styled.div`
  background: ${({ theme }) => rt(theme).color.blue50};
  border-radius: ${({ theme }) => rt(theme).radius.lg};
  padding: ${({ theme }) => rt(theme).space[4]};
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
`;

const Label = styled.p`
  margin: 0;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => rt(theme).color.blue700};
`;

const Body = styled.p`
  margin: 0 0 ${({ theme }) => rt(theme).space[4]};
  font-size: 13px;
  line-height: 1.45;
  color: ${({ theme }) => rt(theme).color.ink700};
`;

export default {
  Card,
  Head,
  Label,
  Body,
};
