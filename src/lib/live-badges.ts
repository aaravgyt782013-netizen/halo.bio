import { Activity, BadgeCheck, Code2, Crown, Gamepad2, Github, Heart, Music2, Sparkles, Star, Twitch, Youtube, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type LiveBadgeId =
  | "verified"
  | "premium"
  | "creator"
  | "developer"
  | "gamer"
  | "discord"
  | "youtube"
  | "github"
  | "twitch"
  | "music"
  | "early-supporter"
  | "live";

export type LiveBadge = {
  id: LiveBadgeId;
  label: string;
  enabled: boolean;
  animated?: boolean;
  color?: string;
};

export type LiveBadgeDefinition = LiveBadge & {
  icon: LucideIcon;
  description: string;
  auto?: boolean;
};

export const LIVE_BADGE_DEFINITIONS: LiveBadgeDefinition[] = [
  { id: "verified", label: "Verified", icon: BadgeCheck, description: "Verified profile badge.", auto: true, enabled: false, color: "#3b82f6" },
  { id: "premium", label: "Premium", icon: Crown, description: "Premium member badge.", auto: true, enabled: false, color: "#f59e0b" },
  { id: "creator", label: "Creator", icon: Sparkles, description: "Creator identity badge.", enabled: false, color: "#a855f7" },
  { id: "developer", label: "Developer", icon: Code2, description: "Developer identity badge.", enabled: false, color: "#22c55e" },
  { id: "gamer", label: "Gamer", icon: Gamepad2, description: "Gaming identity badge.", enabled: false, color: "#8b5cf6" },
  { id: "discord", label: "Discord", icon: Activity, description: "Discord community badge.", enabled: false, color: "#5865f2" },
  { id: "youtube", label: "YouTube", icon: Youtube, description: "YouTube creator badge.", enabled: false, color: "#ef4444" },
  { id: "github", label: "GitHub", icon: Github, description: "GitHub developer badge.", enabled: false, color: "#a3a3a3" },
  { id: "twitch", label: "Twitch", icon: Twitch, description: "Twitch creator badge.", enabled: false, color: "#9146ff" },
  { id: "music", label: "Music", icon: Music2, description: "Music profile badge.", enabled: false, color: "#ec4899" },
  { id: "early-supporter", label: "Early Supporter", icon: Star, description: "Early supporter badge.", enabled: false, color: "#f97316" },
  { id: "live", label: "Live", icon: Zap, description: "Animated live-status badge.", enabled: false, animated: true, color: "#22c55e" },
];

export function normalizeLiveBadges(value: unknown): LiveBadge[] {
  if (!Array.isArray(value)) return [];
  return value.filter((badge): badge is LiveBadge => {
    if (!badge || typeof badge !== "object") return false;
    const item = badge as Partial<LiveBadge>;
    return typeof item.id === "string" && typeof item.label === "string" && typeof item.enabled === "boolean";
  });
}

export function badgeFor(id: LiveBadgeId, badges: LiveBadge[]) {
  return badges.find((badge) => badge.id === id);
}

export function getEffectiveLiveBadges(
  badges: LiveBadge[],
  profile: { is_premium?: boolean; social_links?: Array<{ platform?: string; active?: boolean }> },
): LiveBadge[] {
  const result = [...normalizeLiveBadges(badges)];
  const has = (id: LiveBadgeId) => result.some((badge) => badge.id === id && badge.enabled);
  const add = (id: LiveBadgeId) => {
    if (has(id)) return;
    const definition = LIVE_BADGE_DEFINITIONS.find((item) => item.id === id);
    if (!definition) return;
    result.push({ id, label: definition.label, enabled: true, animated: definition.animated, color: definition.color });
  };

  if (profile.is_premium) add("premium");
  return result.filter((badge) => badge.enabled);
}
