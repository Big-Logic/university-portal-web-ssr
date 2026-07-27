"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import {
  Menu,
  X,
  GraduationCap,
  LogOut,
  FileClock,
  EllipsisVertical,
  User,
  UserCircle,
  Settings,
  FileText,
  CalendarPlus,
} from "lucide-react";
import { rt } from "@/lib/theme";
import { navForRole } from "@/lib/navigation";
import { Badge } from "@/components/ui/primitives";
import Button from "@/components/ui/Button";
import HeaderActions from "@/components/dashboard/HeaderActions";
import { REGISTRATION_WINDOW } from "@/lib/sample-data";

// Single breakpoint: above it the sidebar is a static column, below it
// it becomes an off-canvas drawer toggled from the header. Matches the
// "consistent shell, only the nav contents change per role" brief --
// there's exactly one layout, not a separate mobile design.
const BREAKPOINT = "960px";
const CONTENT_MAX_WIDTH = "1400px";

const Shell = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ theme }) => rt(theme).color.ink50};
`;

const Scrim = styled.div`
  display: none;
  position: fixed;
  inset: 0;
  z-index: 45;
  background: rgba(26, 32, 41, 0.4);

  @media (max-width: ${BREAKPOINT}) {
    display: ${({ $open }) => ($open ? "block" : "none")};
  }
`;

const Sidebar = styled.aside`
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

const Mark = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => rt(theme).radius.md};
  background: ${({ theme }) => rt(theme).color.ink900};
  color: ${({ theme }) => rt(theme).color.white};
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
`;

const BrandName = styled.div`
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.01em;
  flex: 1;
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

const SidebarFooter = styled.div`
  margin-top: auto;
  position: relative;
  padding-top: ${({ theme }) => rt(theme).space[4]};
  border-top: 1px solid ${({ theme }) => rt(theme).color.ink100};
`;

const SidebarMobileMeta = styled.div`
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

const SidebarMetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => rt(theme).space[2]};
`;

const SidebarIdentityRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const RegistrationCard = styled.div`
  background: ${({ theme }) => rt(theme).color.blue50};
  border-radius: ${({ theme }) => rt(theme).radius.lg};
  padding: ${({ theme }) => rt(theme).space[4]};
`;

const RegistrationHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
`;

const RegistrationLabel = styled.p`
  margin: 0;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => rt(theme).color.blue700};
`;

const RegistrationBody = styled.p`
  margin: 0 0 ${({ theme }) => rt(theme).space[4]};
  font-size: 13px;
  line-height: 1.45;
  color: ${({ theme }) => rt(theme).color.ink700};
`;

const IdentityName = styled.div`
  font-size: 13.5px;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const AccountMenu = styled.div`
  position: absolute;
  bottom: 54px;
  left: 0;
  right: 0;
  z-index: 60;
  background: ${({ theme }) => rt(theme).color.white};
  border: 1px solid ${({ theme }) => rt(theme).color.ink150};
  border-radius: ${({ theme }) => rt(theme).radius.lg};
  padding: ${({ theme }) => rt(theme).space[1]};
  box-shadow: ${({ theme }) => rt(theme).shadow.md};
`;

const AccountMenuHeader = styled.div`
  padding: 10px 12px 12px;
`;

const AccountMenuEmail = styled.div`
  font-size: 12.5px;
  color: ${({ theme }) => rt(theme).color.ink500};
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const AccountMenuDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => rt(theme).color.ink100};
  margin: 0 4px 6px;
`;

const AccountMenuItemLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: ${({ theme }) => rt(theme).radius.md};
  font-size: 13.5px;
  font-weight: 600;
  color: ${({ theme }) => rt(theme).color.ink700};
  text-decoration: none;

  &:hover {
    text-decoration: none;
    background: ${({ theme }) => rt(theme).color.ink50};
    color: ${({ theme }) => rt(theme).color.ink900};
  }
`;

const AccountMenuItemBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border: none;
  border-radius: ${({ theme }) => rt(theme).radius.md};
  font-size: 13.5px;
  font-weight: 600;
  color: ${({ theme }) => rt(theme).color.ink700};
  background: transparent;
  cursor: pointer;
  text-align: left;

  &:hover:not(:disabled) {
    background: ${({ theme }) => rt(theme).color.ink50};
    color: ${({ theme }) => rt(theme).color.ink900};
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const Main = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  padding: ${({ theme }) => rt(theme).space[4]}
    ${({ theme }) => rt(theme).space[8]};
  background: ${({ theme }) => rt(theme).color.white};
  border-bottom: 1px solid ${({ theme }) => rt(theme).color.ink150};

  @media (max-width: ${BREAKPOINT}) {
    padding: 12px 16px;
  }
`;

const HeaderInner = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: ${CONTENT_MAX_WIDTH};
  margin: 0 auto;
`;

const HeaderBrand = styled.div`
  display: none;
  align-items: center;
  gap: 10px;

  @media (max-width: ${BREAKPOINT}) {
    display: flex;
  }
`;

const MenuBtn = styled.button`
  display: none;
  width: 36px;
  height: 36px;
  flex: none;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => rt(theme).color.ink150};
  border-radius: ${({ theme }) => rt(theme).radius.pill};
  background: ${({ theme }) => rt(theme).color.white};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => rt(theme).color.ink100};
  }

  @media (max-width: ${BREAKPOINT}) {
    display: flex;
  }
`;

const HeaderRightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
`;

const HeaderMetaGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => rt(theme).space[2]};

  @media (max-width: ${BREAKPOINT}) {
    display: none;
  }
`;

const InfoCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 5px 12px;
  border-radius: ${({ theme }) => rt(theme).radius.md};
  background: ${({ theme }) => rt(theme).color.ink50};
`;

const InfoCardLabel = styled.span`
  font-size: 11px;
  color: ${({ theme }) => rt(theme).color.ink500};
`;

const InfoCardValue = styled.span`
  font-size: 13.5px;
  font-weight: 500;
  color: ${({ theme }) => rt(theme).color.ink900};
`;

const InfoCardValueMono = styled(InfoCardValue)`
  font-family: ${({ theme }) => rt(theme).font.mono};
`;

const HeaderIdentityGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 8px 5px 12px;
  border-radius: ${({ theme }) => rt(theme).radius.md};
  background: ${({ theme }) => rt(theme).color.ink50};

  @media (max-width: ${BREAKPOINT}) {
    display: none;
  }
`;

const HeaderIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HeaderAvatar = styled.div`
  width: 34px;
  height: 34px;
  flex: none;
  border-radius: ${({ theme }) => rt(theme).radius.pill};
  background: ${({ theme }) => rt(theme).color.blue100};
  color: ${({ theme }) => rt(theme).color.blue700};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeaderIdentityText = styled.div`
  min-width: 0;
`;

const HeaderIdentityName = styled.div`
  font-size: 13.5px;
  font-weight: 700;
  white-space: nowrap;
`;

const MoreMenuAnchor = styled.div`
  position: relative;
`;

const MoreBtn = styled.button`
  width: 34px;
  height: 34px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: ${({ theme }) => rt(theme).radius.pill};
  background: ${({ theme, $open }) =>
    $open ? rt(theme).color.ink100 : rt(theme).color.ink50};
  color: ${({ theme }) => rt(theme).color.ink700};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => rt(theme).color.ink100};
  }
`;

const MoreMenu = styled(AccountMenu)`
  position: absolute;
  top: 42px;
  bottom: auto;
  left: auto;
  right: 0;
  width: 240px;
`;

const HeaderDivider = styled.div`
  width: 1px;
  height: 24px;
  flex: none;
  background: ${({ theme }) => rt(theme).color.ink150};

  @media (max-width: ${BREAKPOINT}) {
    display: none;
  }
`;

const ContentArea = styled.main`
  flex: 1;
  width: 100%;
  max-width: ${CONTENT_MAX_WIDTH};
  margin: 0 auto;
  padding: ${({ theme }) => rt(theme).space[8]};

  @media (max-width: ${BREAKPOINT}) {
    padding: ${({ theme }) => rt(theme).space[4]};
  }
`;

function formatClock(date) {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatDate(date) {
  return date.toLocaleDateString([], {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function DashboardShell({ user, children }) {
  const pathname = usePathname();
  const nav = navForRole(user.role);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const [sidebarMenuOpen, setSidebarMenuOpen] = useState(false);
  const [now, setNow] = useState(null);
  const [signingOut, setSigningOut] = useState(false);
  const headerMenuRef = useRef(null);
  const sidebarMenuRef = useRef(null);

  // Deferred to a client-only effect on purpose: rendering a live
  // clock during SSR would bake in the server's render-time second,
  // guaranteeing a mismatch against the client's own Date on hydration.
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    function onClick(e) {
      if (headerMenuRef.current && !headerMenuRef.current.contains(e.target)) {
        setHeaderMenuOpen(false);
      }
      if (
        sidebarMenuRef.current &&
        !sidebarMenuRef.current.contains(e.target)
      ) {
        setSidebarMenuOpen(false);
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Proactively refreshes the access-token cookie for the whole time
  // the user is anywhere under /dashboard, not just on one page --
  // Proxy only re-checks on navigation, so a long-lived tab sitting on
  // a single module page still needs this to avoid expiring mid-session.
  useEffect(() => {
    let isMounted = true;

    async function refreshToken() {
      try {
        const res = await fetch("/api/auth/refresh", {
          method: "POST",
          cache: "no-store",
        });
        if (!isMounted) return;
        if (res.status === 401) {
          window.location.href = "/login";
        }
      } catch {
        // Network glitches shouldn't kick the user out; the next
        // interval or visibility change will retry silently.
      }
    }

    refreshToken();
    const intervalId = window.setInterval(refreshToken, 12 * 60 * 1000);

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") refreshToken();
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  async function handleLogout() {
    setSigningOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    // Full navigation, not router.push -- Proxy needs a fresh request
    // to see the now-cleared cookies before it decides where to send us.
    window.location.href = "/login";
  }

  return (
    <Shell>
      <Scrim $open={drawerOpen} onClick={() => setDrawerOpen(false)} />

      <Sidebar $open={drawerOpen}>
        <BrandRow>
          <Mark>
            <GraduationCap size={18} aria-hidden="true" />
          </Mark>
          <BrandName>Basecourse</BrandName>
          <CloseDrawerBtn
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          >
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
                onClick={() => setDrawerOpen(false)}
              >
                <Icon size={17} aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </Nav>

        <SidebarFooter ref={sidebarMenuRef}>
          <RegistrationCard>
            <RegistrationHead>
              <RegistrationLabel>
                {REGISTRATION_WINDOW.heading}
              </RegistrationLabel>
              <Badge $tone="neutral">Sample</Badge>
            </RegistrationHead>
            <RegistrationBody>{REGISTRATION_WINDOW.body}</RegistrationBody>
            <Button variant="primary" block>
              <CalendarPlus size={15} aria-hidden="true" />
              Register now
            </Button>
          </RegistrationCard>

          {now && (
            <SidebarMobileMeta>
              <SidebarMetaRow>
                <InfoCard>
                  <InfoCardLabel>Local time</InfoCardLabel>
                  <InfoCardValueMono>{formatClock(now)}</InfoCardValueMono>
                </InfoCard>
                <InfoCard>
                  <InfoCardLabel>Today</InfoCardLabel>
                  <InfoCardValue>{formatDate(now)}</InfoCardValue>
                </InfoCard>
              </SidebarMetaRow>

              <SidebarIdentityRow>
                <HeaderIdentity>
                  <HeaderAvatar>
                    <User size={17} aria-hidden="true" />
                  </HeaderAvatar>
                  <HeaderIdentityText>
                    <HeaderIdentityName>{user.fullName}</HeaderIdentityName>
                    <Badge $tone="accent">{user.role}</Badge>
                  </HeaderIdentityText>
                </HeaderIdentity>

                <MoreBtn
                  type="button"
                  $open={sidebarMenuOpen}
                  onClick={() => setSidebarMenuOpen((v) => !v)}
                  aria-label="More options"
                  aria-expanded={sidebarMenuOpen}
                >
                  <EllipsisVertical size={18} aria-hidden="true" />
                </MoreBtn>
              </SidebarIdentityRow>
            </SidebarMobileMeta>
          )}

          {sidebarMenuOpen && (
            <AccountMenu>
              <AccountMenuHeader>
                <IdentityName>{user.fullName}</IdentityName>
                <AccountMenuEmail>{user.email}</AccountMenuEmail>
              </AccountMenuHeader>
              <AccountMenuDivider />
              <AccountMenuItemLink
                href="/dashboard/profile"
                onClick={() => setSidebarMenuOpen(false)}
              >
                <UserCircle size={16} aria-hidden="true" />
                <span>Your profile</span>
              </AccountMenuItemLink>
              <AccountMenuItemLink
                href="/dashboard/settings"
                onClick={() => setSidebarMenuOpen(false)}
              >
                <Settings size={16} aria-hidden="true" />
                <span>Account settings</span>
              </AccountMenuItemLink>
              <AccountMenuItemLink
                href="/dashboard/transcript"
                onClick={() => setSidebarMenuOpen(false)}
              >
                <FileText size={16} aria-hidden="true" />
                <span>Request a transcript</span>
              </AccountMenuItemLink>
              <AccountMenuItemLink
                href="/dashboard/session"
                onClick={() => setSidebarMenuOpen(false)}
              >
                <FileClock size={16} aria-hidden="true" />
                <span>Session diagnostics</span>
              </AccountMenuItemLink>
              <AccountMenuDivider />
              <AccountMenuItemBtn onClick={handleLogout} disabled={signingOut}>
                <LogOut size={16} aria-hidden="true" />
                <span>{signingOut ? "Signing out…" : "Log out"}</span>
              </AccountMenuItemBtn>
            </AccountMenu>
          )}
        </SidebarFooter>
      </Sidebar>

      <Main>
        <Header>
          <HeaderInner>
            <HeaderBrand>
              <Mark>
                <GraduationCap size={18} aria-hidden="true" />
              </Mark>
              <BrandName>Basecourse</BrandName>
            </HeaderBrand>

            <HeaderRightGroup>
              <HeaderActions />

              {now && (
                <HeaderMetaGroup>
                  <InfoCard>
                    <InfoCardLabel>Local time</InfoCardLabel>
                    <InfoCardValueMono>{formatClock(now)}</InfoCardValueMono>
                  </InfoCard>
                  <InfoCard>
                    <InfoCardLabel>Today</InfoCardLabel>
                    <InfoCardValue>{formatDate(now)}</InfoCardValue>
                  </InfoCard>
                </HeaderMetaGroup>
              )}

              <HeaderDivider />

              <HeaderIdentityGroup>
                <HeaderIdentity>
                  <HeaderAvatar>
                    <User size={17} aria-hidden="true" />
                  </HeaderAvatar>
                  <HeaderIdentityText>
                    <HeaderIdentityName>{user.fullName}</HeaderIdentityName>
                    <Badge $tone="accent">{user.role}</Badge>
                  </HeaderIdentityText>
                </HeaderIdentity>

                <MoreMenuAnchor ref={headerMenuRef}>
                  <MoreBtn
                    type="button"
                    $open={headerMenuOpen}
                    onClick={() => setHeaderMenuOpen((v) => !v)}
                    aria-label="More options"
                    aria-expanded={headerMenuOpen}
                  >
                    <EllipsisVertical size={18} aria-hidden="true" />
                  </MoreBtn>

                  {headerMenuOpen && (
                    <MoreMenu>
                      <AccountMenuHeader>
                        <IdentityName>{user.fullName}</IdentityName>
                        <AccountMenuEmail>{user.email}</AccountMenuEmail>
                      </AccountMenuHeader>
                      <AccountMenuDivider />
                      <AccountMenuItemLink
                        href="/dashboard/profile"
                        onClick={() => setHeaderMenuOpen(false)}
                      >
                        <UserCircle size={16} aria-hidden="true" />
                        <span>Your profile</span>
                      </AccountMenuItemLink>
                      <AccountMenuItemLink
                        href="/dashboard/settings"
                        onClick={() => setHeaderMenuOpen(false)}
                      >
                        <Settings size={16} aria-hidden="true" />
                        <span>Account settings</span>
                      </AccountMenuItemLink>
                      <AccountMenuItemLink
                        href="/dashboard/transcript"
                        onClick={() => setHeaderMenuOpen(false)}
                      >
                        <FileText size={16} aria-hidden="true" />
                        <span>Request a transcript</span>
                      </AccountMenuItemLink>
                      <AccountMenuItemLink
                        href="/dashboard/session"
                        onClick={() => setHeaderMenuOpen(false)}
                      >
                        <FileClock size={16} aria-hidden="true" />
                        <span>Session diagnostics</span>
                      </AccountMenuItemLink>
                      <AccountMenuDivider />
                      <AccountMenuItemBtn
                        onClick={handleLogout}
                        disabled={signingOut}
                      >
                        <LogOut size={16} aria-hidden="true" />
                        <span>{signingOut ? "Signing out…" : "Log out"}</span>
                      </AccountMenuItemBtn>
                    </MoreMenu>
                  )}
                </MoreMenuAnchor>
              </HeaderIdentityGroup>
            </HeaderRightGroup>

            <MenuBtn onClick={() => setDrawerOpen(true)} aria-label="Open menu">
              <Menu size={18} aria-hidden="true" />
            </MenuBtn>
          </HeaderInner>
        </Header>

        <ContentArea>{children}</ContentArea>
      </Main>
    </Shell>
  );
}
