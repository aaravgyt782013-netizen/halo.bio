import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Trash2,
  GripVertical,
  Link2,
  Palette,
  Music4,
  ExternalLink,
  LogOut,
  ShieldCheck,
  Save,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { db, ensureProtocol, uploadMedia, type BioLink, type Profile } from "@/lib/bio";
import { useAuth, useIsAdmin, useMyProfile } from "@/hooks/useAuth";
import { ProfileView } from "@/components/ProfileView";
import { PhoneFrame } from "@/components/PhoneFrame";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Builder — Halo bio page" },
      {
        name: "description",
        content:
          "Edit links, background, glass styling and music for your Halo bio page with a live phone preview.",
      },
      { property: "og:title", content: "Builder — Halo bio page" },
      {
        property: "og:description",
        content: "Your Halo builder: links, appearance, media and effects with live preview.",
      },
    ],
  }),
  component: Dashboard,
});

type Tab = "links" | "appearance" | "effects";

function Dashboard() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { profile, setProfile, loading: profileLoading } = useMyProfile(user?.id);
  const isAdmin = useIsAdmin(user?.id);
  const [links, setLinks] = useState<BioLink[]>([]);
  const [tab, setTab] = useState<Tab>("links");
  const [saving, setSaving] = useState(false);
  const dragIndex = useRef<number | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!profileLoading && profile && !profile.username) navigate({ to: "/claim" });
  }, [profile, profileLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    db.from("links")
      .select("*")
      .eq("user_id", user.id)
      .order("position", { ascending: true })
      .then(({ data }: { data: BioLink[] | null }) => setLinks(data ?? []));
  }, [user]);

  const patch = (changes: Partial<Profile>) =>
    setProfile((p) => (p ? { ...p, ...changes } : p));

  const saveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    const { error } = await db
      .from("profiles")
      .update({
        display_name: profile.display_name,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        background_type: profile.background_type,
        background_value: profile.background_value,
        card_opacity: profile.card_opacity,
        card_radius: profile.card_radius,
        card_blur: profile.card_blur,
        accent_color: profile.accent_color,
        music_url: profile.music_url,
        music_enabled: profile.music_enabled,
        enter_text: profile.enter_text,
      })
      .eq("id", profile.id);
    setSaving(false);
    if (error) toast.error("Could not save changes");
    else toast.success("Page updated");
  };

  const addLink = async () => {
    if (!user) return;
    const { data, error } = await db
      .from("links")
      .insert({ user_id: user.id, title: "New link", url: "https://", position: links.length })
      .select()
      .single();
    if (error) {
      toast.error("Could not add link");
      return;
    }
    setLinks((l) => [...l, data as BioLink]);
  };

  const updateLink = async (id: string, changes: Partial<BioLink>) => {
    setLinks((l) => l.map((x) => (x.id === id ? { ...x, ...changes } : x)));
    await db.from("links").update(changes).eq("id", id);
  };

  const removeLink = async (id: string) => {
    setLinks((l) => l.filter((x) => x.id !== id));
    await db.from("links").delete().eq("id", id);
  };

  const commitOrder = async (ordered: BioLink[]) => {
    setLinks(ordered);
    await Promise.all(
      ordered.map((l, i) => db.from("links").update({ position: i }).eq("id", l.id)),
    );
  };

  const onDrop = (index: number) => {
    const from = dragIndex.current;
    dragIndex.current = null;
    if (from === null || from === index) return;
    const next = [...links];
    const [moved] = next.splice(from, 1);
    if (moved) next.splice(index, 0, moved);
    void commitOrder(next);
  };

  const upload = async (file: File, folder: string, onDone: (url: string) => void) => {
    if (!user) return;
    try {
      toast.info("Uploading…");
      const url = await uploadMedia(user.id, file, folder);
      onDone(url);
      toast.success("Uploaded");
    } catch {
      toast.error("Upload failed");
    }
  };

  if (loading || profileLoading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="aura pointer-events-none absolute inset-0 -z-10" />

      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-6">
        <div>
          <span className="font-display text-lg font-bold tracking-tight">halo.bio</span>
          <p className="text-xs text-muted-foreground">@{profile.username}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isAdmin && (
            <Link to="/admin" className="btn-ghost">
              <ShieldCheck className="h-4 w-4" /> Staff
            </Link>
          )}
          {profile.username && (
            <Link
              to="/$username"
              params={{ username: profile.username }}
              className="btn-ghost"
              target="_blank"
            >
              <ExternalLink className="h-4 w-4" /> View page
            </Link>
          )}
          <button onClick={saveProfile} disabled={saving} className="btn-primary">
            <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save"}
          </button>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/" });
            }}
            className="btn-ghost"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-5 pb-20 lg:grid-cols-[1fr_360px]">
        <section className="glass-panel animate-float-in p-5 sm:p-7">
          <div className="mb-6 flex gap-1 rounded-full bg-secondary p-1">
            {(
              [
                ["links", "Links", Link2],
                ["appearance", "Appearance", Palette],
                ["effects", "Media & effects", Music4],
              ] as const
            ).map(([key, label, Icon]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
                  tab === key
                    ? "bg-card text-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" /> {label}
              </button>
            ))}
          </div>

          {tab === "links" && (
            <div className="space-y-3">
              {links.map((link, i) => (
                <div
                  key={link.id}
                  draggable
                  onDragStart={() => (dragIndex.current = i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onDrop(i)}
                  className="surface flex items-start gap-3 p-3"
                >
                  <GripVertical className="mt-2 h-4 w-4 shrink-0 cursor-grab text-muted-foreground" />
                  <div className="grid flex-1 gap-2 sm:grid-cols-2">
                    <input
                      className="field"
                      value={link.title}
                      placeholder="Title"
                      onChange={(e) => updateLink(link.id, { title: e.target.value })}
                    />
                    <input
                      className="field"
                      value={link.url}
                      placeholder="https://…"
                      onChange={(e) => updateLink(link.id, { url: e.target.value })}
                      onBlur={(e) => updateLink(link.id, { url: ensureProtocol(e.target.value) })}
                    />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <button
                      onClick={() => removeLink(link.id)}
                      aria-label={`Delete ${link.title}`}
                      className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <span className="text-[10px] text-muted-foreground">{link.clicks} clicks</span>
                  </div>
                </div>
              ))}
              <button onClick={addLink} className="btn-ghost w-full">
                <Plus className="h-4 w-4" /> Add link
              </button>
              <p className="text-xs text-muted-foreground">Drag rows to reorder — order saves automatically.</p>
            </div>
          )}

          {tab === "appearance" && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="label-text">Display name</span>
                  <input
                    className="field"
                    value={profile.display_name ?? ""}
                    onChange={(e) => patch({ display_name: e.target.value })}
                  />
                </label>
                <label className="block">
                  <span className="label-text">Accent color</span>
                  <input
                    type="color"
                    className="field h-[42px] p-1"
                    value={profile.accent_color}
                    onChange={(e) => patch({ accent_color: e.target.value })}
                  />
                </label>
              </div>

              <label className="block">
                <span className="label-text">Bio</span>
                <textarea
                  className="field min-h-24 resize-y"
                  maxLength={280}
                  value={profile.bio ?? ""}
                  onChange={(e) => patch({ bio: e.target.value })}
                  placeholder="Tell people who you are…"
                />
              </label>

              <div>
                <span className="label-text">Avatar</span>
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 overflow-hidden rounded-full border border-border bg-secondary">
                    {profile.avatar_url && (
                      <img src={profile.avatar_url} alt="Avatar preview" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="text-xs"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void upload(file, "avatar", (url) => patch({ avatar_url: url }));
                    }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <span className="label-text">Background</span>
                <div className="flex gap-1 rounded-full bg-secondary p-1">
                  {(["color", "image", "video"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() =>
                        patch({
                          background_type: t,
                          background_value: t === "color" ? "#eef2f7" : "",
                        })
                      }
                      className={`flex-1 rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                        profile.background_type === t
                          ? "bg-card shadow-soft"
                          : "text-muted-foreground"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {profile.background_type === "color" ? (
                  <input
                    type="color"
                    className="field h-[42px] p-1"
                    value={profile.background_value || "#eef2f7"}
                    onChange={(e) => patch({ background_value: e.target.value })}
                  />
                ) : (
                  <div className="space-y-2">
                    <input
                      className="field"
                      placeholder={`Paste ${profile.background_type} URL`}
                      value={profile.background_value}
                      onChange={(e) => patch({ background_value: e.target.value })}
                    />
                    <input
                      type="file"
                      accept={profile.background_type === "video" ? "video/*" : "image/*"}
                      className="text-xs"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file)
                          void upload(file, "background", (url) => patch({ background_value: url }));
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <SliderRow
                  label="Card opacity"
                  value={profile.card_opacity}
                  min={0.1}
                  max={1}
                  step={0.05}
                  display={`${Math.round(profile.card_opacity * 100)}%`}
                  onChange={(v) => patch({ card_opacity: v })}
                />
                <SliderRow
                  label="Corner radius"
                  value={profile.card_radius}
                  min={0}
                  max={48}
                  step={1}
                  display={`${profile.card_radius}px`}
                  onChange={(v) => patch({ card_radius: v })}
                />
                <SliderRow
                  label="Backdrop blur"
                  value={profile.card_blur}
                  min={0}
                  max={40}
                  step={1}
                  display={`${profile.card_blur}px`}
                  onChange={(v) => patch({ card_blur: v })}
                />
              </div>
            </div>
          )}

          {tab === "effects" && (
            <div className="space-y-6">
              <label className="block">
                <span className="label-text">“Click to enter” text</span>
                <input
                  className="field"
                  maxLength={40}
                  value={profile.enter_text}
                  onChange={(e) => patch({ enter_text: e.target.value })}
                />
              </label>

              <div className="surface flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-semibold">Background music</p>
                  <p className="text-xs text-muted-foreground">
                    Plays after a visitor taps the enter screen.
                  </p>
                </div>
                <button
                  onClick={() => patch({ music_enabled: !profile.music_enabled })}
                  aria-label="Toggle background music"
                  className={`h-7 w-12 rounded-full p-0.5 transition-colors ${
                    profile.music_enabled ? "bg-primary" : "bg-input"
                  }`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-card shadow-soft transition-transform ${
                      profile.music_enabled ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>

              <label className="block">
                <span className="label-text">Music URL (.mp3)</span>
                <input
                  className="field"
                  placeholder="https://…/track.mp3"
                  value={profile.music_url ?? ""}
                  onChange={(e) => patch({ music_url: e.target.value })}
                />
              </label>
              <input
                type="file"
                accept="audio/*"
                className="text-xs"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file)
                    void upload(file, "music", (url) =>
                      patch({ music_url: url, music_enabled: true }),
                    );
                }}
              />
            </div>
          )}
        </section>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <PhoneFrame>
            <ProfileView profile={profile} links={links} preview />
          </PhoneFrame>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Live preview — enter screen is skipped here
          </p>
        </aside>
      </main>
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="label-text flex items-center justify-between">
        {label} <span className="text-muted-foreground">{display}</span>
      </span>
      <input
        type="range"
        className="slider-ios"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}
