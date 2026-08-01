"use client";

import { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import S from "./DashboardShell.style";

export default function DashboardShell({ children, user }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const [sidebarMenuOpen, setSidebarMenuOpen] = useState(false);
  const headerMenuRef = useRef(null);
  const sidebarMenuRef = useRef(null);

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

  return (
    <S.Shell>
      <S.Scrim $open={drawerOpen} onClick={() => setDrawerOpen(false)} />

      {/* children is already server-rendered page content -- it
          doesn't wait on any client-side identity fetch. `user` here
          is only the lightweight { id, role } this layout already had
          on hand for the login check, threaded down for Sidebar's nav
          -- the identity-dependent chrome (avatar, name, account menu)
          still fetches and gates on the full profile itself. */}
      <Sidebar
        user={user}
        open={drawerOpen}
        onCloseDrawer={() => setDrawerOpen(false)}
        menuOpen={sidebarMenuOpen}
        onToggleMenu={() => setSidebarMenuOpen((v) => !v)}
        onCloseMenu={() => setSidebarMenuOpen(false)}
        menuRef={sidebarMenuRef}
      />

      <S.Main>
        <DashboardHeader
          menuOpen={headerMenuOpen}
          onToggleMenu={() => setHeaderMenuOpen((v) => !v)}
          onCloseMenu={() => setHeaderMenuOpen(false)}
          menuRef={headerMenuRef}
          onOpenDrawer={() => setDrawerOpen(true)}
        />

        <S.ContentArea>{children}</S.ContentArea>
      </S.Main>
    </S.Shell>
  );
}
