CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  display_name text,
  bio text DEFAULT '',
  avatar_url text,
  background_type text NOT NULL DEFAULT 'color',
  background_value text NOT NULL DEFAULT '#eef2f7',
  card_opacity numeric NOT NULL DEFAULT 0.55,
  card_radius integer NOT NULL DEFAULT 28,
  card_blur integer NOT NULL DEFAULT 18,
  accent_color text NOT NULL DEFAULT '#3b82f6',
  music_url text,
  music_enabled boolean NOT NULL DEFAULT false,
  enter_text text NOT NULL DEFAULT 'click to enter',
  is_premium boolean NOT NULL DEFAULT false,
  is_banned boolean NOT NULL DEFAULT false,
  is_flagged boolean NOT NULL DEFAULT false,
  views bigint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  url text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  clicks bigint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX links_user_pos_idx ON public.links (user_id, position);

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.links TO authenticated;
GRANT SELECT ON public.links TO anon;
GRANT ALL ON public.links TO service_role;

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "public profiles readable" ON public.profiles
  FOR SELECT TO anon, authenticated USING (is_banned = false OR auth.uid() = id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "own profile insert" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "admins update profiles" ON public.profiles
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete profiles" ON public.profiles
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "public links readable" ON public.links
  FOR SELECT TO anon, authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = links.user_id AND (p.is_banned = false OR p.id = auth.uid()))
  );
CREATE POLICY "own links manage" ON public.links
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "admins delete links" ON public.links
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "own roles readable" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;

  IF lower(NEW.email) = 'staff@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.username_available(_username text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT NOT EXISTS (SELECT 1 FROM public.profiles WHERE lower(username) = lower(_username))
$$;
GRANT EXECUTE ON FUNCTION public.username_available(text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.increment_profile_view(_username text)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.profiles SET views = views + 1 WHERE lower(username) = lower(_username);
$$;
GRANT EXECUTE ON FUNCTION public.increment_profile_view(text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.increment_link_click(_link_id uuid)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.links SET clicks = clicks + 1 WHERE id = _link_id;
$$;
GRANT EXECUTE ON FUNCTION public.increment_link_click(uuid) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.platform_stats()
RETURNS TABLE (total_profiles bigint, active_profiles bigint, total_views bigint, total_clicks bigint, total_links bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT
    (SELECT count(*) FROM public.profiles),
    (SELECT count(*) FROM public.profiles WHERE username IS NOT NULL AND is_banned = false),
    (SELECT COALESCE(sum(views),0) FROM public.profiles),
    (SELECT COALESCE(sum(clicks),0) FROM public.links),
    (SELECT count(*) FROM public.links)
  WHERE public.has_role(auth.uid(), 'admin');
$$;
GRANT EXECUTE ON FUNCTION public.platform_stats() TO authenticated;

CREATE POLICY "media public read" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'media');
CREATE POLICY "media own insert" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "media own update" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'media' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "media own delete" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'media' AND (storage.foldername(name))[1] = auth.uid()::text);