type HookEvent = {
  type: string;
  action: string;
  sessionKey: string;
  timestamp: Date;
  messages: string[];
  context: {
    content?: string;
    from?: string;
    to?: string;
    channelId?: string;
    [key: string]: unknown;
  };
};

export default async function missionControlIngest(event: HookEvent): Promise<void> {
  const url = process.env.MISSION_CONTROL_INGEST_URL?.trim();
  const secret = process.env.MISSION_CONTROL_WEBHOOK_SECRET?.trim();
  if (!url || !secret) return;

  const parts = [event.type, event.action].filter(Boolean);
  let message = parts.join(":");
  if (event.context?.content && typeof event.context.content === "string") {
    const snippet = event.context.content.slice(0, 280);
    message = `${message} — ${snippet}`;
  }

  const body = {
    message,
    agent_name: "OpenClaw",
    status: "active",
    metadata: {
      sessionKey: event.sessionKey,
      type: event.type,
      action: event.action,
      ts: event.timestamp?.toISOString?.() ?? new Date().toISOString(),
    },
    source: "openclaw",
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.warn(`[mission-control] ingest ${res.status}: ${await res.text()}`);
    }
  } catch (e) {
    console.warn("[mission-control] ingest failed", e);
  }
}
