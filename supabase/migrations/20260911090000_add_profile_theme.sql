ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS theme jsonb;
