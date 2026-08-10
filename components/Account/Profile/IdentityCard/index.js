"use client";

import { useRef, useState } from "react";
import { User } from "lucide-react";
import { toast } from "sonner";
import {
  ACCEPT_ATTRIBUTE,
  validateAvatarFile,
} from "@/lib/validation/avatarFile";
import { uploadAvatar } from "@/lib/api/avatar";
import { displayName } from "@/utils/user";
import { avatarSrc } from "@/utils/avatar";
import { formatMonthYear } from "@/utils/date";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/primitives";
import Shared from "../Profile.style";
import S from "./IdentityCard.style";

// The circle is drawn at 72px, so the source is requested at 144 --
// see avatarSrc for why the 2x matters.
const AVATAR_SIZE = 72;

/**
 * Who you are, and the one field that says it visually.
 *
 * Picking a photo runs three steps that are one action to the person
 * doing it: validate locally, upload to Cloudinary, then store the
 * returned URL through the profile mutation this card shares with the
 * details form. `uploading` covers the first two and `isPending` the
 * third, which is why the button reads from both.
 *
 * There is still no "Remove". The API's `avatarUrl` is `.optional()`
 * and not `.nullable()`, so no value it accepts will clear the column
 * -- the button would have nothing to send. It comes back when the API
 * takes null.
 */
export default function IdentityCard({ user, onSave, isPending }) {
  const fileInput = useRef(null);
  const [uploading, setUploading] = useState(false);

  const busy = uploading || isPending;

  async function onPick(event) {
    const file = event.target.files?.[0];

    // Cleared before anything else can fail: without this, picking the
    // same file again after an error fires no change event at all,
    // because the input's value hasn't changed.
    event.target.value = "";

    const problem = validateAvatarFile(file);
    if (problem) {
      toast.error(problem);
      return;
    }

    setUploading(true);
    try {
      const avatarUrl = await uploadAvatar(file);

      // Per-call callbacks rather than the mutation's own: this card
      // shares that mutation with the details form, and only this one
      // should be talking about photos.
      onSave(
        { avatarUrl },
        {
          onSuccess: () => toast.success("Photo updated."),
          onError: (err) => toast.error(err.message),
        },
      );
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <Shared.Panel>
      <S.Row>
        {/* Decorative -- whatever is in the circle, the name is right
            beside it, so there's nothing here to announce. */}
        <S.Avatar
          $src={avatarSrc(user.avatarUrl, AVATAR_SIZE)}
          $dimmed={busy}
          aria-hidden="true"
        >
          {!user.avatarUrl && <User size={28} />}
        </S.Avatar>

        <S.Identity>
          <S.NameRow>
            {/* Uncapped, unlike the sidebar's copy of the same name:
                this is the one place the whole thing should fit. */}
            <S.Name>{displayName(user, { maxLength: 0 })}</S.Name>
            <Badge $tone="accent">{user.role}</Badge>
          </S.NameRow>
          <S.Since>Member since {formatMonthYear(user.createdAt)}</S.Since>
        </S.Identity>

        <S.Actions>
          {/* The input is the control; the button is what people see.
              Hidden rather than styled because no amount of CSS makes
              a file input match the rest of the form, and a <button>
              gets keyboard and focus behaviour for free. */}
          <S.FileInput
            type="file"
            ref={fileInput}
            accept={ACCEPT_ATTRIBUTE}
            onChange={onPick}
            tabIndex={-1}
          />
          <Button
            variant="secondary"
            type="button"
            loading={busy}
            loadingText={uploading ? "Uploading…" : "Saving…"}
            onClick={() => fileInput.current?.click()}
          >
            {user.avatarUrl ? "Change photo" : "Add photo"}
          </Button>
        </S.Actions>
      </S.Row>
    </Shared.Panel>
  );
}
