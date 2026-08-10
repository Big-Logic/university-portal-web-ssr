import styled from "styled-components";
import { rt } from "@/lib/style/theme";

// One look for every signed-out panel, and it's /login's. The recovery
// screens used to run a size larger and heavier off their own copy of
// these rules; they follow the front door now, so nobody moving from
// sign-in to a reset and back crosses two type scales on the way.

const Eyebrow = styled.p`
  font-family: ${({ theme }) => rt(theme).font.mono};
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => rt(theme).color.blue700};
  margin: 0 0 4px;
`;

const Heading = styled.h1`
  font-size: 24px;
  margin-bottom: 4px;
`;

// No trailing margin, deliberately: the recovery panels sit in a flex
// column with a gap of its own, and a flex item establishes its own
// formatting context -- a bottom margin here couldn't collapse out of
// the wrapper div and would stack on that gap instead. Whatever follows
// the intro is spaced by its container, which on /login means the rule
// on LoginForm's own Intro.
const Sub = styled.p`
  color: ${({ theme }) => rt(theme).color.ink500};
  font-size: 14px;
  margin: 0;
`;

export default {
  Eyebrow,
  Heading,
  Sub,
};
