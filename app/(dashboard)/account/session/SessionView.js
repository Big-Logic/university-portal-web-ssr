"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { motion } from "framer-motion";
import { CheckCircle2, RefreshCw } from "lucide-react";
import Button from "@/components/ui/Button";
import { Card, Badge } from "@/components/ui/primitives";
import { rt } from "@/lib/theme";

const Wrap = styled.div`
  max-width: 640px;
`;

const Eyebrow = styled.p`
  font-family: ${({ theme }) => rt(theme).font.mono};
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => rt(theme).color.ink500};
  margin: 0 0 8px;
`;

const NameHeading = styled.h1`
  font-size: 28px;
  margin-bottom: ${({ theme }) => rt(theme).space[6]};
`;

const IdentityRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => rt(theme).space[3]};
  margin-bottom: ${({ theme }) => rt(theme).space[8]};
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => rt(theme).color.blue100};
  color: ${({ theme }) => rt(theme).color.blue700};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 15px;
  flex: none;
`;

const Email = styled.span`
  color: ${({ theme }) => rt(theme).color.ink500};
  font-size: 14px;
`;

const VerifyCard = styled(Card)`
  border-left: 3px solid ${({ theme }) => rt(theme).color.blue600};
`;

const VerifyTitle = styled.p`
  font-family: ${({ theme }) => rt(theme).font.mono};
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => rt(theme).color.ink500};
  margin: 0 0 12px;
`;

const StatusLine = styled.p`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;
  margin: 0;
  color: ${({ theme }) => rt(theme).color.green600};
`;

const DataLine = styled.p`
  font-family: ${({ theme }) => rt(theme).font.mono};
  font-size: 12.5px;
  color: ${({ theme }) => rt(theme).color.ink500};
  margin: 6px 0 0 24px;
`;

const RefreshRow = styled.div`
  margin-top: ${({ theme }) => rt(theme).space[3]};
`;

// The one page in the app whose entire point is to prove the SSR/
// httpOnly-cookie model actually works: reaching this render at all
// already proves it, the "re-verify" button just lets you watch it
// happen again on demand. Token refresh itself runs continuously in
// DashboardShell (mounted for the whole /dashboard section), not here.
export default function SessionView({ user }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleRefresh() {
    startTransition(() => router.refresh());
  }

  const initials = user.fullName
    ? user.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <Wrap>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Eyebrow>Signed in as</Eyebrow>
        <NameHeading>{user.fullName}</NameHeading>

        <IdentityRow>
          <Avatar>{initials}</Avatar>
          <div>
            <Badge $tone="accent">{user.role}</Badge>
          </div>
          <Email>{user.email}</Email>
        </IdentityRow>

        <VerifyCard>
          <VerifyTitle>Server-side session</VerifyTitle>
          <StatusLine>
            <CheckCircle2 size={16} aria-hidden="true" />
            Rendered server-side from an httpOnly cookie -- this page couldn&rsquo;t have loaded
            at all if that request had failed.
          </StatusLine>
          <DataLine>id: {user.id}</DataLine>
          <DataLine>role: {user.role}</DataLine>

          <RefreshRow>
            <Button variant="ghost" onClick={handleRefresh} loading={isPending} loadingText="Re-fetching…">
              <RefreshCw size={14} aria-hidden="true" />
              Re-verify (re-run the server fetch)
            </Button>
          </RefreshRow>
        </VerifyCard>
      </motion.div>
    </Wrap>
  );
}
