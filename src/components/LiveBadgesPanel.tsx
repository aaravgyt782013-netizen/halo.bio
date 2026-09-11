import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, Lock, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";
import { auth, db, type Profile } from "@/lib/bio";
import { LIVE_BADGE_DEFINITIONS, normalizeLiveBadges, type LiveBadge } from "@/lib/live-badges";

type BadgeProfile = Profile & { live_badges?: LiveBadge[] };

export function LiveBadgesPanel() {
  const [profile, setProfile] = useState<BadgeProfile | null>(null);
  const [badges, setBadges] = useState<LiveBadge[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void auth.getSession().then(async ({ data }) => {
      if (!data.session || cancelled) return;
      const { data: loaded } = await db
        .from("profiles")
        .select("*")
        .eq("id", data.session.user.id)
        .maybeSingle();
      if (cancelled) return;
      const current = (loaded ?? null) as BadgeProfile | null;
      setProfile(current);
      setBadges(normalizeLiveBadges(current?.live_badges));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const enabled = useMemo(() => new Set(badges.filter((badge) => badge.enabled).map((badge) => badge.id)), [badges]);

  const toggle = async (id: LiveBadge["id"]) => {
    if (!profile) {
      toast.error("Your profile is still loading");
      return;
    }
    const definition = LIVE_BADGE_DEFINITIONS.find((item) => item.id === id);
    if (!definition || definition.auto) return;

    const next = badges.some((badge) => badge.id === id)
      ? badges.map((badge) => badge.id === id ? { ...badge, enabled: !badge.enabled } : badge)
      : [...badges, { id, label: definition.label, enabled: true, animated: definition.animated, color: definition.color }];

    setBadges(next);
    setSaving(true);
    const { error } = await db.from("profiles").update({ live_badges: next } as unknown as Partial<Profile>).eq("id", profile.id);
    setSaving(false);
    if (error) {
      toast.error(`Could not save badges: ${error.message}`);
      return;
    }
    setProfile((current) => current ? { ...current, live_badges: next } : current);
    window.dispatchEvent(new CustomEvent("halo-badges-preview", { detail: next }));
    toast.success("Badges updated");
  };

  return (
    <div className="space-y-4 rounded-2xl border border-border/80 bg-secondary/20 p-3.5 sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Live Badges</h3>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            Pick profile badges that appear instantly on your public page. The Live badge has a subtle animated pulse.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
          {enabled.size} active
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {LIVE_BADGE_DEFINITIONS.map((definition) => {
          const Icon = definition.icon;
          const isActive = enabled.has(definition.id) || (definition.id === "premium" && Boolean(profile?.is_premium));
          const locked = definition.auto;
          return (
            <button
              key={definition.id}
              type="button"
              disabled={saving || locked}
              onClick={() => void toggle(definition.id)}
              className={`relative flex min-w-0 items-center gap-2 rounded-xl border p-2.5 text-left transition-all ${
                isActive ? "border-primary bg-primary/10 ring-1 ring-primary/20" : "border-border/80 bg-card hover:border-primary/40"
              } ${locked ? "cursor-default" : "active:scale-[0.98]"}`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${definition.animated && isActive ? "animate-pulse" : ""}`}
                style={{ color: definition.color, borderColor: `${definition.color}55`, backgroundColor: `${definition.color}15` }}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[11px] font-bold text-foreground">{definition.label}</span>
                <span className="block truncate text-[9px] text-muted-foreground">{locked ? "Automatic" : definition.description}</span>
              </span>
              {locked && <Lock className="absolute right-1.5 top-1.5 h-3 w-3 text-muted-foreground" />}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 rounded-lg bg-secondary/60 p-2.5 text-[10px] text-muted-foreground">
        <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-primary" />
        <span>Verified/Premium badges are derived from the account state and cannot be self-granted.</span>
        <Zap className="ml-auto h-3.5 w-3.5 shrink-0 text-primary" />
      </div>
    </div>
  );
}
