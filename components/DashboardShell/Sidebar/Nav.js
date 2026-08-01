"use client";

import { usePathname } from "next/navigation";
import { navForRole } from "@/lib/navigation";
import S from "./Sidebar.style";

// `user` here is the lightweight { id, role } from getCurrentUser()
// (app/(dashboard)/layout.js reads it once, server-side, from headers
// Proxy already verified -- no network call), not the full profile
// UserIdentity/AccountMenuPanel fetch client-side. Role is all nav
// items need.
export default function Nav({ user, onCloseDrawer }) {
  const pathname = usePathname();
  const nav = user ? navForRole(user.role) : [];

  return (
    <S.Nav>
      {nav.map((item) => {
        const Icon = item.icon;
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <S.NavLink
            key={item.href}
            href={item.href}
            $active={active}
            onClick={onCloseDrawer}
          >
            <Icon size={17} aria-hidden="true" />
            <span>{item.label}</span>
          </S.NavLink>
        );
      })}
    </S.Nav>
  );
}
