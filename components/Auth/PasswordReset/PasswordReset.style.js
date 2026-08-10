import styled from "styled-components";
import { rt } from "@/lib/style/theme";

// Styles shared across this folder: the pieces more than one of the
// three panels uses. Anything only a single component renders lives in
// that component's own .style.js beside it -- the same split as
// DashboardShell uses. Anything a screen outside this folder also needs
// belongs in Auth/reusables instead.

const iconTones = {
  success: (t) => ({ bg: t.color.green100, fg: t.color.green600 }),
  warning: (t) => ({ bg: t.color.amber100, fg: t.color.amber600 }),
};

// One component with a tone rather than a base plus a styled() variant
// per panel: the two icons differ only in colour, and inheriting across
// component folders would put the success panel's styles on the
// dead-link panel's import path for no reason.
const PanelIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => rt(theme).radius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  background: ${({ theme, $tone = "success" }) =>
    iconTones[$tone](rt(theme)).bg};
  color: ${({ theme, $tone = "success" }) => iconTones[$tone](rt(theme)).fg};
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

// A plain anchor, not next/link, everywhere on this route. Every exit
// from here either follows a password reset that just cleared both
// cookies or leaves a signed-out user where they already were -- and in
// the first case Proxy has to see a fresh request to notice the cookies
// are gone. A client-side transition wouldn't guarantee that, the same
// reasoning as login and logout.
const BackLink = styled.a`
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

// The primary action on both dead-end panels is a navigation, so it has
// to be an anchor -- middle-click and "open in new tab" should work,
// and a <button> would break both. Styled to match Button's primary
// variant rather than reaching for it, since that component is a
// <button> all the way down.
const PrimaryLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 8px;
  font-family: ${({ theme }) => rt(theme).font.sans};
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  border-radius: ${({ theme }) => rt(theme).radius.pill};
  padding: 11px 22px;
  border: 1.5px solid transparent;
  background: ${({ theme }) => rt(theme).color.blue600};
  color: ${({ theme }) => rt(theme).color.white};
  transition: background 0.15s ease;

  &:hover {
    background: ${({ theme }) => rt(theme).color.blue700};
    color: ${({ theme }) => rt(theme).color.white};
    text-decoration: none;
  }
`;

export default {
  PanelIcon,
  Divider,
  FootRow,
  BackLink,
  PrimaryLink,
};
