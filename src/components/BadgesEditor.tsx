import { useMemo, useState } from "react";
import { Award, BadgeCheck, Bug, CandyCane, CircleDollarSign, Check, Egg, Flame, Gift, Gauge, Gem, Lightbulb, Medal, Rabbit, Rocket, Search, Satellite, Snowflake, Star, Sun, Trophy, Wrench } from "lucide-react";
import type { Profile } from "@/lib/bio";
import { extractBadges, PROFILE_BADGES, type ProfileBadge } from "@/lib/profileBadges";

type Props = { profile: Profile };
const ICONS = { wrench: Wrench, lightbulb: Lightbulb, gem: Gem, "badge-check": BadgeCheck, "badge-dollar": CircleDollarSign, gift: Gift, star: Star, rocket: Rocket, medal: Medal, flame: Flame, gauge: Gauge, bug: Bug, sun: Sun, rabbit: Rabbit, snowflake: Snowflake, egg: Egg, "candy-cane": CandyCane, satellite: Satellite, trophy: Trophy, award: Award } as const;

export function BadgesEditor({ profile }: Props) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ProfileBadge | null>(null);
  const obtained = extractBadges(profile.social_links);
  const allBadges = useMemo(() => {
    const map = new Map<string, ProfileBadge>();
    for (const badge of PROFILE_BADGES) map.set(badge.id, badge);
    for (const badge of obtained) map.set(badge.id, badge);
    return [...map.values()];
  }, [obtained]);
  const visible = allBadges.filter((b) => `${b.name} ${b.description}`.toLowerCase().includes(query.toLowerCase()));

  return <div className="space-y-5 w-full min-w-0">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-3">
      <div><h2 className="flex items-center gap-2 text-sm font-bold text-foreground"><Award className="h-4 w-4 text-primary" /> Badges</h2><p className="mt-0.5 text-xs text-muted-foreground">All available badges are shown here. Obtained badges are highlighted.</p></div>
      <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-secondary/40 px-3 py-2"><Search className="h-3.5 w-3.5 text-muted-foreground" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search badges" className="w-full bg-transparent text-xs outline-none sm:w-44" /></div>
    </div>
    <div className="rounded-2xl border border-primary/15 bg-primary/[.04] p-4"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[.14em] text-primary">Your badges</p><p className="mt-1 text-sm text-foreground/70">{obtained.length} obtained</p></div><div className="flex -space-x-1.5">{obtained.slice(0, 6).map((badge) => <BadgeGlyph key={badge.id} badge={badge} small />)}</div></div></div>
    <div className="grid gap-2 sm:grid-cols-2">{visible.map((badge) => { const owned = obtained.some((b) => b.id === badge.id); return <button key={badge.id} type="button" onClick={() => setSelected(badge)} className={`group flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all hover:-translate-y-px ${owned ? "border-primary/30 bg-primary/[.06]" : "border-border/70 bg-card/40 hover:border-primary/20"}`}><BadgeGlyph badge={badge} /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-foreground">{badge.name}</span><span className="mt-0.5 block truncate text-[11px] text-muted-foreground">{owned ? "Obtained · Click for details" : "Not obtained · Click for details"}</span></span>{owned && <Check className="h-4 w-4 shrink-0 text-primary" />}</button>; })}</div>
    {selected && <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md" onClick={() => setSelected(null)}><div className="glass-panel w-full max-w-md p-5 shadow-lift" onClick={(e) => e.stopPropagation()}><div className="flex items-center gap-4"><BadgeGlyph badge={selected} /><div className="min-w-0"><p className="font-display text-lg font-bold text-foreground">{selected.name}</p><p className="mt-1 text-xs text-muted-foreground">{obtained.some((b) => b.id === selected.id) ? "Obtained badge" : "Available badge"}</p></div></div><p className="mt-4 text-sm leading-relaxed text-foreground/75">{selected.description}</p><button type="button" onClick={() => setSelected(null)} className="btn-primary mt-5 w-full justify-center text-xs">Close</button></div></div>}
  </div>;
}

function BadgeGlyph({ badge, small = false }: { badge: ProfileBadge; small?: boolean }) {
  const Icon = ICONS[badge.icon as keyof typeof ICONS] ?? Star;
  const glow = badge.glowColor || badge.color;
  const size = small ? "h-8 w-8" : "h-11 w-11";
  return <span className={`grid shrink-0 place-items-center rounded-xl bg-black/25 border border-white/10 ${size}`} style={{ color: badge.color, filter: `drop-shadow(0 0 ${small ? 6 : 10}px ${glow})` }}>{badge.imageUrl ? <img src={badge.imageUrl} alt="" className={`${small ? "h-5 w-5" : "h-7 w-7"} object-contain`} /> : badge.emoji ? <span className={small ? "text-base" : "text-xl"}>{badge.emoji}</span> : <Icon className={small ? "h-4 w-4" : "h-6 w-6"} />}</span>;
}
