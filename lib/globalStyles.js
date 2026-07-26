"use client";

import { createGlobalStyle } from "styled-components";
import { rt } from "./theme";

const GlobalStyles = createGlobalStyle`
  * { box-sizing: border-box; }

  html, body {
    margin: 0;
    padding: 0;
  }

  body {
    background: ${({ theme }) => rt(theme).color.ink50};
    color: ${({ theme }) => rt(theme).color.ink900};
    font-family: ${({ theme }) => rt(theme).font.sans};
    font-size: 15px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, h4 {
    font-family: ${({ theme }) => rt(theme).font.sans};
    font-weight: 700;
    margin: 0;
    letter-spacing: -0.01em;
  }

  a {
    color: ${({ theme }) => rt(theme).color.blue700};
  }

  button, input {
    font-family: inherit;
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => rt(theme).color.blue600};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;

export default GlobalStyles;
