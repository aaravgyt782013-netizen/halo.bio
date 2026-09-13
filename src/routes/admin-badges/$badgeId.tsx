import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Award, Check, Loader2, Save, Search } from "lucide-react";
import { toast } from "sonner";
import { type Profile, type SocialLink } from "@/lib/bio";
import { extractBadges, mergeBadges, PROFILE_BADGES, type ProfileBadge } from "@/lib/profileBadges";
import { useAuth, useIsAdmin } from "@/hooks/useAuth";

export const Route = createFileRoute("/admin-badges/$badgeId")({ component: BadgeEditor });
const DEFINITION_PLATFORM = "__spider_badge_definition__";
const ADMIN_HEADERS = { "Content-Type": "application/json", "X-Requested-With": "halo-app" };

function readDefinitions(links?: SocialLink[] | null): ProfileBadge[] {
  return (links ?? []).flatMap((link) => {
    if (link.platform !== DEFINITION_PLATFORM) return [];
    try { const badge = JSON.parse(link.icon_url || "") as ProfileBadge; return badge?.id && badge?.name ? [badge] : []; } catch { return []; }
  });
}
function mergeDefinitions(saved: ProfileBadge[]) {
  const map = new Map(PROFILE_BADGES.map((badge) => [badge.id, badge]));
  saved.forEach((badge) => map.set(badge.id, badge));
  return [...map.values()];
}
function definitionLinks(existing: SocialLink[] | null | undefined, badges: ProfileBadge[]): SocialLink[] {
  return [
    ...(existing ?? []).filter((link) => link.platform !== DEFINITION_PLATFORM),
    ...badges.map((badge) => ({ id: `badge-definition:${badge.id}`, platform: DEFINITION_PLATFORM, url: badge.id, title: badge.name, icon_url: JSON.stringify(badge), active: false })),
  ];
}
async function adminMutateProfile(targetUserId: string, changes: Partial<Profile>) {
  const response = await fetch("/api/admin/profile-mutate", { method: "POST", headers: ADMIN_HEADERS, credentials: "include", body: JSON.stringify({ targetUserId, changes }) });
  const data = (await response.json().catch(() => ({}))) as { success?: boolean; error?: string };
  if (!response.ok || !data.success) throw new Error(data.error || "Admin change failed");
}
async function loadAdminProfiles(): Promise<Profile[]> {
  const response = await fetch("/api/admin/profiles", { credentials: "include", headers: { "X-Requested-With": "halo-app" }, cache: "no-store" });
  const data = (await response.json().catch(() => ({}))) as { profiles?: Profile[]; error?: string };
  if (!response.ok) throw new Error(data.error || "Could not load admin profiles");
  return Array.isArray(data.profiles) ? data.profiles : [];
}

function BadgeEditor() {
  const navigate = useNavigate();
  const { badgeId } = Route.useParams();
  const { user, loading } = useAuth();
  const isAdmin = useIsAdmin(user?.id, user?.email);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [owner, setOwner] = useState<Profile | null>(null);
  const [badge, setBadge] = useState<ProfileBadge | null>(null);
  const [name, setName] = useState(""); const [description, setDescription] = useState(""); const [icon, setIcon] = useState("award"); const [emoji, setEmoji] = useState(""); const [imageUrl, setImageUrl] = useState(""); const [color, setColor] = useState("#ef4444"); const [glowColor, setGlowColor] = useState("#ef4444");
  const [query, setQuery] = useState(""); const [busy, setBusy] = useState(true); const [saving, setSaving] = useState(false);

  useEffect(() => { if (!loading && !user) navigate({ to: "/auth" }); }, [loading, user, navigate]);
  useEffect(() => {
    if (!isAdmin || !user) return;
    let cancelled = false;
    void loadAdminProfiles().then((rows) => {
      if (cancelled) return;
      const ownerData = rows.find((p) => p.id === user.id) ?? null;
      const definitions = mergeDefinitions(readDefinitions(ownerData?.social_links));
      const found = definitions.find((item) => item.id === badgeId) ?? null;
      setOwner(ownerData); setProfiles(rows); setBadge(found);
      if (found) { setName(found.name); setDescription(found.description || ""); setIcon(found.icon || "award"); setEmoji(found.emoji || ""); setImageUrl(found.imageUrl || ""); setColor(found.color || "#ef4444"); setGlowColor(found.glowColor || found.color || "#ef4444"); }
    }).catch((error) => { if (!cancelled) toast.error(error instanceof Error ? error.message : "Could not load admin data"); }).finally(() => { if (!cancelled) setBusy(false); });
    return () => { cancelled = true; };
  }, [isAdmin, user, badgeId]);

  const assigned = useMemo(() => new Set(profiles.filter((profile) => extractBadges(profile.social_links).some((item) => item.id === badgeId)).map((profile) => profile.id)), [profiles, badgeId]);
  const visibleProfiles = profiles.filter((profile) => `${profile.username ?? ""} ${profile.display_name ?? ""}`.toLowerCase().includes(query.toLowerCase()));

  const saveBadge = async () => {
    if (!user || !owner || !badge) return;
    const cleanColor = /^#[0-9a-f]{6}$/i.test(color.trim()) ? color.trim() : "#ef4444";
    const cleanGlow = /^#[0-9a-f]{6}$/i.test(glowColor.trim()) ? glowColor.trim() : cleanColor;
    const updated: ProfileBadge = { ...badge, name: name.trim() || "Badge", description: description.trim(), icon: icon.trim() || "award", emoji: emoji.trim() || undefined, imageUrl: imageUrl.trim() || undefined, color: cleanColor, glowColor: cleanGlow };
    setSaving(true);
    try {
      const definitions = mergeDefinitions(readDefinitions(owner.social_links)).map((item) => item.id === badge.id ? updated : item);
      await adminMutateProfile(owner.id, { social_links: definitionLinks(owner.social_links, definitions) });
      const assignedProfiles = profiles.filter((profile) => extractBadges(profile.social_links).some((item) => item.id === badge.id));
      await Promise.all(assignedProfiles.map((profile) => adminMutateProfile(profile.id, { social_links: mergeBadges(profile.social_links, extractBadges(profile.social_links).map((item) => item.id === badge.id ? updated : item)) })));
      setBadge(updated); setOwner((current) => current ? { ...current, social_links: definitionLinks(current.social_links, definitions) } : current);
      setProfiles((items) => items.map((profile) => assigned.has(profile.id) ? { ...profile, social_links: mergeBadges(profile.social_links, extractBadges(profile.social_links).map((item) => item.id === updated.id ? updated : item)) } : profile));
      window.dispatchEvent(new Event("halo-store-updated")); toast.success("Badge saved and synced to assigned players");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Could not save badge"); } finally { setSaving(false); }
  };

  const togglePlayer = async (profile: Profile) => {
    if (!badge) return;
    const current = extractBadges(profile.social_links); const has = current.some((item) => item.id === badge.id); const next = has ? current.filter((item) => item.id !== badge.id) : [...current, badge];
    try {
      await adminMutateProfile(profile.id, { social_links: mergeBadges(profile.social_links, next) });
      setProfiles((items) => items.map((item) => item.id === profile.id ? { ...item, social_links: mergeBadges(item.social_links, next) } : item));
      window.dispatchEvent(new Event("halo-store-updated")); toast.success(has ? `Removed ${badge.name}` : `Assigned ${badge.name} to @${profile.username ?? profile.display_name ?? "player"}`);
    } catch (error) { toast.error(error instanceof Error ? error.message : "Could not update player badge"); }
  };

  if (loading || isAdmin === null || busy) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!isAdmin || !badge) return <div className="flex min-h-screen items-center justify-center p-5"><div className="glass-panel p-8 text-center"><h1 className="text-xl font-bold">Badge not found</h1><Link to="/admin-badges" className="btn-primary mt-5 inline-flex">Back to badges</Link></div></div>;

  return <div className="min-h-screen bg-[#070707] text-white"><header className="sticky top-0 z-20 border-b border-white/10 bg-black/80 px-4 py-4 backdrop-blur-xl"><div className="mx-auto flex max-w-5xl items-center justify-between gap-3"><Link to="/admin-badges" className="btn-ghost"><ArrowLeft className="h-4 w-4" /> Badges</Link><div className="flex min-w-0 items-center gap-2"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border" style={{ color, borderColor: `${glowColor}90`, boxShadow: `0 0 14px ${glowColor}90, 0 0 34px ${glowColor}55` }}>{emoji || <Award className="h-5 w-5" />}</div><div className="min-w-0"><h1 className="truncate font-display font-bold">Edit {badge.name}</h1><p className="text-[11px] text-white/45">Badge settings & player assignment</p></div></div><button type="button" onClick={() => void saveBadge()} disabled={saving} className="btn-primary"><Save className="h-4 w-4" /> {saving ? "Saving…" : "Save"}</button></div></header>
    <main className="mx-auto max-w-5xl space-y-5 px-4 py-7"><section className="rounded-2xl border border-white/10 bg-white/[.035] p-5"><h2 className="font-display text-lg font-bold">Badge details</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-xs text-white/55">Name<input className="field mt-1 w-full" value={name} onChange={(e) => setName(e.target.value)} /></label><label className="text-xs text-white/55">Icon key<input className="field mt-1 w-full" value={icon} onChange={(e) => setIcon(e.target.value)} /></label><label className="text-xs text-white/55 sm:col-span-2">Description<textarea className="field mt-1 min-h-20 w-full" value={description} onChange={(e) => setDescription(e.target.value)} /></label><label className="text-xs text-white/55">Emoji<input className="field mt-1 w-full" value={emoji} onChange={(e) => setEmoji(e.target.value)} placeholder="Optional" /></label><label className="text-xs text-white/55">Image URL<input className="field mt-1 w-full" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Optional" /></label><label className="text-xs text-white/55">Badge color<div className="mt-1 flex gap-2"><input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-12" /><input className="field w-full font-mono" value={color} onChange={(e) => setColor(e.target.value)} /></div></label><label className="text-xs text-white/55">Glow color<div className="mt-1 flex gap-2"><input type="color" value={glowColor} onChange={(e) => setGlowColor(e.target.value)} className="h-10 w-12" /><input className="field w-full font-mono" value={glowColor} onChange={(e) => setGlowColor(e.target.value)} /></div></label></div></section>
    <section className="rounded-2xl border border-white/10 bg-white/[.035] p-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-display text-lg font-bold">{name || badge.name} — Assign to players</h2><p className="text-xs text-white/45">Search a username or display name and tap a player to assign or remove this badge.</p></div><div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2"><Search className="h-4 w-4 text-white/40" /><input className="bg-transparent text-sm outline-none" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Username or display name" /></div></div><div className="mt-4 space-y-2">{visibleProfiles.map((profile) => { const has = assigned.has(profile.id); return <button key={profile.id} type="button" onClick={() => void togglePlayer(profile)} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${has ? "border-red-500/40 bg-red-500/[.08]" : "border-white/10 bg-black/20 hover:bg-white/[.04]"}`}><div className="h-9 w-9 overflow-hidden rounded-full bg-white/10">{profile.avatar_url ? <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-xs font-bold">{(profile.display_name ?? profile.username ?? "?").slice(0, 1).toUpperCase()}</div>}</div><div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">@{profile.username ?? "no-username"}</div><div className="truncate text-xs text-white/45">{profile.display_name ?? "Unnamed"}</div></div>{has ? <span className="inline-flex items-center gap-1 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold"><Check className="h-3 w-3" /> Assigned</span> : <span className="text-xs text-white/40">Assign</span>}</button>; })}{visibleProfiles.length === 0 && <p className="py-8 text-center text-sm text-white/40">No players found.</p>}</div></section></main></div>;
}
