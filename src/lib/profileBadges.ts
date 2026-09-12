import type { SocialLink } from "@/lib/bio";

export type ProfileBadge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  emoji?: string;
  imageUrl?: string;
  glowColor?: string;
};

export const PROFILE_BADGES: ProfileBadge[] = [
  { id: "staff", name: "Staff", description: "Be a part of the Spider Website staff team.", icon: "wrench", color: "#6d8cff" },
  { id: "helper", name: "Helper", description: "Be active and help users in the community.", icon: "lightbulb", color: "#e8a33d" },
  { id: "premium", name: "Premium", description: "Purchase the premium package.", icon: "gem", color: "#a855f7" },
  { id: "verified", name: "Verified", description: "Purchase or be a known content creator.", icon: "badge-check", color: "#0ea5e9" },
  { id: "donor", name: "Donor", description: "Support the Spider Website community.", icon: "badge-dollar", color: "#18c77a" },
  { id: "gifter", name: "Gifter", description: "Gift a Spider Website product to another user.", icon: "gift", color: "#fbbf24" },
  { id: "image-host", name: "Image Host", description: "Purchase the Image Host package.", icon: "star", color: "#22d3a0" },
  { id: "domain-legend", name: "Domain Legend", description: "Add a public custom domain.", icon: "rocket", color: "#ff6b61" },
  { id: "og", name: "OG", description: "Be an early supporter of Spider Website.", icon: "medal", color: "#f2cf24" },
  { id: "server-booster", name: "Server Booster", description: "Boost the community server.", icon: "flame", color: "#f97316" },
  { id: "hone", name: "Hone.gg", description: "Earned by redeeming a partner reward.", icon: "gauge", color: "#f59e0b" },
  { id: "bug-hunter", name: "Bug Hunter", description: "Report a bug to the Spider Website team.", icon: "bug", color: "#42d47b" },
  { id: "summer-2026", name: "Summer 2026", description: "Exclusive badge from the 2026 summer event.", icon: "sun", color: "#f7c948" },
  { id: "easter-2026", name: "Easter 2026", description: "Exclusive badge from the 2026 Easter event.", icon: "rabbit", color: "#9b7cff" },
  { id: "christmas-2025", name: "Christmas 2025", description: "Exclusive badge from the 2025 winter event.", icon: "snowflake", color: "#72c7ff" },
  { id: "easter-2025", name: "Easter 2025", description: "Exclusive badge from the 2025 Easter event.", icon: "egg", color: "#f6a6c1" },
  { id: "christmas-2024", name: "Christmas 2024", description: "Exclusive badge from the 2024 winter event.", icon: "candy-cane", color: "#ef4444" },
  { id: "million", name: "The Million", description: "Celebration badge for 1M users.", icon: "satellite", color: "#65e6df" },
  { id: "winner", name: "Winner", description: "Win a Spider Website event.", icon: "trophy", color: "#facc15" },
  { id: "second-place", name: "Second Place", description: "Get second place in a Spider Website event.", icon: "award", color: "#bdbdbd" },
  { id: "third-place", name: "Third Place", description: "Get third place in a Spider Website event.", icon: "award", color: "#c77b35" },
];

export const BADGE_PLATFORM = "__spider_profile_badge__";

export function encodeBadge(badge: ProfileBadge): SocialLink {
  return { id: `badge:${badge.id}`, platform: BADGE_PLATFORM, url: badge.id, title: badge.name, icon_url: JSON.stringify(badge), active: false };
}

export function extractBadges(links?: SocialLink[] | null): ProfileBadge[] {
  if (!links) return [];
  const result: ProfileBadge[] = [];
  for (const link of links) {
    if (link.platform !== BADGE_PLATFORM) continue;
    try {
      const parsed = JSON.parse(link.icon_url || "") as ProfileBadge;
      if (parsed?.id && parsed?.name && !result.some((x) => x.id === parsed.id)) result.push(parsed);
    } catch {
      const fallback = PROFILE_BADGES.find((x) => x.id === link.url);
      if (fallback && !result.some((x) => x.id === fallback.id)) result.push(fallback);
    }
  }
  return result;
}

export function mergeBadges(links: SocialLink[] | undefined | null, badges: ProfileBadge[]) {
  const normalLinks = (links ?? []).filter((link) => link.platform !== BADGE_PLATFORM);
  return [...normalLinks, ...badges.map(encodeBadge)];
}
