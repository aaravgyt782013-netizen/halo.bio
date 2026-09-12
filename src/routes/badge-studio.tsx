import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Loader2, Search, Shield, Sparkles, Pencil, Save, Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { db, type Profile, type SocialLink } from "@/lib/bio";
import { extractBadges, mergeBadges, PROFILE_BADGES, type ProfileBadge } from "@/lib/profileBadges";
import { useAuth, useIsAdmin } from "@/hooks/useAuth";
import { ProfileBadges } from "@/components/ProfileBadges";

export const Route = createFileRoute("/badge-studio")({
  head: () => ({ meta: [
    { title: "Badge Studio — Spider Wensors" },
    { name: "description", content: "Owner controls for Spider Wensors badges." },
    { name: "robots", content: "noindex" },
  ] }),
  component: BadgeStudio,
});

const DEFINITION_PLATFORM = "__spider_badge_definition__";
const MAX_SOURCE_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_STORED_IMAGE_BYTES = 900 * 1024;

function readDefinitions(links?: SocialLink[] | null): ProfileBadge[] {
  if (!links) return [];
  return links.flatMap((link) => {
    if (link.platform !== DEFINITION_PLATFORM) return [];
    try {
      const badge = JSON.parse(link.icon_url || "") as ProfileBadge;
      return badge?.id && badge?.name ? [badge] : [];
    } catch { return []; }
  });
}

function mergeDefinitions(saved: ProfileBadge[]) {
  const map = new Map<string, ProfileBadge>();
  PROFILE_BADGES.forEach((badge) => map.set(badge.id, badge));
  saved.forEach((badge) => map.set(badge.id, badge));
  return [...map.values()];
}

function saveDefinitions(links: SocialLink[] | null | undefined, badges: ProfileBadge[]) {
  const normal = (links ?? []).filter((link) => link.platform !== DEFINITION_PLATFORM);
  const definitions = badges.map((badge) => ({
    id: `badge-definition:${badge.id}`,
    platform: DEFINITION_PLATFORM,
    url: badge.id,
    title: badge.name,
    icon_url: JSON.stringify(badge),
    active: false,
  }));
  return [...normal, ...definitions];
}

function badgeIcon(badge: ProfileBadge) {
  if (badge.imageUrl) return <img src={badge.imageUrl} alt="" className="h-7 w-7 object-contain" />;
  if (badge.emoji) return <span className="text-xl">{badge.emoji}</span>;
  const icons: Record<string, string> = { wrench: "🛠️", lightbulb: "💡", gem: "💎", "badge-check": "✓", "badge-dollar": "$", gift: "🎁", star: "★", rocket: "🚀", medal: "🏅", flame: "🔥", gauge: "◔", bug: "✦", sun: "☀", rabbit: "♢", snowflake: "❄", egg: "◉", "candy-cane": "⌁", satellite: "◈", trophy: "🏆", award: "◆" };
  return <span className="text-xl">{icons[badge.icon] ?? "◉"}</span>;
}

function BadgeCard({ badge, active, onToggle, onEdit, onDelete, busy }: { badge: ProfileBadge; active: boolean; onToggle: () => void; onEdit: () => void; onDelete: () => void; busy: boolean }) {
  const isBuiltin = PROFILE_BADGES.some((b) => b.id === badge.id);
  return <div className={`relative flex items-center gap-3 rounded-2xl border p-4 transition-all ${active ? "border-red-500/35 bg-red-500/[0.08]" : "border-white/[0.07] bg-white/[0.025] hover:border-white/[0.14]"}`}>
    <button type="button" onClick={onToggle} disabled={busy} className="flex min-w-0 flex-1 items-center gap-3 text-left">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/20" style={{ color: badge.color, boxShadow: `0 0 22px ${badge.glowColor || badge.color}35` }}>{badgeIcon(badge)}</span>
      <span className="min-w-0 flex-1"><span className="block truncate font-semibold">{badge.name}</span><span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{badge.description}</span></span>
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${active ? "border-red-500/40 bg-red-500 text-white" : "border-white/10 bg-white/[0.03] text-transparent"}`}><Check className="h-4 w-4" /></span>
    </button>
    <div className="flex shrink-0 gap-1"><button type="button" onClick={onEdit} className="rounded-full border border-white/10 bg-black/40 p-2 text-muted-foreground hover:text-white" title="Edit badge"><Pencil className="h-3.5 w-3.5" /></button>{!isBuiltin && <button type="button" onClick={onDelete} className="rounded-full border border-red-500/10 bg-red-500/5 p-2 text-red-400 hover:bg-red-500/15" title="Delete custom badge"><Trash2 className="h-3.5 w-3.5" /></button>}</div>
  </div>;
}

function compressBadgeImage(file: File): Promise<string> {
  if (file.size > MAX_SOURCE_IMAGE_BYTES) return Promise.reject(new Error("Image must be 10 MB or smaller."));
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read image."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("Invalid image."));
      image.onload = () => {
        let width = image.naturalWidth;
        let height = image.naturalHeight;
        const maxSide = 768;
        if (Math.max(width, height) > maxSide) {
          const scale = maxSide / Math.max(width, height);
          width = Math.max(1, Math.round(width * scale));
          height = Math.max(1, Math.round(height * scale));
        }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Image processing is unavailable."));
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(image, 0, 0, width, height);
        let quality = 0.88;
        let output = canvas.toDataURL("image/webp", quality);
        while (output.length * 0.75 > MAX_STORED_IMAGE_BYTES && quality > 0.42) {
          quality -= 0.08;
          output = canvas.toDataURL("image/webp", quality);
        }
        if (output.length * 0.75 > MAX_STORED_IMAGE_BYTES) return reject(new Error("Image could not be compressed below 900 KB. Try a smaller image."));
        resolve(output);
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

function BadgeStudio() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const isAdmin = useIsAdmin(user?.id, user?.email);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [query, setQuery] = useState("");
  const [badgeQuery, setBadgeQuery] = useState("");
  const [definitions, setDefinitions] = useState<ProfileBadge[]>(PROFILE_BADGES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftDescription, setDraftDescription] = useState("");
  const [draftEmoji, setDraftEmoji] = useState("");
  const [draftImageUrl, setDraftImageUrl] = useState("");
  const [draftColor, setDraftColor] = useState("");
  const [draftGlowColor, setDraftGlowColor] = useState("");
  const [createName, setCreateName] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [createEmoji, setCreateEmoji] = useState("");
  const [createImageUrl, setCreateImageUrl] = useState("");
  const [createColor, setCreateColor] = useState("#facc15");
  const [createGlowColor, setCreateGlowColor] = useState("#facc15");
  const [busy, setBusy] = useState<string | null>(null);
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  const loadProfiles = useCallback(async () => {
    const { data, error } = await db.from("profiles").select("*").order("created_at", { ascending: false }).limit(500);
    if (error) { toast.error("Could not load profiles"); setLoadingProfiles(false); return; }
    const rows = (data ?? []) as Profile[];
    setProfiles(rows);
    if (!selectedId && rows[0]) setSelectedId(rows[0].id);
    const owner = rows.find((p) => p.id === user?.id);
    setDefinitions(mergeDefinitions(readDefinitions(owner?.social_links)));
    setLoadingProfiles(false);
  }, [selectedId, user?.id]);

  useEffect(() => { if (!loading && !user) navigate({ to: "/auth" }); }, [loading, user, navigate]);
  useEffect(() => { if (isAdmin) void loadProfiles(); if (isAdmin === false) setLoadingProfiles(false); }, [isAdmin, loadProfiles]);

  const selected = profiles.find((p) => p.id === selectedId) ?? null;
  const assigned = useMemo(() => extractBadges(selected?.social_links), [selected?.social_links]);
  const assignedIds = useMemo(() => new Set(assigned.map((b) => b.id)), [assigned]);
  const visibleBadges = definitions.filter((b) => `${b.name} ${b.description}`.toLowerCase().includes(badgeQuery.trim().toLowerCase()));
  const visibleProfiles = profiles.filter((p) => `${p.username ?? ""} ${p.display_name ?? ""}`.toLowerCase().includes(query.toLowerCase()));

  const toggleBadge = async (badge: ProfileBadge) => {
    if (!selected) return;
    setBusy(badge.id);
    const current = extractBadges(selected.social_links);
    const next = current.some((x) => x.id === badge.id) ? current.filter((x) => x.id !== badge.id) : [...current, badge];
    const socialLinks = mergeBadges(selected.social_links, next);
    const { error } = await db.from("profiles").update({ social_links: socialLinks }).eq("id", selected.id);
    if (error) toast.error("Could not update badge");
    else { setProfiles((items) => items.map((p) => p.id === selected.id ? { ...p, social_links: socialLinks } : p)); toast.success(next.some((x) => x.id === badge.id) ? `${badge.name} assigned` : `${badge.name} removed`); }
    setBusy(null);
  };

  const beginEdit = (badge: ProfileBadge) => {
    setEditingId(badge.id); setDraftName(badge.name); setDraftDescription(badge.description); setDraftEmoji(badge.emoji || ""); setDraftImageUrl(badge.imageUrl || ""); setDraftColor(badge.color || "#ef4444"); setDraftGlowColor(badge.glowColor || badge.color || "#ef4444");
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const saveBadge = async () => {
    if (!editingId || !user) return;
    const previous = definitions.find((b) => b.id === editingId);
    if (!previous) return;
    const updated: ProfileBadge = { ...previous, id: editingId, name: draftName.trim() || "Badge", description: draftDescription.trim(), emoji: draftEmoji.trim() || undefined, imageUrl: draftImageUrl.trim() || undefined, color: draftColor.trim() || "#ef4444", glowColor: draftGlowColor.trim() || draftColor.trim() || "#ef4444" };
    const nextDefinitions = definitions.map((b) => b.id === editingId ? updated : b);
    const owner = profiles.find((p) => p.id === user.id);
    if (!owner) { toast.error("Your owner profile was not found"); return; }
    setBusy(editingId);
    const ownerLinks = saveDefinitions(owner.social_links, nextDefinitions);
    const { error: ownerError } = await db.from("profiles").update({ social_links: ownerLinks }).eq("id", owner.id);
    if (ownerError) { toast.error("Could not save badge settings"); setBusy(null); return; }
    const updatedProfiles = await Promise.all(profiles.map(async (profile) => {
      const current = extractBadges(profile.social_links);
      if (!current.some((b) => b.id === editingId)) return profile;
      const replaced = current.map((b) => b.id === editingId ? updated : b);
      const socialLinks = mergeBadges(profile.social_links, replaced);
      const { error } = await db.from("profiles").update({ social_links: socialLinks }).eq("id", profile.id);
      return error ? profile : { ...profile, social_links: socialLinks };
    }));
    setDefinitions(nextDefinitions); setProfiles(updatedProfiles); setEditingId(null); setBusy(null); toast.success("Badge updated everywhere it is assigned");
  };

  const createBadge = async () => {
    if (!user || !createName.trim()) { toast.error("Enter a badge name"); return; }
    const owner = profiles.find((p) => p.id === user.id);
    if (!owner) { toast.error("Your owner profile was not found"); return; }
    const id = `custom-${Date.now().toString(36)}`;
    const badge: ProfileBadge = { id, name: createName.trim(), description: createDescription.trim(), icon: "award", emoji: createEmoji.trim() || undefined, imageUrl: createImageUrl.trim() || undefined, color: createColor || "#facc15", glowColor: createGlowColor || createColor || "#facc15" };
    setBusy(id);
    const nextDefinitions = [...definitions, badge];
    const { error } = await db.from("profiles").update({ social_links: saveDefinitions(owner.social_links, nextDefinitions) }).eq("id", owner.id);
    if (error) toast.error("Could not create badge");
    else { setDefinitions(nextDefinitions); setCreateName(""); setCreateDescription(""); setCreateEmoji(""); setCreateImageUrl(""); toast.success("Badge created and saved"); }
    setBusy(null);
  };

  const deleteBadge = async (badge: ProfileBadge) => {
    if (!user) return;
    const owner = profiles.find((p) => p.id === user.id);
    if (!owner) return;
    setBusy(badge.id);
    const nextDefinitions = definitions.filter((b) => b.id !== badge.id);
    const { error: ownerError } = await db.from("profiles").update({ social_links: saveDefinitions(owner.social_links, nextDefinitions) }).eq("id", owner.id);
    if (ownerError) { toast.error("Could not delete badge"); setBusy(null); return; }
    const updatedProfiles = await Promise.all(profiles.map(async (profile) => {
      const current = extractBadges(profile.social_links);
      if (!current.some((b) => b.id === badge.id)) return profile;
      const socialLinks = mergeBadges(profile.social_links, current.filter((b) => b.id !== badge.id));
      const { error } = await db.from("profiles").update({ social_links: socialLinks }).eq("id", profile.id);
      return error ? profile : { ...profile, social_links: socialLinks };
    }));
    setDefinitions(nextDefinitions); setProfiles(updatedProfiles); setBusy(null); toast.success("Custom badge deleted everywhere");
  };

  const handleCreateImage = async (file?: File) => { if (!file) return; try { setCreateImageUrl(await compressBadgeImage(file)); toast.success("Image compressed and ready"); } catch (e) { toast.error(e instanceof Error ? e.message : "Could not process image"); } };
  const handleEditImage = async (file?: File) => { if (!file) return; try { setDraftImageUrl(await compressBadgeImage(file)); toast.success("Image compressed and ready"); } catch (e) { toast.error(e instanceof Error ? e.message : "Could not process image"); } };

  if (loading || isAdmin === null || loadingProfiles) return <div className="flex min-h-screen items-center justify-center bg-[#070707]"><Loader2 className="h-6 w-6 animate-spin text-red-500" /></div>;
  if (!isAdmin) return <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#070707] px-5 text-center"><Shield className="h-10 w-10 text-red-500" /><h1 className="text-2xl font-bold">Owner access only</h1><p className="max-w-sm text-sm text-muted-foreground">Badge controls are restricted to Spider Wensors administrators.</p><Link to="/admin" className="btn-primary">Back to staff portal</Link></div>;

  return <div className="min-h-screen bg-[#070707] text-foreground">
    <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(239,68,68,0.12),transparent_35%),radial-gradient(circle_at_85%_20%,rgba(59,130,246,0.06),transparent_30%)]" />
    <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#070707]/85 backdrop-blur-xl"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400"><Sparkles className="h-5 w-5" /></div><div><h1 className="font-display text-lg font-bold"><span className="text-red-500">Spider</span> Badge Studio</h1><p className="text-xs text-muted-foreground">Create · edit · assign · sync badges</p></div></div><Link to="/admin" className="btn-ghost"><ArrowLeft className="h-4 w-4" /> Staff Portal</Link></div></header>
    <main className="relative z-10 mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[300px_1fr]">
      <aside className="glass-panel h-fit overflow-hidden p-3 lg:sticky lg:top-24"><div className="mb-3 px-2"><p className="text-sm font-semibold">Members</p><p className="text-[11px] text-muted-foreground">Select who receives badges</p></div><label className="mb-3 flex items-center gap-2 rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2"><Search className="h-4 w-4 text-muted-foreground" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search members…" className="min-w-0 flex-1 bg-transparent text-sm outline-none" /></label><div className="max-h-[65vh] space-y-1 overflow-y-auto pr-1">{visibleProfiles.map((profile) => <button key={profile.id} type="button" onClick={() => setSelectedId(profile.id)} className={`flex w-full items-center gap-3 rounded-xl p-3 text-left ${selectedId === profile.id ? "bg-red-500/10 ring-1 ring-red-500/25" : "hover:bg-white/[0.04]"}`}><div className="h-9 w-9 overflow-hidden rounded-full border border-white/10 bg-white/5">{profile.avatar_url ? <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-sm font-bold">{(profile.display_name || profile.username || "?").slice(0, 1).toUpperCase()}</div>}</div><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{profile.display_name || profile.username || "Unnamed"}</span><span className="block truncate text-[11px] text-muted-foreground">@{profile.username || "—"}</span></span><span className="rounded-full bg-white/5 px-2 py-1 text-[10px] text-muted-foreground">{extractBadges(profile.social_links).length}</span></button>)}</div></aside>
      <section className="space-y-5">
        <div className="glass-panel p-5 sm:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-400">Member badges</p><h2 className="mt-1 text-xl font-bold">{selected?.display_name || selected?.username || "Select a member"}</h2><p className="text-sm text-muted-foreground">Assign or remove badges. Changes appear under the member's profile name.</p></div>{selected && <ProfileBadges badges={assigned} />}</div></div>
        <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2"><Search className="h-4 w-4 text-muted-foreground" /><input value={badgeQuery} onChange={(e) => setBadgeQuery(e.target.value)} placeholder="Search badges…" className="flex-1 bg-transparent text-sm outline-none" /><span className="text-[11px] text-muted-foreground">{assignedIds.size} active</span></div>
        <div className="grid gap-3 md:grid-cols-2">{visibleBadges.map((badge) => <BadgeCard key={badge.id} badge={badge} active={assignedIds.has(badge.id)} busy={busy === badge.id} onToggle={() => void toggleBadge(badge)} onEdit={() => beginEdit(badge)} onDelete={() => void deleteBadge(badge)} />)}</div>

        <div className="glass-panel p-5 sm:p-6"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-400">Create badge</p><h3 className="mt-1 text-lg font-bold">New custom badge</h3><p className="text-xs text-muted-foreground">Images can be up to 10 MB when selected; they are automatically compressed before saving.</p></div><div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-xs text-muted-foreground">Name<input value={createName} onChange={(e) => setCreateName(e.target.value)} placeholder="Badge name" className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-foreground outline-none" /></label><label className="text-xs text-muted-foreground">Description<input value={createDescription} onChange={(e) => setCreateDescription(e.target.value)} placeholder="Badge description" className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-foreground outline-none" /></label><label className="text-xs text-muted-foreground">Emoji<input value={createEmoji} onChange={(e) => setCreateEmoji(e.target.value)} placeholder="👑" className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-foreground outline-none" /></label><label className="text-xs text-muted-foreground">Image URL<input value={createImageUrl} onChange={(e) => setCreateImageUrl(e.target.value)} placeholder="https://example.com/badge.png" className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-foreground outline-none" /><span className="mt-1 block text-[10px]">PNG, JPG, WEBP or GIF URL</span></label><label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium hover:bg-white/[0.06]"><Upload className="h-4 w-4" /> Upload image<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" onChange={(e) => void handleCreateImage(e.target.files?.[0])} /></label><label className="text-xs text-muted-foreground">Icon color<input type="color" value={createColor} onChange={(e) => setCreateColor(e.target.value)} className="mt-1 h-11 w-full cursor-pointer rounded-xl border border-white/10 bg-transparent" /></label><label className="text-xs text-muted-foreground">Glow color<input type="color" value={createGlowColor} onChange={(e) => setCreateGlowColor(e.target.value)} className="mt-1 h-11 w-full cursor-pointer rounded-xl border border-white/10 bg-transparent" /></label></div><button type="button" onClick={() => void createBadge()} disabled={busy !== null} className="btn-primary mt-4 w-full justify-center sm:w-auto"><Sparkles className="h-4 w-4" /> Create badge</button></div>

        {editingId && <div className="glass-panel p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-400">Edit badge</p><h3 className="mt-1 text-lg font-bold">{definitions.find((b) => b.id === editingId)?.name}</h3></div><button type="button" onClick={() => setEditingId(null)} className="btn-ghost">Cancel</button></div><div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-xs text-muted-foreground">Name<input value={draftName} onChange={(e) => setDraftName(e.target.value)} className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-foreground outline-none" /></label><label className="text-xs text-muted-foreground">Description<input value={draftDescription} onChange={(e) => setDraftDescription(e.target.value)} className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-foreground outline-none" /></label><label className="text-xs text-muted-foreground">Emoji<input value={draftEmoji} onChange={(e) => setDraftEmoji(e.target.value)} className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-foreground outline-none" /></label><label className="text-xs text-muted-foreground">Image URL<input value={draftImageUrl} onChange={(e) => setDraftImageUrl(e.target.value)} className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-foreground outline-none" /><span className="mt-1 block text-[10px]">Saved images are compressed automatically.</span></label><label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium hover:bg-white/[0.06]"><Upload className="h-4 w-4" /> Replace image<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" onChange={(e) => void handleEditImage(e.target.files?.[0])} /></label><label className="text-xs text-muted-foreground">Icon color<input type="color" value={draftColor} onChange={(e) => setDraftColor(e.target.value)} className="mt-1 h-11 w-full cursor-pointer rounded-xl border border-white/10 bg-transparent" /></label><label className="text-xs text-muted-foreground">Glow color<input type="color" value={draftGlowColor} onChange={(e) => setDraftGlowColor(e.target.value)} className="mt-1 h-11 w-full cursor-pointer rounded-xl border border-white/10 bg-transparent" /></label></div><button type="button" onClick={() => void saveBadge()} disabled={busy === editingId} className="btn-primary mt-4 w-full justify-center sm:w-auto"><Save className="h-4 w-4" /> Save badge changes</button></div>}
      </section>
    </main>
  </div>;
}
