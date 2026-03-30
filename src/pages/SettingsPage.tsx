import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { StatusDot } from "@/components/StatusDot";
import { Clock, Plug, Bot, ChevronRight } from "lucide-react";

const cronJobs = [
  { name: "Daily data sync — Shopify", schedule: "Every day at 6:00 AM", status: "active" as const, lastRun: "Today, 6:00 AM" },
  { name: "Weekly performance report", schedule: "Every Friday at 8:00 AM", status: "active" as const, lastRun: "Mar 28, 8:00 AM" },
  { name: "Experiment results check", schedule: "Every 4 hours", status: "active" as const, lastRun: "2h ago" },
  { name: "GA4 event pull", schedule: "Every 30 minutes", status: "error" as const, lastRun: "Failed — rate limited" },
  { name: "Nightly attribution model update", schedule: "Every day at 2:00 AM", status: "active" as const, lastRun: "Today, 2:00 AM" },
];

const integrations = [
  { name: "Shopify", description: "Data source for CRO experiments", status: "active" as const, lastSync: "2 min ago" },
  { name: "Notion", description: "Memory + task sync", status: "active" as const, lastSync: "15 min ago" },
  { name: "Google Analytics 4", description: "Conversion tracking", status: "error" as const, lastSync: "Rate limited — retrying" },
  { name: "Slack", description: "Agent alerts + notifications", status: "active" as const, lastSync: "1 min ago" },
  { name: "GitHub", description: "Deployment triggers", status: "active" as const, lastSync: "30 min ago" },
  { name: "Vercel", description: "Build status", status: "active" as const, lastSync: "5 min ago" },
];

const agentConfig = [
  { label: "Experiment frequency", value: "Up to 5 concurrent experiments" },
  { label: "Significance threshold", value: "95% confidence" },
  { label: "Auto-deploy winners", value: "Enabled (with 24h review gate)" },
  { label: "Approval gates", value: "Required for revenue-impacting changes" },
  { label: "Max traffic allocation", value: "50% per variant" },
  { label: "Minimum sample size", value: "1,000 visitors per variant" },
];

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="p-8 max-w-4xl">
        <PageHeader title="Settings" description="Configure integrations, cron jobs, and agent parameters." />

        {/* Cron Jobs */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Cron Jobs</h2>
          </div>
          <div className="rounded-lg border border-border bg-card divide-y divide-border">
            {cronJobs.map((job) => (
              <div key={job.name} className="flex items-center justify-between px-5 py-3.5 hover:bg-accent/30 transition-colors">
                <div className="flex items-center gap-3">
                  <StatusDot status={job.status} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{job.name}</p>
                    <p className="text-xs text-muted-foreground">{job.schedule}</p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  <p>{job.lastRun}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Integrations */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Plug className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Integrations</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {integrations.map((int) => (
              <div key={int.name} className="rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-foreground">{int.name}</h3>
                  <StatusDot status={int.status} />
                </div>
                <p className="text-xs text-muted-foreground mb-2">{int.description}</p>
                <p className="text-[10px] text-muted-foreground">Last sync: {int.lastSync}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Agent Config */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Bot className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">VELO Configuration</h2>
          </div>
          <div className="rounded-lg border border-border bg-card divide-y divide-border">
            {agentConfig.map((config) => (
              <div key={config.label} className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm text-muted-foreground">{config.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{config.value}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
