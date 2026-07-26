"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { motion } from "framer-motion";
import { LogOut, CheckCircle2, RefreshCw } from "lucide-react";
import Button from "@/components/ui/Button";
import { Card, Badge } from "@/components/ui/primitives";
import { rt } from "@/lib/theme";

const Screen = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => rt(theme).color.ink50};
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => rt(theme).space[4]} ${({ theme }) => rt(theme).space[6]};
  border-bottom: 1px solid ${({ theme }) => rt(theme).color.ink150};
  background: ${({ theme }) => rt(theme).color.white};
`;

const Wordmark = styled.span`
  font-family: ${({ theme }) => rt(theme).font.mono};
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => rt(theme).color.ink500};
`;

const Main = styled.main`
  max-width: 640px;
  margin: 0 auto;
  padding: ${({ theme }) => rt(theme).space[12]} ${({ theme }) => rt(theme).space[6]};
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
  font-size: 32px;
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

export default function DashboardView({ user }) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    let intervalId;
    let isMounted = true;

    async function refreshToken() {
      try {
        const res = await fetch("/api/auth/refresh", {
          method: "POST",
          cache: "no-store",
        });

        if (!isMounted) return;
        if (res.status === 401) {
          window.location.href = "/login";
        }
      } catch {
        // network glitches should not immediately kick users out;
        // next interval will retry silently.
      }
    }

    refreshToken();
    intervalId = window.setInterval(refreshToken, 12 * 60 * 1000);

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        refreshToken();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  async function handleLogout() {
    setSigningOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    // Full navigation, not router.push -- ensures Middleware runs
    // fresh against the now-cleared cookies rather than relying on
    // client-side router state that might not reflect them yet.
    window.location.href = "/login";
  }

  function handleRefresh() {
    // Re-runs the Server Component's data fetch on the current route
    // without a full page reload -- the App Router equivalent of the
    // cookie-free version's "re-verify" button, just re-triggering a
    // server fetch instead of a client one.
    startTransition(() => router.refresh());
  }

  const initials = user.fullName
    ? user.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <Screen>
      <Header>
        <Wordmark>Basecourse</Wordmark>
        <Button variant="secondary" onClick={handleLogout} loading={signingOut} loadingText="Signing out…">
          <LogOut size={15} aria-hidden="true" />
          Sign out
        </Button>
      </Header>

      <Main>
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
              Rendered server-side from an httpOnly cookie -- this page couldn&rsquo;t have
              loaded at all if that request had failed.
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
      </Main>
    </Screen>
  );
}
