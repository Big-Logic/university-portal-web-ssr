"use client";

import { EllipsisVertical, User } from "lucide-react";
import { Badge } from "@/components/ui/primitives";
import useCurrentUser from "@/hooks/useCurrentUser";
import AccountMenuItems from "../AccountMenuPanel";
import S, { KebabButton } from "./UserIdentity.style";

export { KebabButton };

// No real avatar image field exists on the API's /me response --
// a generic person icon, not initials, on purpose (see conversation
// history: initials implied a photo upload feature that doesn't exist).
function IdentityRow({ user }) {
  return (
    <S.Row>
      <S.Avatar>
        <User size={17} aria-hidden="true" />
      </S.Avatar>
      <S.Text>
        <S.Name>{user.fullName}</S.Name>
        <Badge $tone="accent">{user.role}</Badge>
      </S.Text>
    </S.Row>
  );
}

function IdentitySkeleton() {
  return (
    <S.Row aria-hidden="true">
      <S.SkeletonAvatar />
      <S.SkeletonLines>
        <S.SkeletonLine $width="72px" $height="12px" />
        <S.SkeletonLine $width="44px" $height="16px" />
      </S.SkeletonLines>
    </S.Row>
  );
}

// Bare by default -- Sidebar's mobile identity row assembles its own
// kebab and dropdown around this. Pass the menu-control props to get
// the header's self-contained chip instead: identity row plus its own
// kebab and account menu dropdown, anchored to this component rather
// than laid out by the caller.
export default function UserIdentity({
  menuOpen,
  onToggleMenu,
  onCloseMenu,
  menuRef,
}) {
  const user = useCurrentUser();

  if (!user) {
    // No kebab/dropdown while loading -- there's nothing for it to
    // open yet, and it would just disappear once the real chip swaps in.
    return onToggleMenu ? (
      <S.IdentityGroup>
        <IdentitySkeleton />
      </S.IdentityGroup>
    ) : (
      <IdentitySkeleton />
    );
  }

  if (!onToggleMenu) {
    return <IdentityRow user={user} />;
  }

  return (
    <S.IdentityGroup>
      <IdentityRow user={user} />

      <S.MenuAnchor ref={menuRef}>
        <KebabButton
          type="button"
          $open={menuOpen}
          onClick={onToggleMenu}
          aria-label="More options"
          aria-expanded={menuOpen}
        >
          <EllipsisVertical size={18} aria-hidden="true" />
        </KebabButton>

        {menuOpen && (
          <S.HeaderMenuPanel>
            <AccountMenuItems onNavigate={onCloseMenu} />
          </S.HeaderMenuPanel>
        )}
      </S.MenuAnchor>
    </S.IdentityGroup>
  );
}
