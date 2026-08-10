import styled from "styled-components";
import { rt } from "@/lib/style/theme";
import { Card } from "@/components/ui/primitives";

// Styles shared across this folder: the card shell every panel sits in
// and the label/value row three of them use. Anything only one card
// renders lives in that card's own .style.js beside it -- the same
// split as Auth next door.

const Screen = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => rt(theme).space[6]};
`;

// Two columns, weighted toward the editing side: the left column is
// where the work happens and the right is reference. Below 1100px they
// stack, which is also where the dashboard sidebar has already
// collapsed -- one breakpoint, not two competing ones.
const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr);
  align-items: start;
  gap: ${({ theme }) => rt(theme).space[6]};

  @media (max-width: 1100px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => rt(theme).space[6]};
`;

const Panel = styled(Card)`
  padding: ${({ theme }) => rt(theme).space[6]};
`;

const PanelHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => rt(theme).space[3]};
  flex-wrap: wrap;
`;

const PanelTitle = styled.h2`
  font-size: 17px;
  font-weight: 700;
`;

const PanelSub = styled.p`
  font-size: 13.5px;
  color: ${({ theme }) => rt(theme).color.ink500};
  margin: ${({ theme }) => rt(theme).space[1]} 0 0;
  text-wrap: pretty;
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => rt(theme).color.ink100};
`;

// Label left, value right, both on the same baseline. The value can be
// long (an email address) and the label never is, so the value is what
// gets to shrink and wrap.
const MetaRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => rt(theme).space[4]};
`;

const MetaLabel = styled.span`
  font-size: 13px;
  color: ${({ theme }) => rt(theme).color.ink500};
  flex: none;
`;

const MetaValue = styled.span`
  font-size: 13px;
  font-weight: 600;
  text-align: right;
  min-width: 0;
  overflow-wrap: anywhere;
`;

export default {
  Screen,
  Grid,
  Column,
  Panel,
  PanelHead,
  PanelTitle,
  PanelSub,
  Divider,
  MetaRow,
  MetaLabel,
  MetaValue,
};
