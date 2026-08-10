import styled from "styled-components";
import Link from "next/link";
import { rt } from "@/lib/style/theme";

// Styles shared across this folder: the pieces both panels use.
// Anything only one of them renders lives in that component's own
// .style.js beside it -- the same split as PasswordReset next door.

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

// next/link here, unlike /reset-password's plain anchor: nothing on
// this route touches cookies, so there's no cookie change Proxy needs a
// fresh request to notice -- a signed-out visitor going back to sign in
// is just navigation.
const BackLink = styled(Link)`
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export default {
  Divider,
  FootRow,
  BackLink,
};
