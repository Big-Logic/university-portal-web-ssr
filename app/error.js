"use client";

import { useEffect } from "react";
import styled from "styled-components";
import { rt } from "@/lib/theme";
import Button from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";

const Wrap = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => rt(theme).color.ink50};
  padding: ${({ theme }) => rt(theme).space[6]};
`;

const Box = styled.div`
  max-width: 420px;
  text-align: center;
`;

const IconWrap = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ theme }) => rt(theme).color.red100};
  color: ${({ theme }) => rt(theme).color.red600};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => rt(theme).space[4]};
`;

const Message = styled.p`
  color: ${({ theme }) => rt(theme).color.ink500};
  font-size: 14px;
  margin: 8px 0 ${({ theme }) => rt(theme).space[6]};
`;

// Next.js calls this automatically when a rendering error occurs
// anywhere in this route segment or below -- it's a real React error
// boundary, just framework-wired rather than hand-rolled. `reset`
// re-renders the segment without a full page reload.
export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Route error boundary caught:", error);
  }, [error]);

  return (
    <Wrap>
      <Box>
        <IconWrap>
          <AlertTriangle size={22} aria-hidden="true" />
        </IconWrap>
        <h1 style={{ fontSize: 20 }}>Something went wrong</h1>
        <Message>
          That wasn&rsquo;t supposed to happen. You can try again, or come back in a moment.
        </Message>
        <Button onClick={reset}>Try again</Button>
      </Box>
    </Wrap>
  );
}
