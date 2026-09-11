import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, Lock, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";
import { auth, db, type Profile, type SocialLink } from "@/lib/bio";
import { LIVE_BADGE_DEFINITIONS, normalizeLiveBadges, type LiveBadge } from "@/lib/live-badges";

type BadgeProfile = Profile & { live_badges?: LiveBadge[] };
const BADGE_PREFIX = "__halo_live_badge_";

function badgeIconUrl(label: string, color: string, animated = false) {
  const safeLabel = label.slice(0, 2).toUpperCase();
  const animation = animated ? `<circle cx="48" cy="48" r="34" fill="none" stroke="${color}" stroke-width="4" opacity=".45"><animate attributeName="r" values="30;42;30" dur="1.8s" repeatCount="indefinite"/><animate attributeName="opacity" values=".8;0;.8" dur="1.8s" repeatCount="indefinite"/></circle>` : "";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="48" fill="#101827"/><circle cx="48" cy="48" r="38" fill="${color}20" stroke="${color}" stroke-width="3"/>${animation}<text x="48" y="54" text-anchor="middle" font-family="Arial,sans-serif" font-size="23" font-weight="700" fill="white">${safeLabel}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function toSocialBadge(badge: LiveBadge): SocialLink {
  const definition = LIVE_BADGE_DEFINITIONS.find((item) => item.id === badge.id);
  return {
    id: `${BADGE_PREFIX}${badge.id}`,
    platform: "custom",
    url: "#",
    title: badge.label,
    icon_url: badgeIconUrl(badge.label, badge.color || definition?.color || "#6366f1", Boolean(badge.animated || definition?.animated)),
    active: true,
  };
}

export function LiveBadgesPanel() {
  const [profile, setProfile] = useState<BadgeProfile | null>(null);
  const [badges, setBadges] = useState<LiveBadge[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void auth.getSession().then(async ({ data }) => {
      if (!data.session || cancelled) return;
      const { data: loaded } = await db.from("profiles").select("*").eq("id", data.session.user.id).maybeSingle();
      if (cancelled) return;
      const current = (loaded ?? null) as BadgeProfile | null;
      setProfile(current);
      setBadges(normalizeLiveBadges(current?.live_badges));
    });
    return () => { cancelled = true; };
  }, []);

  const enabled = useMemo(() => new Set(badges.filter((badge) => badge.enabled).map((badge) => badge.id)), [badges]);

  const save = async (next: LiveBadge[]) => {
    if (!profile) return;
    setSaving(true);
    const activeBadges = next.filter((badge) => badge.enabled);
    const currentSocials = (profile.social_links || []).filter((social) => !String(social.id).startsWith(BADGE_PREFIX));
    const social_links = [...currentSocials, ...activeBadges.map(toSocialBadge)];
    const { error } = await db.from("profiles").update({ live_badges: next, social_links } as unknown as Partial<Profile>).eq("id", profile.id);
    setSaving(false);
    if (error) { toast.error(`Could not save badges: ${error.message}`); return; }
    setBadges(next);
    setProfile((current) => current ? { ...current, live_badges: next, social_links } : current);
    window.dispatchEvent(new CustomEvent("halo-badges-preview", { detail: next }));
    window.dispatchEvent(new Event("halo-store-updated"));
    toast.success("Badges updated");
  };

  const toggle = async (id: LiveBadge["id"]) => {
    if (!profile) { toast.error("Your profile is still loading"); return; }
    const definition = LIVE_BADGE_DEFINITIONS.find((item) => item.id === id);
    if (!definition || definition.auto) return;
    const next = badges.some((badge) => badge.id === id)
      ? badges.map((badge) => badge.id === id ? { ...badge, enabled: !badge.enabled } : badge)
      : [...badges, { id, label: definition.label, enabled: true, animated: definition.animated, color: definition.color }];
    await save(next);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-border/80 bg-secondary/20 p-3.5 sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-primary" /><h3 className="text-sm font-bold text-foreground">Live Badges</h3></div>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">Choose profile badges that appear immediately on your public page. The Live badge has a subtle animated pulse.</p>
        </div>
        <span className="shrink-0 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">{enabled.size} active</span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {LIVE_BADGE_DEFINITIONS.map((definition) => {
          const Icon = definition.icon;
          const isActive = enabled.has(definition.id) || (definition.id === "premium" && Boolean(profile?.is_premium));
          const locked = definition.auto;
          return (
            <button key={definition.id} type="button" disabled={saving || locked} onClick={() => void toggle(definition.id)} className={`relative flex min-w-0 items-center gap-2 rounded-xl border p-2.5 text-left transition-all ${isActive ? "border-primary bg-primary/10 ring-1 ring-primary/20" : "border-border/80 bg-card hover:border-primary/40"} ${locked ? "cursor-default" : "active:scale-[0.98]"}`}>
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${definition.animated && isActive ? "animate-pulse" : ""}`} style={{ color: definition.color, borderColor: `${definition.color}55`, backgroundColor: `${definition.color}15` }}><Icon className="h-4 w-4" /></span>
              <span className="min-w-0"><span className="block truncate text-[11px] font-bold text-foreground">{definition.label}</span><span className="block truncate text-[9px] text-muted-foreground">{locked ? "Automatic" : definition.description}</span></span>
              {locked && <Lock className="absolute right-1.5 top-1.5 h-3 w-3 text-muted-foreground" />}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-2 rounded-lg bg-secondary/60 p-2.5 text-[10px] text-muted-foreground"><BadgeCheck className="h-3.5 w-3.5 shrink-0 text-primary" /><span>Verified/Premium badges are derived from account state and cannot be self-granted.</span><Zap className="ml-auto h-3.5 w-3.5 shrink-0 text-primary" /></div>
    </div>
  );
}
