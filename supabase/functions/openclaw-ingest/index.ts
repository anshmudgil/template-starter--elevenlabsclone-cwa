import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-openclaw-token",
};

type ActivityInput = {
  message?: string;
  text?: string;
  agent_name?: string;
  agentName?: string;
  status?: string;
  metadata?: Record<string, unknown>;
  source?: string;
};

const validStatuses = ["active", "pending", "idle", "error"] as const;
type RowStatus = (typeof validStatuses)[number];

function normalizeStatus(s: unknown): RowStatus {
  if (s === "active" || s === "pending" || s === "idle" || s === "error") return s;
  return "active";
}

function getToken(req: Request): string | null {
  const auth = req.headers.get("Authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7).trim();
  const h = req.headers.get("x-openclaw-token");
  return h?.trim() ?? null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const webhookSecret = Deno.env.get("OPENCLAW_WEBHOOK_SECRET");
  const userId = Deno.env.get("MISSION_CONTROL_USER_ID");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!webhookSecret || !userId || !supabaseUrl || !serviceKey) {
    return new Response(JSON.stringify({ error: "Server misconfigured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const token = getToken(req);
  if (!token || token !== webhookSecret) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  if (body.kind === "agent_status" && typeof body.slug === "string") {
    const update: Record<string, unknown> = {
      status: normalizeStatus(body.status),
      last_active_at: new Date().toISOString(),
    };
    if (typeof body.current_task === "string") update.current_task = body.current_task;
    const { error } = await supabase
      .from("agents")
      .update(update)
      .eq("user_id", userId)
      .eq("slug", body.slug);
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (Array.isArray(body.events)) {
    const rows = (body.events as ActivityInput[])
      .map((e) => ({
        user_id: userId,
        agent_name: String(e.agent_name ?? e.agentName ?? "OpenClaw"),
        status: normalizeStatus(e.status),
        message: String(e.message ?? e.text ?? "").trim(),
        metadata: (e.metadata ?? {}) as Record<string, unknown>,
        source: String(e.source ?? "openclaw"),
      }))
      .filter((r) => r.message.length > 0);

    if (rows.length === 0) {
      return new Response(JSON.stringify({ ok: true, inserted: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error } = await supabase.from("activity_events").insert(rows);
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ ok: true, inserted: rows.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const message = String(body.message ?? body.text ?? "").trim();
  if (!message) {
    return new Response(JSON.stringify({ error: "message or text required" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { error } = await supabase.from("activity_events").insert({
    user_id: userId,
    agent_name: String(body.agent_name ?? body.agentName ?? "OpenClaw"),
    status: normalizeStatus(body.status),
    message,
    metadata:
      typeof body.metadata === "object" && body.metadata !== null
        ? (body.metadata as Record<string, unknown>)
        : {},
    source: String(body.source ?? "openclaw"),
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
