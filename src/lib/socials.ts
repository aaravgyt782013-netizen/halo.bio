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

// Famous, most popular social platforms only
export const SUPPORTED_PLATFORMS: PlatformConfig[] = [
  {
    id: "instagram",
    label: "Instagram",
    placeholder: "username or https://instagram.com/username",
    icon: Instagram,
    color: "#E1306C",
    prefixUrl: "https://instagram.com/",
    hint: "Instagram profile or @handle",
  },
  {
    id: "tiktok",
    label: "TikTok",
    placeholder: "@username or https://tiktok.com/@username",
    icon: Music,
    color: "#00F2FE",
    prefixUrl: "https://tiktok.com/@",
    hint: "TikTok profile or @handle",
  },
  {
    id: "youtube",
    label: "YouTube",
    placeholder: "@channel or https://youtube.com/@channel",
    icon: Youtube,
    color: "#FF0000",
    prefixUrl: "https://youtube.com/@",
    hint: "YouTube channel or @handle",
  },
  {
    id: "twitter",
    label: "Twitter / X",
    placeholder: "username or https://x.com/username",
    icon: Twitter,
    color: "#1DA1F2",
    prefixUrl: "https://x.com/",
    hint: "X (Twitter) handle or link",
  },
  {
    id: "spotify",
    label: "Spotify",
    placeholder: "https://open.spotify.com/artist/...",
    icon: Headphones,
    color: "#1DB954",
    prefixUrl: "https://open.spotify.com/",
    hint: "Artist profile or playlist URL",
  },
  {
    id: "discord",
    label: "Discord",
    placeholder: "https://discord.gg/invite",
    icon: MessageSquare,
    color: "#5865F2",
    prefixUrl: "https://discord.gg/",
    hint: "Discord server invite or profile",
  },
  {
    id: "github",
    label: "GitHub",
    placeholder: "username or https://github.com/username",
    icon: Github,
    color: "#F0F6FC",
    prefixUrl: "https://github.com/",
    hint: "GitHub username or profile link",
  },
  {
    id: "twitch",
    label: "Twitch",
    placeholder: "username or https://twitch.tv/username",
    icon: Twitch,
    color: "#9146FF",
    prefixUrl: "https://twitch.tv/",
    hint: "Twitch channel or username",
  },
];

export function getPlatformConfig(platform: string): PlatformConfig {
  const normalized = platform.toLowerCase();
  if (normalized === "custom") {
    return {
      id: "custom",
      label: "Custom",
      placeholder: "https://...",
      icon: Sparkles,
      color: "#8B5CF6",
      hint: "Custom icon link",
    };
  }
  const found = SUPPORTED_PLATFORMS.find(
    (p) => p.id === normalized || (normalized === "x" && p.id === "twitter"),
  );
  if (found) return found;

  // Fallbacks for legacy profile entries
  if (normalized === "linkedin") {
    return {
      id: "linkedin",
      label: "LinkedIn",
      placeholder: "username",
      icon: Linkedin,
      color: "#0A66C2",
      hint: "LinkedIn profile",
    };
  }
  if (normalized === "telegram") {
    return {
      id: "telegram",
      label: "Telegram",
      placeholder: "username",
      icon: Send,
      color: "#229ED9",
      hint: "Telegram channel",
    };
  }
  if (normalized === "soundcloud") {
    return {
      id: "soundcloud",
      label: "SoundCloud",
      placeholder: "artist",
      icon: Radio,
      color: "#FF5500",
      hint: "SoundCloud profile",
    };
  }
  if (normalized === "email") {
    return {
      id: "email",
      label: "Email",
      placeholder: "hello@example.com",
      icon: Mail,
      color: "#EA4335",
      hint: "Email address",
    };
  }

  return {
    id: "website",
    label: platform.charAt(0).toUpperCase() + platform.slice(1),
    placeholder: "https://...",
    icon: Globe,
    color: "#3B82F6",
    hint: "External link",
  };
}

export function formatSocialUrl(
  platform: SocialPlatform | string,
  raw: string,
): string {
  const val = raw.trim();
  if (!val) return "";

  if (platform === "email") {
    return val.startsWith("mailto:") ? val : `mailto:${val}`;
  }

  if (val.startsWith("http://") || val.startsWith("https://")) {
    return val;
  }

  // Remove leading @ if present
  const cleanHandle = val.replace(/^@+/, "");

  switch (platform) {
    case "instagram":
      return `https://instagram.com/${cleanHandle}`;
    case "twitter":
      return `https://x.com/${cleanHandle}`;
    case "tiktok":
      return `https://tiktok.com/@${cleanHandle}`;
    case "youtube":
      return `https://youtube.com/@${cleanHandle}`;
    case "github":
      return `https://github.com/${cleanHandle}`;
    case "twitch":
      return `https://twitch.tv/${cleanHandle}`;
    case "telegram":
      return `https://t.me/${cleanHandle}`;
    case "linkedin":
      return cleanHandle.startsWith("in/")
        ? `https://linkedin.com/${cleanHandle}`
        : `https://linkedin.com/in/${cleanHandle}`;
    case "discord":
      return val.includes("discord.gg")
        ? `https://${val}`
        : `https://discord.gg/${val}`;
    case "spotify":
      return val.includes("spotify.com")
        ? `https://${val}`
        : `https://open.spotify.com/${val}`;
    case "soundcloud":
      return `https://soundcloud.com/${cleanHandle}`;
    case "custom":
    case "website":
    default:
      return `https://${val}`;
  }
}
