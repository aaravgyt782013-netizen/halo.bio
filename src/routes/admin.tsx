import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Search,
  Users,
  Eye,
  MousePointerClick,
  Link2,
  Crown,
  Ban,
  Flag,
  Trash2,
  ArrowLeft,
  X,
  AlertTriangle,
  ExternalLink,
  Award,
  KeyRound,
  EyeOff,
} from "lucide-react";
import { db, type Profile } from "@/lib/bio";
import { useAuth, useIsAdmin } from "@/hooks/useAuth";
import { AdminBadgeManager } from "@/components/AdminBadgeManager";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Staff portal — Spider Wensors" },
      { name: "description", content: "Spider Wensors staff portal for user management, moderation and badges." },
      { property: "og:title", content: "Staff portal — Spider Wensors" },
      { property: "og:description", content: "Manage users, premium tiers, moderation and profile badges." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Stats = { total_profiles: number; active_profiles: number; total_views: number; total_clicks: number; total_links: number };
type FilterCategory = "all" | "flagged" | "pro" | "banned";
type PasswordTarget = Profile;

const ADMIN_CSRF = { "X-Requested-With": "halo-app" };

async function adminProfileMutation(targetUserId: string, changes: Partial<Profile>) {
  const res = await fetch("/api/admin/profile-mutate", {
    method: "POST",
    headers: { "content-type": "application/json", ...ADMIN_CSRF },
    credentials: "include",
    body: JSON.stringify({ targetUserId, changes }),
  });
  const data = (await res.json().catch(() => ({}))) as { success?: boolean; error?: string };
  if (!res.ok || !data.success) throw new Error(data.error || "Admin change failed");
  return data;
}

async function adminDeleteProfile(targetUserId: string) {
  const res = await fetch("/api/admin/delete-profile", {
    method: "POST",
    headers: { "content-type": "application/json", ...ADMIN_CSRF },
    credentials: "include",
    body: JSON.stringify({ targetUserId }),
  });
  const data = (await res.json().catch(() => ({}))) as { success?: boolean; error?: string };
  if (!res.ok || !data.success) throw new Error(data.error || "Could not delete profile");
}

function AdminPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const isAdmin = useIsAdmin(user?.id, user?.email);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [q, setQ] = useState("");
  const [filterTab, setFilterTab] = useState<FilterCategory>("all");
  const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null);
  const [passwordTarget, setPasswordTarget] = useState<PasswordTarget | null>(null);
  const [passwordEmail, setPasswordEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [badgeTarget, setBadgeTarget] = useState<Profile | null>(null);
  const [busy, setBusy] = useState(true);

  const load = useCallback(async () => {
    const [{ data: rows }, { data: statRows }] = await Promise.all([
      db.from("profiles").select("*").order("created_at", { ascending: false }).limit(500),
      db.rpc("platform_stats"),
    ]);
    setProfiles((rows ?? []) as Profile[]);
    setStats((statRows?.[0] ?? null) as Stats | null);
    setBusy(false);
  }, []);

  useEffect(() => { if (!loading && !user) navigate({ to: "/auth" }); }, [loading, user, navigate]);
  useEffect(() => { if (isAdmin) void load(); if (isAdmin === false) setBusy(false); }, [isAdmin, load]);

  const mutate = async (id: string, changes: Partial<Profile>, message: string) => {
    const previous = profiles;
    setProfiles((p) => p.map((x) => (x.id === id ? { ...x, ...changes } : x)));
    try {
      await adminProfileMutation(id, changes);
      toast.success(message);
      window.dispatchEvent(new Event("halo-store-updated"));
    } catch (error) {
      setProfiles(previous);
      toast.error(error instanceof Error ? error.message : "Action failed");
    }
  };

  const removeProfile = async (id: string) => {
    try {
      await adminDeleteProfile(id);
      setProfiles((p) => p.filter((x) => x.id !== id));
      setProfileToDelete(null);
      toast.success("Profile permanently deleted");
      window.dispatchEvent(new Event("halo-store-updated"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete profile");
    }
  };

  const openPasswordModal = (profile: Profile) => {
    setPasswordTarget(profile);
    setPasswordEmail("");
    setNewPassword("");
    setShowNewPassword(false);
  };
  const closePasswordModal = () => {
    if (passwordBusy) return;
    setPasswordTarget(null);
    setPasswordEmail("");
    setNewPassword("");
    setShowNewPassword(false);
  };
  const changeMemberPassword = async () => {
    if (!passwordTarget) return;
    const email = passwordEmail.trim().toLowerCase();
    if (!email || !email.includes("@")) return toast.error("Enter the member's email address");
    if (newPassword.length < 6) return toast.error("Password must be at least 6 characters long");
    if (newPassword.length > 128) return toast.error("Password must be 128 characters or less");
    setPasswordBusy(true);
    try {
      const res = await fetch("/api/admin/profile-mutate", { method: "POST", headers: { "content-type": "application/json", ...ADMIN_CSRF }, credentials: "include", body: JSON.stringify({ targetUserId: passwordTarget.id, changes: { __adminPassword: { email, password: newPassword } } }) });
      const data = (await res.json().catch(() => ({}))) as { success?: boolean; error?: string };
      if (!res.ok || !data.success) { toast.error(data.error || "Could not change member password"); return; }
      toast.success(`Password changed for @${passwordTarget.username ?? passwordTarget.display_name ?? "member"}`);
      closePasswordModal();
    } catch { toast.error("Network error while changing password"); }
    finally { setPasswordBusy(false); }
  };

  const openBadgeManager = (profile: Profile) => {
    setBadgeTarget(profile);
    window.setTimeout(() => document.getElementById("manage-badges")?.scrollIntoView({ behavior: "smooth", block: "start" }), 40);
  };

  if (loading || isAdmin === null || busy) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (!isAdmin) return <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-5 text-center"><h1 className="font-display text-2xl font-bold">Staff only</h1><p className="max-w-sm text-muted-foreground">This portal is restricted to Spider Wensors staff accounts.</p><Link to="/dashboard" className="btn-primary">Back to builder</Link></div>;

  const flaggedCount = profiles.filter((p) => p.is_flagged).length;
  const proCount = profiles.filter((p) => p.is_premium).length;
  const bannedCount = profiles.filter((p) => p.is_banned).length;
  const filtered = profiles.filter((p) => {
    const matchesQuery = `${p.username ?? ""} ${p.display_name ?? ""}`.toLowerCase().includes(q.toLowerCase());
    if (!matchesQuery) return false;
    if (filterTab === "flagged") return p.is_flagged;
    if (filterTab === "pro") return p.is_premium;
    if (filterTab === "banned") return p.is_banned;
    return true;
  });

  return <div className="relative min-h-screen">
    <div className="aura pointer-events-none absolute inset-0 -z-10" />
    <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6"><div><h1 className="font-display text-xl font-bold"><span className="text-red-500">Spider</span> Staff Portal</h1><p className="text-xs text-muted-foreground">User directory, moderation, tiers & profile badges</p></div><div className="flex items-center gap-2"><button type="button" onClick={() => openBadgeManager(profiles[0] ?? { id: "" } as Profile)} className="btn-primary"><Award className="h-4 w-4" /> Manage Badges</button><Link to="/dashboard" className="btn-ghost"><ArrowLeft className="h-4 w-4" /> Builder</Link></div></header>
    <main className="mx-auto max-w-6xl space-y-6 px-5 pb-20">
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"><StatCard icon={Users} label="Total users" value={stats?.total_profiles ?? 0} /><StatCard icon={Users} label="Active profiles" value={stats?.active_profiles ?? 0} /><StatCard icon={Eye} label="Page views" value={stats?.total_views ?? 0} /><StatCard icon={MousePointerClick} label="Link clicks" value={stats?.total_clicks ?? 0} /><StatCard icon={Link2} label="Links created" value={stats?.total_links ?? 0} /></section>
      <section className="glass-panel p-5 sm:p-6 shadow-lift">
        <div className="mb-4 flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center"><div className="flex flex-1 items-center gap-2 rounded-xl border border-input bg-card px-4 py-2"><Search className="h-4 w-4 text-muted-foreground" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search username or display name…" aria-label="Search users" className="flex-1 bg-transparent text-sm outline-none" /></div><div className="flex gap-1 rounded-xl bg-secondary/80 p-1">{([["all", `All (${profiles.length})`],["flagged", `Flagged (${flaggedCount})`],["pro", `Pro (${proCount})`],["banned", `Banned (${bannedCount})`]] as const).map(([key, label]) => <button key={key} type="button" onClick={() => setFilterTab(key)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${filterTab === key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{label}</button>)}</div></div>
        <div className="space-y-2.5">
          {filtered.length === 0 && <div className="py-12 text-center text-sm text-muted-foreground">No profiles match your filter criteria.</div>}
          {filtered.map((p) => <div key={p.id} className="surface flex flex-wrap items-center gap-3 rounded-xl border border-border/70 p-3.5">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-secondary">{p.avatar_url ? <img src={p.avatar_url} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-xs font-bold text-muted-foreground">{(p.display_name ?? p.username ?? "?").slice(0, 1).toUpperCase()}</div>}</div>
            <div className="min-w-40 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="text-sm font-semibold">{p.username ? `@${p.username}` : "— no username —"}</span>{p.is_premium && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">PRO</span>}{p.is_banned && <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold text-destructive">BANNED</span>}{p.is_flagged && <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-600">FLAGGED</span>}</div><p className="mt-0.5 text-xs text-muted-foreground">{p.display_name ?? "unnamed"} · {p.views || 0} views</p><div className="mt-1 flex flex-wrap items-center gap-3"><button type="button" onClick={() => openBadgeManager(p)} className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-400 hover:text-red-300"><Award className="h-3 w-3" /> Manage badges</button><button type="button" onClick={() => openPasswordModal(p)} className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:opacity-80"><KeyRound className="h-3 w-3" /> Change password</button></div></div>
            <div className="flex flex-wrap items-center gap-1.5">{p.username && <Link to="/$username" params={{ username: p.username }} target="_blank" className="btn-ghost p-2 text-muted-foreground hover:text-foreground" title="View public profile"><ExternalLink className="h-4 w-4" /></Link>}<IconAction icon={Crown} label={p.is_premium ? "Remove Pro" : "Grant Pro"} onClick={() => void mutate(p.id, { is_premium: !p.is_premium }, p.is_premium ? "Pro removed" : "Pro granted")} active={p.is_premium} /><IconAction icon={Flag} label={p.is_flagged ? "Unflag" : "Flag content"} onClick={() => void mutate(p.id, { is_flagged: !p.is_flagged }, p.is_flagged ? "Flag cleared" : "Flagged for review")} active={p.is_flagged} /><IconAction icon={Ban} label={p.is_banned ? "Unban" : "Suspend"} onClick={() => void mutate(p.id, { is_banned: !p.is_banned }, p.is_banned ? "Account restored" : "Account suspended")} active={p.is_banned} />{p.avatar_url && <button onClick={() => void mutate(p.id, { avatar_url: null }, "Avatar removed")} className="rounded-lg bg-secondary px-2.5 py-1 text-xs font-semibold hover:bg-accent">Reset avatar</button>}<IconAction icon={Trash2} label="Delete profile" destructive onClick={() => setProfileToDelete(p)} /></div>
          </div>)}
        </div>
      </section>

      <div className="scroll-mt-6">
        {badgeTarget ? <AdminBadgeManager initialMemberId={badgeTarget.id} /> : <section className="glass-panel border-dashed p-6 text-center"><Award className="mx-auto h-8 w-8 text-red-400" /><h2 className="mt-2 font-display text-lg font-bold">Manage Badges</h2><p className="mt-1 text-sm text-muted-foreground">Choose a member above and tap “Manage badges” to open the badge manager here.</p></section>}
      </div>
    </main>
    {profileToDelete && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"><div className="glass-panel relative w-full max-w-sm p-6 shadow-lift"><button type="button" onClick={() => setProfileToDelete(null)} className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button><div className="mb-2 flex items-center gap-2 text-destructive"><AlertTriangle className="h-5 w-5" /><h3 className="font-display text-lg font-bold">Delete Profile?</h3></div><p className="text-sm text-muted-foreground">Are you sure you want to permanently delete profile <strong className="text-foreground">@{profileToDelete.username ?? profileToDelete.id}</strong>? This action cannot be undone and deletes all associated links.</p><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setProfileToDelete(null)} className="btn-ghost text-xs">Cancel</button><button type="button" onClick={() => void removeProfile(profileToDelete.id)} className="rounded-xl bg-destructive px-4 py-2 text-xs font-semibold text-destructive-foreground hover:opacity-90">Delete Profile</button></div></div></div>}
    {passwordTarget && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"><div className="glass-panel relative w-full max-w-md p-6 shadow-lift"><button type="button" onClick={closePasswordModal} disabled={passwordBusy} className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:text-foreground disabled:opacity-50"><X className="h-4 w-4" /></button><div className="mb-5"><div className="mb-2 flex items-center gap-2"><div className="rounded-xl bg-primary/10 p-2 text-primary"><KeyRound className="h-5 w-5" /></div><div><h3 className="font-display text-lg font-bold">Change Member Password</h3><p className="text-xs text-muted-foreground">Selected member: @{passwordTarget.username ?? passwordTarget.display_name ?? "member"}</p></div></div></div><div className="space-y-4"><div><label className="mb-1.5 block text-xs font-semibold">Member email</label><input type="email" value={passwordEmail} onChange={(e) => setPasswordEmail(e.target.value)} placeholder="user@example.com" autoComplete="off" className="w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm outline-none focus:border-primary" /></div><div><label className="mb-1.5 block text-xs font-semibold">New password</label><div className="relative"><input type={showNewPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter a new password" autoComplete="new-password" className="w-full rounded-xl border border-input bg-card px-3.5 py-2.5 pr-11 text-sm outline-none focus:border-primary" /><button type="button" onClick={() => setShowNewPassword((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted-foreground hover:text-foreground" aria-label={showNewPassword ? "Hide password" : "Show password"}>{showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div><p className="mt-1.5 text-[11px] text-muted-foreground">6–128 characters. The password is securely hashed on the server.</p></div></div><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={closePasswordModal} disabled={passwordBusy} className="btn-ghost text-xs">Cancel</button><button type="button" onClick={changeMemberPassword} disabled={passwordBusy} className="btn-primary text-xs disabled:opacity-60">{passwordBusy ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Changing…</> : <><KeyRound className="h-3.5 w-3.5" /> Change Password</>}</button></div></div></div>}
  </div>;
}

function StatCard({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: number }) { return <div className="glass-panel p-4"><Icon className="h-4 w-4 text-primary" /><p className="mt-2 font-display text-2xl font-bold">{value.toLocaleString()}</p><p className="text-xs text-muted-foreground">{label}</p></div>; }
function IconAction({ icon: Icon, label, onClick, active, destructive }: { icon: typeof Crown; label: string; onClick: () => void; active?: boolean; destructive?: boolean }) { return <button onClick={onClick} title={label} aria-label={label} className={`rounded-full p-2 transition-colors ${destructive ? "text-muted-foreground hover:bg-destructive/10 hover:text-destructive" : active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}><Icon className="h-4 w-4" /></button>; }
