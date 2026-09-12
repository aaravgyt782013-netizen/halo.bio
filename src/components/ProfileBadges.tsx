import {
  Award,
  BadgeCheck,
  Bug,
  CandyCane,
  CircleDollarSign,
  Egg,
  Flame,
  Gift,
  Gauge,
  Gem,
  Lightbulb,
  Medal,
  Rabbit,
  Rocket,
  Satellite,
  Snowflake,
  Star,
  Sun,
  Trophy,
  Wrench,
} from "lucide-react";
import type { ProfileBadge } from "@/lib/profileBadges";

const ICONS = {
  wrench: Wrench,
  lightbulb: Lightbulb,
  gem: Gem,
  "badge-check": BadgeCheck,
  "badge-dollar": CircleDollarSign,
  gift: Gift,
  star: Star,
  rocket: Rocket,
  medal: Medal,
  flame: Flame,
  gauge: Gauge,
  bug: Bug,
  sun: Sun,
  rabbit: Rabbit,
  snowflake: Snowflake,
  egg: Egg,
  "candy-cane": CandyCane,
  satellite: Satellite,
  trophy: Trophy,
  award: Award,
} as const;

export function ProfileBadges({ badges }: { badges: ProfileBadge[] }) {
  if (!badges.length) return null;

  return (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5" aria-label="Profile badges">
      {badges.map((badge) => {
        const Icon = ICONS[badge.icon as keyof typeof ICONS] ?? Star;
        return (
          <span
            key={badge.id}
            title={`${badge.name} — ${badge.description}`}
            className="group relative inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-black/25 shadow-sm backdrop-blur-md transition-transform duration-200 hover:scale-110"
            style={{ color: badge.color, boxShadow: `0 0 16px ${badge.color}30` }}
          >
            <Icon className="h-4 w-4" strokeWidth={2.2} />
            <span className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 w-max max-w-52 -translate-x-1/2 scale-95 rounded-lg border border-white/10 bg-black/90 px-2.5 py-1.5 text-left text-[11px] leading-snug text-white opacity-0 shadow-xl transition-all group-hover:scale-100 group-hover:opacity-100">
              <strong className="block font-semibold">{badge.name}</strong>
              <span className="text-white/60">{badge.description}</span>
            </span>
          </span>
        );
      })}
    </div>
  );
}
