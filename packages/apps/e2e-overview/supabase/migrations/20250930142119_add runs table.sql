create table public.runs (
  id uuid primary key default gen_random_uuid(),
  version_id uuid references public.app_test_versions(id) on delete cascade,
  logs text,
  container_logs text,
  start_time timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  duration real,
  expected integer,
  flaky integer,
  skipped integer,
  unexpected integer,
  config jsonb,
  errors jsonb,
  suits jsonb,
  screenshots jsonb
);

CREATE INDEX idx_runs_version_id ON public.runs (version_id);