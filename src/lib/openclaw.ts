export function getOpenClawIngestUrl(): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return "";
  return `${base.replace(/\/$/, "")}/functions/v1/openclaw-ingest`;
}
