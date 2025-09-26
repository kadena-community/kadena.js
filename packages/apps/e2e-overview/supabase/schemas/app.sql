create table "apps" (
  id uuid generated always as identity primary key
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
);

insert into apps
  (name)
values
  ('preview.wallet.kadena.io');