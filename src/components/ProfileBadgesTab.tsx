import { useState } from "react";
import { Award, BadgeCheck, Bug, CandyCane, CircleDollarSign, Egg, Flame, Gift, Gauge, Gem, Lightbulb, Medal, Rabbit, Rocket, Satellite, Snowflake, Star, Sun, Trophy, Wrench, X } from "lucide-react";
import type { ProfileBadge } from "@/lib/profileBadges";

const ICONS = { wrench: Wrench, lightbulb: Lightbulb, gem: Gem, "badge-check": BadgeCheck, "badge-dollar": CircleDollarSign, gift: Gift, star: Star, rocket: Rocket, medal: Medal, flame: Flame, gauge: Gauge, bug: Bug, sun: Sun, rabbit: Rabbit, snowflake: Snowflake, egg: Egg, "candy-cane": CandyCane, satellite: Satellite, trophy: Trophy, award: Award } as const;

export function ProfileBadgesTab({ badges }: { badges: ProfileBadge[] }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ProfileBadge | null>(null);
  if (!badges.length) return null;

  const iconFor = (badge: ProfileBadge) => ICONS[badge.icon as keyof typeof ICONS] ?? Star;

  return <>
    <button type="button" onClick={() => { setSelected(null); setOpen(true); }} className="fixed bottom-5 left-5 z-[80] inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/70 px-4 py-2.5 text-xs font-semibold text-white shadow-xl backdrop-blur-xl transition hover:scale-[1.03] hover:border-red-500/30 hover:bg-black/80" aria-label="Open badges"><Award className="h-4 w-4 text-red-400" /> Badges <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] text-white/60">{badges.length}</span></button>
    {open && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md" onClick={() => setOpen(false)}>
      <div className="relative flex max-h-[82vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b]/95 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4"><div><p className="font-display text-base font-bold"><span className="text-red-500">Spider</span> Badges</p><p className="mt-0.5 text-xs text-white/40">Click a badge to view its details.</p></div><button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 text-white/45 hover:bg-white/5 hover:text-white" aria-label="Close badges"><X className="h-4 w-4" /></button></div>
        {selected ? <div className="p-5"><button type="button" onClick={() => setSelected(null)} className="mb-4 text-xs font-semibold text-red-400 hover:text-red-300">← All badges</button><div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[.03] p-4"><div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-black/40 text-2xl" style={{ color: selected.color, filter: `drop-shadow(0 0 10px ${selected.glowColor || selected.color})` }}>{selected.emoji ? <span>{selected.emoji}</span> : (() => { const Icon = iconFor(selected); return <Icon className="h-7 w-7" />; })()}</div><div className="min-w-0"><h3 className="font-display text-lg font-bold text-white">{selected.name}</h3><p className="mt-1 text-sm leading-relaxed text-white/55">{selected.description}</p></div></div></div> : <div className="space-y-2 overflow-y-auto p-3">{badges.map((badge) => { const Icon = iconFor(badge); return <button type="button" key={badge.id} onClick={() => setSelected(badge)} className="flex w-full items-center gap-4 rounded-2xl border border-white/[.06] bg-white/[.025] p-4 text-left transition hover:border-white/10 hover:bg-white/[.05]"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-black/40 text-xl" style={{ color: badge.color, filter: `drop-shadow(0 0 8px ${badge.glowColor || badge.color})` }}>{badge.emoji ? <span>{badge.emoji}</span> : <Icon className="h-6 w-6" />}</span><span className="min-w-0 flex-1"><span className="block truncate text-base font-semibold text-white">{badge.name}</span><span className="mt-0.5 block text-[11px] text-white/35">View badge details</span></span><span className="text-white/25">›</span></button>; })}</div>}
      </div>
    </div>}
  </>;
}
