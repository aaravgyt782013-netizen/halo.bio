import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Award, Loader2, Plus, ArrowLeft, Pencil } from "lucide-react";
import { type Profile, type SocialLink } from "@/lib/bio";
import { PROFILE_BADGES, type ProfileBadge } from "@/lib/profileBadges";
import { useAuth, useIsAdmin } from "@/hooks/useAuth";

export const Route = createFileRoute("/admin-badges")({ component: AdminBadges });
const DEFINITION_PLATFORM = "__spider_badge_definition__";
const ADMIN_HEADERS = { "X-Requested-With": "halo-app" };
function readDefinitions(links?: SocialLink[] | null): ProfileBadge[] {
  return (links ?? []).flatMap((link) => {
    if (link.platform !== DEFINITION_PLATFORM) return [];
    try { const b = JSON.parse(link.icon_url || "") as ProfileBadge & { deleted?: boolean }; return b?.id && b?.name ? [b] : []; } catch { return []; }
  });
}
function mergeDefinitions(saved: ProfileBadge[]) {
  const map = new Map(PROFILE_BADGES.map((b) => [b.id, b]));
  const deleted = new Set(saved.filter((b) => (b as ProfileBadge & { deleted?: boolean }).deleted).map((b) => b.id));
  deleted.forEach((id) => map.delete(id));
  saved.filter((b) => !(b as ProfileBadge & { deleted?: boolean }).deleted).forEach((b) => map.set(b.id, b));
  return [...map.values()];
}
async function loadAdminProfiles(): Promise<Profile[]> {
  const response = await fetch("/api/admin/profiles", { credentials: "include", headers: ADMIN_HEADERS, cache: "no-store" });
  const data = (await response.json().catch(() => ({}))) as { profiles?: Profile[]; error?: string };
  if (!response.ok) throw new Error(data.error || "Could not load admin profiles");
  return Array.isArray(data.profiles) ? data.profiles : [];
}
function AdminBadges() {
  const { user, loading } = useAuth(); const isAdmin = useIsAdmin(user?.id, user?.email);
  const [badges, setBadges] = useState<ProfileBadge[]>(PROFILE_BADGES); const [busy, setBusy] = useState(true);
  useEffect(() => { if (!isAdmin || !user) return; void loadAdminProfiles().then((profiles) => { const owner = profiles.find((p) => p.id === user.id); setBadges(mergeDefinitions(readDefinitions(owner?.social_links))); }).catch((error) => console.warn("Could not load badge definitions:", error)).finally(() => setBusy(false)); }, [isAdmin, user]);
  if (loading || isAdmin === null || busy) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!isAdmin) return <div className="flex min-h-screen items-center justify-center p-5"><div className="glass-panel p-8 text-center"><h1 className="text-xl font-bold">Admin only</h1><Link to="/dashboard" className="btn-primary mt-5">Back to dashboard</Link></div></div>;
  return <div className="min-h-screen bg-[#070707] text-white"><header className="sticky top-0 z-20 border-b border-white/10 bg-black/80 px-4 py-4 backdrop-blur-xl"><div className="mx-auto flex max-w-6xl items-center justify-between gap-3"><Link to="/admin" className="btn-ghost"><ArrowLeft className="h-4 w-4" /> Admin</Link><div className="text-center"><h1 className="font-display text-xl font-bold">Badge Manager</h1><p className="text-xs text-white/45">Select a badge to edit its details and players</p></div><Link to="/badge-studio" className="btn-primary"><Plus className="h-4 w-4" /> New badge</Link></div></header><main className="mx-auto max-w-6xl px-4 py-7"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{badges.map((badge) => <a key={badge.id} href={`/admin-badges/${encodeURIComponent(badge.id)}`} className="group block w-full rounded-2xl border border-white/10 bg-white/[.035] p-4 text-left transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[.06] active:scale-[.99]"><div className="flex items-center gap-3"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border" style={{ color: badge.color, borderColor: `${badge.glowColor || badge.color}80`, boxShadow: `0 0 12px ${badge.glowColor || badge.color}70, 0 0 28px ${badge.glowColor || badge.color}35` }}>{badge.imageUrl ? <img src={badge.imageUrl} alt="" className="h-8 w-8 object-contain" /> : badge.emoji ? <span className="text-2xl">{badge.emoji}</span> : <Award className="h-7 w-7" />}</div><div className="min-w-0 flex-1"><h2 className="truncate font-semibold group-hover:text-red-300">{badge.name}</h2><p className="truncate text-xs text-white/45">{badge.description || "No description"}</p></div><span className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-[10px] font-semibold text-white/55 group-hover:text-white"><Pencil className="h-3 w-3" /> Edit</span></div></a>)}</div></main></div>;
}
