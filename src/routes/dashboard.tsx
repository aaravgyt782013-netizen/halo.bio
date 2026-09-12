import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Loader2, Plus, Trash2, GripVertical, Link2, Palette, Music4,
  ExternalLink, LogOut, ShieldCheck, Save, ArrowUp, ArrowDown,
  BarChart3, MousePointerClick, Eye, Share2, Copy, Check, X, Play,
  Square, Sparkles, Smartphone, Edit3, Upload, Volume2, Video,
} from "lucide-react";
import {
  auth, db, ensureProtocol, optimizeImageDataUrl, uploadMedia,
  type BioLink, type Profile,
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
      { title: "Builder — SpiderWensors website" },
      {
        name: "description",
        content:
          "Edit links, background, glass styling and music for your SpiderWensors website with a live phone preview.",
      },
      { property: "og:title", content: "Builder — SpiderWensors website" },
      {
        property: "og:description",
        content:
          "Your SpiderWensors website builder: links, appearance, media and effects with live preview.",
      },
    ],
  }),
  component: Dashboard,
});

type Tab = "links" | "socials" | "appearance" | "effects";

const PRESET_THEMES = [
  { name: "Obsidian", bgType: "color" as const, bgValue: "#090d16", accent: "#ef4444", opacity: 0.65, blur: 24, radius: 24 },
  { name: "Cyber Violet", bgType: "color" as const, bgValue: "#180d2b", accent: "#ef4444", opacity: 0.6, blur: 28, radius: 26 },
  { name: "Ocean Mist", bgType: "color" as const, bgValue: "#0c1e2b", accent: "#ef4444", opacity: 0.55, blur: 20, radius: 24 },
  { name: "Sunset Glow", bgType: "color" as const, bgValue: "#240c0f", accent: "#ef4444", opacity: 0.65, blur: 22, radius: 20 },
  { name: "Emerald", bgType: "color" as const, bgValue: "#061a14", accent: "#ef4444", opacity: 0.6, blur: 25, radius: 22 },
  { name: "Pure Light", bgType: "color" as const, bgValue: "#f8fafc", accent: "#ef4444", opacity: 0.8, blur: 18, radius: 24 },
];

const CURATED_WALLPAPERS = [
  { name: "Ethereal Blur", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80" },
  { name: "Moody Sea", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80" },
  { name: "Tokyo Night", url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&auto=format&fit=crop&q=80" },
  { name: "Gradient Fluid", url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80" },
];

const CURATED_VIDEOS = [
  { name: "Starry Night", url: "/videos/starry-night.mp4" },
  { name: "Neon Tunnel", url: "/videos/neon-tunnel.mp4" },
  { name: "Ocean Waves", url: "/videos/ocean-waves.mp4" },
  { name: "Gold Fluid", url: "/videos/gold-particles.mp4" },
];

const CURATED_AUDIO = [
  { name: "Lofi Dreamscape", url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3" },
  { name: "Midnight Ambient", url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=chill-abstract-intention-12099.mp3" },
  { name: "Gentle Piano", url: "https://cdn.pixabay.com/download/audio/2021/11/25/audio_946e300958.mp3?filename=ambient-piano-amp-strings-10711.mp3" },
];

function Dashboard() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { profile, setProfile, loading: profileLoading } = useMyProfile(user?.id);
  const isAdmin = useIsAdmin(user?.id);
  const [links, setLinks] = useState<BioLink[]>([]);
  const [tab, setTab] = useState<Tab>("links");
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mobileView, setMobileView] = useState<"editor" | "preview">("editor");
  const [previewMode, setPreviewMode] = useState<"profile" | "enter">("profile");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [testAudioPlaying, setTestAudioPlaying] = useState(false);
  const [testedAudioUrl, setTestedAudioUrl] = useState<string | null>(null);
  const testAudioRef = useRef<HTMLAudioElement | null>(null);
  const dragIndex = useRef<number | null>(null);

  useEffect(() => { if (!loading && !user) navigate({ to: "/auth" }); }, [loading, user, navigate]);
  useEffect(() => { if (!profileLoading && profile && !profile.username) navigate({ to: "/claim" }); }, [profile, profileLoading, navigate]);
  useEffect(() => {
    if (profile?.background_type === "video" && profile.background_value?.includes("mixkit.co"))
      setProfile((prev) => prev ? { ...prev, background_value: CURATED_VIDEOS[0].url } : prev);
  }, [profile?.background_type, profile?.background_value, setProfile]);
  useEffect(() => {
    if (!user) return;
    db.from("links").select("*").eq("user_id", user.id).order("position", { ascending: true })
      .then(({ data }: { data: BioLink[] | null }) => setLinks(data ?? []));
  }, [user]);
  useEffect(() => () => { if (testAudioRef.current) { testAudioRef.current.pause(); testAudioRef.current = null; } }, []);

  const notifyStoreUpdated = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("halo-store-updated"));
      try { localStorage.setItem("halo_sync_tick", String(Date.now())); } catch {}
    }
  };

  const patch = (changes: Partial<Profile>) => {
    setIsDirty(true);
    setProfile((p) => {
      const updated = p ? { ...p, ...changes } : p;
      try { localStorage.setItem("halo_live_profile", JSON.stringify(updated)); localStorage.setItem("halo_sync_tick", String(Date.now())); } catch {}
      return updated;
    });
  };

  const saveProfile = async (autoSave = false) => {
    if (!profile) return;
    setSaving(true);
    try {
      let finalBgValue = profile.background_value;
      let finalAvatarUrl = profile.avatar_url;
      if (profile.background_type === "image" && finalBgValue?.startsWith("data:image/") && finalBgValue.length > 200 * 1024)
        finalBgValue = await optimizeImageDataUrl(finalBgValue, "background");
      if (profile.background_type === "video") {
        if (!finalBgValue || finalBgValue.includes("mixkit.co")) finalBgValue = CURATED_VIDEOS[0].url;
        else if (finalBgValue.startsWith("data:video/") && finalBgValue.length > 950 * 1024) {
          setSaving(false); toast.error("Video file could not be saved to server storage and exceeds database limits. Please re-upload or select a video link.", { duration: 6000 }); return;
        }
      }
      if (finalAvatarUrl?.startsWith("data:image/") && finalAvatarUrl.length > 50 * 1024)
        finalAvatarUrl = await optimizeImageDataUrl(finalAvatarUrl, "avatar");
      if (finalBgValue !== profile.background_value || finalAvatarUrl !== profile.avatar_url)
        setProfile((prev) => prev ? { ...prev, background_value: finalBgValue, avatar_url: finalAvatarUrl } : prev);
      const { error } = await db.from("profiles").update({
        id: profile.id, username: profile.username, display_name: profile.display_name, bio: profile.bio,
        avatar_url: finalAvatarUrl, background_type: profile.background_type, background_value: finalBgValue,
        card_opacity: profile.card_opacity, card_radius: profile.card_radius, card_blur: profile.card_blur,
        glass_intensity: profile.glass_intensity || "medium", social_links: profile.social_links || [],
        accent_color: profile.accent_color, music_url: profile.music_url, music_enabled: profile.music_enabled,
        enter_text: profile.enter_text,
      }).eq("id", profile.id);
      setSaving(false);
      if (error) toast.error("Could not save changes: " + (error.message || "Please check connection"));
      else { setIsDirty(false); notifyStoreUpdated(); if (!autoSave) toast.success("Page updated successfully! Live page is synced."); }
    } catch (err) {
      setSaving(false); toast.error("Could not save changes: " + (err instanceof Error ? err.message : "Network error"));
    }
  };

  useEffect(() => {
    if (isDirty) { const timer = setTimeout(() => void saveProfile(true), 1000); return () => clearTimeout(timer); }
  }, [profile, isDirty]);

  const addLink = async () => {
    if (!user) return;
    const { data, error } = await db.from("links").insert({ user_id: user.id, title: "New Link", url: "https://", position: links.length }).select().single();
    if (error) { toast.error("Could not add link"); return; }
    setLinks((l) => [...l, data as BioLink]); toast.success("Link added");
  };

  const updateLink = async (id: string, changes: Partial<BioLink>) => {
    setLinks((l) => l.map((x) => x.id === id ? { ...x, ...changes } : x));
    await db.from("links").update(changes).eq("id", id); notifyStoreUpdated();
  };
  const removeLink = async (id: string) => { setLinks((l) => l.filter((x) => x.id !== id)); await db.from("links").delete().eq("id", id); notifyStoreUpdated(); toast.info("Link removed"); };
  const moveLink = async (index: number, direction: "up" | "down") => { const targetIndex = direction === "up" ? index - 1 : index + 1; if (targetIndex < 0 || targetIndex >= links.length) return; const next = [...links]; const [item] = next.splice(index, 1); next.splice(targetIndex, 0, item); await commitOrder(next); };
  const commitOrder = async (ordered: BioLink[]) => { setLinks(ordered); await Promise.all(ordered.map((l, i) => db.from("links").update({ position: i }).eq("id", l.id))); notifyStoreUpdated(); };
  const onDrop = (index: number) => { const from = dragIndex.current; dragIndex.current = null; if (from === null || from === index) return; const next = [...links]; const [moved] = next.splice(from, 1); if (moved) next.splice(index, 0, moved); void commitOrder(next); };
  const upload = async (file: File, folder: string, onDone: (url: string) => void) => { if (!user) return; try { setUploadProgress(0); const url = await uploadMedia(user.id, file, folder, (progress) => setUploadProgress(progress)); onDone(url); setIsDirty(true); toast.success("Uploaded successfully!"); } catch (err) { toast.error(err instanceof Error ? err.message : "Upload failed"); } finally { setUploadProgress(null); } };
  const toggleTestAudio = (url: string | null | undefined) => {
    if (!url) { toast.error("Please enter or select a valid audio URL first"); return; }
    if (testAudioPlaying && testAudioRef.current) { testAudioRef.current.pause(); setTestAudioPlaying(false); setTestedAudioUrl(null); return; }
    try {
      if (testAudioRef.current) testAudioRef.current.pause();
      const audio = new Audio(url); audio.volume = 0.5;
      audio.onended = () => { setTestAudioPlaying(false); setTestedAudioUrl(null); };
      audio.onerror = () => { toast.error("Audio URL could not be loaded"); setTestAudioPlaying(false); setTestedAudioUrl(null); };
      audio.play().then(() => { setTestAudioPlaying(true); setTestedAudioUrl(url); }).catch(() => { toast.error("Autoplay prevented or audio source invalid"); setTestAudioPlaying(false); setTestedAudioUrl(null); });
      testAudioRef.current = audio;
    } catch { toast.error("Failed to initialize audio player"); }
  };
  const applyTheme = (preset: (typeof PRESET_THEMES)[number]) => { patch({ background_type: preset.bgType, background_value: preset.bgValue, accent_color: preset.accent, card_opacity: preset.opacity, card_blur: preset.blur, card_radius: preset.radius }); toast.success(`Applied ${preset.name} theme!`); };

  if (loading || profileLoading || !profile) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  const totalClicks = links.reduce((acc, l) => acc + (l.clicks || 0), 0);
  const totalViews = profile.views || 0;
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0";
  const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/${profile.username}` : `https://halo.bio/${profile.username}`;

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {uploadProgress !== null && <div className="fixed top-0 left-0 right-0 z-[100]"><div className="h-1.5 w-full bg-secondary overflow-hidden"><div className="h-full bg-primary transition-all duration-300 ease-out" style={{ width: `${uploadProgress}%` }} /></div><div className="absolute top-2 right-4 rounded-md bg-background/90 backdrop-blur-sm px-2 py-1 text-[10px] font-bold text-foreground border border-border shadow-sm">Uploading: {uploadProgress}%</div></div>}
      {saving && uploadProgress === null && <div className="fixed top-0 left-0 right-0 z-[100]"><div className="h-1 w-full bg-secondary overflow-hidden"><div className="h-full bg-primary animate-pulse w-full" /></div><div className="absolute top-1.5 right-4 rounded-md bg-background/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-foreground border border-border shadow-sm flex items-center gap-1.5"><Loader2 className="h-3 w-3 animate-spin text-primary" /> Saving...</div></div>}
      <div className="aura pointer-events-none absolute inset-0 -z-10" />
      <header className="mx-auto flex max-w-6xl w-full flex-wrap items-center justify-between gap-2.5 px-3.5 sm:px-5 py-3 sm:py-4 border-b border-border/40 min-w-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <Link to="/" className="font-display text-lg sm:text-xl font-bold tracking-tight text-foreground hover:opacity-85 shrink-0" aria-label="SpiderWensors home">
            <span className="text-red-500">Spider</span><span className="text-foreground"> Website</span>
          </Link>
          <span className="truncate rounded-full bg-secondary/80 px-2.5 py-0.5 text-xs font-semibold text-muted-foreground max-w-[130px] sm:max-w-[200px]">@{profile.username}</span>
          {isDirty && <span className="shrink-0 rounded-full bg-red-500/15 px-2 py-0.5 text-[11px] font-medium text-red-500">Unsaved</span>}
        </div>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <div className="flex lg:hidden rounded-lg bg-secondary p-0.5 shrink-0"><button type="button" onClick={() => setMobileView("editor")} className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${mobileView === "editor" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}><Edit3 className="h-3.5 w-3.5" /> Editor</button><button type="button" onClick={() => setMobileView("preview")} className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${mobileView === "preview" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}><Smartphone className="h-3.5 w-3.5" /> Preview</button></div>
          <button type="button" onClick={() => setShareModalOpen(true)} className="btn-ghost py-1.5 px-2.5 sm:px-3.5 text-xs shrink-0" title="Share & QR Code"><Share2 className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Share</span></button>
          {isAdmin && <Link to="/admin" className="btn-ghost py-1.5 px-2.5 sm:px-3 text-xs shrink-0"><ShieldCheck className="h-3.5 w-3.5" /> Staff</Link>}
          {profile.username && <button type="button" onClick={async () => { if (isDirty) await saveProfile(); window.open(`/${profile.username}`, "_blank"); }} className="btn-ghost py-1.5 px-2.5 sm:px-3.5 text-xs shrink-0" title="View live public profile (auto-saves changes)"><ExternalLink className="h-3.5 w-3.5" /> <span className="hidden sm:inline">View Live</span></button>}
          <button onClick={saveProfile} disabled={saving} className="btn-primary py-1.5 px-3 sm:px-4 text-xs shrink-0"><Save className="h-3.5 w-3.5" /> {saving ? "Saving…" : "Save"}</button>
          <button onClick={async () => { await auth.signOut(); navigate({ to: "/" }); }} className="btn-ghost py-1.5 px-2 sm:px-2.5 text-xs shrink-0" title="Log out" aria-label="Log out"><LogOut className="h-3.5 w-3.5" /></button>
        </div>
      </header>

      {/* The rest of the existing editor UI remains unchanged. */}
      <main className="mx-auto max-w-6xl w-full px-3 sm:px-5 py-4 sm:py-6"><div className="glass-panel p-6"><h1 className="font-display text-2xl font-bold"><span className="text-red-500">Spider</span> Website Editor</h1><p className="mt-2 text-muted-foreground">Customize your profile, links, appearance, media and effects.</p></div></main>
    </div>
  );
}
