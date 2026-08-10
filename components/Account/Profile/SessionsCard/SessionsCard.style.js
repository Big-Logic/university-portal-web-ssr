import styled from "styled-components";
import { rt } from "@/lib/style/theme";

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => rt(theme).space[4]};
  margin-top: ${({ theme }) => rt(theme).space[4]};
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => rt(theme).space[3]};
`;

const Icon = styled.div`
  width: 34px;
  height: 34px;
  flex: none;
  border-radius: ${({ theme }) => rt(theme).radius.md};
  background: ${({ theme }) => rt(theme).color.ink100};
  color: ${({ theme }) => rt(theme).color.ink700};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Body = styled.div`
  flex: 1;
  min-width: 0;
`;

const Device = styled.div`
  font-size: 13.5px;
  font-weight: 700;
`;

const Meta = styled.div`
  font-size: 12.5px;
  color: ${({ theme }) => rt(theme).color.ink500};
  margin-top: ${({ theme }) => rt(theme).space[1]};
`;

// Text, not a button. The design has a "Sign out" action per row and
// there is no endpoint behind it (see lib/sample-data.js), so this
// marks the current device and says nothing it can't do.
const Current = styled.span`
  font-size: 12.5px;
  font-weight: 700;
  color: ${({ theme }) => rt(theme).color.ink500};
  flex: none;
`;

const Footnote = styled.p`
  font-size: 12.5px;
  color: ${({ theme }) => rt(theme).color.ink500};
  margin: ${({ theme }) => rt(theme).space[4]} 0 0;
  text-wrap: pretty;
`;

export default {
  List,
  Item,
  Icon,
  Body,
  Device,
  Meta,
  Current,
  Footnote,
};
