-- Mission Control: per-user data + OpenClaw ingest (Edge Function with service role)

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.activity_events (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  agent_name text not null default 'OpenClaw',
  status text not null default 'active'
    check (status in ('active', 'pending', 'idle', 'error')),
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  source text not null default 'openclaw'
);

create table public.agents (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references public.profiles (id) on delete cascade,
  slug text not null,
  name text not null,
  role text,
  group_name text not null,
  current_task text not null default '',
  status text not null default 'idle'
    check (status in ('active', 'pending', 'idle', 'error')),
  last_active_at timestamptz,
  responsibilities jsonb not null default '[]'::jsonb,
  metrics jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  unique (user_id, slug)
);

create table public.tasks (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references public.profiles (id) on delete cascade,
  column_id text not null
    check (column_id in ('backlog', 'inProgress', 'review', 'done')),
  sort_order int not null default 0,
  title text not null,
  assignee text not null check (assignee in ('Ansh', 'VELO')),
  priority text not null check (priority in ('low', 'medium', 'high', 'urgent')),
  due_date text,
  project text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.calendar_events (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  event_date date not null,
  event_time text,
  category text not null
    check (category in ('velocity', 'content', 'agency', 'automation')),
  created_at timestamptz not null default now()
);

create table public.content_items (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references public.profiles (id) on delete cascade,
  column_id text not null,
  sort_order int not null default 0,
  title text not null,
  platform text not null,
  day_label text,
  status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contacts (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  role text,
  category text not null,
  email text,
  slack text,
  linkedin text,
  timezone text,
  compensation text,
  notes text,
  created_at timestamptz not null default now()
);

create table public.memories (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  category text not null,
  preview text,
  content text not null default '',
  created_at timestamptz not null default now()
);

create table public.integrations (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  description text,
  status text not null default 'active'
    check (status in ('active', 'pending', 'idle', 'error')),
  last_sync_at timestamptz,
  unique (user_id, name)
);

create table public.cron_jobs (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  schedule_human text,
  status text not null default 'active'
    check (status in ('active', 'pending', 'idle', 'error')),
  last_run_at timestamptz,
  unique (user_id, name)
);

create table public.agent_settings (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references public.profiles (id) on delete cascade,
  label text not null,
  value text not null,
  unique (user_id, label)
);

create index activity_events_user_created_idx on public.activity_events (user_id, created_at desc);
create index tasks_user_column_idx on public.tasks (user_id, column_id, sort_order);
create index content_items_user_column_idx on public.content_items (user_id, column_id, sort_order);
create index calendar_events_user_date_idx on public.calendar_events (user_id, event_date);
create index agents_user_group_idx on public.agents (user_id, group_name, sort_order);

-- Realtime for live feed
alter publication supabase_realtime add table public.activity_events;

-- RLS
alter table public.profiles enable row level security;
alter table public.activity_events enable row level security;
alter table public.agents enable row level security;
alter table public.tasks enable row level security;
alter table public.calendar_events enable row level security;
alter table public.content_items enable row level security;
alter table public.contacts enable row level security;
alter table public.memories enable row level security;
alter table public.integrations enable row level security;
alter table public.cron_jobs enable row level security;
alter table public.agent_settings enable row level security;

create policy "profiles_own" on public.profiles for all using (auth.uid () = id) with check (auth.uid () = id);

create policy "activity_events_own" on public.activity_events for all using (auth.uid () = user_id) with check (auth.uid () = user_id);

create policy "agents_own" on public.agents for all using (auth.uid () = user_id) with check (auth.uid () = user_id);

create policy "tasks_own" on public.tasks for all using (auth.uid () = user_id) with check (auth.uid () = user_id);

create policy "calendar_events_own" on public.calendar_events for all using (auth.uid () = user_id) with check (auth.uid () = user_id);

create policy "content_items_own" on public.content_items for all using (auth.uid () = user_id) with check (auth.uid () = user_id);

create policy "contacts_own" on public.contacts for all using (auth.uid () = user_id) with check (auth.uid () = user_id);

create policy "memories_own" on public.memories for all using (auth.uid () = user_id) with check (auth.uid () = user_id);

create policy "integrations_own" on public.integrations for all using (auth.uid () = user_id) with check (auth.uid () = user_id);

create policy "cron_jobs_own" on public.cron_jobs for all using (auth.uid () = user_id) with check (auth.uid () = user_id);

create policy "agent_settings_own" on public.agent_settings for all using (auth.uid () = user_id) with check (auth.uid () = user_id);

-- New user → profile + demo seed
create or replace function public.handle_new_user ()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := new.id;
  em text := new.email;
  dn text := coalesce(new.raw_user_meta_data ->> 'display_name', split_part(coalesce(new.email, 'user'), '@', 1));
begin
  insert into public.profiles (id, email, display_name)
  values (uid, em, dn);

  insert into public.agents (user_id, slug, name, role, group_name, current_task, status, last_active_at, responsibilities, metrics, sort_order)
  values
    (uid, 'experiment-builder', 'Experiment Builder', 'Creates and configures A/B test experiments', 'Developers', 'Idle', 'idle', now(), '["Design experiment variants","Set up test parameters","Configure traffic allocation"]'::jsonb, '[{"label":"Experiments built","value":"0"},{"label":"Avg setup time","value":"—"}]'::jsonb, 0),
    (uid, 'variant-deployer', 'Variant Deployer', 'Deploys winning experiment variants to production', 'Developers', 'Idle', 'idle', now(), '["Deploy variant code","Rollback failed deploys","Verify production state"]'::jsonb, '[{"label":"Variants deployed","value":"0"},{"label":"Success rate","value":"—"}]'::jsonb, 1),
    (uid, 'ab-test-runner', 'A/B Test Runner', 'Monitors and manages running experiments', 'Developers', 'Idle', 'idle', now(), '["Monitor statistical significance","Auto-stop losing variants","Generate interim reports"]'::jsonb, '[{"label":"Tests managed","value":"0"},{"label":"Winners found","value":"0"}]'::jsonb, 2),
    (uid, 'data-unifier', 'Data Unifier', 'Aggregates data from multiple sources into unified view', 'Analysts', 'Idle', 'idle', now(), '["Pull Shopify data","Normalize GA4 events","Merge attribution data"]'::jsonb, '[{"label":"Data points synced","value":"0"},{"label":"Sources connected","value":"0"}]'::jsonb, 3),
    (uid, 'insight-extractor', 'Insight Extractor', 'Identifies patterns and actionable insights from data', 'Analysts', 'Idle', 'idle', now(), '["Pattern recognition","Anomaly detection","Insight prioritization"]'::jsonb, '[{"label":"Insights generated","value":"0"},{"label":"Actionable rate","value":"—"}]'::jsonb, 4),
    (uid, 'attribution-modeller', 'Attribution Modeller', 'Builds multi-touch attribution models', 'Analysts', 'Idle', 'idle', now(), '["Multi-touch modeling","Channel scoring","ROI calculation"]'::jsonb, '[{"label":"Models built","value":"0"},{"label":"Avg accuracy","value":"—"}]'::jsonb, 5),
    (uid, 'copy-variant-generator', 'Copy Variant Generator', 'Creates copy variations for experiments', 'Writers', 'Idle', 'idle', now(), '["Headline generation","CTA copy variants","Tone adaptation"]'::jsonb, '[{"label":"Variants created","value":"0"},{"label":"Win rate","value":"—"}]'::jsonb, 6),
    (uid, 'email-ad-copywriter', 'Email/Ad Copywriter', 'Writes email campaigns and ad copy', 'Writers', 'Idle', 'idle', now(), '["Email sequences","Ad copy (Meta, Google)","Landing page copy"]'::jsonb, '[{"label":"Emails written","value":"0"},{"label":"Avg open rate","value":"—"}]'::jsonb, 7),
    (uid, 'scheduler', 'Scheduler', 'Manages task scheduling and cron jobs', 'Operators', 'Idle', 'idle', now(), '["Cron job management","Task scheduling","Retry logic"]'::jsonb, '[{"label":"Jobs scheduled","value":"0"},{"label":"On-time rate","value":"—"}]'::jsonb, 8),
    (uid, 'cron-manager', 'Cron Manager', 'Executes and monitors automated recurring tasks', 'Operators', 'Idle', 'idle', now(), '["Execute cron jobs","Monitor failures","Alert on errors"]'::jsonb, '[{"label":"Jobs run","value":"0"},{"label":"Failure rate","value":"—"}]'::jsonb, 9),
    (uid, 'integration-monitor', 'Integration Monitor', 'Monitors health of all external integrations', 'Operators', 'Idle', 'idle', now(), '["API health checks","Rate limit monitoring","Credential rotation alerts"]'::jsonb, '[{"label":"Uptime","value":"—"},{"label":"Integrations","value":"0"}]'::jsonb, 10);

  insert into public.integrations (user_id, name, description, status, last_sync_at)
  values
    (uid, 'Shopify', 'Data source for CRO experiments', 'idle', null),
    (uid, 'Notion', 'Memory + task sync', 'idle', null),
    (uid, 'Google Analytics 4', 'Conversion tracking', 'idle', null),
    (uid, 'Slack', 'Agent alerts + notifications', 'idle', null),
    (uid, 'GitHub', 'Deployment triggers', 'idle', null),
    (uid, 'OpenClaw', 'Autonomous agent gateway', 'idle', null);

  insert into public.cron_jobs (user_id, name, schedule_human, status, last_run_at)
  values
    (uid, 'Daily data sync — Shopify', 'Every day at 6:00 AM', 'idle', null),
    (uid, 'Weekly performance report', 'Every Friday at 8:00 AM', 'idle', null),
    (uid, 'Experiment results check', 'Every 4 hours', 'idle', null),
    (uid, 'GA4 event pull', 'Every 30 minutes', 'idle', null),
    (uid, 'Nightly attribution model update', 'Every day at 2:00 AM', 'idle', null);

  insert into public.agent_settings (user_id, label, value)
  values
    (uid, 'Experiment frequency', 'Up to 5 concurrent experiments'),
    (uid, 'Significance threshold', '95% confidence'),
    (uid, 'Auto-deploy winners', 'Enabled (with 24h review gate)'),
    (uid, 'Approval gates', 'Required for revenue-impacting changes'),
    (uid, 'Max traffic allocation', '50% per variant'),
    (uid, 'Minimum sample size', '1,000 visitors per variant');

  insert into public.activity_events (user_id, agent_name, status, message, source)
  values (uid, 'OpenClaw', 'active', 'Mission Control workspace ready. Connect OpenClaw webhook to start streaming activity.', 'system');

  return NEW;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user ();

-- updated_at helper for tasks/content_items
create or replace function public.set_updated_at ()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger tasks_updated_at before update on public.tasks
  for each row execute procedure public.set_updated_at ();

create trigger content_items_updated_at before update on public.content_items
  for each row execute procedure public.set_updated_at ();

create trigger profiles_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at ();
