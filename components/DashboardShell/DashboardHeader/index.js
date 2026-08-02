"use client";

import { Menu } from "lucide-react";
import HeaderActions from "../HeaderActions";
import Brand from "../Brand";
import TimeDateCards from "../TimeDateCards";
import UserIdentity from "../UserIdentity";
import S from "./DashboardHeader.style";

export default function DashboardHeader({
  menuOpen,
  onToggleMenu,
  onCloseMenu,
  menuRef,
  onOpenDrawer,
}) {
  return (
    <S.HeaderEl>
      <S.Inner>
        <S.HeaderBrand>
          <Brand />
        </S.HeaderBrand>

        <S.RightGroup>
          <HeaderActions />

          <S.MetaGroup>
            <TimeDateCards />
          </S.MetaGroup>

          <S.VDivider />

          <UserIdentity
            menuOpen={menuOpen}
            onToggleMenu={onToggleMenu}
            onCloseMenu={onCloseMenu}
            menuRef={menuRef}
          />
        </S.RightGroup>

        <S.MenuBtn onClick={onOpenDrawer} aria-label="Open menu">
          <Menu size={18} aria-hidden="true" />
        </S.MenuBtn>
      </S.Inner>
    </S.HeaderEl>
  );
}
