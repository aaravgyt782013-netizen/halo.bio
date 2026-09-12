import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Award, Check, Link2, Plus, Search, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { db, type Profile } from "@/lib/bio";
import { extractBadges, mergeBadges, PROFILE_BADGES, type ProfileBadge } from "@/lib/profileBadges";
import { useAuth, useIsAdmin } from "@/hooks/useAuth";

const DEFINITION_PLATFORM = "__spider_badge_definition__";
const emojiPresets = ["⭐", "🔥", "💎", "👑", "⚡", "💫", "🎯", "🚀", "🏆", "🛡️", "💙", "❤️"];
const input = "mt-1 w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 text-sm text-white outline-none transition focus:border-red-500/50";
const ADMIN_CSRF = { "X-Requested-With": "halo-app" };

function readDefinitions(links: any[] | null | undefined): ProfileBadge[] {
  return (links ?? []).flatMap((link) => {
    if (link.platform !== DEFINITION_PLATFORM) return [];
    try { const badge = JSON.parse(link.icon_url || "") as ProfileBadge; return badge?.id && badge?.name ? [badge] : []; } catch { return []; }
  });
}

function saveDefinitions(links: any[] | null | undefined, badges: ProfileBadge[]) {
  const normal = (links ?? []).filter((link) => link.platform !== DEFINITION_PLATFORM);
  return [...normal, ...badges.map((badge) => ({ id: `badge-definition:${badge.id}`, platform: DEFINITION_PLATFORM, url: badge.id, title: badge.name, icon_url: JSON.stringify(badge), active: false }))];
}

function imageFromBadge(badge: ProfileBadge) {
  if (badge.imageUrl) return <img src={badge.imageUrl} alt="" className="h-7 w-7 object-contain" />;
  return <span>{badge.emoji || "★"}</span>;
}

async function adminProfileMutation(targetUserId: string, changes: Partial<Profile>) {
  const res = await fetch("/api/admin/profile-mutate", {
    method: "POST",
    headers: { "content-type": "application/json", ...ADMIN_CSRF },
    credentials: "include",
    body: JSON.stringify({ targetUserId, changes }),
  });
  const data = (await res.json().catch(() => ({}))) as { success?: boolean; error?: string };
  if (!res.ok || !data.success) throw new Error(data.error || "Could not save admin change");
}

export function AdminBadgeManager({ initialMemberId = "" }: { initialMemberId?: string }) {
  const { user } = useAuth();
  const isAdmin = useIsAdmin(user?.id);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [definitions, setDefinitions] = useState<ProfileBadge[]>(PROFILE_BADGES);
  const [selectedId, setSelectedId] = useState(initialMemberId);
  const [memberQuery, setMemberQuery] = useState("");
  const [badgeQuery, setBadgeQuery] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState("⭐");
  const [imageUrl, setImageUrl] = useState("");
  const [color, setColor] = useState("#ef4444");
  const [glowColor, setGlowColor] = useState("#ef4444");
  const [saving, setSaving] = useState(false);
  const [busyBadge, setBusyBadge] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const { data, error } = await db.from("profiles").select("*").order("created_at", { ascending: false }).limit(500);
    if (error) { toast.error("Could not load members"); return; }
    const rows = (data ?? []) as Profile[];
    setProfiles(rows);
    setSelectedId((current) => current || initialMemberId || rows[0]?.id || "");
    const owner = rows.find((p) => p.id === user?.id);
    const custom = readDefinitions(owner?.social_links);
    if (custom.length) {
      const map = new Map(custom.map((b) => [b.id, b]));
      setDefinitions([...PROFILE_BADGES.map((b) => map.get(b.id) ?? b), ...custom.filter((b) => !PROFILE_BADGES.some((x) => x.id === b.id))]);
    }
  }, [initialMemberId, user?.id]);

  useEffect(() => { if (isAdmin) void load(); }, [isAdmin, load]);
  useEffect(() => { if (initialMemberId) setSelectedId(initialMemberId); }, [initialMemberId]);

  const selected = profiles.find((p) => p.id === selectedId) ?? null;
  const assigned = selected ? extractBadges(selected.social_links) : [];
  const visibleMembers = useMemo(() => profiles.filter((p) => `${p.username ?? ""} ${p.display_name ?? ""}`.toLowerCase().includes(memberQuery.toLowerCase())), [profiles, memberQuery]);
  const visibleBadges = useMemo(() => definitions.filter((b) => `${b.name} ${b.description}`.toLowerCase().includes(badgeQuery.toLowerCase())), [definitions, badgeQuery]);

  const persistDefinitions = async (next: ProfileBadge[]) => {
    const owner = profiles.find((p) => p.id === user?.id);
    if (!owner) throw new Error("Owner profile not found");
    const { error } = await db.from("profiles").update({ social_links: saveDefinitions(owner.social_links, next) }).eq("id", owner.id);
    if (error) throw new Error(error.message || "Could not save badge definitions");
    setProfiles((items) => items.map((p) => p.id === owner.id ? { ...p, social_links: saveDefinitions(p.social_links, next) } : p));
    setDefinitions(next);
    window.dispatchEvent(new Event("halo-store-updated"));
  };

  const readImageFile = (file: File) => new Promise<string>((resolve, reject) => {
    if (!file.type.startsWith("image/")) return reject(new Error("Choose an image file"));
    if (file.size > 400 * 1024) return reject(new Error("Badge image must be 400 KB or smaller"));
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Could not read image"));
    reader.onerror = () => reject(new Error("Could not read image"));
    reader.readAsDataURL(file);
  });

  const handleUpload = async (file?: File) => {
    if (!file) return;
    try { setImageUrl(await readImageFile(file)); toast.success("Badge image loaded"); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Could not load image"); }
  };

  const createBadge = async () => {
    const cleanName = name.trim();
    const cleanImage = imageUrl.trim();
    if (!cleanName) return toast.error("Enter a badge name");
    if (!emoji.trim() && !cleanImage) return toast.error("Add an emoji or badge image");
    if (cleanImage && !/^https?:\/\//i.test(cleanImage) && !cleanImage.startsWith("data:image/")) return toast.error("Badge image URL must start with http:// or https://");
    const idBase = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const badge: ProfileBadge = { id: `${idBase || "custom"}-${Date.now().toString(36)}`, name: cleanName, description: description.trim() || "Custom Spider Wensors badge.", icon: "award", emoji: emoji.trim() ? emoji.trim().slice(0, 8) : undefined, imageUrl: cleanImage || undefined, color, glowColor };
    setSaving(true);
    try { await persistDefinitions([...definitions, badge]); setName(""); setDescription(""); setEmoji("⭐"); setImageUrl(""); if (fileRef.current) fileRef.current.value = ""; toast.success(`${cleanName} badge created`); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Could not create badge"); }
    finally { setSaving(false); }
  };

  const assign = async (badge: ProfileBadge) => {
    if (!selected) return;
    setBusyBadge(badge.id);
    const previousLinks = selected.social_links;
    const current = extractBadges(previousLinks);
    const isAssigned = current.some((b) => b.id === badge.id);
    const next = isAssigned ? current.filter((b) => b.id !== badge.id) : [...current, badge];
    const socialLinks = mergeBadges(previousLinks, next);
    setProfiles((items) => items.map((p) => p.id === selected.id ? { ...p, social_links: socialLinks } : p));
    try {
      await adminProfileMutation(selected.id, { social_links: socialLinks });
      toast.success(isAssigned ? "Badge removed" : "Badge assigned");
      window.dispatchEvent(new Event("halo-store-updated"));
    } catch (error) {
      setProfiles((items) => items.map((p) => p.id === selected.id ? { ...p, social_links: previousLinks } : p));
      toast.error(error instanceof Error ? error.message : "Could not update member badge");
    } finally {
      setBusyBadge(null);
    }
  };

  const deleteBadge = async (badge: ProfileBadge) => {
    if (PROFILE_BADGES.some((b) => b.id === badge.id)) return toast.error("Built-in badges cannot be deleted");
    setSaving(true);
    try {
      const next = definitions.filter((b) => b.id !== badge.id);
      await persistDefinitions(next);
      for (const p of profiles) {
        const current = extractBadges(p.social_links);
        if (current.some((b) => b.id === badge.id)) {
          const nextLinks = mergeBadges(p.social_links, current.filter((b) => b.id !== badge.id));
          await adminProfileMutation(p.id, { social_links: nextLinks });
        }
      }
      setProfiles((items) => items.map((p) => ({ ...p, social_links: mergeBadges(p.social_links, extractBadges(p.social_links).filter((b) => b.id !== badge.id)) })));
      window.dispatchEvent(new Event("halo-store-updated"));
      toast.success("Custom badge deleted");
    } catch (e) { toast.error(e instanceof Error ? e.message : "Could not delete badge"); }
    finally { setSaving(false); }
  };

  if (isAdmin !== true) return null;

  return <section className="glass-panel overflow-hidden" id="manage-badges">
    <div className="border-b border-white/[.07] bg-black/20 px-5 py-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><div><div className="flex items-center gap-2"><Award className="h-5 w-5 text-red-400" /><h2 className="font-display text-lg font-bold">Manage Badges</h2></div><p className="mt-1 text-xs text-muted-foreground">Create badges with emoji, uploaded images, or image URLs, then assign them to members.</p></div><div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2"><Search className="h-4 w-4 text-white/40" /><input value={memberQuery} onChange={(e) => setMemberQuery(e.target.value)} placeholder="Search members" className="w-full bg-transparent text-sm text-white outline-none sm:w-56" /></div></div>
    </div>
    <div className="grid lg:grid-cols-[250px_1fr]">
      <aside className="border-b border-white/[.07] p-3 lg:border-b-0 lg:border-r"><div className="max-h-80 space-y-1 overflow-auto lg:max-h-[520px]">{visibleMembers.map((p) => <button key={p.id} onClick={() => setSelectedId(p.id)} className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${selectedId === p.id ? "bg-red-500/10 ring-1 ring-red-500/25" : "hover:bg-white/5"}`}><div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-white/5">{p.avatar_url ? <img src={p.avatar_url} alt="" className="h-full w-full object-cover" /> : (p.display_name || p.username || "?").slice(0,1).toUpperCase()}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{p.display_name || p.username || "Unnamed"}</p><p className="truncate text-[11px] text-muted-foreground">@{p.username || "—"}</p></div><span className="text-[11px] text-muted-foreground">{extractBadges(p.social_links).length}</span></button>)}</div></aside>
      <div className="space-y-4 p-5">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-red-400">Create new badge</p><p className="mt-1 text-sm text-white/50">Use an emoji, upload an image, or paste an image URL.</p></div><div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-white/10 bg-black/30 text-2xl" style={{ color, filter: `drop-shadow(0 0 12px ${glowColor})` }}>{imageUrl ? <img src={imageUrl} alt="Preview" className="h-9 w-9 object-contain" /> : emoji || "⭐"}</div></div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-xs text-white/55">Name<input className={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Creator" /></label><label className="text-xs text-white/55">Description<input className={input} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Special community badge" /></label>
            <label className="text-xs text-white/55">Emoji<input className={input} value={emoji} onChange={(e) => setEmoji(e.target.value)} placeholder="⭐" maxLength={8} /><span className="mt-2 flex flex-wrap gap-1">{emojiPresets.map((x) => <button type="button" key={x} onClick={() => setEmoji(x)} className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-base hover:bg-white/10">{x}</button>)}</span></label>
            <div className="space-y-2"><label className="text-xs text-white/55">Image URL<input className={input} value={imageUrl.startsWith("data:image/") ? "Uploaded image" : imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/badge.png" disabled={imageUrl.startsWith("data:image/")} /><span className="mt-1 flex items-center gap-1 text-[10px] text-white/30"><Link2 className="h-3 w-3" /> PNG, JPG, WEBP, GIF URL</span></label><input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml" className="hidden" onChange={(e) => void handleUpload(e.target.files?.[0])} /><div className="flex gap-2"><button type="button" onClick={() => fileRef.current?.click()} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-semibold text-white hover:bg-white/10"><Upload className="h-4 w-4" /> Upload image</button>{imageUrl && <button type="button" onClick={() => { setImageUrl(""); if (fileRef.current) fileRef.current.value = ""; }} className="rounded-xl border border-white/10 px-3 text-white/50 hover:bg-white/5 hover:text-white" title="Clear image"><X className="h-4 w-4" /></button>}</div></div>
            <div className="grid grid-cols-2 gap-2"><label className="text-xs text-white/55">Icon color<input type="color" className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-black/20 p-1" value={color} onChange={(e) => setColor(e.target.value)} /></label><label className="text-xs text-white/55">Glow color<input type="color" className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-black/20 p-1" value={glowColor} onChange={(e) => setGlowColor(e.target.value)} /></label></div>
          </div><button onClick={() => void createBadge()} disabled={saving} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold hover:bg-red-400 disabled:opacity-50"><Plus className="h-4 w-4" />{saving ? "Creating…" : "Create badge"}</button></div>
        <div><div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-red-400">Badges</p><p className="text-sm text-muted-foreground">Selected: {selected?.display_name || selected?.username || "none"} · click a badge to assign/remove</p></div><div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2"><Search className="h-4 w-4 text-white/40" /><input value={badgeQuery} onChange={(e) => setBadgeQuery(e.target.value)} placeholder="Search badges" className="w-40 bg-transparent text-sm outline-none" /></div></div><div className="grid gap-2 sm:grid-cols-2">{visibleBadges.map((badge) => { const active = assigned.some((b) => b.id === badge.id); return <div key={badge.id} className={`flex items-center gap-3 rounded-xl border p-3 ${active ? "border-red-500/30 bg-red-500/[.07]" : "border-white/10 bg-black/20"}`}><button type="button" onClick={() => void assign(badge)} disabled={!selected || busyBadge === badge.id} className="flex min-w-0 flex-1 items-center gap-3 text-left"><span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-black/30 text-xl" style={{ color: badge.color, filter: `drop-shadow(0 0 9px ${badge.glowColor || badge.color})` }}>{imageFromBadge(badge)}</span><span className="min-w-0"><span className="block truncate text-sm font-semibold">{badge.name}</span><span className="block truncate text-[11px] text-white/40">{badge.description}</span></span></button>{active && <Check className="h-4 w-4 shrink-0 text-red-400" />}{!PROFILE_BADGES.some((b) => b.id === badge.id) && <button type="button" onClick={() => void deleteBadge(badge)} disabled={saving} className="rounded-lg p-2 text-white/35 hover:bg-red-500/10 hover:text-red-400" title="Delete custom badge"><Trash2 className="h-4 w-4" /></button>}</div>; })}</div></div>
      </div>
    </div>
  </section>;
}
