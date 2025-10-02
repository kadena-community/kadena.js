create table public.apps (
  id uuid primary key default gen_random_uuid(),
  is_on_dashboard boolean DEFAULT false NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  cron text DEFAULT '* * * * *' NOT NULL,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

