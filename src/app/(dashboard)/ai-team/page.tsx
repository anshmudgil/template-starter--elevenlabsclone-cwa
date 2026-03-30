"use client";

import { useMemo } from "react";
import { MissionPageHeader } from "@/components/mission-page-header";
import { StatusDot } from "@/components/status-dot";
import { Badge } from "@/components/ui/badge";
import { useAgents } from "@/hooks/use-mission-control";
import { formatRelativeTime } from "@/lib/format-relative-time";
import type { Tables } from "@/integrations/supabase/types";

function agentStatus(s: string): "active" | "pending" | "idle" | "error" {
  if (s === "active" || s === "pending" || s === "error" || s === "idle") return s;
  return "idle";
}

export default function AiTeamPage() {
  const { data: agents = [], isLoading } = useAgents();

  const groups = useMemo(() => {
    const m = new Map<string, Tables<"agents">[]>();
    for (const a of agents) {
      const g = a.group_name || "Other";
      if (!m.has(g)) m.set(g, []);
      m.get(g)!.push(a);
    }
    return Array.from(m.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [agents]);

  return (
    <>
      <MissionPageHeader
        title="AI Team"
        description="VELO sub-agents and operators seeded for your workspace."
      />
      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-6">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading agents…</p>
        ) : groups.length === 0 ? (
          <p className="text-sm text-muted-foreground">No agents — run DB seed after first sign-in.</p>
        ) : (
          groups.map(([groupName, rows]) => (
            <section key={groupName}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {groupName}
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {rows.map((a) => {
                  const metrics = Array.isArray(a.metrics)
                    ? (a.metrics as { label?: string; value?: string }[])
                    : [];
                  return (
                    <li
                      key={a.id}
                      className="rounded-lg border border-border bg-card p-4 shadow-sm"
                    >
                      <div className="flex items-start gap-2">
                        <StatusDot status={agentStatus(a.status)} className="mt-1.5" />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-medium text-foreground">{a.name}</h3>
                            <Badge variant="outline" className="capitalize">
                              {a.status}
                            </Badge>
                          </div>
                          {a.role ? (
                            <p className="mt-1 text-xs text-muted-foreground">{a.role}</p>
                          ) : null}
                          <p className="mt-2 text-sm text-foreground/90">{a.current_task}</p>
                          {a.last_active_at ? (
                            <p className="mt-2 text-xs text-muted-foreground">
                              Last active {formatRelativeTime(a.last_active_at)}
                            </p>
                          ) : null}
                          {metrics.length > 0 ? (
                            <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                              {metrics.slice(0, 3).map((x, i) => (
                                <div key={i} className="flex gap-1">
                                  <dt className="text-muted-foreground">{x.label ?? "—"}:</dt>
                                  <dd className="font-medium text-foreground">{x.value ?? "—"}</dd>
                                </div>
                              ))}
                            </dl>
                          ) : null}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        )}
      </div>
    </>
  );
}
