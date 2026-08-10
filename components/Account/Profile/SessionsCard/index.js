"use client";

import { Monitor } from "lucide-react";
import { ACCOUNT_SESSIONS } from "@/lib/sample-data";
import SampleBadge from "@/components/SampleBadge";
import Shared from "../Profile.style";
import S from "./SessionsCard.style";

/**
 * Placeholder content, and badged as such. The API issues refresh
 * tokens but exposes no way to list or revoke them individually, so
 * there is nothing real to show here yet -- see the note beside
 * ACCOUNT_SESSIONS in lib/sample-data.js.
 *
 * Read-only for the same reason: the design gives each row a "Sign
 * out", and a button that quietly did nothing on a security screen
 * would be worse than no button. The footnote points at the one thing
 * that genuinely does end other sessions today.
 *
 * When the endpoint lands: delete ACCOUNT_SESSIONS, fetch the real
 * list in app/(dashboard)/account/profile/page.js, take the badge off,
 * and give the rows back their action.
 */
export default function SessionsCard() {
  return (
    <Shared.Panel>
      <Shared.PanelHead>
        <Shared.PanelTitle>Where you&rsquo;re signed in</Shared.PanelTitle>
        <SampleBadge />
      </Shared.PanelHead>
      <Shared.PanelSub>
        Device history isn&rsquo;t available yet. These are examples, not your
        sessions.
      </Shared.PanelSub>

      <S.List>
        {ACCOUNT_SESSIONS.map((session) => (
          <S.Item key={session.id}>
            <S.Icon>
              <Monitor size={17} aria-hidden="true" />
            </S.Icon>
            <S.Body>
              <S.Device>{session.device}</S.Device>
              <S.Meta>{session.meta}</S.Meta>
            </S.Body>
            {session.current && <S.Current>Current</S.Current>}
          </S.Item>
        ))}
      </S.List>

      <Shared.Divider />

      <S.Footnote>
        To end every other session, change your password above &mdash; it signs
        out all devices.
      </S.Footnote>
    </Shared.Panel>
  );
}
