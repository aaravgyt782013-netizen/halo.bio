import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Award, Loader2, Plus, ArrowLeft } from "lucide-react";
import { db, type Profile, type SocialLink } from "@/lib/bio";
import { PROFILE_BADGES, type ProfileBadge } from "@/lib/profileBadges";
import { useAuth, useIsAdmin } from "@/hooks/useAuth";

export const Route = createFileRoute("/admin-badges")({ component: AdminBadges });
const DEFINITION_PLATFORM = "__spider_badge_definition__";
const ADMIN_HEADERS = { "X-Requested-With": "halo-app" };
function readDefinitions(links?: SocialLink[] | null): ProfileBadge[] {
  return (links ?? []).flatMap((link) => {
    if (link.platform !== DEFINITION_PLATFORM) return [];
    try { const b = JSON.parse(link.icon_url || "") as ProfileBadge; return b?.id && b?.name ? [b] : []; } catch { return []; }
  });
}
function mergeDefinitions(saved: ProfileBadge[]) {
  const map = new Map(PROFILE_BADGES.map((b) => [b.id, b]));
  saved.forEach((b) => map.set(b.id, b));
  return [...map.values()];
}
async function loadAdminProfiles(): Promise<Profile[]> {
  const response = await fetch("/api/admin/profiles", { credentials: "include", headers: ADMIN_HEADERS, cache: "no-store" });
  const data = (await response.json().catch(() => ({}))) as { profiles?: Profile[]; error?: string };
  if (!response.ok) throw new Error(data.error || "Could not load admin profiles");
  return Array.isArray(data.profiles) ? data.profiles : [];
}
function AdminBadges() {
  const navigate = useNavigate(); const { user, loading } = useAuth(); const isAdmin = useIsAdmin(user?.id, user?.email);
  const [badges, setBadges] = useState<ProfileBadge[]>(PROFILE_BADGES); const [busy, setBusy] = useState(true);
  useEffect(() => { if (!loading && !user) navigate({ to: "/auth" }); }, [loading, user, navigate]);
  useEffect(() => {
    if (!isAdmin || !user) return;
    void loadAdminProfiles().then((profiles) => {
      const owner = profiles.find((p) => p.id === user.id);
      setBadges(mergeDefinitions(readDefinitions(owner?.social_links)));
    }).catch((error) => console.warn("Could not load badge definitions:", error)).finally(() => setBusy(false));
  }, [isAdmin, user]);
  if (loading || isAdmin === null || busy) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!isAdmin) return <div className="flex min-h-screen items-center justify-center p-5"><div className="glass-panel p-8 text-center"><h1 className="text-xl font-bold">Admin only</h1><Link to="/dashboard" className="btn-primary mt-5">Back to dashboard</Link></div></div>;
  return <div className="min-h-screen bg-[#070707] text-white"><header className="sticky top-0 z-20 border-b border-white/10 bg-black/80 px-4 py-4 backdrop-blur-xl"><div className="mx-auto flex max-w-6xl items-center justify-between gap-3"><Link to="/admin" className="btn-ghost"><ArrowLeft className="h-4 w-4" /> Admin</Link><div className="text-center"><h1 className="font-display text-xl font-bold">Badge Manager</h1><p className="text-xs text-white/45">Click a badge to open its editor</p></div><Link to="/badge-studio" className="btn-primary"><Plus className="h-4 w-4" /> New badge</Link></div></header><main className="mx-auto max-w-6xl px-4 py-7"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{badges.map((badge) => <Link key={badge.id} to="/admin-badges/$badgeId" params={{ badgeId: badge.id }} className="group rounded-2xl border border-white/10 bg-white/[.035] p-4 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[.06]"><div className="flex items-center gap-3"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border" style={{ color: badge.color, borderColor: `${badge.glowColor || badge.color}80`, boxShadow: `0 0 12px ${badge.glowColor || badge.color}70, 0 0 28px ${badge.glowColor || badge.color}35` }}>{badge.imageUrl ? <img src={badge.imageUrl} alt="" className="h-8 w-8 object-contain" /> : badge.emoji ? <span className="text-2xl">{badge.emoji}</span> : <Award className="h-7 w-7" />}</div><div className="min-w-0"><h2 className="truncate font-semibold group-hover:text-red-300">{badge.name}</h2><p className="truncate text-xs text-white/45">{badge.description || "No description"}</p></div></div></Link>)}</div></main></div>;
}
