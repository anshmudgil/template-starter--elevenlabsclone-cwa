"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { MissionSupabaseProvider } from "@/providers/mission-supabase-provider";
import { MissionBootstrap } from "@/providers/mission-bootstrap";

export function DashboardProviders({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
      }),
  );

  return (
    <QueryClientProvider client={client}>
      <MissionSupabaseProvider>
        <MissionBootstrap />
        {children}
      </MissionSupabaseProvider>
    </QueryClientProvider>
  );
}
