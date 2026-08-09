import styled, { css } from "styled-components";
import { rt } from "@/lib/style/theme";

const tones = {
  danger: (t) => t.color.red600,
  warning: (t) => t.color.amber600,
  success: (t) => t.color.green600,
};

// Sits under the password input and inside its label's spacing, so the
// meter and checklist read as part of that field rather than as a
// separate block between the two inputs.
const Block = styled.div`
  margin-top: ${({ theme }) => rt(theme).space[3]};
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => rt(theme).space[2]};
`;

const MeterTrack = styled.div`
  flex: 1;
  height: 6px;
  border-radius: ${({ theme }) => rt(theme).radius.pill};
  background: ${({ theme }) => rt(theme).color.ink100};
  overflow: hidden;
`;

// Width and colour both animate: the bar is the only part of the form
// that reacts per keystroke, so an instant jump reads as a glitch
// rather than as feedback.
const MeterFill = styled.div`
  height: 100%;
  border-radius: ${({ theme }) => rt(theme).radius.pill};
  width: ${({ $width }) => $width};
  background: ${({ theme, $tone }) =>
    $tone ? tones[$tone](rt(theme)) : "transparent"};
  transition: width 0.12s ease-out, background 0.12s ease-out;
`;

// Fixed width so the bar doesn't resize as the word changes length --
// otherwise "Strong" nudges the whole meter wider than "Fair".
const MeterLabel = styled.div`
  font-size: 12.5px;
  font-weight: 700;
  min-width: 62px;
  text-align: right;
  color: ${({ theme, $tone }) =>
    $tone ? tones[$tone](rt(theme)) : rt(theme).color.ink500};
`;

const RuleList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Rule = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => rt(theme).space[2]};
`;

const RuleDot = styled.span`
  width: 16px;
  height: 16px;
  flex: none;
  border-radius: ${({ theme }) => rt(theme).radius.pill};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => rt(theme).color.white};

  ${({ theme, $met }) =>
    $met
      ? css`
          background: ${rt(theme).color.green600};
          border: 1px solid ${rt(theme).color.green600};
        `
      : css`
          background: ${rt(theme).color.white};
          border: 1.5px solid ${rt(theme).color.ink150};
        `}
`;

const RuleText = styled.span`
  font-size: 12.5px;
  color: ${({ theme, $met }) =>
    $met ? rt(theme).color.ink700 : rt(theme).color.ink500};
`;

export default {
  Block,
  Row,
  MeterTrack,
  MeterFill,
  MeterLabel,
  RuleList,
  Rule,
  RuleDot,
  RuleText,
};
