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
  ArrowUp,
  ArrowDown,
  BarChart3,
  MousePointerClick,
  Eye,
  Share2,
  Copy,
  Check,
  X,
  Play,
  Square,
  Sparkles,
  Smartphone,
  Edit3,
  Upload,
  Volume2,
  Video,
} from "lucide-react";
import {
  auth,
  db,
  ensureProtocol,
  optimizeImageDataUrl,
  uploadMedia,
  type BioLink,
  type Profile,
} from "@/lib/bio";
import { useAuth, useIsAdmin, useMyProfile } from "@/hooks/useAuth";
import { ProfileView } from "@/components/ProfileView";
import { PhoneFrame } from "@/components/PhoneFrame";
import { FrostedGlassToggle } from "@/components/FrostedGlassToggle";
import { VideoPreviewPlayer } from "@/components/VideoPreviewPlayer";
import { SocialLinksEditor } from "@/components/SocialLinksEditor";

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
        content:
          "Your Halo builder: links, appearance, media and effects with live preview.",
      },
    ],
  }),
  component: Dashboard,
});

type Tab = "links" | "socials" | "appearance" | "effects";

const PRESET_THEMES = [
  {
    name: "Obsidian",
    bgType: "color" as const,
    bgValue: "#090d16",
    accent: "#6366f1",
    opacity: 0.65,
    blur: 24,
    radius: 24,
  },
  {
    name: "Cyber Violet",
    bgType: "color" as const,
    bgValue: "#180d2b",
    accent: "#a855f7",
    opacity: 0.6,
    blur: 28,
    radius: 26,
  },
  {
    name: "Ocean Mist",
    bgType: "color" as const,
    bgValue: "#0c1e2b",
    accent: "#06b6d4",
    opacity: 0.55,
    blur: 20,
    radius: 24,
  },
  {
    name: "Sunset Glow",
    bgType: "color" as const,
    bgValue: "#240c0f",
    accent: "#f97316",
    opacity: 0.65,
    blur: 22,
    radius: 20,
  },
  {
    name: "Emerald",
    bgType: "color" as const,
    bgValue: "#061a14",
    accent: "#10b981",
    opacity: 0.6,
    blur: 25,
    radius: 22,
  },
  {
    name: "Pure Light",
    bgType: "color" as const,
    bgValue: "#f8fafc",
    accent: "#3b82f6",
    opacity: 0.8,
    blur: 18,
    radius: 24,
  },
];

const CURATED_WALLPAPERS = [
  {
    name: "Ethereal Blur",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
  },
  {
    name: "Moody Sea",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80",
  },
  {
    name: "Tokyo Night",
    url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&auto=format&fit=crop&q=80",
  },
  {
    name: "Gradient Fluid",
    url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80",
  },
];

const CURATED_VIDEOS = [
  {
    name: "Starry Night",
    url: "/videos/starry-night.mp4",
  },
  {
    name: "Neon Tunnel",
    url: "/videos/neon-tunnel.mp4",
  },
  {
    name: "Ocean Waves",
    url: "/videos/ocean-waves.mp4",
  },
  {
    name: "Gold Fluid",
    url: "/videos/gold-particles.mp4",
  },
];

const CURATED_AUDIO = [
  {
    name: "Lofi Dreamscape",
    url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3",
  },
  {
    name: "Midnight Ambient",
    url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=chill-abstract-intention-12099.mp3",
  },
  {
    name: "Gentle Piano",
    url: "https://cdn.pixabay.com/download/audio/2021/11/25/audio_946e300958.mp3?filename=ambient-piano-amp-strings-10711.mp3",
  },
];

function Dashboard() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const {
    profile,
    setProfile,
    loading: profileLoading,
  } = useMyProfile(user?.id);
  const isAdmin = useIsAdmin(user?.id);
  const [links, setLinks] = useState<BioLink[]>([]);
  const [tab, setTab] = useState<Tab>("links");
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mobileView, setMobileView] = useState<"editor" | "preview">("editor");
  const [previewMode, setPreviewMode] = useState<"profile" | "enter">(
    "profile",
  );

  // Audio testing
  const [testAudioPlaying, setTestAudioPlaying] = useState(false);
  const [testedAudioUrl, setTestedAudioUrl] = useState<string | null>(null);
  const testAudioRef = useRef<HTMLAudioElement | null>(null);

  const dragIndex = useRef<number | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!profileLoading && profile && !profile.username)
      navigate({ to: "/claim" });
  }, [profile, profileLoading, navigate]);

  useEffect(() => {
    if (
      profile?.background_type === "video" &&
      profile.background_value?.includes("mixkit.co")
    ) {
      setProfile((prev) =>
        prev ? { ...prev, background_value: CURATED_VIDEOS[0].url } : prev,
      );
    }
  }, [profile?.background_type, profile?.background_value, setProfile]);

  useEffect(() => {
    if (!user) return;
    db.from("links")
      .select("*")
      .eq("user_id", user.id)
      .order("position", { ascending: true })
      .then(({ data }: { data: BioLink[] | null }) => setLinks(data ?? []));
  }, [user]);

  useEffect(() => {
    return () => {
      if (testAudioRef.current) {
        testAudioRef.current.pause();
        testAudioRef.current = null;
      }
    };
  }, []);

  const notifyStoreUpdated = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("halo-store-updated"));
      try {
        localStorage.setItem("halo_sync_tick", String(Date.now()));
      } catch {
        // ignore
      }
    }
  };

  const patch = (changes: Partial<Profile>) => {
    setIsDirty(true);
    setProfile((p) => (p ? { ...p, ...changes } : p));
  };

  const saveProfile = async () => {
    if (!profile) return;
    setSaving(true);

    try {
      let finalBgValue = profile.background_value;
      let finalAvatarUrl = profile.avatar_url;

      // Auto-compress background image if it is an oversized data URL
      if (
        profile.background_type === "image" &&
        finalBgValue?.startsWith("data:image/") &&
        finalBgValue.length > 200 * 1024
      ) {
        finalBgValue = await optimizeImageDataUrl(finalBgValue, "background");
      }

      // Handle video background validation & migration
      if (profile.background_type === "video") {
        if (!finalBgValue || finalBgValue.includes("mixkit.co")) {
          finalBgValue = CURATED_VIDEOS[0].url;
        } else if (finalBgValue.startsWith("data:video/")) {
          try {
            toast.info("Transferring video to media streaming server...");
            const res = await fetch(finalBgValue);
            const blob = await res.blob();
            const file = new File(
              [blob],
              `bg-video-${Date.now()}.${blob.type.includes("webm") ? "webm" : "mp4"}`,
              { type: blob.type || "video/mp4" },
            );
            const uploadedUrl = await uploadMedia(user.id, file, "backgrounds");
            finalBgValue = uploadedUrl;
          } catch (vidErr) {
            console.error("Auto-migrating video to media server failed:", vidErr);
            if (finalBgValue.length > 900 * 1024) {
              setSaving(false);
              toast.error(
                "Video file exceeds database size limits. Please select a video file to upload directly or paste an external video link.",
                { duration: 6000 },
              );
              return;
            }
          }
        }
      }

      // Auto-compress avatar image if large
      if (
        finalAvatarUrl?.startsWith("data:image/") &&
        finalAvatarUrl.length > 50 * 1024
      ) {
        finalAvatarUrl = await optimizeImageDataUrl(finalAvatarUrl, "avatar");
      }

      if (
        finalBgValue !== profile.background_value ||
        finalAvatarUrl !== profile.avatar_url
      ) {
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                background_value: finalBgValue,
                avatar_url: finalAvatarUrl,
              }
            : prev,
        );
      }

      const { error } = await db
        .from("profiles")
        .update({
          id: profile.id,
          username: profile.username,
          display_name: profile.display_name,
          bio: profile.bio,
          avatar_url: finalAvatarUrl,
          background_type: profile.background_type,
          background_value: finalBgValue,
          card_opacity: profile.card_opacity,
          card_radius: profile.card_radius,
          card_blur: profile.card_blur,
          glass_intensity: profile.glass_intensity || "medium",
          social_links: profile.social_links || [],
          accent_color: profile.accent_color,
          music_url: profile.music_url,
          music_enabled: profile.music_enabled,
          enter_text: profile.enter_text,
        })
        .eq("id", profile.id);

      setSaving(false);
      if (error) {
        toast.error(
          "Could not save changes: " +
            (error.message || "Please check connection"),
        );
      } else {
        setIsDirty(false);
        notifyStoreUpdated();
        toast.success("Page updated successfully! Live page is synced.");
      }
    } catch (err) {
      setSaving(false);
      toast.error(
        "Could not save changes: " +
          (err instanceof Error ? err.message : "Network error"),
      );
    }
  };

  const addLink = async () => {
    if (!user) return;
    const { data, error } = await db
      .from("links")
      .insert({
        user_id: user.id,
        title: "New Link",
        url: "https://",
        position: links.length,
      })
      .select()
      .single();
    if (error) {
      toast.error("Could not add link");
      return;
    }
    setLinks((l) => [...l, data as BioLink]);
    notifyStoreUpdated();
    toast.success("Link added");
  };

  const updateLink = async (id: string, changes: Partial<BioLink>) => {
    setLinks((l) => l.map((x) => (x.id === id ? { ...x, ...changes } : x)));
    await db.from("links").update(changes).eq("id", id);
    notifyStoreUpdated();
  };

  const removeLink = async (id: string) => {
    setLinks((l) => l.filter((x) => x.id !== id));
    await db.from("links").delete().eq("id", id);
    notifyStoreUpdated();
    toast.info("Link removed");
  };

  const moveLink = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= links.length) return;
    const next = [...links];
    const [item] = next.splice(index, 1);
    next.splice(targetIndex, 0, item);
    await commitOrder(next);
  };

  const commitOrder = async (ordered: BioLink[]) => {
    setLinks(ordered);
    await Promise.all(
      ordered.map((l, i) =>
        db.from("links").update({ position: i }).eq("id", l.id),
      ),
    );
    notifyStoreUpdated();
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

  const upload = async (
    file: File,
    folder: string,
    onDone: (url: string) => void,
  ) => {
    if (!user) return;
    try {
      toast.info("Optimizing & uploading…");
      const url = await uploadMedia(user.id, file, folder);
      onDone(url);
      setIsDirty(true);
      toast.success("Uploaded successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    }
  };

  const toggleTestAudio = (url: string | null | undefined) => {
    if (!url) {
      toast.error("Please enter or select a valid audio URL first");
      return;
    }
    if (testAudioPlaying && testAudioRef.current) {
      testAudioRef.current.pause();
      setTestAudioPlaying(false);
      setTestedAudioUrl(null);
      return;
    }
    try {
      if (testAudioRef.current) {
        testAudioRef.current.pause();
      }
      const audio = new Audio(url);
      audio.volume = 0.5;
      audio.onended = () => {
        setTestAudioPlaying(false);
        setTestedAudioUrl(null);
      };
      audio.onerror = () => {
        toast.error("Audio URL could not be loaded");
        setTestAudioPlaying(false);
        setTestedAudioUrl(null);
      };
      audio
        .play()
        .then(() => {
          setTestAudioPlaying(true);
          setTestedAudioUrl(url);
        })
        .catch(() => {
          toast.error("Autoplay prevented or audio source invalid");
          setTestAudioPlaying(false);
          setTestedAudioUrl(null);
        });
      testAudioRef.current = audio;
    } catch {
      toast.error("Failed to initialize audio player");
    }
  };

  const applyTheme = (preset: (typeof PRESET_THEMES)[number]) => {
    patch({
      background_type: preset.bgType,
      background_value: preset.bgValue,
      accent_color: preset.accent,
      card_opacity: preset.opacity,
      card_blur: preset.blur,
      card_radius: preset.radius,
    });
    toast.success(`Applied ${preset.name} theme!`);
  };

  if (loading || profileLoading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const totalClicks = links.reduce((acc, l) => acc + (l.clicks || 0), 0);
  const totalViews = profile.views || 0;
  const ctr =
    totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0";
  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${profile.username}`
      : `https://halo.bio/${profile.username}`;

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <div className="aura pointer-events-none absolute inset-0 -z-10" />

      {/* Navigation header */}
      <header className="mx-auto flex max-w-6xl w-full flex-wrap items-center justify-between gap-2.5 px-3.5 sm:px-5 py-3 sm:py-4 border-b border-border/40 min-w-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <Link
            to="/"
            className="font-display text-lg sm:text-xl font-bold tracking-tight text-foreground hover:opacity-85 shrink-0"
          >
            halo<span className="text-primary">.bio</span>
          </Link>
          <span className="truncate rounded-full bg-secondary/80 px-2.5 py-0.5 text-xs font-semibold text-muted-foreground max-w-[130px] sm:max-w-[200px]">
            @{profile.username}
          </span>
          {isDirty && (
            <span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary">
              Unsaved
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Mobile view toggle */}
          <div className="flex lg:hidden rounded-lg bg-secondary p-0.5 shrink-0">
            <button
              type="button"
              onClick={() => setMobileView("editor")}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                mobileView === "editor"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" /> Editor
            </button>
            <button
              type="button"
              onClick={() => setMobileView("preview")}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                mobileView === "preview"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" /> Preview
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShareModalOpen(true)}
            className="btn-ghost py-1.5 px-2.5 sm:px-3.5 text-xs shrink-0"
            title="Share & QR Code"
          >
            <Share2 className="h-3.5 w-3.5" />{" "}
            <span className="hidden sm:inline">Share</span>
          </button>

          {isAdmin && (
            <Link
              to="/admin"
              className="btn-ghost py-1.5 px-2.5 sm:px-3 text-xs shrink-0"
            >
              <ShieldCheck className="h-3.5 w-3.5" /> Staff
            </Link>
          )}

          {profile.username && (
            <button
              type="button"
              onClick={async () => {
                if (isDirty) {
                  await saveProfile();
                }
                window.open(`/${profile.username}`, "_blank");
              }}
              className="btn-ghost py-1.5 px-2.5 sm:px-3.5 text-xs shrink-0"
              title="View live public profile (auto-saves changes)"
            >
              <ExternalLink className="h-3.5 w-3.5" />{" "}
              <span className="hidden sm:inline">View Live</span>
            </button>
          )}

          <button
            onClick={saveProfile}
            disabled={saving}
            className="btn-primary py-1.5 px-3 sm:px-4 text-xs shrink-0"
          >
            <Save className="h-3.5 w-3.5" /> {saving ? "Saving…" : "Save"}
          </button>

          <button
            onClick={async () => {
              await auth.signOut();
              navigate({ to: "/" });
            }}
            className="btn-ghost py-1.5 px-2 sm:px-2.5 text-xs shrink-0"
            title="Log out"
            aria-label="Log out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      {/* Analytics KPI strip */}
      <div className="mx-auto max-w-6xl w-full px-3 sm:px-5 pt-4 sm:pt-6 min-w-0">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 w-full">
          <div className="glass rounded-xl p-3 sm:p-3.5 flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Eye className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground truncate">
                Total Views
              </p>
              <p className="font-display text-base sm:text-lg font-bold text-foreground truncate">
                {totalViews}
              </p>
            </div>
          </div>

          <div className="glass rounded-xl p-3 sm:p-3.5 flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-success/15 text-success">
              <MousePointerClick className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground truncate">
                Total Clicks
              </p>
              <p className="font-display text-base sm:text-lg font-bold text-foreground truncate">
                {totalClicks}
              </p>
            </div>
          </div>

          <div className="glass rounded-xl p-3 sm:p-3.5 flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground truncate">
                Click Rate
              </p>
              <p className="font-display text-base sm:text-lg font-bold text-foreground truncate">
                {ctr}%
              </p>
            </div>
          </div>

          <div className="glass rounded-xl p-3 sm:p-3.5 flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Link2 className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground truncate">
                Active Links
              </p>
              <p className="font-display text-base sm:text-lg font-bold text-foreground truncate">
                {links.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto grid max-w-6xl w-full min-w-0 gap-6 px-3 sm:px-5 py-4 sm:py-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Editor panel */}
        <section
          className={`glass-panel p-3.5 sm:p-7 shadow-lift w-full min-w-0 max-w-full overflow-hidden ${
            mobileView === "preview" ? "hidden lg:block" : "block"
          }`}
        >
          {/* Tabs */}
          <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-1 rounded-xl bg-secondary/80 p-1 w-full min-w-0">
            {(
              [
                ["links", "Links", Link2],
                ["socials", "Social Icons", Share2],
                ["appearance", "Appearance", Palette],
                ["effects", "Media & FX", Music4],
              ] as const
            ).map(([key, label, Icon]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`inline-flex items-center justify-center gap-1 sm:gap-1.5 rounded-lg px-2 py-2 text-[11px] sm:text-xs font-semibold transition-all min-w-0 truncate ${
                  tab === key
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{label}</span>
              </button>
            ))}
          </div>

          {/* Links tab */}
          {tab === "links" && (
            <div className="space-y-3.5 w-full min-w-0">
              <div className="flex items-center justify-between pb-1 min-w-0">
                <span className="text-xs font-semibold text-muted-foreground truncate">
                  Your bio links ({links.length})
                </span>
                <button
                  onClick={addLink}
                  className="btn-primary py-1 px-3 text-xs shrink-0 inline-flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Link
                </button>
              </div>

              {links.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border/80 p-6 sm:p-8 text-center w-full min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    No links yet
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground max-w-xs mx-auto">
                    Add your first link to YouTube, Spotify, store, or
                    portfolio.
                  </p>
                  <button
                    onClick={addLink}
                    className="btn-primary mt-4 py-2 px-4 text-xs"
                  >
                    <Plus className="h-4 w-4" /> Add your first link
                  </button>
                </div>
              ) : (
                links.map((link, i) => (
                  <div
                    key={link.id}
                    draggable
                    onDragStart={() => (dragIndex.current = i)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => onDrop(i)}
                    className="surface flex flex-col sm:flex-row items-stretch sm:items-start gap-2.5 p-3 sm:p-3.5 rounded-xl border border-border/70 min-w-0 w-full"
                  >
                    <div className="flex items-center justify-between sm:justify-start gap-2 min-w-0">
                      <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground hover:text-foreground hidden sm:block mt-2.5" />
                      <span className="text-[10px] font-bold text-muted-foreground uppercase sm:hidden">
                        Link #{i + 1}
                      </span>
                      <div className="flex items-center gap-0.5 sm:hidden">
                        <button
                          type="button"
                          onClick={() => moveLink(i, "up")}
                          disabled={i === 0}
                          className="rounded p-1 text-muted-foreground hover:bg-secondary disabled:opacity-30"
                          title="Move up"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveLink(i, "down")}
                          disabled={i === links.length - 1}
                          className="rounded p-1 text-muted-foreground hover:bg-secondary disabled:opacity-30"
                          title="Move down"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => removeLink(link.id)}
                          aria-label={`Delete ${link.title}`}
                          className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-destructive transition-colors ml-1"
                          title="Delete link"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid flex-1 gap-2 sm:grid-cols-2 min-w-0 w-full">
                      <div className="min-w-0 w-full">
                        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                          Label
                        </label>
                        <input
                          className="field w-full min-w-0 text-xs sm:text-sm"
                          value={link.title}
                          placeholder="e.g. My Latest Song"
                          onChange={(e) =>
                            updateLink(link.id, { title: e.target.value })
                          }
                        />
                      </div>
                      <div className="min-w-0 w-full">
                        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                          URL destination
                        </label>
                        <input
                          className="field w-full min-w-0 text-xs sm:text-sm"
                          value={link.url}
                          placeholder="https://…"
                          onChange={(e) =>
                            updateLink(link.id, { url: e.target.value })
                          }
                          onBlur={(e) =>
                            updateLink(link.id, {
                              url: ensureProtocol(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="hidden sm:flex flex-col items-end gap-1 shrink-0 pt-1">
                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => moveLink(i, "up")}
                          disabled={i === 0}
                          className="rounded p-1 text-muted-foreground hover:bg-secondary disabled:opacity-30"
                          title="Move up"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveLink(i, "down")}
                          disabled={i === links.length - 1}
                          className="rounded p-1 text-muted-foreground hover:bg-secondary disabled:opacity-30"
                          title="Move down"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => removeLink(link.id)}
                          aria-label={`Delete ${link.title}`}
                          className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-destructive transition-colors ml-1"
                          title="Delete link"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-[10px] font-medium text-muted-foreground pr-1">
                        {link.clicks || 0} clicks
                      </span>
                    </div>
                  </div>
                ))
              )}

              <p className="text-xs text-muted-foreground pt-1">
                Tip: Drag rows or use arrow buttons to reorder. Changes sync
                live on your page.
              </p>
            </div>
          )}

          {/* Social Icons tab */}
          {tab === "socials" && (
            <SocialLinksEditor
              socialLinks={profile.social_links || []}
              onChange={(updated) => patch({ social_links: updated })}
              accentColor={profile.accent_color}
              userId={user?.id}
            />
          )}

          {/* Appearance tab */}
          {tab === "appearance" && (
            <div className="space-y-6 w-full min-w-0">
              {/* Presets row */}
              <div className="w-full min-w-0">
                <span className="label-text flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" /> Curated
                  Design Themes
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-2 w-full min-w-0">
                  {PRESET_THEMES.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => applyTheme(preset)}
                      className="group flex flex-col items-center gap-1.5 rounded-xl border border-border/80 bg-card p-2 text-center hover:border-primary/50 transition-all active:scale-95 min-w-0"
                    >
                      <div
                        className="h-7 sm:h-8 w-full rounded-lg border border-white/20 shadow-inner flex items-start"
                        style={{ backgroundColor: preset.bgValue }}
                      >
                        <div
                          className="h-2 w-2 rounded-full m-1"
                          style={{ backgroundColor: preset.accent }}
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-foreground truncate w-full">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 w-full min-w-0">
                <label className="block w-full min-w-0">
                  <span className="label-text">Display Name</span>
                  <input
                    className="field w-full min-w-0"
                    value={profile.display_name ?? ""}
                    onChange={(e) => patch({ display_name: e.target.value })}
                    placeholder="Your Name or Brand"
                  />
                </label>
                <label className="block w-full min-w-0">
                  <span className="label-text">Accent Color</span>
                  <div className="flex items-center gap-2 w-full min-w-0">
                    <input
                      type="color"
                      className="field h-[42px] w-12 shrink-0 p-1 cursor-pointer rounded-lg"
                      value={profile.accent_color}
                      onChange={(e) => patch({ accent_color: e.target.value })}
                    />
                    <input
                      type="text"
                      className="field flex-1 min-w-0 font-mono uppercase text-xs"
                      value={profile.accent_color}
                      onChange={(e) => patch({ accent_color: e.target.value })}
                    />
                  </div>
                </label>
              </div>

              <label className="block w-full min-w-0">
                <span className="label-text">Bio description</span>
                <textarea
                  className="field min-h-20 sm:min-h-24 resize-y text-sm w-full min-w-0"
                  maxLength={280}
                  value={profile.bio ?? ""}
                  onChange={(e) => patch({ bio: e.target.value })}
                  placeholder="Tell people who you are, what you create, or your mission…"
                />
              </label>

              {/* Profile Avatar */}
              <div className="w-full min-w-0">
                <span className="label-text">Profile Avatar</span>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 min-w-0 w-full">
                  <div className="h-16 w-16 overflow-hidden rounded-full border border-border bg-secondary shrink-0 shadow-soft">
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Avatar preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-bold text-lg text-muted-foreground">
                        {(profile.display_name ?? profile.username ?? "?")
                          .slice(0, 1)
                          .toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 min-w-0 flex-1 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="btn-ghost py-1.5 px-3 text-xs cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-border hover:border-primary transition-all shrink-0">
                        <Upload className="h-3.5 w-3.5 text-primary" />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file)
                              void upload(file, "avatar", (url) =>
                                patch({ avatar_url: url }),
                              );
                          }}
                        />
                      </label>
                      {profile.avatar_url && (
                        <button
                          type="button"
                          onClick={() => patch({ avatar_url: null })}
                          className="btn-ghost py-1.5 px-2.5 text-xs text-destructive hover:text-destructive shrink-0"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <input
                      className="field text-xs min-w-0 w-full"
                      placeholder="Or paste avatar image URL (https://…)"
                      value={profile.avatar_url ?? ""}
                      onChange={(e) => patch({ avatar_url: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Background Wallpaper */}
              <div className="space-y-3 w-full min-w-0">
                <span className="label-text">Background Wallpaper</span>
                <div className="grid grid-cols-3 gap-1 rounded-xl bg-secondary/80 p-1 w-full min-w-0">
                  {(["color", "image", "video"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() =>
                        patch({
                          background_type: t,
                          background_value:
                            t === "color"
                              ? "#0b0f19"
                              : t === "image"
                                ? CURATED_WALLPAPERS[0].url
                                : CURATED_VIDEOS[0].url,
                        })
                      }
                      className={`rounded-lg py-1.5 text-xs font-semibold capitalize transition-all min-w-0 truncate ${
                        profile.background_type === t
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {profile.background_type === "color" ? (
                  <div className="flex items-center gap-2 w-full min-w-0">
                    <input
                      type="color"
                      className="field h-[42px] w-12 shrink-0 p-1 cursor-pointer rounded-lg"
                      value={profile.background_value || "#0b0f19"}
                      onChange={(e) =>
                        patch({ background_value: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      className="field flex-1 min-w-0 font-mono uppercase text-xs"
                      value={profile.background_value || "#0b0f19"}
                      onChange={(e) =>
                        patch({ background_value: e.target.value })
                      }
                    />
                  </div>
                ) : (
                  <div className="space-y-3 w-full min-w-0">
                    {profile.background_type === "video" && (
                      <div className="space-y-1.5 w-full min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                            <Video className="h-3.5 w-3.5 text-primary" />
                            Live Background Video Player
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            Tests playback & loops before saving
                          </span>
                        </div>
                        <VideoPreviewPlayer
                          videoUrl={profile.background_value}
                          accentColor={profile.accent_color}
                        />
                      </div>
                    )}

                    <input
                      className="field w-full min-w-0"
                      placeholder={
                        profile.background_type === "video"
                          ? "Direct MP4/WebM URL or YouTube link (e.g. https://…)"
                          : "Direct image URL (e.g. https://…)"
                      }
                      value={profile.background_value}
                      onChange={(e) =>
                        patch({ background_value: e.target.value })
                      }
                    />

                    <div className="flex flex-wrap items-center gap-2">
                      <label className="btn-ghost py-1.5 px-3 text-xs cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-border hover:border-primary transition-all shrink-0">
                        <Upload className="h-3.5 w-3.5 text-primary" />
                        <span>
                          {profile.background_type === "video"
                            ? "Upload Background Video (Up to 100MB)"
                            : "Upload Wallpaper Image"}
                        </span>
                        <input
                          type="file"
                          accept={
                            profile.background_type === "video"
                              ? "video/mp4,video/webm"
                              : "image/*"
                          }
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file)
                              void upload(file, "background", (url) =>
                                patch({ background_value: url }),
                              );
                          }}
                        />
                      </label>
                    </div>

                    {profile.background_type === "video" && (
                      <p className="text-[11px] text-muted-foreground">
                        Supports uploaded videos up to 100MB with
                        high-performance streaming, direct MP4/WebM URLs,
                        YouTube loops, or curated background video clips.
                      </p>
                    )}

                    {profile.background_type === "image" && (
                      <div className="w-full min-w-0">
                        <p className="text-[11px] font-semibold text-muted-foreground mb-1.5">
                          Or choose a curated backdrop:
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full min-w-0">
                          {CURATED_WALLPAPERS.map((wp) => (
                            <button
                              key={wp.name}
                              type="button"
                              onClick={() =>
                                patch({ background_value: wp.url })
                              }
                              className={`group relative h-14 sm:h-16 rounded-lg overflow-hidden border transition-all active:scale-95 ${
                                profile.background_value === wp.url
                                  ? "border-primary ring-2 ring-primary/30"
                                  : "border-border/80 hover:border-primary"
                              }`}
                            >
                              <img
                                src={wp.url}
                                alt={wp.name}
                                className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-x-0 bottom-0 bg-black/60 py-0.5 px-1 text-[9px] font-medium text-white truncate">
                                {wp.name}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {profile.background_type === "video" && (
                      <div className="w-full min-w-0">
                        <p className="text-[11px] font-semibold text-muted-foreground mb-1.5">
                          Or choose a curated background clip:
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full min-w-0">
                          {CURATED_VIDEOS.map((vid) => (
                            <button
                              key={vid.name}
                              type="button"
                              onClick={() =>
                                patch({ background_value: vid.url })
                              }
                              className={`group relative h-14 sm:h-16 rounded-lg overflow-hidden border bg-black transition-all active:scale-95 ${
                                profile.background_value === vid.url
                                  ? "border-primary ring-2 ring-primary/30"
                                  : "border-border/80 hover:border-primary"
                              }`}
                            >
                              <video
                                src={vid.url}
                                muted
                                playsInline
                                loop
                                autoPlay
                                className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                              />
                              <div className="absolute inset-x-0 bottom-0 bg-black/70 py-0.5 px-1 text-[9px] font-medium text-white truncate">
                                {vid.name}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Glass styling controls */}
              <div className="rounded-xl border border-border/80 bg-secondary/30 p-3.5 sm:p-4 space-y-4 w-full min-w-0">
                <FrostedGlassToggle
                  intensity={profile.glass_intensity || "medium"}
                  currentOpacity={profile.card_opacity}
                  currentBlur={profile.card_blur}
                  onChange={({ intensity, opacity, blur }) =>
                    patch({
                      glass_intensity: intensity,
                      card_opacity: opacity,
                      card_blur: blur,
                    })
                  }
                />

                <div className="pt-3 border-t border-border/60">
                  <span className="text-[11px] font-semibold text-muted-foreground block mb-2">
                    Fine-tune Parameters
                  </span>
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 w-full min-w-0">
                    <SliderRow
                      label="Card Opacity"
                      value={profile.card_opacity}
                      min={0.1}
                      max={1}
                      step={0.05}
                      display={`${Math.round(profile.card_opacity * 100)}%`}
                      onChange={(v) => patch({ card_opacity: v })}
                    />
                    <SliderRow
                      label="Corner Radius"
                      value={profile.card_radius}
                      min={0}
                      max={44}
                      step={1}
                      display={`${profile.card_radius}px`}
                      onChange={(v) => patch({ card_radius: v })}
                    />
                    <SliderRow
                      label="Backdrop Blur"
                      value={profile.card_blur}
                      min={0}
                      max={40}
                      step={1}
                      display={`${profile.card_blur}px`}
                      onChange={(v) => patch({ card_blur: v })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Media & effects tab */}
          {tab === "effects" && (
            <div className="space-y-6 w-full min-w-0">
              <label className="block w-full min-w-0">
                <span className="label-text">“Click to Enter” Splash Text</span>
                <input
                  className="field w-full min-w-0"
                  maxLength={50}
                  placeholder="e.g. click to enter / explore & listen"
                  value={profile.enter_text ?? ""}
                  onChange={(e) => patch({ enter_text: e.target.value })}
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  The stylish prompt displayed before visitor enters and audio
                  plays.
                </p>
              </label>

              <div className="surface flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-border/80 min-w-0 w-full">
                <div className="min-w-0 pr-3">
                  <p className="text-sm font-semibold truncate">
                    Background Soundtrack
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Plays automatically once the visitor taps the enter screen.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    patch({ music_enabled: !profile.music_enabled })
                  }
                  aria-label="Toggle background music"
                  className={`h-7 w-12 shrink-0 rounded-full p-0.5 transition-colors ${
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

              <div className="space-y-3 w-full min-w-0">
                <label className="block w-full min-w-0">
                  <span className="label-text">Audio Track (.mp3 URL)</span>
                  <div className="flex flex-col sm:flex-row gap-2 w-full min-w-0">
                    <input
                      className="field flex-1 min-w-0 text-xs sm:text-sm"
                      placeholder="https://…/track.mp3"
                      value={profile.music_url ?? ""}
                      onChange={(e) => patch({ music_url: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => toggleTestAudio(profile.music_url)}
                      className="btn-ghost py-2 px-3 text-xs shrink-0 flex items-center justify-center gap-1.5"
                    >
                      {testAudioPlaying &&
                      testedAudioUrl === profile.music_url ? (
                        <>
                          <Square className="h-3.5 w-3.5 fill-current" /> Stop
                        </>
                      ) : (
                        <>
                          <Play className="h-3.5 w-3.5 fill-current" /> Test
                          Audio
                        </>
                      )}
                    </button>
                  </div>
                </label>

                <div className="flex flex-wrap items-center gap-2">
                  <label className="btn-ghost py-1.5 px-3 text-xs cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-border hover:border-primary transition-all shrink-0">
                    <Upload className="h-3.5 w-3.5 text-primary" />
                    <span>Upload MP3 File (max 3.5MB)</span>
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file)
                          void upload(file, "music", (url) =>
                            patch({ music_url: url, music_enabled: true }),
                          );
                      }}
                    />
                  </label>
                </div>

                {/* Curated Soundtracks */}
                <div className="w-full min-w-0 pt-2">
                  <span className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
                    Or select a curated ambient background track:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full min-w-0">
                    {CURATED_AUDIO.map((track) => {
                      const isCurrent = profile.music_url === track.url;
                      const isThisPlaying =
                        testAudioPlaying && testedAudioUrl === track.url;
                      return (
                        <div
                          key={track.name}
                          className={`flex items-center justify-between gap-2 p-2.5 rounded-xl border transition-all ${
                            isCurrent
                              ? "border-primary bg-primary/5"
                              : "border-border/80 bg-card hover:border-border"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              patch({
                                music_url: track.url,
                                music_enabled: true,
                              })
                            }
                            className="flex-1 text-left min-w-0"
                          >
                            <p className="text-xs font-semibold text-foreground truncate">
                              {track.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {isCurrent ? "Active track" : "Click to select"}
                            </p>
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleTestAudio(track.url)}
                            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground shrink-0"
                            title={isThisPlaying ? "Stop" : "Preview"}
                          >
                            {isThisPlaying ? (
                              <Square className="h-3.5 w-3.5 fill-current text-primary" />
                            ) : (
                              <Volume2 className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Live Phone Preview panel */}
        <aside
          className={`w-full min-w-0 flex flex-col items-center lg:sticky lg:top-6 lg:self-start ${
            mobileView === "editor" ? "hidden lg:flex" : "flex"
          }`}
        >
          <div className="mb-2 flex w-full max-w-[340px] items-center justify-between px-1">
            <span className="text-xs font-semibold text-muted-foreground">
              Live Preview
            </span>
            <button
              type="button"
              onClick={() =>
                setPreviewMode(previewMode === "profile" ? "enter" : "profile")
              }
              className="text-xs font-medium text-primary hover:underline"
            >
              {previewMode === "enter"
                ? "← Direct Profile View"
                : "Test “Click to Enter”"}
            </button>
          </div>
          <PhoneFrame>
            <ProfileView
              key={previewMode}
              profile={profile}
              links={links}
              preview={previewMode === "profile"}
            />
          </PhoneFrame>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Changes reflect instantly on your live canvas
          </p>
        </aside>
      </main>

      {/* Share & QR Code Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-float-in">
          <div className="glass-panel w-full max-w-sm p-6 shadow-lift relative">
            <button
              type="button"
              onClick={() => setShareModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="font-display text-lg font-bold text-foreground">
              Share your Halo page
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Scan this QR code with any smartphone or copy your link.
            </p>

            <div className="mt-5 flex justify-center">
              <div className="rounded-2xl border border-border bg-white p-3 shadow-soft">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                    publicUrl,
                  )}`}
                  alt="QR Code"
                  className="h-40 w-40"
                />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-xl border border-input bg-secondary/50 p-2">
              <span className="truncate text-xs font-mono text-foreground flex-1 pl-1">
                {publicUrl}
              </span>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(publicUrl);
                    setCopied(true);
                    toast.success("Copied to clipboard!");
                    setTimeout(() => setCopied(false), 2000);
                  } catch {
                    toast.error("Could not copy URL");
                  }
                }}
                className="btn-primary py-1 px-2.5 text-xs shrink-0"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <div className="mt-4">
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost w-full justify-center text-xs"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Open in new tab
              </a>
            </div>
          </div>
        </div>
      )}
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
    <label className="block w-full min-w-0">
      <span className="label-text flex items-center justify-between text-xs w-full">
        <span>{label}</span>
        <span className="font-mono text-foreground font-semibold">
          {display}
        </span>
      </span>
      <input
        type="range"
        className="slider-ios w-full"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}
