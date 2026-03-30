import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { StatusDot } from "@/components/StatusDot";
import { Zap, X } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  role: string;
  group: string;
  currentTask: string;
  status: "active" | "pending" | "idle" | "error";
  lastActive: string;
  responsibilities: string[];
  metrics?: { label: string; value: string }[];
}

const agents: Agent[] = [
  { id: "a1", name: "Experiment Builder", role: "Creates and configures A/B test experiments", group: "Developers", currentTask: "Building hero section test for NovaSkin", status: "active", lastActive: "2 min ago", responsibilities: ["Design experiment variants", "Set up test parameters", "Configure traffic allocation"], metrics: [{ label: "Experiments built", value: "47" }, { label: "Avg setup time", value: "3.2min" }] },
  { id: "a2", name: "Variant Deployer", role: "Deploys winning experiment variants to production", group: "Developers", currentTask: "Deploying CTA variant B to production", status: "active", lastActive: "5 min ago", responsibilities: ["Deploy variant code", "Rollback failed deploys", "Verify production state"], metrics: [{ label: "Variants deployed", value: "31" }, { label: "Success rate", value: "99.2%" }] },
  { id: "a3", name: "A/B Test Runner", role: "Monitors and manages running experiments", group: "Developers", currentTask: "Monitoring 3 active experiments", status: "active", lastActive: "1 min ago", responsibilities: ["Monitor statistical significance", "Auto-stop losing variants", "Generate interim reports"], metrics: [{ label: "Tests managed", value: "89" }, { label: "Winners found", value: "34" }] },
  { id: "a4", name: "Data Unifier", role: "Aggregates data from multiple sources into unified view", group: "Analysts", currentTask: "Syncing Shopify analytics for 3 stores", status: "active", lastActive: "12 min ago", responsibilities: ["Pull Shopify data", "Normalize GA4 events", "Merge attribution data"], metrics: [{ label: "Data points synced", value: "2.1M" }, { label: "Sources connected", value: "6" }] },
  { id: "a5", name: "Insight Extractor", role: "Identifies patterns and actionable insights from data", group: "Analysts", currentTask: "Analyzing checkout funnel drop-offs", status: "pending", lastActive: "30 min ago", responsibilities: ["Pattern recognition", "Anomaly detection", "Insight prioritization"], metrics: [{ label: "Insights generated", value: "156" }, { label: "Actionable rate", value: "72%" }] },
  { id: "a6", name: "Attribution Modeller", role: "Builds multi-touch attribution models", group: "Analysts", currentTask: "Idle — awaiting new data batch", status: "idle", lastActive: "2h ago", responsibilities: ["Multi-touch modeling", "Channel scoring", "ROI calculation"], metrics: [{ label: "Models built", value: "12" }, { label: "Avg accuracy", value: "91%" }] },
  { id: "a7", name: "Copy Variant Generator", role: "Creates copy variations for experiments", group: "Writers", currentTask: "Generating 4 headline variants for PDP test", status: "active", lastActive: "8 min ago", responsibilities: ["Headline generation", "CTA copy variants", "Tone adaptation"], metrics: [{ label: "Variants created", value: "312" }, { label: "Win rate", value: "28%" }] },
  { id: "a8", name: "Email/Ad Copywriter", role: "Writes email campaigns and ad copy", group: "Writers", currentTask: "Drafting welcome email sequence", status: "pending", lastActive: "1h ago", responsibilities: ["Email sequences", "Ad copy (Meta, Google)", "Landing page copy"], metrics: [{ label: "Emails written", value: "84" }, { label: "Avg open rate", value: "42%" }] },
  { id: "a9", name: "Scheduler", role: "Manages task scheduling and cron jobs", group: "Operators", currentTask: "Scheduling weekly report for Friday 8am", status: "active", lastActive: "5 min ago", responsibilities: ["Cron job management", "Task scheduling", "Retry logic"], metrics: [{ label: "Jobs scheduled", value: "234" }, { label: "On-time rate", value: "99.8%" }] },
  { id: "a10", name: "Cron Manager", role: "Executes and monitors automated recurring tasks", group: "Operators", currentTask: "Running nightly data aggregation", status: "active", lastActive: "3 min ago", responsibilities: ["Execute cron jobs", "Monitor failures", "Alert on errors"], metrics: [{ label: "Jobs run", value: "1,204" }, { label: "Failure rate", value: "0.3%" }] },
  { id: "a11", name: "Integration Monitor", role: "Monitors health of all external integrations", group: "Operators", currentTask: "All integrations healthy", status: "active", lastActive: "1 min ago", responsibilities: ["API health checks", "Rate limit monitoring", "Credential rotation alerts"], metrics: [{ label: "Uptime", value: "99.97%" }, { label: "Integrations", value: "6" }] },
];

const groups = ["Developers", "Analysts", "Writers", "Operators"];

export default function AITeamPage() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  return (
    <DashboardLayout>
      <div className="p-8">
        <PageHeader title="AI Team" description="VELO agent network and sub-agent status." />

        {/* VELO Card */}
        <div className="mb-8 rounded-lg border border-primary/30 bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20 border border-primary/30">
              <Zap className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">VELO</h2>
              <p className="text-sm text-muted-foreground">Velocity OS Autonomous CRO Agent</p>
              <p className="text-xs text-muted-foreground mt-0.5">Runs experiments, generates insights, and deploys optimisations for DTC brands</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <StatusDot status="active" />
              <span className="text-sm font-medium text-success">Online — Running</span>
            </div>
          </div>
        </div>

        {groups.map((group) => (
          <div key={group} className="mb-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{group}</h3>
            <div className="grid grid-cols-3 gap-3">
              {agents.filter((a) => a.group === group).map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className="text-left rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-foreground">{agent.name}</h4>
                    <StatusDot status={agent.status} />
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-1">{agent.role}</p>
                  <div className="text-xs text-muted-foreground">
                    <p className="line-clamp-1"><span className="text-secondary-foreground">Task:</span> {agent.currentTask}</p>
                    <p className="mt-1 text-[10px]">Last active: {agent.lastActive}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {selectedAgent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setSelectedAgent(null)}>
            <div className="w-full max-w-lg rounded-lg border border-border bg-card p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-foreground">{selectedAgent.name}</h2>
                    <StatusDot status={selectedAgent.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedAgent.role}</p>
                </div>
                <button onClick={() => setSelectedAgent(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Current Task</h4>
                <p className="text-sm text-foreground">{selectedAgent.currentTask}</p>
              </div>

              <div className="mb-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Responsibilities</h4>
                <ul className="space-y-1">
                  {selectedAgent.responsibilities.map((r, i) => (
                    <li key={i} className="text-sm text-secondary-foreground">• {r}</li>
                  ))}
                </ul>
              </div>

              {selectedAgent.metrics && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Performance</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedAgent.metrics.map((m, i) => (
                      <div key={i} className="rounded-md bg-muted p-3">
                        <p className="text-xs text-muted-foreground">{m.label}</p>
                        <p className="text-lg font-bold text-foreground">{m.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
