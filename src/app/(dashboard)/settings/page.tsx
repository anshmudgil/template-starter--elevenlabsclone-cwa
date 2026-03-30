"use client";

import { useMemo, useState } from "react";
import { MissionPageHeader } from "@/components/mission-page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  useAgentSettingsRows,
  useCronJobs,
  useIntegrations,
  useUpdateAgentSetting,
  useUpdateCronJob,
  useUpdateIntegration,
} from "@/hooks/use-mission-control";
import { formatRelativeTime } from "@/lib/format-relative-time";

function isRunning(status: string) {
  return status === "active" || status === "running";
}

export default function SettingsPage() {
  const { data: integrations = [], isLoading: intLoading } = useIntegrations();
  const { data: crons = [], isLoading: cronLoading } = useCronJobs();
  const { data: agentSettings = [], isLoading: asLoading } = useAgentSettingsRows();
  const updateIntegration = useUpdateIntegration();
  const updateCron = useUpdateCronJob();
  const updateSetting = useUpdateAgentSetting();
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const sortedSettings = useMemo(
    () => [...agentSettings].sort((a, b) => a.label.localeCompare(b.label)),
    [agentSettings],
  );

  const setDraft = (id: string, value: string) => {
    setDrafts((d) => ({ ...d, [id]: value }));
  };

  return (
    <>
      <MissionPageHeader
        title="Settings"
        description="Integrations, scheduled jobs, and agent defaults."
      />
      <div className="flex min-h-0 flex-1 flex-col gap-10 overflow-y-auto p-6">
        <section>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Integrations</h2>
          {intLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (
            <ul className="divide-y divide-border rounded-lg border border-border bg-card">
              {integrations.map((row) => (
                <li key={row.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-foreground">{row.name}</div>
                    {row.description ? (
                      <p className="text-xs text-muted-foreground">{row.description}</p>
                    ) : null}
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {row.status}
                  </Badge>
                  <Switch
                    checked={isRunning(row.status)}
                    onCheckedChange={(on) =>
                      updateIntegration.mutate({
                        id: row.id,
                        patch: { status: on ? "active" : "idle" },
                      })
                    }
                    disabled={updateIntegration.isPending}
                    aria-label={`Toggle ${row.name}`}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Cron jobs</h2>
          {cronLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (
            <ul className="divide-y divide-border rounded-lg border border-border bg-card">
              {crons.map((row) => (
                <li key={row.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-foreground">{row.name}</div>
                    {row.schedule_human ? (
                      <p className="text-xs text-muted-foreground">{row.schedule_human}</p>
                    ) : null}
                    {row.last_run_at ? (
                      <p className="text-xs text-muted-foreground">
                        Last run {formatRelativeTime(row.last_run_at)}
                      </p>
                    ) : null}
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {row.status}
                  </Badge>
                  <Switch
                    checked={isRunning(row.status)}
                    onCheckedChange={(on) =>
                      updateCron.mutate({
                        id: row.id,
                        patch: { status: on ? "active" : "idle" },
                      })
                    }
                    disabled={updateCron.isPending}
                    aria-label={`Toggle ${row.name}`}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Agent defaults</h2>
          {asLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (
            <div className="space-y-4 rounded-lg border border-border bg-card p-4">
              {sortedSettings.map((row) => {
                const val = drafts[row.id] ?? row.value;
                return (
                  <div key={row.id} className="grid gap-1.5 sm:grid-cols-[minmax(0,220px)_1fr_auto] sm:items-end sm:gap-3">
                    <Label htmlFor={`as-${row.id}`} className="text-foreground">
                      {row.label}
                    </Label>
                    <Input
                      id={`as-${row.id}`}
                      value={val}
                      onChange={(e) => setDraft(row.id, e.target.value)}
                    />
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={val === row.value || updateSetting.isPending}
                      onClick={() =>
                        updateSetting.mutate(
                          { id: row.id, value: val },
                          {
                            onSuccess: () => setDrafts((d) => {
                              const next = { ...d };
                              delete next[row.id];
                              return next;
                            }),
                          },
                        )
                      }
                    >
                      Save
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
