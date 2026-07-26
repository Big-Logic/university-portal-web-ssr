"use client";

import styled from "styled-components";
import { rt } from "@/lib/theme";
import Link from "next/link";
import Button from "@/components/ui/Button";

// Next.js always attempts to statically prerender the special
// /_not-found route at build time, regardless of this segment's own
// config -- and that specific prerender pass doesn't have
// ThemeProvider context available, which crashed every styled
// component here and in the shared UI primitives it renders (Button,
// etc.) with "Cannot read properties of undefined." Forcing this page
// to render dynamically (at request time, where context IS available)
// fixes it at the source instead of requiring a defensive theme
// fallback in every component this page happens to use.
export const dynamic = "force-dynamic";

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

const Code = styled.div`
  font-family: ${({ theme }) => rt(theme).font.mono};
  font-size: 13px;
  color: ${({ theme }) => rt(theme).color.ink300};
  margin-bottom: ${({ theme }) => rt(theme).space[2]};
`;

const Message = styled.p`
  color: ${({ theme }) => rt(theme).color.ink500};
  font-size: 14px;
  margin: 8px 0 ${({ theme }) => rt(theme).space[6]};
`;

export default function NotFound() {
  return (
    <Wrap>
      <Box>
        <Code>404</Code>
        <h1 style={{ fontSize: 20 }}>Page not found</h1>
        <Message>There&rsquo;s nothing here. It may have moved, or the link might be off.</Message>
        <Link href="/" style={{ textDecoration: "none" }}>
          <Button>Back to portal</Button>
        </Link>
      </Box>
    </Wrap>
  );
}
