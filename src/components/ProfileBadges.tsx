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
    <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2" aria-label="Profile badges">
      {badges.map((badge) => {
        const Icon = ICONS[badge.icon as keyof typeof ICONS] ?? Star;
        return (
          <span
            key={badge.id}
            title={badge.name}
            aria-label={badge.name}
            className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/25 backdrop-blur-md transition-transform duration-200 hover:scale-110"
            style={{
              color: badge.color,
              filter: `drop-shadow(0 0 5px ${badge.color}) drop-shadow(0 0 11px ${badge.color}80)`,
            }}
          >
            <Icon className="h-[17px] w-[17px]" strokeWidth={2.5} />
          </span>
        );
      })}
    </div>
  );
}
