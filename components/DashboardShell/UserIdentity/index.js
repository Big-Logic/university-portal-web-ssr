"use client";

import { EllipsisVertical, User } from "lucide-react";
import { Badge } from "@/components/ui/primitives";
import useCurrentUser from "@/hooks/useCurrentUser";
import { displayName } from "@/utils/user";
import { avatarSrc } from "@/utils/avatar";
import AccountMenuItems from "../AccountMenuPanel";
import S, { KebabButton } from "./UserIdentity.style";

export { KebabButton };

// The photo when there is one, the generic person icon when there
// isn't -- the same pair the profile card shows, one size down, so the
// chip and the card can't present someone two different ways.
//
// Requested through avatarSrc at the size this chip actually draws:
// the stored URL is the untransformed original, and asking a 34px
// circle to download a 4MB photo would be the whole point of using
// Cloudinary, wasted.
//
// Decorative in both branches -- the name is right beside it, so
// there's nothing here for a screen reader to add.
const AVATAR_SIZE = 34;

function IdentityRow({ user }) {
  return (
    <S.Row>
      <S.Avatar $src={avatarSrc(user.avatarUrl, AVATAR_SIZE)} aria-hidden="true">
        {!user.avatarUrl && <User size={17} />}
      </S.Avatar>
      <S.Text>
        <S.Name>{displayName(user)}</S.Name>
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
