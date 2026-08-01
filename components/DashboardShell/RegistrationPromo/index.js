"use client";

import { CalendarPlus } from "lucide-react";
import { Badge } from "@/components/ui/primitives";
import Button from "@/components/ui/Button";
import { REGISTRATION_WINDOW } from "@/lib/sample-data";
import S from "./RegistrationPromo.style";

// Sample content -- see lib/sample-data.js's file-level note. No
// registration endpoint exists yet, hence the "Sample" badge and the
// button that doesn't go anywhere.
export default function RegistrationPromo() {
  return (
    <S.Card>
      <S.Head>
        <S.Label>{REGISTRATION_WINDOW.heading}</S.Label>
        <Badge $tone="neutral">Sample</Badge>
      </S.Head>
      <S.Body>{REGISTRATION_WINDOW.body}</S.Body>
      <Button variant="primary" block>
        <CalendarPlus size={15} aria-hidden="true" />
        Register now
      </Button>
    </S.Card>
  );
}
