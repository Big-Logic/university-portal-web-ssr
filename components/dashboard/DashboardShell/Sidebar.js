"use client";

import Link from "next/link";
import styled from "styled-components";
import { X, EllipsisVertical } from "lucide-react";
import { rt } from "@/lib/theme";
import { navForRole } from "@/lib/navigation";
import Brand from "./Brand";
import RegistrationPromo from "./RegistrationPromo";
import TimeDateCards from "./TimeDateCards";
import UserIdentity, { KebabButton } from "./UserIdentity";
import AccountMenuItems, { AccountMenuPanel } from "./AccountMenuPanel";
import { BREAKPOINT } from "./constants";

const SidebarAside = styled.aside`
  width: 260px;
  flex: none;
  position: sticky;
  top: 0;
  align-self: flex-start;
  height: 100vh;
  overflow-y: auto;
  background: ${({ theme }) => rt(theme).color.white};
  border-right: 1px solid ${({ theme }) => rt(theme).color.ink150};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => rt(theme).space[6]};
  padding: ${({ theme }) => rt(theme).space[6]}
    ${({ theme }) => rt(theme).space[4]};

  @media (max-width: ${BREAKPOINT}) {
    position: fixed;
    z-index: 50;
    left: 0;
    top: 0;
    box-shadow: ${({ theme, $open }) => ($open ? rt(theme).shadow.md : "none")};
    transform: translateX(${({ $open }) => ($open ? "0" : "-101%")});
    transition: transform 160ms ease-out;
  }
`;

const BrandRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 ${({ theme }) => rt(theme).space[1]};
`;

const CloseDrawerBtn = styled.button`
  display: none;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: ${({ theme }) => rt(theme).radius.pill};
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: transparent;
  color: ${({ theme }) => rt(theme).color.ink700};

  &:hover {
    background: ${({ theme }) => rt(theme).color.ink100};
  }

  @media (max-width: ${BREAKPOINT}) {
    display: flex;
  }
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: ${({ theme }) => rt(theme).radius.pill};
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  background: ${({ theme, $active }) =>
    $active ? rt(theme).color.blue600 : "transparent"};
  color: ${({ theme, $active }) =>
    $active ? rt(theme).color.white : rt(theme).color.ink700};
  text-decoration: none;

  &:hover {
    text-decoration: none;
    background: ${({ theme, $active }) =>
      $active ? rt(theme).color.blue600 : rt(theme).color.ink100};
    color: ${({ theme, $active }) =>
      $active ? rt(theme).color.white : rt(theme).color.ink900};
  }
`;

const Footer = styled.div`
  margin-top: auto;
  position: relative;
  padding-top: ${({ theme }) => rt(theme).space[4]};
  border-top: 1px solid ${({ theme }) => rt(theme).color.ink100};
`;

// The header's own time/date + identity cluster hides below
// BREAKPOINT (same width the sidebar turns into a drawer) -- this is
// where that information lives instead once it's gone from the header.
const MobileMeta = styled.div`
  display: none;

  @media (max-width: ${BREAKPOINT}) {
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => rt(theme).space[3]};
    margin-top: ${({ theme }) => rt(theme).space[4]};
    padding-top: ${({ theme }) => rt(theme).space[4]};
    border-top: 1px solid ${({ theme }) => rt(theme).color.ink100};
  }
`;

const IdentityRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const SidebarMenuPanel = styled(AccountMenuPanel)`
  position: absolute;
  bottom: 54px;
  left: 0;
  right: 0;
`;

export default function Sidebar({
  user,
  pathname,
  open,
  onCloseDrawer,
  now,
  menuOpen,
  onToggleMenu,
  onCloseMenu,
  menuRef,
  onLogout,
  signingOut,
}) {
  const nav = navForRole(user.role);

  return (
    <SidebarAside $open={open}>
      <BrandRow>
        <Brand />
        <CloseDrawerBtn onClick={onCloseDrawer} aria-label="Close menu">
          <X size={16} aria-hidden="true" />
        </CloseDrawerBtn>
      </BrandRow>

      <Nav>
        {nav.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <NavLink
              key={item.href}
              href={item.href}
              $active={active}
              onClick={onCloseDrawer}
            >
              <Icon size={17} aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </Nav>

      <Footer ref={menuRef}>
        <RegistrationPromo />

        {now && (
          <MobileMeta>
            <TimeDateCards now={now} />

            <IdentityRow>
              <UserIdentity user={user} />
              <KebabButton
                type="button"
                $open={menuOpen}
                onClick={onToggleMenu}
                aria-label="More options"
                aria-expanded={menuOpen}
              >
                <EllipsisVertical size={18} aria-hidden="true" />
              </KebabButton>
            </IdentityRow>
          </MobileMeta>
        )}

        {menuOpen && (
          <SidebarMenuPanel>
            <AccountMenuItems
              user={user}
              onNavigate={onCloseMenu}
              onLogout={onLogout}
              signingOut={signingOut}
            />
          </SidebarMenuPanel>
        )}
      </Footer>
    </SidebarAside>
  );
}
