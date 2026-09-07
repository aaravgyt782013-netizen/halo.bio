import { supabase } from "@/integrations/supabase/client";

/** Loosely typed client: these tables were added after the generated types. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db = supabase as any;

export type Profile = {
  id: string;
  username: string | null;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  background_type: "color" | "image" | "video";
  background_value: string;
  card_opacity: number;
  card_radius: number;
  card_blur: number;
  accent_color: string;
  music_url: string | null;
  music_enabled: boolean;
  enter_text: string;
  is_premium: boolean;
  is_banned: boolean;
  is_flagged: boolean;
  views: number;
  created_at: string;
};

export type BioLink = {
  id: string;
  user_id: string;
  title: string;
  url: string;
  position: number;
  clicks: number;
};

export const USERNAME_RE = /^[a-z0-9_.]{3,20}$/;

export function normalizeUsername(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9_.]/g, "").slice(0, 20);
}

export function ensureProtocol(url: string) {
  if (!url) return url;
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

/** Uploads to the private media bucket and returns a long-lived signed URL. */
export async function uploadMedia(userId: string, file: File, folder: string) {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const path = `${userId}/${folder}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { upsert: true });
  if (error) throw error;
  const { data, error: signError } = await supabase.storage
    .from("media")
    .createSignedUrl(path, TEN_YEARS);
  if (signError) throw signError;
  return data.signedUrl;
}

export async function fetchProfileByUsername(username: string) {
  const { data, error } = await db
    .from("profiles")
    .select("*")
    .ilike("username", username)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const { data: links, error: linkError } = await db
    .from("links")
    .select("*")
    .eq("user_id", data.id)
    .order("position", { ascending: true });
  if (linkError) throw linkError;
  return { profile: data as Profile, links: (links ?? []) as BioLink[] };
}
