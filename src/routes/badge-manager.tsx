import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Award, Check, Loader2, Plus, Search, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { db, type Profile } from "@/lib/bio";
import { extractBadges, mergeBadges, PROFILE_BADGES, type ProfileBadge } from "@/lib/profileBadges";
import { useAuth, useIsAdmin } from "@/hooks/useAuth";

export const Route = createFileRoute("/badge-manager")({
  head: () => ({ meta: [{ title: "Badge Manager — Spider Website" }, { name: "robots", content: "noindex" }] }),
  component: BadgeManager,
});

const DEFINITION_PLATFORM = "__spider_badge_definition__";
const emojiPresets = ["⭐", "🔥", "💎", "👑", "⚡", "💫", "🎯", "🚀", "🏆", "🛡️", "💙", "❤️"];

function readDefinitions(links?: any[] | null): ProfileBadge[] {
  return (links ?? []).flatMap((link) => {
    if (link.platform !== DEFINITION_PLATFORM) return [];
    try { const badge = JSON.parse(link.icon_url || "") as ProfileBadge; return badge?.id && badge?.name ? [badge] : []; } catch { return []; }
  });
}

function saveDefinitions(links: any[] | null | undefined, badges: ProfileBadge[]) {
  const normal = (links ?? []).filter((link) => link.platform !== DEFINITION_PLATFORM);
  return [...normal, ...badges.map((badge) => ({ id: `badge-definition:${badge.id}`, platform: DEFINITION_PLATFORM, url: badge.id, title: badge.name, icon_url: JSON.stringify(badge), active: false }))];
}

const input = "mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 text-sm text-white outline-none transition focus:border-red-500/50";

function BadgeManager() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const isAdmin = useIsAdmin(user?.id, user?.email);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [definitions, setDefinitions] = useState<ProfileBadge[]>(PROFILE_BADGES);
  const [selectedId, setSelectedId] = useState("");
  const [memberQuery, setMemberQuery] = useState("");
  const [badgeQuery, setBadgeQuery] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState("⭐");
  const [color, setColor] = useState("#ef4444");
  const [glowColor, setGlowColor] = useState("#ef4444");
  const [saving, setSaving] = useState(false);
  const [busyBadge, setBusyBadge] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await db.from("profiles").select("*").order("created_at", { ascending: false }).limit(500);
    if (error) { toast.error("Could not load members"); return; }
    const rows = (data ?? []) as Profile[];
    setProfiles(rows);
    if (!selectedId && rows[0]) setSelectedId(rows[0].id);
    const owner = rows.find((p) => p.id === user?.id);
    const custom = readDefinitions(owner?.social_links);
    if (custom.length) {
      const map = new Map(custom.map((b) => [b.id, b]));
      setDefinitions([...PROFILE_BADGES.map((b) => map.get(b.id) ?? b), ...custom.filter((b) => !PROFILE_BADGES.some((x) => x.id === b.id))]);
    }
  }, [selectedId, user?.id]);

  useEffect(() => { if (!loading && !user) navigate({ to: "/auth" }); }, [loading, user, navigate]);
  useEffect(() => { if (isAdmin) void load(); }, [isAdmin, load]);

  const selected = profiles.find((p) => p.id === selectedId) ?? null;
  const assigned = selected ? extractBadges(selected.social_links) : [];
  const visibleMembers = useMemo(() => profiles.filter((p) => `${p.username ?? ""} ${p.display_name ?? ""}`.toLowerCase().includes(memberQuery.toLowerCase())), [profiles, memberQuery]);
  const visibleBadges = useMemo(() => definitions.filter((b) => `${b.name} ${b.description}`.toLowerCase().includes(badgeQuery.toLowerCase())), [definitions, badgeQuery]);

  const persistDefinitions = async (next: ProfileBadge[]) => {
    const owner = profiles.find((p) => p.id === user?.id);
    if (!owner) throw new Error("Owner profile not found");
    const { error } = await db.from("profiles").update({ social_links: saveDefinitions(owner.social_links, next) }).eq("id", owner.id);
    if (error) throw new Error(error.message || "Could not save badge definitions");
    setDefinitions(next);
  };

  const createBadge = async () => {
    const cleanName = name.trim();
    if (!cleanName) return toast.error("Enter a badge name");
    if (!emoji.trim()) return toast.error("Enter an emoji");
    const idBase = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const id = `${idBase || "custom"}-${Date.now().toString(36)}`;
    const badge: ProfileBadge = { id, name: cleanName, description: description.trim() || "Custom Spider Website badge.", icon: "award", emoji: emoji.trim().slice(0, 4), color, glowColor };
    setSaving(true);
    try {
      await persistDefinitions([...definitions, badge]);
      setName(""); setDescription(""); setEmoji("⭐");
      toast.success(`${cleanName} badge created`);
    } catch (e) { toast.error(e instanceof Error ? e.message : "Could not create badge"); }
    finally { setSaving(false); }
  };

  const assign = async (badge: ProfileBadge) => {
    if (!selected) return;
    setBusyBadge(badge.id);
    const current = extractBadges(selected.social_links);
    const next = current.some((b) => b.id === badge.id) ? current.filter((b) => b.id !== badge.id) : [...current, badge];
    const socialLinks = mergeBadges(selected.social_links, next);
    const { error } = await db.from("profiles").update({ social_links: socialLinks }).eq("id", selected.id);
    if (error) toast.error("Could not update member badge");
    else { setProfiles((items) => items.map((p) => p.id === selected.id ? { ...p, social_links: socialLinks } : p)); toast.success(next.some((b) => b.id === badge.id) ? "Badge assigned" : "Badge removed"); }
    setBusyBadge(null);
  };

  const deleteBadge = async (badge: ProfileBadge) => {
    if (PROFILE_BADGES.some((b) => b.id === badge.id)) return toast.error("Built-in badges cannot be deleted");
    setSaving(true);
    try {
      const next = definitions.filter((b) => b.id !== badge.id);
      await persistDefinitions(next);
      await Promise.all(profiles.map(async (p) => {
        const current = extractBadges(p.social_links);
        if (!current.some((b) => b.id === badge.id)) return;
        await db.from("profiles").update({ social_links: mergeBadges(p.social_links, current.filter((b) => b.id !== badge.id)) }).eq("id", p.id);
      }));
      setProfiles((items) => items.map((p) => ({ ...p, social_links: mergeBadges(p.social_links, extractBadges(p.social_links).filter((b) => b.id !== badge.id)) })));
      toast.success("Custom badge deleted");
    } catch (e) { toast.error(e instanceof Error ? e.message : "Could not delete badge"); }
    finally { setSaving(false); }
  };

  if (loading || isAdmin === null) return <div className="grid min-h-screen place-items-center bg-[#070707]"><Loader2 className="h-6 w-6 animate-spin text-red-500" /></div>;
  if (!isAdmin) return <div className="grid min-h-screen place-items-center bg-[#070707] px-5 text-center text-white"><div><Award className="mx-auto mb-3 h-10 w-10 text-red-500" /><h1 className="text-xl font-bold">Owner access only</h1><p className="mt-2 text-sm text-white/50">Badge management is restricted to Spider Website staff.</p><Link to="/admin" className="mt-5 inline-flex rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold">Back to Staff</Link></div></div>;

  return <div className="min-h-screen bg-[#070707] text-white">
    <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(239,68,68,.12),transparent_35%),radial-gradient(circle_at_90%_20%,rgba(37,99,235,.08),transparent_30%)]" />
    <header className="sticky top-0 z-40 border-b border-white/[.07] bg-[#070707]/85 backdrop-blur-xl"><div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400"><Sparkles className="h-5 w-5" /></div><div><h1 className="font-display text-lg font-bold"><span className="text-red-500">Spider</span> Badge Manager</h1><p className="text-xs text-white/45">Create badges · set emoji & glow · assign to members</p></div></div><Link to="/admin" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-white/70 hover:bg-white/5"><ArrowLeft className="h-4 w-4" /> Staff Portal</Link></div></header>
    <main className="relative z-10 mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[280px_1fr]">
      <aside className="glass-panel h-fit p-3 lg:sticky lg:top-24"><div className="mb-3 px-2"><p className="text-sm font-semibold">Members</p><p className="text-[11px] text-white/40">Choose a member to manage badges</p></div><div className="mb-3 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2"><Search className="h-4 w-4 text-white/40" /><input value={memberQuery} onChange={(e) => setMemberQuery(e.target.value)} placeholder="Search members" className="min-w-0 flex-1 bg-transparent text-sm outline-none" /></div><div className="max-h-[65vh] space-y-1 overflow-auto">{visibleMembers.map((p) => <button key={p.id} onClick={() => setSelectedId(p.id)} className={`flex w-full items-center gap-3 rounded-xl p-3 text-left ${selectedId === p.id ? "bg-red-500/10 ring-1 ring-red-500/25" : "hover:bg-white/5"}`}><div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-white/5">{p.avatar_url ? <img src={p.avatar_url} alt="" className="h-full w-full object-cover" /> : (p.display_name || p.username || "?").slice(0, 1).toUpperCase()}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{p.display_name || p.username || "Unnamed"}</p><p className="truncate text-[11px] text-white/40">@{p.username || "—"}</p></div><span className="text-[11px] text-white/35">{extractBadges(p.social_links).length}</span></button>)}</div></aside>
      <section className="space-y-5">
        <div className="glass-panel p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-red-400">Create new badge</p><h2 className="mt-1 text-xl font-bold">Custom badge</h2><p className="text-sm text-white/45">Make a badge with its own emoji, icon color and glow color.</p></div><div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-white/10 bg-black/30 text-3xl" style={{ color, filter: `drop-shadow(0 0 12px ${glowColor})` }}>{emoji || "⭐"}</div></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-xs text-white/55">Badge name<input className={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Creator" /></label><label className="text-xs text-white/55">Description<input className={input} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Special community badge" /></label><label className="text-xs text-white/55">Emoji<input className={input} value={emoji} onChange={(e) => setEmoji(e.target.value)} placeholder="⭐" maxLength={8} /><span className="mt-2 flex flex-wrap gap-1">{emojiPresets.map((x) => <button type="button" key={x} onClick={() => setEmoji(x)} className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-base hover:bg-white/10">{x}</button>)}</span></label><div className="grid grid-cols-2 gap-3"><label className="text-xs text-white/55">Icon color<input type="color" className="mt-1 h-11 w-full rounded-xl border border-white/10 bg-black/20 p-1" value={color} onChange={(e) => setColor(e.target.value)} /></label><label className="text-xs text-white/55">Glow color<input type="color" className="mt-1 h-11 w-full rounded-xl border border-white/10 bg-black/20 p-1" value={glowColor} onChange={(e) => setGlowColor(e.target.value)} /></label></div></div><button onClick={() => void createBadge()} disabled={saving} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold hover:bg-red-400 disabled:opacity-50"><Plus className="h-4 w-4" />{saving ? "Creating…" : "Create badge"}</button></div>
        <div className="glass-panel p-5"><div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-red-400">Manage members</p><h2 className="mt-1 text-xl font-bold">{selected?.display_name || selected?.username || "Select a member"}</h2><p className="text-sm text-white/45">Tap a badge to assign or remove it.</p></div><div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2"><Search className="h-4 w-4 text-white/40" /><input value={badgeQuery} onChange={(e) => setBadgeQuery(e.target.value)} placeholder="Search badges" className="w-36 bg-transparent text-sm outline-none" /></div></div><div className="grid gap-2 sm:grid-cols-2">{visibleBadges.map((badge) => { const active = assigned.some((b) => b.id === badge.id); return <div key={badge.id} className={`flex items-center gap-3 rounded-xl border p-3 transition ${active ? "border-red-500/30 bg-red-500/[.07]" : "border-white/10 bg-black/20"}`}><button type="button" onClick={() => void assign(badge)} disabled={!selected || busyBadge === badge.id} className="flex min-w-0 flex-1 items-center gap-3 text-left"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-black/30 text-xl" style={{ color: badge.color, filter: `drop-shadow(0 0 9px ${badge.glowColor || badge.color})` }}>{badge.emoji || "★"}</span><span className="min-w-0"><span className="block truncate text-sm font-semibold">{badge.name}</span><span className="block truncate text-[11px] text-white/40">{badge.description}</span></span></button>{active && <Check className="h-4 w-4 shrink-0 text-red-400" />}{!PROFILE_BADGES.some((b) => b.id === badge.id) && <button type="button" onClick={() => void deleteBadge(badge)} disabled={saving} className="rounded-lg p-2 text-white/35 hover:bg-red-500/10 hover:text-red-400" title="Delete custom badge"><Trash2 className="h-4 w-4" /></button>}</div>; })}</div></div>
        <div className="flex flex-wrap gap-2"><Link to="/badge-studio" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-white/65 hover:bg-white/5"><Award className="h-4 w-4" /> Open Badge Studio</Link><Link to="/admin" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-white/65 hover:bg-white/5"><ArrowLeft className="h-4 w-4" /> Staff Portal</Link></div>
      </section>
    </main>
  </div>;
}
