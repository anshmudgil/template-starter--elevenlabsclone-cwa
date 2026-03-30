import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { StatusDot } from "@/components/StatusDot";
import { Activity, CheckCircle2, FileText, Calendar, Bot, ArrowUpRight, ArrowDownRight } from "lucide-react";

const metrics = [
  { label: "Active Tasks", value: "12", change: "+3", up: true, icon: CheckCircle2 },
  { label: "Content Pipeline", value: "8 items", change: "3 scripting", up: true, icon: FileText },
  { label: "Upcoming Events", value: "4", change: "Next 48h", up: false, icon: Calendar },
  { label: "VELO Activity", value: "Active", change: "3 tasks today", up: true, icon: Bot },
];

const activityFeed = [
  { time: "2 min ago", action: "VELO deployed A/B test variant for client homepage CTA", status: "active" as const, agent: "VELO" },
  { time: "18 min ago", action: "Content scheduled: LinkedIn post — CRO insight on exit-intent popups", status: "active" as const, agent: "Scheduler" },
  { time: "45 min ago", action: "Data sync completed — Shopify analytics pulled for 3 stores", status: "active" as const, agent: "Data Unifier" },
  { time: "1h ago", action: "YouTube video draft moved to Editing stage", status: "pending" as const, agent: "Ansh" },
  { time: "2h ago", action: "VELO detected winning variant: +14.2% CVR on product page", status: "active" as const, agent: "VELO" },
  { time: "3h ago", action: "Cron job: Weekly report generation started", status: "pending" as const, agent: "Cron Manager" },
  { time: "5h ago", action: "GitHub deployment triggered — velocity-os v0.4.2", status: "active" as const, agent: "Integration Monitor" },
  { time: "8h ago", action: "Error: GA4 API rate limit exceeded — retrying in 15min", status: "error" as const, agent: "Data Unifier" },
  { time: "12h ago", action: "Email campaign copy variants generated (4 versions)", status: "idle" as const, agent: "Copywriter" },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <PageHeader title="Mission Control" description="Welcome back, Ansh. Here's what's happening." />

        <div className="grid grid-cols-4 gap-4 mb-8">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground">{m.label}</span>
                <m.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground">{m.value}</div>
              <div className="mt-1 flex items-center gap-1 text-xs">
                {m.up ? (
                  <ArrowUpRight className="h-3 w-3 text-success" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-muted-foreground" />
                )}
                <span className={m.up ? "text-success" : "text-muted-foreground"}>{m.change}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border px-5 py-4">
            <Activity className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Live Activity Feed</h2>
          </div>
          <div className="divide-y divide-border">
            {activityFeed.map((item, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-3.5 hover:bg-accent/50 transition-colors">
                <StatusDot status={item.status} className="mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{item.action}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{item.agent}</span>
                    <span>·</span>
                    <span>{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
