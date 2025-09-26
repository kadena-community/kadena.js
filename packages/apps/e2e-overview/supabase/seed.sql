insert into public.apps
  (name)
values
  ('preview.wallet.kadena.io')
  ON CONFLICT DO NOTHING; -- Avoid duplicates