import { useCallback, useEffect, useMemo, useState } from "react";
import { Award, Check, Palette, Save, Search, Trash2, UserPlus, X } from "lucide-react";
import { toast } from "sonner";
import { type Profile, type SocialLink } from "@/lib/bio";
import { extractBadges, mergeBadges, PROFILE_BADGES, type ProfileBadge } from "@/lib/profileBadges";
import { useAuth, useIsAdmin } from "@/hooks/useAuth";

const DEFINITION_PLATFORM = "__spider_badge_definition__";
const ADMIN_HEADERS = { "Content-Type": "application/json", "X-Requested-With": "halo-app" };
const input = "mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none transition focus:border-red-500/60";

function readDefinitions(links?: SocialLink[] | null): ProfileBadge[] {
  return (links ?? []).flatMap((link) => {
    if (link.platform !== DEFINITION_PLATFORM) return [];
    try {
      const badge = JSON.parse(link.icon_url || "") as ProfileBadge;
      return badge?.id && badge?.name ? [badge] : [];
    } catch { return []; }
  });
}

function allDefinitions(links?: SocialLink[] | null) {
  const custom = readDefinitions(links);
  const customMap = new Map(custom.map((b) => [b.id, b]));
  return [
    ...PROFILE_BADGES.map((b) => customMap.get(b.id) ?? b),
    ...custom.filter((b) => !PROFILE_BADGES.some((x) => x.id === b.id)),
  ];
}

function definitionLinks(existing: SocialLink[] | null | undefined, badges: ProfileBadge[]) {
  return [
    ...(existing ?? []).filter((link) => link.platform !== DEFINITION_PLATFORM),
    ...badges.map((badge) => ({
      id: `badge-definition:${badge.id}`,
      platform: DEFINITION_PLATFORM,
      url: badge.id,
      title: badge.name,
      icon_url: JSON.stringify(badge),
      active: false,
    })),
  ];
}

async function adminMutateProfile(targetUserId: string, changes: Partial<Profile>) {
  const response = await fetch("/api/admin/profile-mutate", {
    method: "POST",
    headers: ADMIN_HEADERS,
    credentials: "include",
    body: JSON.stringify({ targetUserId, changes }),
  });
  const data = (await response.json().catch(() => ({}))) as { success?: boolean; error?: string };
  if (!response.ok || !data.success) throw new Error(data.error || "Admin change failed");
}

async function loadAdminProfiles() {
  const response = await fetch("/api/admin/profiles", {
    credentials: "include",
    headers: { "X-Requested-With": "halo-app" },
    cache: "no-store",
  });
  const data = (await response.json().catch(() => ({}))) as { profiles?: Profile[]; error?: string };
  if (!response.ok) throw new Error(data.error || "Could not load members");
  return Array.isArray(data.profiles) ? data.profiles : [];
}

function BadgeIcon({ badge, size = "h-10 w-10" }: { badge: ProfileBadge; size?: string }) {
  const glow = badge.glowColor || badge.color || "#ef4444";
  return (
    <div
      className={`grid shrink-0 place-items-center rounded-xl border border-white/10 bg-black/30 ${size}`}
      style={{ color: badge.color, boxShadow: `0 0 10px ${glow}90, 0 0 28px ${glow}45` }}
    >
      {badge.imageUrl ? <img src={badge.imageUrl} alt="" className="h-7 w-7 object-contain" /> : <span className="text-xl">{badge.emoji || "★"}</span>}
    </div>
  );
}

export function AdminBadgeManager() {
  const { user } = useAuth();
  const isAdmin = useIsAdmin(user?.id, user?.email);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [owner, setOwner] = useState<Profile | null>(null);
  const [badges, setBadges] = useState<ProfileBadge[]>(PROFILE_BADGES);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ProfileBadge | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [color, setColor] = useState("#ef4444");
  const [glowColor, setGlowColor] = useState("#ef4444");
  const [playerQuery, setPlayerQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyPlayer, setBusyPlayer] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isAdmin || !user) return;
    setLoading(true);
    try {
      const rows = await loadAdminProfiles();
      const own = rows.find((p) => p.id === user.id) ?? null;
      setProfiles(rows);
      setOwner(own);
      setBadges(allDefinitions(own?.social_links));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load badge data");
    } finally { setLoading(false); }
  }, [isAdmin, user]);

  useEffect(() => { void load(); }, [load]);

  const visibleBadges = useMemo(() => badges.filter((b) => `${b.name} ${b.description}`.toLowerCase().includes(query.toLowerCase())), [badges, query]);
  const assignedPlayers = useMemo(() => selected ? profiles.filter((p) => extractBadges(p.social_links).some((b) => b.id === selected.id)) : [], [profiles, selected]);
  const visiblePlayers = useMemo(() => {
    const q = playerQuery.trim().toLowerCase();
    return profiles.filter((p) => !q || `${p.username ?? ""} ${p.display_name ?? ""}`.toLowerCase().includes(q));
  }, [profiles, playerQuery]);

  const openEditor = (badge: ProfileBadge) => {
    setSelected(badge);
    setName(badge.name);
    setDescription(badge.description || "");
    setEmoji(badge.emoji || "");
    setImageUrl(badge.imageUrl || "");
    setColor(badge.color || "#ef4444");
    setGlowColor(badge.glowColor || badge.color || "#ef4444");
    setPlayerQuery("");
  };

  const saveBadge = async () => {
    if (!selected || !owner) return;
    const cleanName = name.trim();
    if (!cleanName) return toast.error("Badge name is required");
    const cleanColor = /^#[0-9a-f]{6}$/i.test(color.trim()) ? color.trim() : "#ef4444";
    const cleanGlow = /^#[0-9a-f]{6}$/i.test(glowColor.trim()) ? glowColor.trim() : cleanColor;
    const updated: ProfileBadge = {
      ...selected,
      name: cleanName,
      description: description.trim(),
      emoji: emoji.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      color: cleanColor,
      glowColor: cleanGlow,
    };
    setSaving(true);
    try {
      const nextBadges = badges.map((b) => b.id === selected.id ? updated : b);
      await adminMutateProfile(owner.id, { social_links: definitionLinks(owner.social_links, nextBadges) });
      const assigned = profiles.filter((p) => extractBadges(p.social_links).some((b) => b.id === selected.id));
      for (const player of assigned) {
        const next = extractBadges(player.social_links).map((b) => b.id === selected.id ? updated : b);
        await adminMutateProfile(player.id, { social_links: mergeBadges(player.social_links, next) });
      }
      setBadges(nextBadges);
      setOwner((p) => p ? { ...p, social_links: definitionLinks(p.social_links, nextBadges) } : p);
      setProfiles((items) => items.map((p) => assigned.some((x) => x.id === p.id) ? { ...p, social_links: mergeBadges(p.social_links, extractBadges(p.social_links).map((b) => b.id === selected.id ? updated : b)) } : p));
      setSelected(updated);
      window.dispatchEvent(new Event("halo-store-updated"));
      toast.success("Badge saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save badge");
    } finally { setSaving(false); }
  };

  const togglePlayer = async (player: Profile) => {
    if (!selected) return;
    setBusyPlayer(player.id);
    try {
      const current = extractBadges(player.social_links);
      const has = current.some((b) => b.id === selected.id);
      const next = has ? current.filter((b) => b.id !== selected.id) : [...current, selected];
      const socialLinks = mergeBadges(player.social_links, next);
      await adminMutateProfile(player.id, { social_links: socialLinks });
      setProfiles((items) => items.map((p) => p.id === player.id ? { ...p, social_links: socialLinks } : p));
      window.dispatchEvent(new Event("halo-store-updated"));
      toast.success(has ? `Removed ${selected.name}` : `Assigned ${selected.name}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update player");
    } finally { setBusyPlayer(null); }
  };

  const deleteBadge = async () => {
    if (!selected || !owner) return;
    if (PROFILE_BADGES.some((b) => b.id === selected.id)) {
      toast.error("Built-in badges are protected. You can edit them, but they cannot be deleted.");
      return;
    }
    if (!window.confirm(`Delete ${selected.name}? This also removes it from assigned players.`)) return;
    setSaving(true);
    try {
      const nextBadges = badges.filter((b) => b.id !== selected.id);
      await adminMutateProfile(owner.id, { social_links: definitionLinks(owner.social_links, nextBadges) });
      for (const player of profiles) {
        const current = extractBadges(player.social_links);
        if (current.some((b) => b.id === selected.id)) {
          await adminMutateProfile(player.id, { social_links: mergeBadges(player.social_links, current.filter((b) => b.id !== selected.id)) });
        }
      }
      setBadges(nextBadges);
      setSelected(null);
      await load();
      toast.success("Badge deleted");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Could not delete badge"); }
    finally { setSaving(false); }
  };

  if (isAdmin !== true) return null;

  return (
    <section className="glass-panel overflow-hidden" id="manage-badges">
      <div className="border-b border-white/[.07] bg-black/20 px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div><div className="flex items-center gap-2"><Award className="h-5 w-5 text-red-400" /><h2 className="font-display text-lg font-bold">Manage Badges</h2></div><p className="mt-1 text-xs text-white/45">Click any badge to edit it or manage its players.</p></div>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2"><Search className="h-4 w-4 text-white/40" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search badges" className="w-full bg-transparent text-sm text-white outline-none sm:w-52" /></div>
        </div>
      </div>
      <div className="p-5">
        {loading ? <div className="flex justify-center py-10 text-white/50">Loading badges…</div> : <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{visibleBadges.map((badge) => <button key={badge.id} type="button" onClick={() => openEditor(badge)} className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3 text-left transition hover:-translate-y-0.5 hover:border-red-500/30 hover:bg-white/[.045]"><BadgeIcon badge={badge} /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-white">{badge.name}</span><span className="mt-0.5 block truncate text-[11px] text-white/40">{badge.description}</span></span><span className="text-xs text-white/30">Edit</span></button>)}</div>}
      </div>

      {selected && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 p-3 backdrop-blur-md" onMouseDown={(e) => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#090b10] shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#090b10]/95 px-5 py-4 backdrop-blur-xl">
              <div className="flex min-w-0 items-center gap-3"><BadgeIcon badge={{ ...selected, name }} size="h-11 w-11" /><div className="min-w-0"><h3 className="truncate text-lg font-bold text-white">Edit {name || selected.name}</h3><p className="text-[11px] text-white/40">Changes are applied to every player who has this badge.</p></div></div>
              <button type="button" onClick={() => setSelected(null)} className="rounded-xl p-2 text-white/50 hover:bg-white/5 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-5 p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-xs text-white/50">Name<input className={input} value={name} onChange={(e) => setName(e.target.value)} /></label>
                <label className="text-xs text-white/50">Emoji<input className={input} value={emoji} onChange={(e) => setEmoji(e.target.value)} placeholder="⭐" /></label>
                <label className="text-xs text-white/50 sm:col-span-2">Description<textarea className={`${input} min-h-20 resize-y`} value={description} onChange={(e) => setDescription(e.target.value)} /></label>
                <label className="text-xs text-white/50">Badge color<div className="mt-1 flex gap-2"><input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-11 w-12 rounded-xl border border-white/10 bg-black" /><input className={`${input} mt-0 font-mono`} value={color} onChange={(e) => setColor(e.target.value)} /></div></label>
                <label className="text-xs text-white/50">Glow color<div className="mt-1 flex gap-2"><input type="color" value={glowColor} onChange={(e) => setGlowColor(e.target.value)} className="h-11 w-12 rounded-xl border border-white/10 bg-black" /><input className={`${input} mt-0 font-mono`} value={glowColor} onChange={(e) => setGlowColor(e.target.value)} /></div></label>
                <label className="text-xs text-white/50 sm:col-span-2">Image URL<input className={input} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…/badge.png" /></label>
              </div>

              <div className="rounded-2xl border border-red-500/15 bg-red-500/[.035] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white"><Palette className="h-4 w-4 text-red-400" /> Live preview</div>
                <div className="mt-3 flex items-center gap-3 rounded-xl border border-white/10 bg-black/25 p-3"><BadgeIcon badge={{ ...selected, name, emoji: emoji || undefined, imageUrl: imageUrl || undefined, color, glowColor }} /><div><p className="font-semibold text-white">{name}</p><p className="text-xs text-white/40">Glow: {glowColor}</p></div></div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h4 className="flex items-center gap-2 font-semibold text-white"><UserPlus className="h-4 w-4 text-red-400" /> {name || selected.name} — Players</h4><p className="mt-1 text-[11px] text-white/40">Tap a player to assign or remove this badge.</p></div><div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2"><Search className="h-4 w-4 text-white/40" /><input value={playerQuery} onChange={(e) => setPlayerQuery(e.target.value)} placeholder="Search player" className="bg-transparent text-sm text-white outline-none sm:w-48" /></div></div>
                <div className="mt-3 max-h-64 space-y-1.5 overflow-y-auto">{visiblePlayers.map((player) => { const has = extractBadges(player.social_links).some((b) => b.id === selected.id); const isBusy = busyPlayer === player.id; return <button key={player.id} type="button" disabled={isBusy} onClick={() => void togglePlayer(player)} className={`flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition ${has ? "border-red-500/30 bg-red-500/[.07]" : "border-white/10 bg-white/[.02] hover:bg-white/[.05]"}`}><div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-white/10">{player.avatar_url ? <img src={player.avatar_url} alt="" className="h-full w-full object-cover" /> : <span className="text-xs font-bold">{(player.display_name || player.username || "?").slice(0,1).toUpperCase()}</span>}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-white">@{player.username || "no-username"}</p><p className="truncate text-[11px] text-white/40">{player.display_name || "Unnamed"}</p></div>{has ? <span className="inline-flex items-center gap-1 rounded-full bg-red-500 px-2 py-1 text-[10px] font-bold text-white"><Check className="h-3 w-3" /> Remove</span> : <span className="text-[11px] text-white/40">Assign</span>}</button>; })}</div>
                <p className="mt-3 text-[10px] text-white/30">Currently assigned: {assignedPlayers.length}</p>
              </div>

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
                <button type="button" onClick={() => void deleteBadge()} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 px-4 py-2.5 text-xs font-semibold text-red-300 hover:bg-red-500/10"><Trash2 className="h-4 w-4" /> Delete badge</button>
                <div className="flex gap-2"><button type="button" onClick={() => setSelected(null)} className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-white/60 hover:bg-white/5">Cancel</button><button type="button" onClick={() => void saveBadge()} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-red-500/20 hover:bg-red-400 disabled:opacity-50"><Save className="h-4 w-4" /> {saving ? "Saving…" : "Save changes"}</button></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
