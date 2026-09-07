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
} from "lucide-react";
import { db, type Profile } from "@/lib/bio";
import { useAuth, useIsAdmin } from "@/hooks/useAuth";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Staff portal — Halo" },
      { name: "description", content: "Internal Halo staff portal for user management and moderation." },
      { property: "og:title", content: "Staff portal — Halo" },
      { property: "og:description", content: "Manage users, premium tiers and flagged content." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Stats = {
  total_profiles: number;
  active_profiles: number;
  total_views: number;
  total_clicks: number;
  total_links: number;
};

function AdminPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const isAdmin = useIsAdmin(user?.id);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [q, setQ] = useState("");
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

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (isAdmin) void load();
    if (isAdmin === false) setBusy(false);
  }, [isAdmin, load]);

  const mutate = async (id: string, changes: Partial<Profile>, message: string) => {
    setProfiles((p) => p.map((x) => (x.id === id ? { ...x, ...changes } : x)));
    const { error } = await db.from("profiles").update(changes).eq("id", id);
    if (error) toast.error("Action failed");
    else toast.success(message);
  };

  const removeProfile = async (id: string) => {
    const { error } = await db.from("profiles").delete().eq("id", id);
    if (error) {
      toast.error("Could not delete profile");
      return;
    }
    setProfiles((p) => p.filter((x) => x.id !== id));
    toast.success("Profile deleted");
  };

  if (loading || isAdmin === null || busy) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-5 text-center">
        <h1 className="font-display text-2xl font-bold">Staff only</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          This portal is restricted to Halo staff accounts.
        </p>
        <Link to="/dashboard" className="btn-primary">
          Back to builder
        </Link>
      </div>
    );
  }

  const filtered = profiles.filter((p) =>
    `${p.username ?? ""} ${p.display_name ?? ""}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="relative min-h-screen">
      <div className="aura pointer-events-none absolute inset-0 -z-10" />

      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <div>
          <h1 className="font-display text-lg font-bold">Staff portal</h1>
          <p className="text-xs text-muted-foreground">Users, tiers and moderation</p>
        </div>
        <Link to="/dashboard" className="btn-ghost">
          <ArrowLeft className="h-4 w-4" /> Builder
        </Link>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-5 pb-20">
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard icon={Users} label="Total users" value={stats?.total_profiles ?? 0} />
          <StatCard icon={Users} label="Active profiles" value={stats?.active_profiles ?? 0} />
          <StatCard icon={Eye} label="Page views" value={stats?.total_views ?? 0} />
          <StatCard icon={MousePointerClick} label="Link clicks" value={stats?.total_clicks ?? 0} />
          <StatCard icon={Link2} label="Links created" value={stats?.total_links ?? 0} />
        </section>

        <section className="glass-panel p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2 rounded-full border border-input bg-card px-4 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search username or name"
              aria-label="Search users"
              className="flex-1 bg-transparent text-sm outline-none"
            />
          </div>

          <div className="space-y-2">
            {filtered.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">No users found.</p>
            )}
            {filtered.map((p) => (
              <div
                key={p.id}
                className="surface flex flex-wrap items-center gap-3 p-3"
              >
                <div className="h-10 w-10 overflow-hidden rounded-full bg-secondary">
                  {p.avatar_url && (
                    <img src={p.avatar_url} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-40 flex-1">
                  <p className="text-sm font-semibold">
                    {p.username ? `@${p.username}` : "— no username —"}
                    {p.is_premium && (
                      <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                        PRO
                      </span>
                    )}
                    {p.is_banned && (
                      <span className="ml-2 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold text-destructive">
                        BANNED
                      </span>
                    )}
                    {p.is_flagged && (
                      <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
                        FLAGGED
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {p.display_name ?? "unnamed"} · {p.views} views
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <IconAction
                    icon={Crown}
                    label={p.is_premium ? "Remove Pro" : "Grant Pro"}
                    onClick={() =>
                      mutate(
                        p.id,
                        { is_premium: !p.is_premium },
                        p.is_premium ? "Pro removed" : "Pro granted",
                      )
                    }
                    active={p.is_premium}
                  />
                  <IconAction
                    icon={Flag}
                    label={p.is_flagged ? "Unflag" : "Flag content"}
                    onClick={() =>
                      mutate(
                        p.id,
                        { is_flagged: !p.is_flagged },
                        p.is_flagged ? "Flag cleared" : "Flagged for review",
                      )
                    }
                    active={p.is_flagged}
                  />
                  <IconAction
                    icon={Ban}
                    label={p.is_banned ? "Unban" : "Suspend"}
                    onClick={() =>
                      mutate(
                        p.id,
                        { is_banned: !p.is_banned },
                        p.is_banned ? "Account restored" : "Account suspended",
                      )
                    }
                    active={p.is_banned}
                  />
                  {p.avatar_url && (
                    <button
                      onClick={() => mutate(p.id, { avatar_url: null }, "Avatar removed")}
                      className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold hover:bg-accent"
                    >
                      Remove avatar
                    </button>
                  )}
                  <IconAction
                    icon={Trash2}
                    label="Delete profile"
                    destructive
                    onClick={() => {
                      if (window.confirm(`Delete profile ${p.username ?? p.id}?`))
                        void removeProfile(p.id);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: number;
}) {
  return (
    <div className="glass-panel p-4">
      <Icon className="h-4 w-4 text-primary" />
      <p className="mt-2 font-display text-2xl font-bold">{value.toLocaleString()}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function IconAction({
  icon: Icon,
  label,
  onClick,
  active,
  destructive,
}: {
  icon: typeof Crown;
  label: string;
  onClick: () => void;
  active?: boolean;
  destructive?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`rounded-full p-2 transition-colors ${
        destructive
          ? "text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          : active
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
