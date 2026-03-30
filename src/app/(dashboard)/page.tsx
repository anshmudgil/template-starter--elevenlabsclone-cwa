"use client";

import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bot,
  Calendar,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { MissionPageHeader } from "@/components/mission-page-header";
import { StatusDot } from "@/components/status-dot";
import {
  useActivityFeed,
  useAgents,
  useCalendarEvents,
  useContentItems,
  useMissionProfile,
  useTasks,
} from "@/hooks/use-mission-control";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { addHours, isAfter, isBefore, parseISO, startOfToday } from "date-fns";

export default function DashboardPage() {
  const { data: profile } = useMissionProfile();
  const { data: activities = [], isLoading: actLoading } = useActivityFeed();
  const { data: tasks = [] } = useTasks();
  const { data: content = [] } = useContentItems();
  const { data: events = [] } = useCalendarEvents();
  const { data: agents = [] } = useAgents();

  const displayName = profile?.display_name?.trim() || profile?.email?.split("@")[0] || "there";

  const activeTaskCount = tasks.filter((t) => t.column_id !== "done").length;
  const pipelineCount = content.filter((c) => c.column_id !== "published").length;
  const now = new Date();
  const horizon = addHours(now, 48);
  const upcomingCount = events.filter((e) => {
    const d = parseISO(e.event_date);
    return !isBefore(d, startOfToday()) && !isAfter(d, horizon);
  }).length;

  const veloAgents = agents.filter((a) => a.status === "active");
  const veloLine =
    veloAgents.length > 0
      ? `${veloAgents.length} sub-agent(s) active`
      : agents.some((a) => a.status === "active")
        ? "Network online"
        : "Awaiting OpenClaw signal";

  const metrics = [
    {
      label: "Active Tasks",
      value: String(activeTaskCount),
      change: activeTaskCount ? "Open items" : "Clear",
      up: activeTaskCount > 0,
      icon: CheckCircle2,
    },
    {
      label: "Content Pipeline",
      value: `${pipelineCount} items`,
      change: "Pre-publish",
      up: pipelineCount > 0,
      icon: FileText,
    },
    {
      label: "Upcoming Events",
      value: String(upcomingCount),
      change: "Next 48h",
      up: upcomingCount > 0,
      icon: Calendar,
    },
    {
      label: "VELO Activity",
      value: veloAgents.length ? "Active" : "Idle",
      change: veloLine,
      up: veloAgents.length > 0,
      icon: Bot,
    },
  ];

  return (
    <>
      <MissionPageHeader
        title="Mission Control"
        description={`Welcome back, ${displayName}. Here's what's happening.`}
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground">{m.label}</span>
                <m.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground">{m.value}</div>
              <div className="mt-1 flex items-center gap-1 text-xs">
                {m.up ? (
                  <ArrowUpRight className="h-3 w-3 text-green-600 dark:text-green-400" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-muted-foreground" />
                )}
                <span className={m.up ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}>
                  {m.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border px-5 py-4">
            <Activity className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Live Activity Feed</h2>
            {actLoading ? <span className="text-xs text-muted-foreground ml-2">Loading…</span> : null}
          </div>
          <div className="divide-y divide-border">
            {activities.length === 0 && !actLoading ? (
              <div className="px-5 py-8 text-sm text-muted-foreground text-center">
                No events yet. Point OpenClaw at the ingest URL to stream activity here.
              </div>
            ) : (
              activities.map((item) => {
                const st = item.status as "active" | "pending" | "idle" | "error";
                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 px-5 py-3.5 hover:bg-accent/50 transition-colors"
                  >
                    <StatusDot status={st} className="mt-1.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{item.message}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>{item.agent_name}</span>
                        <span>·</span>
                        <span>{formatRelativeTime(item.created_at)}</span>
                        {item.source !== "openclaw" ? (
                          <>
                            <span>·</span>
                            <span className="uppercase">{item.source}</span>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}
