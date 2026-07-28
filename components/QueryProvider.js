"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// QueryClient is created inside useState, not at module scope -- on
// the server that would share one client (and its cache) across
// every request; useState keeps it request-scoped there and stable
// across client re-renders.
export default function QueryProvider({ children }) {
  const [client] = useState(() => new QueryClient());
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
