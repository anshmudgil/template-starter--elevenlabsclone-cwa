---
name: mission-control
description: "Forward OpenClaw lifecycle events to Mission Control (Supabase openclaw-ingest)"
metadata:
  {
    "openclaw":
      {
        "emoji": "🛰️",
        "events":
          [
            "gateway:startup",
            "message:received",
            "message:sent",
            "command:new",
            "session:patch",
          ],
        "requires": { "env": ["MISSION_CONTROL_INGEST_URL", "MISSION_CONTROL_WEBHOOK_SECRET"] },
      },
  }
---

# mission-control

Posts a JSON activity payload to your deployed `openclaw-ingest` Edge Function whenever registered events fire.

## Setup

1. Deploy Mission Control DB + `openclaw-ingest` and copy the ingest URL from Settings.
2. Create the same random secret in Supabase Function secrets (`OPENCLAW_WEBHOOK_SECRET`) and in your shell:

```bash
export MISSION_CONTROL_INGEST_URL="https://YOUR_PROJECT.supabase.co/functions/v1/openclaw-ingest"
export MISSION_CONTROL_WEBHOOK_SECRET="same-secret-as-supabase"
```

3. Copy this folder to `~/.openclaw/hooks/mission-control` or install via plugin path, then:

```bash
openclaw hooks enable mission-control
```

Optional: tighten `metadata.openclaw.events` in the frontmatter to only the signals you want.
