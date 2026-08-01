"use client";

import { X, EllipsisVertical } from "lucide-react";
import Brand from "../Brand";
import RegistrationPromo from "../RegistrationPromo";
import TimeDateCards from "../TimeDateCards";
import UserIdentity, { KebabButton } from "../UserIdentity";
import AccountMenuItems from "../AccountMenuPanel";
import Nav from "./Nav";
import S from "./Sidebar.style";

export default function Sidebar({
  user,
  open,
  onCloseDrawer,
  menuOpen,
  onToggleMenu,
  onCloseMenu,
  menuRef,
}) {
  return (
    <S.SidebarAside $open={open}>
      <S.BrandRow>
        <Brand />
        <S.CloseDrawerBtn onClick={onCloseDrawer} aria-label="Close menu">
          <X size={16} aria-hidden="true" />
        </S.CloseDrawerBtn>
      </S.BrandRow>

      <Nav user={user} onCloseDrawer={onCloseDrawer} />

      <S.Footer ref={menuRef}>
        <RegistrationPromo />

        <S.MobileMeta>
          <TimeDateCards />

          <S.IdentityRow>
            <UserIdentity />
            <KebabButton
              type="button"
              $open={menuOpen}
              onClick={onToggleMenu}
              aria-label="More options"
              aria-expanded={menuOpen}
            >
              <EllipsisVertical size={18} aria-hidden="true" />
            </KebabButton>
          </S.IdentityRow>
        </S.MobileMeta>

        {menuOpen && (
          <S.SidebarMenuPanel>
            <AccountMenuItems onNavigate={onCloseMenu} />
          </S.SidebarMenuPanel>
        )}
      </S.Footer>
    </S.SidebarAside>
  );
}
