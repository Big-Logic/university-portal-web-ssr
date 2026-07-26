"use client";

import React, { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

/**
 * App Router runs styled-components' render on the server, which
 * needs an explicit registry to collect the generated CSS and inject
 * it into the initial HTML -- without this, styles either flash
 * unstyled on first paint or cause a hydration mismatch. This is the
 * pattern styled-components' own docs recommend for the App Router;
 * it should wrap the app once, above everything else.
 */
export default function StyledComponentsRegistry({ children }) {
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  if (typeof window !== "undefined") return <>{children}</>;

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  );
}
