import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Loader2, Search, Shield, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { db, type Profile } from "@/lib/bio";
import {
  mergeBadges,
  extractBadges,
  PROFILE_BADGES,
  type ProfileBadge,
} from "@/lib/profileBadges";
import { useAuth, useIsAdmin } from "@/hooks/useAuth";
import { ProfileBadges } from "@/components/ProfileBadges";

export const Route = createFileRoute("/badge-studio")({
  head: () => ({
    meta: [
      { title: "Badge Studio — Spider Website" },
      {
        name: "description",
        content: "Owner-only profile badge management for Spider Website.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BadgeStudio,
});

function BadgeCard({
  badge,
  active,
  onToggle,
  busy,
}: {
  badge: ProfileBadge;
  active: boolean;
  onToggle: () => void;
  busy: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={busy}
      className={`group flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all duration-200 ${
        active
          ? "border-red-500/35 bg-red-500/[0.08] shadow-[0_0_30px_rgba(239,68,68,0.08)]"
          : "border-white/[0.07] bg-white/[0.025] hover:border-white/[0.14] hover:bg-white/[0.045]"
      }`}
    >
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-xl shadow-inner"
        style={{ color: badge.color, boxShadow: `0 0 22px ${badge.color}20` }}
      >
        {badge.icon === "wrench" ? "🛠️" :
          badge.icon === "lightbulb" ? "💡" :
          badge.icon === "gem" ? "💎" :
          badge.icon === "badge-check" ? "✓" :
          badge.icon === "badge-dollar" ? "$" :
          badge.icon === "gift" ? "🎁" :
          badge.icon === "star" ? "★" :
          badge.icon === "rocket" ? "🚀" :
          badge.icon === "medal" ? "🏅" :
          badge.icon === "flame" ? "🔥" :
          badge.icon === "gauge" ? "◔" :
          badge.icon === "bug" ? "✦" :
          badge.icon === "sun" ? "☀" :
          badge.icon === "rabbit" ? "♢" :
          badge.icon === "snowflake" ? "❄" :
          badge.icon === "egg" ? "◉" :
          badge.icon === "candy-cane" ? "⌁" :
          badge.icon === "satellite" ? "◈" :
          badge.icon === "trophy" ? "🏆" : "◉"}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-foreground">{badge.name}</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
          {badge.description}
        </span>
      </span>
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors ${
          active
            ? "border-red-500/40 bg-red-500 text-white"
            : "border-white/10 bg-white/[0.03] text-transparent"
        }`}
      >
        <Check className="h-4 w-4" />
      </span>
    </button>
  );
}

function BadgeStudio() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const isAdmin = useIsAdmin(user?.id);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [query, setQuery] = useState("");
  const [badgeQuery, setBadgeQuery] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  const loadProfiles = useCallback(async () => {
    const { data, error } = await db
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) {
      toast.error("Could not load profiles");
      return;
    }
    const rows = (data ?? []) as Profile[];
    setProfiles(rows);
    if (!selectedId && rows[0]) setSelectedId(rows[0].id);
    setLoadingProfiles(false);
  }, [selectedId]);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (isAdmin) void loadProfiles();
    if (isAdmin === false) setLoadingProfiles(false);
  }, [isAdmin, loadProfiles]);

  const selected = profiles.find((p) => p.id === selectedId) ?? null;
  const assigned = useMemo(
    () => extractBadges(selected?.social_links),
    [selected?.social_links],
  );
  const assignedIds = useMemo(() => new Set(assigned.map((b) => b.id)), [assigned]);

  const visibleBadges = PROFILE_BADGES.filter((badge) => {
    const q = badgeQuery.trim().toLowerCase();
    return !q || `${badge.name} ${badge.description}`.toLowerCase().includes(q);
  });

  const visibleProfiles = profiles.filter((profile) =>
    `${profile.username ?? ""} ${profile.display_name ?? ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  const toggleBadge = async (badge: ProfileBadge) => {
    if (!selected) return;
    setBusy(badge.id);
    const current = extractBadges(selected.social_links);
    const next = current.some((x) => x.id === badge.id)
      ? current.filter((x) => x.id !== badge.id)
      : [...current, badge];

    const socialLinks = mergeBadges(selected.social_links, next);
    const { error } = await db
      .from("profiles")
      .update({ social_links: socialLinks })
      .eq("id", selected.id);

    if (error) {
      toast.error("Could not update badge");
    } else {
      setProfiles((items) =>
        items.map((p) =>
          p.id === selected.id ? { ...p, social_links: socialLinks } : p,
        ),
      );
      toast.success(
        next.some((x) => x.id === badge.id)
          ? `${badge.name} assigned`
          : `${badge.name} removed`,
      );
    }
    setBusy(null);
  };

  if (loading || isAdmin === null || loadingProfiles) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070707]">
        <Loader2 className="h-6 w-6 animate-spin text-red-500" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#070707] px-5 text-center">
        <Shield className="h-10 w-10 text-red-500" />
        <h1 className="text-2xl font-bold">Owner access only</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          The Badge Studio is restricted to Spider Website administrators.
        </p>
        <Link to="/dashboard" className="btn-primary">Back to builder</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070707] text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(239,68,68,0.12),transparent_35%),radial-gradient(circle_at_85%_20%,rgba(59,130,246,0.06),transparent_30%)]" />

      <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#070707]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold"><span className="text-red-500">Spider</span> Badge Studio</h1>
              <p className="text-xs text-muted-foreground">21 badges · owner controls</p>
            </div>
          </div>
          <Link to="/admin" className="btn-ghost"><ArrowLeft className="h-4 w-4" /> Staff Portal</Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[300px_1fr]">
        <aside className="glass-panel h-fit overflow-hidden p-3 lg:sticky lg:top-24">
          <div className="mb-3 flex items-center justify-between px-2">
            <div>
              <p className="text-sm font-semibold">Profiles</p>
              <p className="text-[11px] text-muted-foreground">Select who receives badges</p>
            </div>
            <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] text-muted-foreground">{profiles.length}</span>
          </div>
          <label className="mb-3 flex items-center gap-2 rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users…"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
          </label>
          <div className="max-h-[65vh] space-y-1 overflow-y-auto pr-1">
            {visibleProfiles.map((profile) => {
              const count = extractBadges(profile.social_links).length;
              return (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => setSelectedId(profile.id)}
                  className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors ${selectedId === profile.id ? "bg-red-500/10 ring-1 ring-red-500/25" : "hover:bg-white/[0.04]"}`}
                >
                  <div className="h-9 w-9 overflow-hidden rounded-full border border-white/10 bg-white/5">
                    {profile.avatar_url ? <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-sm font-bold">{(profile.display_name || profile.username || "?").slice(0, 1).toUpperCase()}</div>}
                  </div>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{profile.display_name || profile.username || "Unnamed"}</span>
                    <span className="block truncate text-[11px] text-muted-foreground">@{profile.username || "—"}</span>
                  </span>
                  <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] text-muted-foreground">{count}</span>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="space-y-5">
          <div className="glass-panel p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-400">Badge configuration</p>
                <h2 className="mt-1 text-xl font-bold">{selected?.display_name || selected?.username || "Select a profile"}</h2>
                <p className="text-sm text-muted-foreground">Assign any combination of the available profile badges.</p>
              </div>
              {selected && <ProfileBadges badges={assigned} />}
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={badgeQuery} onChange={(e) => setBadgeQuery(e.target.value)} placeholder="Search badges…" className="flex-1 bg-transparent text-sm outline-none" />
            <span className="text-[11px] text-muted-foreground">{assignedIds.size} active</span>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {visibleBadges.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                active={assignedIds.has(badge.id)}
                busy={busy === badge.id}
                onToggle={() => void toggleBadge(badge)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
