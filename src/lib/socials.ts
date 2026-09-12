import {
  Instagram,
  Twitter,
  Youtube,
  Github,
  Headphones,
  MessageSquare,
  Twitch,
  Music,
  Sparkles,
  Globe,
  Mail,
  Linkedin,
  Send,
  Radio,
  type LucideIcon,
} from "lucide-react";
import type { SocialPlatform } from "./bio";

export interface PlatformConfig {
  id: SocialPlatform;
  label: string;
  placeholder: string;
  icon: LucideIcon;
  color: string;
  prefixUrl?: string;
  hint: string;
}

// Official-looking Simple Icons SVGs are used for saved social links so profiles
// show recognizable app marks instead of generic placeholder icons.
const BRAND_ICONS: Record<string, string> = {
  instagram: "https://cdn.simpleicons.org/instagram",
  tiktok: "https://cdn.simpleicons.org/tiktok",
  youtube: "https://cdn.simpleicons.org/youtube",
  twitter: "https://cdn.simpleicons.org/x",
  spotify: "https://cdn.simpleicons.org/spotify",
  discord: "https://cdn.simpleicons.org/discord",
  github: "https://cdn.simpleicons.org/github",
  twitch: "https://cdn.simpleicons.org/twitch",
  linkedin: "https://cdn.simpleicons.org/linkedin",
  telegram: "https://cdn.simpleicons.org/telegram",
  soundcloud: "https://cdn.simpleicons.org/soundcloud",
  reddit: "https://cdn.simpleicons.org/reddit",
  facebook: "https://cdn.simpleicons.org/facebook",
  pinterest: "https://cdn.simpleicons.org/pinterest",
  snapchat: "https://cdn.simpleicons.org/snapchat",
  steam: "https://cdn.simpleicons.org/steam",
  patreon: "https://cdn.simpleicons.org/patreon",
  "ko-fi": "https://cdn.simpleicons.org/kofi",
  paypal: "https://cdn.simpleicons.org/paypal",
  medium: "https://cdn.simpleicons.org/medium",
  behance: "https://cdn.simpleicons.org/behance",
  dribbble: "https://cdn.simpleicons.org/dribbble",
  buymeacoffee: "https://cdn.simpleicons.org/buymeacoffee",
};

export function getPlatformIconUrl(platform: string): string | undefined {
  return BRAND_ICONS[platform.toLowerCase()];
}

export const SUPPORTED_PLATFORMS: PlatformConfig[] = [
  { id: "instagram", label: "Instagram", placeholder: "username or https://instagram.com/username", icon: Instagram, color: "#E1306C", prefixUrl: "https://instagram.com/", hint: "Instagram profile or @handle" },
  { id: "tiktok", label: "TikTok", placeholder: "@username or https://tiktok.com/@username", icon: Music, color: "#00F2FE", prefixUrl: "https://tiktok.com/@", hint: "TikTok profile or @handle" },
  { id: "youtube", label: "YouTube", placeholder: "@channel or https://youtube.com/@channel", icon: Youtube, color: "#FF0000", prefixUrl: "https://youtube.com/@", hint: "YouTube channel or @handle" },
  { id: "twitter", label: "Twitter / X", placeholder: "username or https://x.com/username", icon: Twitter, color: "#1DA1F2", prefixUrl: "https://x.com/", hint: "X (Twitter) handle or link" },
  { id: "spotify", label: "Spotify", placeholder: "https://open.spotify.com/artist/...", icon: Headphones, color: "#1DB954", prefixUrl: "https://open.spotify.com/", hint: "Artist profile or playlist URL" },
  { id: "discord", label: "Discord", placeholder: "https://discord.gg/invite", icon: MessageSquare, color: "#5865F2", prefixUrl: "https://discord.gg/", hint: "Discord server invite or profile" },
  { id: "github", label: "GitHub", placeholder: "username or https://github.com/username", icon: Github, color: "#F0F6FC", prefixUrl: "https://github.com/", hint: "GitHub username or profile link" },
  { id: "twitch", label: "Twitch", placeholder: "username or https://twitch.tv/username", icon: Twitch, color: "#9146FF", prefixUrl: "https://twitch.tv/", hint: "Twitch channel or username" },
];

export function getPlatformConfig(platform: string): PlatformConfig {
  const normalized = platform.toLowerCase();
  if (normalized === "custom") return { id: "custom", label: "Custom", placeholder: "https://...", icon: Sparkles, color: "#8B5CF6", hint: "Custom icon link" };
  const found = SUPPORTED_PLATFORMS.find((p) => p.id === normalized || (normalized === "x" && p.id === "twitter"));
  if (found) return found;
  if (normalized === "linkedin") return { id: "linkedin", label: "LinkedIn", placeholder: "username", icon: Linkedin, color: "#0A66C2", hint: "LinkedIn profile" };
  if (normalized === "telegram") return { id: "telegram", label: "Telegram", placeholder: "username", icon: Send, color: "#229ED9", hint: "Telegram channel" };
  if (normalized === "soundcloud") return { id: "soundcloud", label: "SoundCloud", placeholder: "artist", icon: Radio, color: "#FF5500", hint: "SoundCloud profile" };
  if (normalized === "email") return { id: "email", label: "Email", placeholder: "hello@example.com", icon: Mail, color: "#EA4335", hint: "Email address" };
  return { id: "website", label: platform.charAt(0).toUpperCase() + platform.slice(1), placeholder: "https://...", icon: Globe, color: "#3B82F6", hint: "External link" };
}

export function detectPlatformFromUrl(rawUrl: string): string {
  const value = rawUrl.trim().toLowerCase();
  if (!value) return "website";
  const normalized = value.match(/^\w+:\/\//) ? value : `https://${value}`;
  try {
    const host = new URL(normalized).hostname.replace(/^www\./, "");
    const rules: Array<[string, string[]]> = [
      ["instagram", ["instagram.com", "instagr.am"]],
      ["tiktok", ["tiktok.com"]],
      ["youtube", ["youtube.com", "youtu.be"]],
      ["twitter", ["twitter.com", "x.com"]],
      ["spotify", ["spotify.com", "open.spotify.com"]],
      ["discord", ["discord.com", "discord.gg", "discordapp.com"]],
      ["github", ["github.com", "gist.github.com"]],
      ["twitch", ["twitch.tv"]],
      ["linkedin", ["linkedin.com"]],
      ["telegram", ["t.me", "telegram.me", "telegram.org"]],
      ["soundcloud", ["soundcloud.com"]],
      ["reddit", ["reddit.com", "redd.it"]],
      ["facebook", ["facebook.com", "fb.com"]],
      ["pinterest", ["pinterest.com", "pin.it"]],
      ["snapchat", ["snapchat.com"]],
      ["steam", ["steampowered.com", "steamcommunity.com"]],
      ["patreon", ["patreon.com"]],
      ["ko-fi", ["ko-fi.com"]],
      ["paypal", ["paypal.com"]],
      ["medium", ["medium.com"]],
      ["behance", ["behance.net"]],
      ["dribbble", ["dribbble.com"]],
      ["buymeacoffee", ["buymeacoffee.com"]],
    ];
    const matched = rules.find(([, domains]) => domains.some((domain) => host === domain || host.endsWith(`.${domain}`)));
    return matched?.[0] || "website";
  } catch {
    return "website";
  }
}

export function formatSocialUrl(platform: SocialPlatform | string, raw: string): string {
  const val = raw.trim();
  if (!val) return "";
  if (platform === "email") return val.startsWith("mailto:") ? val : `mailto:${val}`;
  if (val.startsWith("http://") || val.startsWith("https://")) return val;
  const cleanHandle = val.replace(/^@+/, "");
  switch (platform) {
    case "instagram": return `https://instagram.com/${cleanHandle}`;
    case "twitter": return `https://x.com/${cleanHandle}`;
    case "tiktok": return `https://tiktok.com/@${cleanHandle}`;
    case "youtube": return `https://youtube.com/@${cleanHandle}`;
    case "github": return `https://github.com/${cleanHandle}`;
    case "twitch": return `https://twitch.tv/${cleanHandle}`;
    case "telegram": return `https://t.me/${cleanHandle}`;
    case "linkedin": return cleanHandle.startsWith("in/") ? `https://linkedin.com/${cleanHandle}` : `https://linkedin.com/in/${cleanHandle}`;
    case "discord": return val.includes("discord.gg") ? `https://${val}` : `https://discord.gg/${val}`;
    case "spotify": return val.includes("spotify.com") ? `https://${val}` : `https://open.spotify.com/${val}`;
    case "soundcloud": return `https://soundcloud.com/${cleanHandle}`;
    case "custom":
    case "website":
    default: return `https://${val}`;
  }
}
