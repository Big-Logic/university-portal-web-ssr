import styled from "styled-components";
import { rt } from "@/lib/style/theme";

const SuccessIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => rt(theme).radius.md};
  background: ${({ theme }) => rt(theme).color.green100};
  color: ${({ theme }) => rt(theme).color.green600};
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
`;

// The address the link went to, inside Sub -- lifted out of the
// secondary grey so the one detail worth proofreading is the one that
// reads first.
const Strong = styled.span`
  font-weight: 700;
  color: ${({ theme }) => rt(theme).color.ink900};
`;

const Steps = styled.div`
  border: 1px solid ${({ theme }) => rt(theme).color.ink150};
  border-radius: ${({ theme }) => rt(theme).radius.md};
  padding: ${({ theme }) => rt(theme).space[4]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => rt(theme).space[3]};
`;

const StepsTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
`;

const Step = styled.div`
  display: flex;
  gap: ${({ theme }) => rt(theme).space[3]};
  font-size: 13px;
  color: ${({ theme }) => rt(theme).color.ink700};
`;

// Mono for the numerals so they share a width and the two lines of
// text start on the same left edge without a list marker.
const StepNum = styled.span`
  font-family: ${({ theme }) => rt(theme).font.mono};
  color: ${({ theme }) => rt(theme).color.ink500};
`;

const StepText = styled.span`
  flex: 1;
  text-wrap: pretty;
`;

// A button, not a link: it swaps the panel back to the form rather
// than navigating, so anything that reads it as a destination (middle
// click, "open in new tab", a screen reader's link list) would be
// wrong about what it does.
const LinkAction = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => rt(theme).color.blue700};

  &:hover {
    text-decoration: underline;
  }
`;

export default {
  SuccessIcon,
  Strong,
  Steps,
  StepsTitle,
  Step,
  StepNum,
  StepText,
  LinkAction,
};
