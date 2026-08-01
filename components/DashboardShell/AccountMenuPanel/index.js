"use client";

import { UserCircle, Settings, FileText, FileClock, LogOut } from "lucide-react";
import useCurrentUser from "@/hooks/useCurrentUser";
import useLogout from "@/hooks/useLogout";
import S, { AccountMenuPanel } from "./AccountMenuPanel.style";

export { AccountMenuPanel };

// Shared dropdown content for both the header's and the mobile
// sidebar's "more options" kebab -- identical items, just anchored
// differently by each caller via AccountMenuPanel. Owns its own
// logout call (same reasoning as useCurrentUser above it): this is
// the actual "Log out" button, both callers just anchor it.
export default function AccountMenuItems({ onNavigate }) {
  const user = useCurrentUser();
  const { handleLogout, signingOut } = useLogout();
  if (!user) return null;

  return (
    <>
      <S.Header>
        <S.Name>{user.fullName}</S.Name>
        <S.Email>{user.email}</S.Email>
      </S.Header>
      <S.Divider />
      <S.ItemLink href="/account/profile" onClick={onNavigate}>
        <UserCircle size={16} aria-hidden="true" />
        <span>Your profile</span>
      </S.ItemLink>
      <S.ItemLink href="/account/settings" onClick={onNavigate}>
        <Settings size={16} aria-hidden="true" />
        <span>Account settings</span>
      </S.ItemLink>
      <S.ItemLink href="/account/transcript" onClick={onNavigate}>
        <FileText size={16} aria-hidden="true" />
        <span>Request a transcript</span>
      </S.ItemLink>
      <S.ItemLink href="/account/session" onClick={onNavigate}>
        <FileClock size={16} aria-hidden="true" />
        <span>Session diagnostics</span>
      </S.ItemLink>
      <S.Divider />
      <S.ItemBtn onClick={handleLogout} disabled={signingOut}>
        <LogOut size={16} aria-hidden="true" />
        <span>{signingOut ? "Signing out…" : "Log out"}</span>
      </S.ItemBtn>
    </>
  );
}
