"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { rt } from "@/lib/theme";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import { BREAKPOINT, CONTENT_MAX_WIDTH } from "./constants";

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

const Main = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
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

export default function DashboardShell({ user, children }) {
  const pathname = usePathname();
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

  // One listener for both dropdowns rather than one per menu -- header
  // and sidebar kebabs never open at the same time in practice, but
  // each still needs its own outside-click check since they sit in
  // unrelated parts of the tree with no shared ancestor to bail out on.
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

      <Sidebar
        user={user}
        pathname={pathname}
        open={drawerOpen}
        onCloseDrawer={() => setDrawerOpen(false)}
        now={now}
        menuOpen={sidebarMenuOpen}
        onToggleMenu={() => setSidebarMenuOpen((v) => !v)}
        onCloseMenu={() => setSidebarMenuOpen(false)}
        menuRef={sidebarMenuRef}
        onLogout={handleLogout}
        signingOut={signingOut}
      />

      <Main>
        <DashboardHeader
          user={user}
          now={now}
          menuOpen={headerMenuOpen}
          onToggleMenu={() => setHeaderMenuOpen((v) => !v)}
          onCloseMenu={() => setHeaderMenuOpen(false)}
          menuRef={headerMenuRef}
          onLogout={handleLogout}
          signingOut={signingOut}
          onOpenDrawer={() => setDrawerOpen(true)}
        />

        <ContentArea>{children}</ContentArea>
      </Main>
    </Shell>
  );
}
