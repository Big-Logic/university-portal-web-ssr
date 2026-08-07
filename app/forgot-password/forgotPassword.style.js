import styled from "styled-components";
import Link from "next/link";
import { rt } from "@/lib/theme";
import { Card } from "@/components/ui/primitives";

// Single centred column rather than login's split screen: there's no
// marketing panel here, and the page is a detour off the sign-in flow
// -- keeping it narrow signals "small errand, then back" rather than
// "second front door".
const Screen = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => rt(theme).color.ink50};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => rt(theme).space[6]};
  padding: ${({ theme }) => rt(theme).space[8]}
    ${({ theme }) => rt(theme).space[6]};
`;

const Wordmark = styled.div`
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

const WordmarkText = styled.div`
  font-weight: 800;
  font-size: 17px;
  letter-spacing: -0.01em;
`;

const Panel = styled(Card)`
  padding: ${({ theme }) => rt(theme).space[8]};
  box-shadow: ${({ theme }) => rt(theme).shadow.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => rt(theme).space[6]};
`;

const Eyebrow = styled.p`
  font-size: 12.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => rt(theme).color.ink500};
  margin: 0 0 ${({ theme }) => rt(theme).space[2]};
`;

const Heading = styled.h1`
  font-size: 26px;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.02em;
`;

const Sub = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: ${({ theme }) => rt(theme).color.ink500};
  margin: ${({ theme }) => rt(theme).space[2]} 0 0;
  text-wrap: pretty;
`;

// The address the link went to, inside Sub -- lifted out of the
// secondary grey so the one detail worth proofreading is the one that
// reads first.
const Strong = styled.span`
  font-weight: 700;
  color: ${({ theme }) => rt(theme).color.ink900};
`;

const FormEl = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => rt(theme).space[4]};
`;

const Hint = styled.p`
  font-size: 12.5px;
  color: ${({ theme }) => rt(theme).color.ink500};
  margin: ${({ theme }) => rt(theme).space[2]} 0 0;
`;

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

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => rt(theme).color.ink100};
`;

const FootRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => rt(theme).space[3]};
  flex-wrap: wrap;
  font-size: 13px;
  color: ${({ theme }) => rt(theme).color.ink500};
`;

const BackLink = styled(Link)`
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
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

const Footer = styled.p`
  font-size: 12.5px;
  color: ${({ theme }) => rt(theme).color.ink500};
  margin: 0;
`;

export default {
  Screen,
  Wordmark,
  Mark,
  WordmarkText,
  Panel,
  Eyebrow,
  Heading,
  Sub,
  Strong,
  FormEl,
  Hint,
  SuccessIcon,
  Steps,
  StepsTitle,
  Step,
  StepNum,
  StepText,
  Divider,
  FootRow,
  BackLink,
  LinkAction,
  Footer,
};
