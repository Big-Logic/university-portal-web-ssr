"use client";

import styled from "styled-components";
import { User } from "lucide-react";
import { rt } from "@/lib/theme";
import { Badge } from "@/components/ui/primitives";

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Avatar = styled.div`
  width: 34px;
  height: 34px;
  flex: none;
  border-radius: ${({ theme }) => rt(theme).radius.pill};
  background: ${({ theme }) => rt(theme).color.blue100};
  color: ${({ theme }) => rt(theme).color.blue700};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Text = styled.div`
  min-width: 0;
`;

const Name = styled.div`
  font-size: 13.5px;
  font-weight: 700;
  white-space: nowrap;
`;

// No real avatar image field exists on the API's /me response --
// a generic person icon, not initials, on purpose (see conversation
// history: initials implied a photo upload feature that doesn't exist).
export default function UserIdentity({ user }) {
  return (
    <Row>
      <Avatar>
        <User size={17} aria-hidden="true" />
      </Avatar>
      <Text>
        <Name>{user.fullName}</Name>
        <Badge $tone="accent">{user.role}</Badge>
      </Text>
    </Row>
  );
}

export const KebabButton = styled.button`
  width: 34px;
  height: 34px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: ${({ theme }) => rt(theme).radius.pill};
  background: ${({ theme, $open }) =>
    $open ? rt(theme).color.ink100 : rt(theme).color.ink50};
  color: ${({ theme }) => rt(theme).color.ink700};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => rt(theme).color.ink100};
  }
`;
