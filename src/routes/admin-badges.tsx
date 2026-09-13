import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Award, Check, Loader2, Search, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { db, type Profile } from "@/lib/bio";
import { extractBadges, mergeBadges, PROFILE_BADGES, type ProfileBadge } from "@/lib/profileBadges";
import { useAuth, useIsAdmin } from "@/hooks/useAuth";

const DEFINITION_PLATFORM = "__spider_badge_definition__";
const ADMIN_CSRF = { "X-Requested-With": "halo-app" };
const input = "mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 text-sm text-white outline-none transition focus:border-red-500/50";
const emojis = ["⭐", "🔥", "💎", "👑", "⚡", "💫", "🎯", "🚀", "🏆", "🛡️", "💙", "❤️"];

type DefinitionLink = { platform?: string; icon_url?: string | null };

function readDefinitions(links: DefinitionLink[] | null | undefined): ProfileBadge[] {
  return (links ?? []).flatMap((link) => {
    if (link.platform !== DEFINITION_PLATFORM) return [];
    try {
      const badge = JSON.parse(link.icon_url || "") as ProfileBadge;
      return badge?.id && badge?.name ? [badge] : [];
    } catch { return []; }
  });
}

function saveDefinitions(links: any[] | null | undefined, badges: ProfileBadge[]) {
  const normal = (links ?? []).filter((link) => link.platform !== DEFINITION_PLATFORM);
  return [...normal, ...badges.map((badge) => ({ id: `badge-definition:${badge.id}`, platform: DEFINITION_PLATFORM, url: badge.id, title: badge.name, icon_url: JSON.stringify(badge), active: false }))];
}

async function adminProfileMutation(targetUserId: string, changes: Partial<Profile>) {
  const res = await fetch("/api/admin/profile-mutate", { method: "POST", headers: { "content-type": "application/json", ...ADMIN_CSRF }, credentials: "include", body: JSON.stringify({ targetUserId, changes }) });
  const data = (await res.json().catch(() => ({}))) as { success?: boolean; error?: string };
  if (!res.ok || !data.success) throw new Error(data.error || "Admin change failed");
}

export const Route = createFileRoute("/admin-badges")({
  head: () => ({ meta: [{ title: "Badges — Spider Wensors Staff" }, { name: "robots", content: "noindex" }] }),
  component: AdminBadgesPage,
});

function BadgePreview({ badge }: { badge: ProfileBadge }) {
  return <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3" style={{ boxShadow: `0 0 18px ${badge.glowColor || badge.color}55, 0 0 45px ${badge.glowColor || badge.color}25` }}>
    <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/5 text-2xl" style={{ color: badge.color, filter: `drop-shadow(0 0 10px ${badge.glowColor || badge.color})` }}>
      {badge.imageUrl ? <img src={badge.imageUrl} alt="" className="h-8 w-8 object-contain" /> : badge.emoji || "★"}
    </div>
    <div><p className="font-semibold">{badge.name || "Badge name"}</p><p className="text-xs text-white/45">{badge.description || "Badge description"}</p></div>
  </div>;
}

function AdminBadgesPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const isAdmin = useIsAdmin(user?.id, user?.email);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [definitions, setDefinitions] = useState<ProfileBadge[]>(PROFILE_BADGES);
  const [selectedId, setSelectedId] = useState<string>("");
  const [query, setQuery] = useState("");
  const [memberQuery, setMemberQuery] = useState("");
  const [editing, setEditing] = useState<ProfileBadge | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyMember, setBusyMember] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const { data, error } = await db.from("profiles").select("*").order("created_at", { ascending: false }).limit(500);
    if (error) { toast.error("Could not load badge data"); return; }
    const rows = (data ?? []) as Profile[];
    setProfiles(rows);
    const owner = rows.find((p) => p.id === user?.id);
    const custom = readDefinitions(owner?.social_links as any);
    const map = new Map(custom.map((b) => [b.id, b]));
    setDefinitions([...PROFILE_BADGES.map((b) => map.get(b.id) ?? b), ...custom.filter((b) => !PROFILE_BADGES.some((x) => x.id === b.id))]);
  }, [user?.id]);

  useEffect(() => { if (!loading && !user) navigate({ to: "/auth" }); }, [loading, user, navigate]);
  useEffect(() => { if (isAdmin) void load(); }, [isAdmin, load]);

  const selected = definitions.find((b) => b.id === selectedId) ?? null;
  const visibleBadges = useMemo(() => definitions.filter((b) => `${b.name} ${b.description}`.toLowerCase().includes(query.toLowerCase())), [definitions, query]);
  const visibleMembers = useMemo(() => profiles.filter((p) => `${p.username ?? ""} ${p.display_name ?? ""}`.toLowerCase().includes(memberQuery.toLowerCase())), [profiles, memberQuery]);
  const assignedIds = useMemo(() => new Set(selected ? profiles.filter((p) => extractBadges(p.social_links).some((b) => b.id === selected.id)).map((p) => p.id) : []), [profiles, selected]);

  const selectBadge = (badge: ProfileBadge) => {
    setSelectedId(badge.id);
    setEditing({ ...badge });
  };

  const saveBadge = async () => {
    if (!editing) return;
    if (!editing.name.trim()) return toast.error("Badge name is required");
    if (!editing.emoji?.trim() && !editing.imageUrl?.trim()) return toast.error("Add an emoji or image");
    if (editing.imageUrl && !/^https?:\\/\\//i.test(editing.imageUrl) && !editing.imageUrl.startsWith("data:image/")) return toast.error("Image URL must start with http:// or https://");
    const next = definitions.map((b) => b.id === editing.id ? { ...editing, name: editing.name.trim(), description: editing.description.trim() } : b);
    setSaving(true);
    try {
      const owner = profiles.find((p) => p.id === user?.id);
      if (!owner) throw new Error("Owner profile not found");
      const { error } = await db.from("profiles").update({ social_links: saveDefinitions(owner.social_links, next) }).eq("id", owner.id);
      if (error) throw new Error(error.message || "Could not save badge");
      setDefinitions(next);
      setEditing(next.find((b) => b.id === editing.id) ?? null);
      setProfiles((rows) => rows.map((p) => p.id === owner.id ? { ...p, social_links: saveDefinitions(p.social_links, next) } : p));
      toast.success(`${editing.name} saved`);
      window.dispatchEvent(new Event("halo-store-updated"));
    } catch (e) { toast.error(e instanceof Error ? e.message : "Could not save badge"); }
    finally { setSaving(false); }
  };

  const uploadImage = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Choose an image file");
    if (file.size > 400 * 1024) return toast.error("Badge image must be 400 KB or smaller");
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === "string") { setEditing((b) => b ? { ...b, imageUrl: reader.result as string } : b); toast.success("Badge image loaded"); } };
    reader.readAsDataURL(file);
  };

  const assignToMember = async (profile: Profile) => {
    if (!selected) return;
    setBusyMember(profile.id);
    const previous = profile.social_links;
    const current = extractBadges(previous);
    const exists = current.some((b) => b.id === selected.id);
    const next = exists ? current.filter((b) => b.id !== selected.id) : [...current, selected];
    const socialLinks = mergeBadges(previous, next);
    setProfiles((rows) => rows.map((p) => p.id === profile.id ? { ...p, social_links: socialLinks } : p));
    try {
      await adminProfileMutation(profile.id, { social_links: socialLinks });
      toast.success(exists ? `Removed ${selected.name}` : `Assigned ${selected.name} to @${profile.username || profile.display_name || "member"}`);
      window.dispatchEvent(new Event("halo-store-updated"));
    } catch (e) {
      setProfiles((rows) => rows.map((p) => p.id === profile.id ? { ...p, social_links: previous } : p));
      toast.error(e instanceof Error ? e.message : "Could not update member");
    } finally { setBusyMember(null); }
  };

  const deleteCustom = async () => {
    if (!selected || PROFILE_BADGES.some((b) => b.id === selected.id)) return toast.error("Built-in badges cannot be deleted");
    const next = definitions.filter((b) => b.id !== selected.id);
    setSaving(true);
    try {
      const owner = profiles.find((p) => p.id === user?.id);
      if (!owner) throw new Error("Owner profile not found");
      const { error } = await db.from("profiles").update({ social_links: saveDefinitions(owner.social_links, next) }).eq("id", owner.id);
      if (error) throw new Error(error.message || "Could not delete badge");
      for (const p of profiles) if (extractBadges(p.social_links).some((b) => b.id === selected.id)) await adminProfileMutation(p.id, { social_links: mergeBadges(p.social_links, extractBadges(p.social_links).filter((b) => b.id !== selected.id)) });
      setProfiles((rows) => rows.map((p) => ({ ...p, social_links: mergeBadges(p.social_links, extractBadges(p.social_links).filter((b) => b.id !== selected.id)) })));
      setDefinitions(next); setSelectedId(""); setEditing(null); toast.success("Badge deleted");
    } catch (e) { toast.error(e instanceof Error ? e.message : "Could not delete badge"); }
    finally { setSaving(false); }
  };

  if (loading || isAdmin === null) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (!isAdmin) return <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-5 text-center"><h1 className="font-display text-2xl font-bold">Staff only</h1><p className="max-w-sm text-muted-foreground">This area is restricted to Spider Wensors staff accounts.</p><Link to="/admin" className="btn-primary">Back to admin</Link></div>;

  return <div className="relative min-h-screen"><div className="aura pointer-events-none absolute inset-0 -z-10" />
    <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-6"><div><h1 className="font-display text-xl font-bold"><span className="text-red-500">Spider</span> Badges</h1><p className="text-xs text-muted-foreground">Edit every badge and assign it to players.</p></div><Link to="/admin" className="btn-ghost"><ArrowLeft className="h-4 w-4" /> Admin</Link></header>
    <main className="mx-auto max-w-6xl space-y-5 px-5 pb-20">
      <div className="grid gap-5 lg:grid-cols-[290px_1fr]">
        <aside className="glass-panel overflow-hidden"><div className="border-b border-white/[.07] p-4"><div className="flex items-center gap-2"><Award className="h-5 w-5 text-red-400" /><h2 className="font-display font-bold">All badges</h2></div><div className="mt-3 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2"><Search className="h-4 w-4 text-white/40" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search badges" className="w-full bg-transparent text-sm text-white outline-none" /></div></div><div className="max-h-[620px] space-y-1 overflow-auto p-2">{visibleBadges.map((badge) => <button key={badge.id} onClick={() => selectBadge(badge)} className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${selectedId === badge.id ? "bg-red-500/10 ring-1 ring-red-500/30" : "hover:bg-white/5"}`}><div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-black/30 text-xl" style={{ color: badge.color, filter: `drop-shadow(0 0 8px ${badge.glowColor || badge.color})` }}>{badge.imageUrl ? <img src={badge.imageUrl} alt="" className="h-7 w-7 object-contain" /> : badge.emoji || "★"}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{badge.name}</p><p className="truncate text-[11px] text-muted-foreground">{badge.description}</p></div>{PROFILE_BADGES.some((b) => b.id === badge.id) && <span className="rounded-full bg-white/5 px-2 py-1 text-[9px] font-bold text-white/40">BUILT-IN</span>}</button>)}</div></aside>
        <section className="glass-panel overflow-hidden">
          {!editing ? <div className="flex min-h-[360px] flex-col items-center justify-center p-8 text-center"><Award className="h-12 w-12 text-red-400/70" /><h2 className="mt-3 font-display text-xl font-bold">Choose a badge</h2><p className="mt-1 max-w-sm text-sm text-muted-foreground">Click any badge on the left to open its editor.</p></div> : <div>
            <div className="flex flex-col gap-4 border-b border-white/[.07] p-5 sm:flex-row sm:items-center sm:justify-between"><BadgePreview badge={editing} /><div className="flex gap-2"><button type="button" onClick={() => void saveBadge()} disabled={saving} className="btn-primary">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Save</button>{!PROFILE_BADGES.some((b) => b.id === editing.id) && <button type="button" onClick={() => void deleteCustom()} disabled={saving} className="rounded-xl border border-red-500/20 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10"><Trash2 className="mr-1 inline h-4 w-4" />Delete</button>}</div></div>
            <div className="grid gap-4 p-5 sm:grid-cols-2"><label className="text-xs text-white/55">Badge name<input className={input} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></label><label className="text-xs text-white/55">Description<input className={input} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></label><label className="text-xs text-white/55">Icon key<input className={input} value={editing.icon} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} placeholder="award" /></label><label className="text-xs text-white/55">Emoji<input className={input} value={editing.emoji || ""} onChange={(e) => setEditing({ ...editing, emoji: e.target.value })} maxLength={8} /><span className="mt-2 flex flex-wrap gap-1">{emojis.map((x) => <button type="button" key={x} onClick={() => setEditing({ ...editing, emoji: x })} className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-base hover:bg-white/10">{x}</button>)}</span></label><label className="text-xs text-white/55">Icon / image URL<input className={input} value={editing.imageUrl?.startsWith("data:image/") ? "Uploaded image" : editing.imageUrl || ""} disabled={editing.imageUrl?.startsWith("data:image/")} onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })} placeholder="https://example.com/badge.png" /><span className="mt-2 block text-[10px] text-white/30">Upload max 400 KB</span></label><div className="flex items-end gap-2"><input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml" className="hidden" onChange={(e) => uploadImage(e.target.files?.[0])} /><button type="button" onClick={() => fileRef.current?.click()} className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-semibold text-white hover:bg-white/10"><Upload className="mr-1 inline h-4 w-4" />Upload image</button><button type="button" onClick={() => { setEditing({ ...editing, imageUrl: undefined }); if (fileRef.current) fileRef.current.value = ""; }} className="rounded-xl border border-white/10 px-3 py-2.5 text-white/50 hover:bg-white/5" title="Clear image"><X className="h-4 w-4" /></button></div><label className="text-xs text-white/55">Badge color<input type="color" className="mt-1 h-11 w-full rounded-xl border border-white/10 bg-black/20 p-1" value={editing.color} onChange={(e) => setEditing({ ...editing, color: e.target.value })} /></label><label className="text-xs text-white/55">Glow color<input type="color" className="mt-1 h-11 w-full rounded-xl border border-white/10 bg-black/20 p-1" value={editing.glowColor || editing.color} onChange={(e) => setEditing({ ...editing, glowColor: e.target.value })} /></label></div>
            <div className="border-t border-white/[.07] p-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="font-display font-bold">Assign <span className="text-red-400">{editing.name}</span> to players</h3><p className="text-xs text-muted-foreground">Click a player below to assign or remove this badge.</p></div><div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2"><Search className="h-4 w-4 text-white/40" /><input value={memberQuery} onChange={(e) => setMemberQuery(e.target.value)} placeholder="Search players" className="w-full bg-transparent text-sm text-white outline-none sm:w-52" /></div></div><div className="mt-4 grid gap-2 sm:grid-cols-2">{visibleMembers.map((p) => { const assigned = assignedIds.has(p.id); return <button key={p.id} type="button" onClick={() => void assignToMember(p)} disabled={busyMember === p.id} className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${assigned ? "border-red-500/30 bg-red-500/10" : "border-white/10 bg-black/15 hover:bg-white/5"}`}><div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-white/5">{p.avatar_url ? <img src={p.avatar_url} alt="" className="h-full w-full object-cover" /> : (p.display_name || p.username || "?").slice(0, 1).toUpperCase()}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{p.display_name || p.username || "Unnamed"}</p><p className="truncate text-[11px] text-muted-foreground">@{p.username || "—"}</p></div>{busyMember === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : assigned ? <Check className="h-4 w-4 text-red-400" /> : <span className="text-[10px] text-white/30">ADD</span>}</button>; })}</div>{visibleMembers.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No players found.</p>}</div>
          </div>}
        </section>
      </div>
    </main>
  </div>;
}
