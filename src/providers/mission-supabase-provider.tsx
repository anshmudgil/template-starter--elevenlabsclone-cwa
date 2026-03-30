"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useAuth } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const MissionSupabaseContext = createContext<ReturnType<
  typeof createClient<Database>
> | null>(null);

export function MissionSupabaseProvider({ children }: { children: ReactNode }) {
  const { getToken } = useAuth();
  const client = useMemo(
    () =>
      createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
        {
          global: {
            fetch: async (url, options = {}) => {
              const token = await getToken({ template: "supabase" });
              const headers = new Headers(options.headers);
              if (token) headers.set("Authorization", `Bearer ${token}`);
              return fetch(url, { ...options, headers });
            },
          },
        },
      ),
    [getToken],
  );

  return <MissionSupabaseContext.Provider value={client}>{children}</MissionSupabaseContext.Provider>;
}

export function useMissionSupabase() {
  const ctx = useContext(MissionSupabaseContext);
  if (!ctx) {
    throw new Error("useMissionSupabase must be used within MissionSupabaseProvider");
  }
  return ctx;
}
