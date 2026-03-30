"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { useMissionSupabase } from "@/providers/mission-supabase-provider";

export function MissionBootstrap() {
  const { user, isLoaded } = useUser();
  const supabase = useMissionSupabase();
  const ran = useRef(false);

  useEffect(() => {
    if (!isLoaded || !user) return;
    if (ran.current) return;
    ran.current = true;

    void (async () => {
      const email = user.primaryEmailAddress?.emailAddress ?? null;
      const display =
        user.fullName ?? user.firstName ?? user.username ?? email?.split("@")[0] ?? "Operator";

      await supabase.from("profiles").upsert(
        {
          id: user.id,
          email,
          display_name: display,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      );

      await supabase.rpc("ensure_mission_seed", { p_user_id: user.id });
    })();
  }, [isLoaded, user, supabase]);

  return null;
}
