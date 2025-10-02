create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  email TEXT NOT NULL,
  full_name TEXT,
  permissions jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);


-- Function to handle new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, permissions)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', '{"role": "user"}'::jsonb)
  ON CONFLICT (id) DO NOTHING; -- Avoid duplicate profiles
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;



-- Attach trigger to auth.users inserts
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();