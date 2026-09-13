import { useState } from "react";
import { Award, BadgeCheck, Bug, CandyCane, CircleDollarSign, Egg, Flame, Gift, Gauge, Gem, Lightbulb, Medal, Rabbit, Rocket, Satellite, Snowflake, Star, Sun, Trophy, Wrench, X } from "lucide-react";
import type { ProfileBadge } from "@/lib/profileBadges";

const ICONS = { wrench: Wrench, lightbulb: Lightbulb, gem: Gem, "badge-check": BadgeCheck, "badge-dollar": CircleDollarSign, gift: Gift, star: Star, rocket: Rocket, medal: Medal, flame: Flame, gauge: Gauge, bug: Bug, sun: Sun, rabbit: Rabbit, snowflake: Snowflake, egg: Egg, "candy-cane": CandyCane, satellite: Satellite, trophy: Trophy, award: Award } as const;

function BadgeIcon({ badge, large = false }: { badge: ProfileBadge; large?: boolean }) {
  const Icon = ICONS[badge.icon as keyof typeof ICONS] ?? Star;
  if (badge.imageUrl) return <img src={badge.imageUrl} alt="" className={`${large ? "h-10 w-10" : "h-[18px] w-[18px]"} object-contain`} />;
  if (badge.emoji) return <span className={large ? "text-3xl leading-none" : "text-[15px] leading-none"}>{badge.emoji}</span>;
  return <Icon className={large ? "h-8 w-8" : "h-[17px] w-[17px]"} strokeWidth={2.5} />;
}

function glowStyle(badge: ProfileBadge, large = false) {
  const glow = badge.glowColor || badge.color || "#ffffff";
  return {
    color: badge.color || glow,
    borderColor: `${glow}55`,
    boxShadow: large
      ? `0 0 12px ${glow}90, 0 0 28px ${glow}65, 0 0 60px ${glow}35, inset 0 0 18px ${glow}18`
      : `0 0 7px ${glow}85, 0 0 16px ${glow}65, 0 0 30px ${glow}28, inset 0 0 10px ${glow}12`,
    textShadow: `0 0 8px ${glow}90`,
  } as React.CSSProperties;
}

export function ProfileBadges({ badges }: { badges: ProfileBadge[] }) {
  const [selected, setSelected] = useState<ProfileBadge | null>(null);
  if (!badges.length) return null;

  return <>
    <div className="mt-3 flex flex-wrap items-center justify-center gap-2" aria-label="Profile badges">
      {badges.map((badge) => <button key={badge.id} type="button" title={badge.name} aria-label={`View ${badge.name} badge`} onClick={() => setSelected(badge)} className="group relative inline-flex h-8 w-8 items-center justify-center rounded-full border bg-black/30 backdrop-blur-md transition-all duration-300 hover:scale-125 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white/20" style={glowStyle(badge)}>
        <span className="pointer-events-none absolute inset-[2px] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: `radial-gradient(circle, ${badge.glowColor || badge.color}22 0%, transparent 72%)` }} />
        <span className="relative z-10"><BadgeIcon badge={badge} /></span>
      </button>)}
    </div>

    {selected && <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-label={`${selected.name} badge information`} onClick={() => setSelected(null)}>
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[#090909]/95 shadow-2xl backdrop-blur-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-white/[.07] px-5 py-4"><div><p className="text-[10px] font-semibold uppercase tracking-[.18em] text-red-400">Profile badge</p><h3 className="mt-1 font-display text-lg font-bold text-white">{selected.name}</h3></div><button type="button" onClick={() => setSelected(null)} className="rounded-lg p-2 text-white/40 transition hover:bg-white/5 hover:text-white" aria-label="Close"><X className="h-4 w-4" /></button></div>
        <div className="p-5"><div className="mx-auto grid h-20 w-20 place-items-center rounded-2xl border bg-black/40" style={glowStyle(selected, true)}><BadgeIcon badge={selected} large /></div><h4 className="mt-4 text-center font-display text-xl font-bold text-white">{selected.name}</h4><p className="mt-2 text-center text-sm leading-relaxed text-white/55">{selected.description || "No description provided."}</p></div>
      </div>
    </div>}
  </>;
}
