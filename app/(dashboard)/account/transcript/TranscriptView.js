"use client";

import styled from "styled-components";
import { FileText } from "lucide-react";
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

export default function TranscriptView() {
  return (
    <Wrap>
      <PageIntro
        eyebrow="Records"
        heading="Request a transcript"
        sub="Order an official or unofficial copy of your academic transcript."
      />
      <Card>
        <Body>
          <FileText size={20} aria-hidden="true" />
          <div>
            <Badge $tone="neutral">Coming soon</Badge>
            <Note>
              No transcript-request endpoint exists yet, so requests
              can&rsquo;t be submitted here.
            </Note>
          </div>
        </Body>
      </Card>
    </Wrap>
  );
}
