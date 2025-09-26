create table "profiles" (
  id uuid not null references auth.users on delete cascade as identity primary key,
  full_name text,  -- From Google metadata
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);


-- Function to handle new users
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into profiles (id, full_name, permissions)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),  -- Pull name from Google
    '{"role": "user"}'::jsonb  -- Default permissions; customize logic here if needed
  );
  return new;
end;
$$;

-- Attach trigger to auth.users inserts
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();