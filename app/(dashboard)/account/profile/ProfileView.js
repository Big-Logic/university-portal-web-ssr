"use client";

import styled from "styled-components";
import { UserCircle } from "lucide-react";
import { rt } from "@/lib/theme";
import PageIntro from "@/components/dashboard/PageIntro";
import { Card, Badge } from "@/components/ui/primitives";

const Wrap = styled.div`
  max-width: 640px;
`;

const Body = styled.div`
  display: flex;
  gap: ${({ theme }) => rt(theme).space[4]};
  align-items: flex-start;
`;

const Note = styled.p`
  margin: ${({ theme }) => rt(theme).space[2]} 0 0;
  font-size: 13.5px;
  color: ${({ theme }) => rt(theme).color.ink500};
`;

export default function ProfileView() {
  return (
    <Wrap>
      <PageIntro
        eyebrow="Account"
        heading="Your profile"
        sub="Manage your personal details and contact information."
      />
      <Card>
        <Body>
          <UserCircle size={20} aria-hidden="true" />
          <div>
            <Badge $tone="neutral">Coming soon</Badge>
            <Note>
              Profile editing isn&rsquo;t wired up yet -- there&rsquo;s no
              endpoint to update these fields against.
            </Note>
          </div>
        </Body>
      </Card>
    </Wrap>
  );
}
