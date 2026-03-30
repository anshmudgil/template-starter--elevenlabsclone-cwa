-- Mission Control: Clerk user IDs (text) + Supabase third-party JWT (sub) for RLS
-- Requires Clerk JWT template "supabase" per https://supabase.com/docs/guides/auth/third-party/clerk

drop trigger if exists on_auth_user_created on auth.users;

drop function if exists public.handle_new_user ();

drop policy if exists profiles_own on public.profiles;

drop policy if exists activity_events_own on public.activity_events;

drop policy if exists agents_own on public.agents;

drop policy if exists tasks_own on public.tasks;

drop policy if exists calendar_events_own on public.calendar_events;

drop policy if exists content_items_own on public.content_items;

drop policy if exists contacts_own on public.contacts;

drop policy if exists memories_own on public.memories;

drop policy if exists integrations_own on public.integrations;

drop policy if exists cron_jobs_own on public.cron_jobs;

drop policy if exists agent_settings_own on public.agent_settings;

alter table public.activity_events drop constraint if exists activity_events_user_id_fkey;

alter table public.agents drop constraint if exists agents_user_id_fkey;

alter table public.tasks drop constraint if exists tasks_user_id_fkey;

alter table public.calendar_events drop constraint if exists calendar_events_user_id_fkey;

alter table public.content_items drop constraint if exists content_items_user_id_fkey;

alter table public.contacts drop constraint if exists contacts_user_id_fkey;

alter table public.memories drop constraint if exists memories_user_id_fkey;

alter table public.integrations drop constraint if exists integrations_user_id_fkey;

alter table public.cron_jobs drop constraint if exists cron_jobs_user_id_fkey;

alter table public.agent_settings drop constraint if exists agent_settings_user_id_fkey;

alter table public.profiles drop constraint if exists profiles_pkey;

alter table public.profiles drop constraint if exists profiles_id_fkey;

alter table public.profiles
  alter column id type text using id::text;

alter table public.profiles add primary key (id);

alter table public.activity_events
  alter column user_id type text using user_id::text;

alter table public.agents alter column user_id type text using user_id::text;

alter table public.tasks alter column user_id type text using user_id::text;

alter table public.calendar_events alter column user_id type text using user_id::text;

alter table public.content_items alter column user_id type text using user_id::text;

alter table public.contacts alter column user_id type text using user_id::text;

alter table public.memories alter column user_id type text using user_id::text;

alter table public.integrations alter column user_id type text using user_id::text;

alter table public.cron_jobs alter column user_id type text using user_id::text;

alter table public.agent_settings alter column user_id type text using user_id::text;

alter table public.activity_events
  add constraint activity_events_user_id_fkey foreign key (user_id) references public.profiles (id) on delete cascade;

alter table public.agents
  add constraint agents_user_id_fkey foreign key (user_id) references public.profiles (id) on delete cascade;

alter table public.tasks
  add constraint tasks_user_id_fkey foreign key (user_id) references public.profiles (id) on delete cascade;

alter table public.calendar_events
  add constraint calendar_events_user_id_fkey foreign key (user_id) references public.profiles (id) on delete cascade;

alter table public.content_items
  add constraint content_items_user_id_fkey foreign key (user_id) references public.profiles (id) on delete cascade;

alter table public.contacts
  add constraint contacts_user_id_fkey foreign key (user_id) references public.profiles (id) on delete cascade;

alter table public.memories
  add constraint memories_user_id_fkey foreign key (user_id) references public.profiles (id) on delete cascade;

alter table public.integrations
  add constraint integrations_user_id_fkey foreign key (user_id) references public.profiles (id) on delete cascade;

alter table public.cron_jobs
  add constraint cron_jobs_user_id_fkey foreign key (user_id) references public.profiles (id) on delete cascade;

alter table public.agent_settings
  add constraint agent_settings_user_id_fkey foreign key (user_id) references public.profiles (id) on delete cascade;

create policy profiles_own on public.profiles for all to authenticated using ((auth.jwt () ->> 'sub') = id)
with
  check ((auth.jwt () ->> 'sub') = id);

create policy activity_events_own on public.activity_events for all to authenticated using ((auth.jwt () ->> 'sub') = user_id)
with
  check ((auth.jwt () ->> 'sub') = user_id);

create policy agents_own on public.agents for all to authenticated using ((auth.jwt () ->> 'sub') = user_id)
with
  check ((auth.jwt () ->> 'sub') = user_id);

create policy tasks_own on public.tasks for all to authenticated using ((auth.jwt () ->> 'sub') = user_id)
with
  check ((auth.jwt () ->> 'sub') = user_id);

create policy calendar_events_own on public.calendar_events for all to authenticated using ((auth.jwt () ->> 'sub') = user_id)
with
  check ((auth.jwt () ->> 'sub') = user_id);

create policy content_items_own on public.content_items for all to authenticated using ((auth.jwt () ->> 'sub') = user_id)
with
  check ((auth.jwt () ->> 'sub') = user_id);

create policy contacts_own on public.contacts for all to authenticated using ((auth.jwt () ->> 'sub') = user_id)
with
  check ((auth.jwt () ->> 'sub') = user_id);

create policy memories_own on public.memories for all to authenticated using ((auth.jwt () ->> 'sub') = user_id)
with
  check ((auth.jwt () ->> 'sub') = user_id);

create policy integrations_own on public.integrations for all to authenticated using ((auth.jwt () ->> 'sub') = user_id)
with
  check ((auth.jwt () ->> 'sub') = user_id);

create policy cron_jobs_own on public.cron_jobs for all to authenticated using ((auth.jwt () ->> 'sub') = user_id)
with
  check ((auth.jwt () ->> 'sub') = user_id);

create policy agent_settings_own on public.agent_settings for all to authenticated using ((auth.jwt () ->> 'sub') = user_id)
with
  check ((auth.jwt () ->> 'sub') = user_id);

create or replace function public.ensure_mission_seed (p_user_id text) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid text := p_user_id;
begin
  if (auth.jwt () ->> 'sub') is distinct from p_user_id then
    raise exception 'forbidden';
  end if;

  if exists (
    select
      1
    from
      public.agents
    where
      user_id = uid
    limit
      1
  ) then
    return;
  end if;

  insert into public.agents (
    user_id,
    slug,
    name,
    role,
    group_name,
    current_task,
    status,
    last_active_at,
    responsibilities,
    metrics,
    sort_order
  )
    values (
      uid,
      'experiment-builder',
      'Experiment Builder',
      'Creates and configures A/B test experiments',
      'Developers',
      'Idle',
      'idle',
      now(),
      '["Design experiment variants","Set up test parameters","Configure traffic allocation"]'::jsonb,
      '[{"label":"Experiments built","value":"0"},{"label":"Avg setup time","value":"—"}]'::jsonb,
      0
    ),
    (
      uid,
      'variant-deployer',
      'Variant Deployer',
      'Deploys winning experiment variants to production',
      'Developers',
      'Idle',
      'idle',
      now(),
      '["Deploy variant code","Rollback failed deploys","Verify production state"]'::jsonb,
      '[{"label":"Variants deployed","value":"0"},{"label":"Success rate","value":"—"}]'::jsonb,
      1
    ),
    (
      uid,
      'ab-test-runner',
      'A/B Test Runner',
      'Monitors and manages running experiments',
      'Developers',
      'Idle',
      'idle',
      now(),
      '["Monitor statistical significance","Auto-stop losing variants","Generate interim reports"]'::jsonb,
      '[{"label":"Tests managed","value":"0"},{"label":"Winners found","value":"0"}]'::jsonb,
      2
    ),
    (
      uid,
      'data-unifier',
      'Data Unifier',
      'Aggregates data from multiple sources into unified view',
      'Analysts',
      'Idle',
      'idle',
      now(),
      '["Pull Shopify data","Normalize GA4 events","Merge attribution data"]'::jsonb,
      '[{"label":"Data points synced","value":"0"},{"label":"Sources connected","value":"0"}]'::jsonb,
      3
    ),
    (
      uid,
      'insight-extractor',
      'Insight Extractor',
      'Identifies patterns and actionable insights from data',
      'Analysts',
      'Idle',
      'idle',
      now(),
      '["Pattern recognition","Anomaly detection","Insight prioritization"]'::jsonb,
      '[{"label":"Insights generated","value":"0"},{"label":"Actionable rate","value":"—"}]'::jsonb,
      4
    ),
    (
      uid,
      'attribution-modeller',
      'Attribution Modeller',
      'Builds multi-touch attribution models',
      'Analysts',
      'Idle',
      'idle',
      now(),
      '["Multi-touch modeling","Channel scoring","ROI calculation"]'::jsonb,
      '[{"label":"Models built","value":"0"},{"label":"Avg accuracy","value":"—"}]'::jsonb,
      5
    ),
    (
      uid,
      'copy-variant-generator',
      'Copy Variant Generator',
      'Creates copy variations for experiments',
      'Writers',
      'Idle',
      'idle',
      now(),
      '["Headline generation","CTA copy variants","Tone adaptation"]'::jsonb,
      '[{"label":"Variants created","value":"0"},{"label":"Win rate","value":"—"}]'::jsonb,
      6
    ),
    (
      uid,
      'email-ad-copywriter',
      'Email/Ad Copywriter',
      'Writes email campaigns and ad copy',
      'Writers',
      'Idle',
      'idle',
      now(),
      '["Email sequences","Ad copy (Meta, Google)","Landing page copy"]'::jsonb,
      '[{"label":"Emails written","value":"0"},{"label":"Avg open rate","value":"—"}]'::jsonb,
      7
    ),
    (
      uid,
      'scheduler',
      'Scheduler',
      'Manages task scheduling and cron jobs',
      'Operators',
      'Idle',
      'idle',
      now(),
      '["Cron job management","Task scheduling","Retry logic"]'::jsonb,
      '[{"label":"Jobs scheduled","value":"0"},{"label":"On-time rate","value":"—"}]'::jsonb,
      8
    ),
    (
      uid,
      'cron-manager',
      'Cron Manager',
      'Executes and monitors automated recurring tasks',
      'Operators',
      'Idle',
      'idle',
      now(),
      '["Execute cron jobs","Monitor failures","Alert on errors"]'::jsonb,
      '[{"label":"Jobs run","value":"0"},{"label":"Failure rate","value":"—"}]'::jsonb,
      9
    ),
    (
      uid,
      'integration-monitor',
      'Integration Monitor',
      'Monitors health of all external integrations',
      'Operators',
      'Idle',
      'idle',
      now(),
      '["API health checks","Rate limit monitoring","Credential rotation alerts"]'::jsonb,
      '[{"label":"Uptime","value":"—"},{"label":"Integrations","value":"0"}]'::jsonb,
      10
    );

  insert into public.integrations (user_id, name, description, status, last_sync_at)
    values (uid, 'Shopify', 'Data source for CRO experiments', 'idle', null),
(uid, 'Notion', 'Memory + task sync', 'idle', null),
(uid, 'Google Analytics 4', 'Conversion tracking', 'idle', null),
(uid, 'Slack', 'Agent alerts + notifications', 'idle', null),
(uid, 'GitHub', 'Deployment triggers', 'idle', null),
(uid, 'OpenClaw', 'Autonomous agent gateway', 'idle', null);

  insert into public.cron_jobs (user_id, name, schedule_human, status, last_run_at)
    values (uid, 'Daily data sync — Shopify', 'Every day at 6:00 AM', 'idle', null),
(uid, 'Weekly performance report', 'Every Friday at 8:00 AM', 'idle', null),
(uid, 'Experiment results check', 'Every 4 hours', 'idle', null),
(uid, 'GA4 event pull', 'Every 30 minutes', 'idle', null),
(uid, 'Nightly attribution model update', 'Every day at 2:00 AM', 'idle', null);

  insert into public.agent_settings (user_id, label, value)
    values (uid, 'Experiment frequency', 'Up to 5 concurrent experiments'),
(uid, 'Significance threshold', '95% confidence'),
(uid, 'Auto-deploy winners', 'Enabled (with 24h review gate)'),
(uid, 'Approval gates', 'Required for revenue-impacting changes'),
(uid, 'Max traffic allocation', '50% per variant'),
(uid, 'Minimum sample size', '1,000 visitors per variant');

  insert into public.activity_events (user_id, agent_name, status, message, source)
    values (uid, 'OpenClaw', 'active', 'Mission Control workspace ready. Connect OpenClaw webhook to start streaming activity.', 'system');
end;
$$;

revoke all on function public.ensure_mission_seed (text) from public;

grant execute on function public.ensure_mission_seed (text) to authenticated;
