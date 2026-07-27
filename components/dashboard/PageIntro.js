"use client";

import styled from "styled-components";
import { rt } from "@/lib/theme";

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
  margin: 0 0 ${({ theme }) => rt(theme).space[6]};
  max-width: 640px;
`;

export default function PageIntro({ eyebrow, heading, sub }) {
  return (
    <div>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Heading>{heading}</Heading>
      {sub && <Sub>{sub}</Sub>}
    </div>
  );
}
