"use client";

import styled from "styled-components";
import { CalendarPlus } from "lucide-react";
import { rt } from "@/lib/theme";
import { Badge } from "@/components/ui/primitives";
import Button from "@/components/ui/Button";
import { REGISTRATION_WINDOW } from "@/lib/sample-data";

const Card = styled.div`
  background: ${({ theme }) => rt(theme).color.blue50};
  border-radius: ${({ theme }) => rt(theme).radius.lg};
  padding: ${({ theme }) => rt(theme).space[4]};
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
`;

const Label = styled.p`
  margin: 0;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => rt(theme).color.blue700};
`;

const Body = styled.p`
  margin: 0 0 ${({ theme }) => rt(theme).space[4]};
  font-size: 13px;
  line-height: 1.45;
  color: ${({ theme }) => rt(theme).color.ink700};
`;

// Sample content -- see lib/sample-data.js's file-level note. No
// registration endpoint exists yet, hence the "Sample" badge and the
// button that doesn't go anywhere.
export default function RegistrationPromo() {
  return (
    <Card>
      <Head>
        <Label>{REGISTRATION_WINDOW.heading}</Label>
        <Badge $tone="neutral">Sample</Badge>
      </Head>
      <Body>{REGISTRATION_WINDOW.body}</Body>
      <Button variant="primary" block>
        <CalendarPlus size={15} aria-hidden="true" />
        Register now
      </Button>
    </Card>
  );
}
