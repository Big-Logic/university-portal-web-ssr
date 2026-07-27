"use client";

import Link from "next/link";
import styled from "styled-components";
import { rt } from "@/lib/theme";
import { navForRole } from "@/lib/navigation";
import { Badge } from "@/components/ui/primitives";
import NoticeBanner from "@/components/dashboard/NoticeBanner";

const Eyebrow = styled.p`
  font-family: ${({ theme }) => rt(theme).font.mono};
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => rt(theme).color.ink500};
  margin: 0 0 8px;
`;

const Heading = styled.h1`
  font-size: 26px;
  margin: 0 0 ${({ theme }) => rt(theme).space[2]};
`;

const Sub = styled.p`
  color: ${({ theme }) => rt(theme).color.ink500};
  font-size: 14px;
  margin: 0 0 ${({ theme }) => rt(theme).space[8]};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: ${({ theme }) => rt(theme).space[4]};
`;

const ModuleCard = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: ${({ theme }) => rt(theme).space[4]};
  background: ${({ theme }) => rt(theme).color.white};
  border: 1px solid ${({ theme }) => rt(theme).color.ink150};
  border-radius: ${({ theme }) => rt(theme).radius.lg};
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s ease, transform 0.1s ease;

  &:hover {
    text-decoration: none;
    border-color: ${({ theme }) => rt(theme).color.blue600};
    transform: translateY(-1px);
  }
`;

const IconBadge = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => rt(theme).radius.md};
  background: ${({ theme }) => rt(theme).color.blue100};
  color: ${({ theme }) => rt(theme).color.blue700};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModuleLabel = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => rt(theme).color.ink900};
`;

const ModuleDescription = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => rt(theme).color.ink500};
`;

const EmptyNote = styled.p`
  font-size: 13.5px;
  color: ${({ theme }) => rt(theme).color.ink500};
`;

const NoticeWrap = styled.div`
  margin-bottom: ${({ theme }) => rt(theme).space[6]};
`;

/**
 * The shared "role home" layout: a greeting plus a card per module the
 * role has beyond Home itself. Only `user` (plain data) is passed in
 * from the Server Component page -- the module list (with its
 * lucide-react icon components) is derived from user.role here, on
 * the client, rather than built server-side and passed as a prop.
 */
export default function ModuleHub({ user }) {
  const firstName = user.fullName?.split(" ")[0] || user.fullName;
  const modules = navForRole(user.role).slice(1);

  return (
    <div>
      <NoticeWrap>
        <NoticeBanner />
      </NoticeWrap>
      <Eyebrow>Dashboard</Eyebrow>
      <Heading>Welcome back, {firstName}.</Heading>
      <Sub>
        Signed in as <Badge $tone="accent">{user.role}</Badge>
      </Sub>

      {modules.length > 0 ? (
        <Grid>
          {modules.map((item) => {
            const Icon = item.icon;
            return (
              <ModuleCard key={item.href} href={item.href}>
                <IconBadge>
                  <Icon size={18} aria-hidden="true" />
                </IconBadge>
                <ModuleLabel>{item.label}</ModuleLabel>
                {item.description && <ModuleDescription>{item.description}</ModuleDescription>}
              </ModuleCard>
            );
          })}
        </Grid>
      ) : (
        <EmptyNote>No additional modules are assigned to your account yet.</EmptyNote>
      )}
    </div>
  );
}
