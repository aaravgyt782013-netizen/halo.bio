import { useEffect, useRef, useState } from "react";
import {
  Music,
  Volume2,
  VolumeX,
  Eye,
  BadgeCheck,
  Share2,
  ExternalLink,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import type { BioLink, Profile } from "@/lib/bio";
import { ensureProtocol } from "@/lib/bio";
import { getPlatformConfig } from "@/lib/socials";
import { DEFAULT_PROFILE_THEME, getProfileTheme, type ProfileTheme } from "@/lib/profile-themes";

type Props = {
  profile: Profile;
  links: BioLink[];
  preview?: boolean;
  onEnter?: () => void;
  onLinkClick?: (link: BioLink) => void;
};

function getYouTubeId(url?: string | null): string | null {
  if (!url) return null;
  try {
    const match = url.trim().match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

function getDomainBadge(url: string): string | null {
  try {
    const lower = url.toLowerCase();
    if (lower.includes("spotify.com")) return "Spotify";
    if (lower.includes("youtube.com") || lower.includes("youtu.be")) return "YouTube";
    if (lower.includes("instagram.com")) return "Instagram";
    if (lower.includes("twitter.com") || lower.includes("x.com")) return "X";
    if (lower.includes("github.com")) return "GitHub";
    if (lower.includes("discord.gg") || lower.includes("discord.com")) return "Discord";
    if (lower.includes("tiktok.com")) return "TikTok";
    if (lower.includes("linkedin.com")) return "LinkedIn";
    if (lower.includes("soundcloud.com")) return "SoundCloud";
    return null;
  } catch {
    return null;
  }
}

type ThemeProfile = Profile & { theme?: ProfileTheme };

export function ProfileView({ profile, links, preview = false, onEnter, onLinkClick }: Props) {
  const themedProfile = profile as ThemeProfile;
  const [entered, setEntered] = useState(preview);
  const [leaving, setLeaving] = useState(false);
  const [muted, setMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [liveTheme, setLiveTheme] = useState<ProfileTheme>(() =>
    getProfileTheme(themedProfile.theme),
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setLiveTheme(getProfileTheme(themedProfile.theme));
  }, [themedProfile.theme]);

  // Lets the editor update the phone preview immediately without replacing the
  // existing ProfileView data flow.
  useEffect(() => {
    const onThemePreview = (event: Event) => {
      const custom = event as CustomEvent<ProfileTheme>;
      if (custom.detail) setLiveTheme(getProfileTheme(custom.detail));
    };
    window.addEventListener("halo-theme-preview", onThemePreview);
    return () => window.removeEventListener("halo-theme-preview", onThemePreview);
  }, []);

  const resolvedBgValue =
    profile.background_type === "video" && profile.background_value?.includes("mixkit.co")
      ? "/videos/starry-night.mp4"
      : profile.background_value;
  const ytId = profile.background_type === "video" ? getYouTubeId(resolvedBgValue) : null;

  useEffect(() => {
    setVideoReady(false);
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, [resolvedBgValue, profile.background_type]);

  useEffect(() => {
    if (preview) setEntered(true);
  }, [preview]);

  const handleEnter = () => {
    if (leaving) return;
    setLeaving(true);
    onEnter?.();
    if (profile.music_enabled && profile.music_url) {
      try {
        const audio = new Audio(profile.music_url);
        audio.loop = true;
        audio.volume = 0.45;
        audio.onplay = () => setIsPlaying(true);
        audio.onpause = () => setIsPlaying(false);
        audio.onerror = () => setIsPlaying(false);
        audio.play().catch(() => setIsPlaying(false));
        audioRef.current = audio;
      } catch {
        // ignore invalid audio sources
      }
    }
    window.setTimeout(() => setEntered(true), 520);
  };

  useEffect(() => () => {
    audioRef.current?.pause();
    audioRef.current = null;
  }, []);

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !audioRef.current.muted;
    setMuted(audioRef.current.muted);
  };

  const handleShare = async () => {
    if (preview) return;
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = `${profile.display_name || profile.username}'s Halo Bio`;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // clipboard fallback below
      }
    }
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("Profile link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error("Could not copy link");
      }
    }
  };

  const intensity = profile.glass_intensity || "medium";
  const saturateMap: Record<string, string> = { subtle: "135%", medium: "165%", heavy: "195%", ultra: "235%" };
  const borderOpacityMap: Record<string, string> = { subtle: "0.18", medium: "0.28", heavy: "0.42", ultra: "0.62" };
  const shadowMap: Record<string, string> = {
    subtle: "0 8px 30px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(255,255,255,0.15)",
    medium: "0 14px 44px rgba(0,0,0,0.22), inset 0 1px 1px rgba(255,255,255,0.30)",
    heavy: "0 20px 52px rgba(0,0,0,0.30), inset 0 1px 2px rgba(255,255,255,0.45)",
    ultra: "0 28px 64px rgba(0,0,0,0.40), inset 0 2px 4px rgba(255,255,255,0.65)",
  };

  const theme = liveTheme || DEFAULT_PROFILE_THEME;
  const cardBackground = theme.card.mode === "glass"
    ? `color-mix(in srgb, ${theme.card.background} ${Math.round(Math.max(0.15, profile.card_opacity) * 100)}%, transparent)`
    : theme.card.background;
  const cardStyle = {
    background: cardBackground,
    borderRadius: `${profile.card_radius}px`,
    backdropFilter: `blur(${profile.card_blur}px) saturate(${saturateMap[intensity] || "165%"})`,
    WebkitBackdropFilter: `blur(${profile.card_blur}px) saturate(${saturateMap[intensity] || "165%"})`,
    border: `1px solid ${theme.card.border || `rgba(255,255,255,${borderOpacityMap[intensity] || "0.28"})`}`,
    boxShadow: shadowMap[intensity],
    color: theme.text.primary,
  } as const;

  const legacyMediaActive = profile.background_type === "video" || profile.background_type === "image";
  const themePageStyle = !legacyMediaActive
    ? theme.page.mode === "gradient"
      ? { background: theme.page.value }
      : theme.page.mode === "image"
        ? { backgroundImage: `url(${theme.page.value})`, backgroundSize: "cover", backgroundPosition: "center" }
        : { background: theme.page.value }
    : { background: profile.background_value || theme.page.value };

  return (
    <div className="relative h-full w-full overflow-hidden select-none">
      <div className="absolute inset-0 overflow-hidden" style={themePageStyle}>
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ background: `radial-gradient(circle at 50% 30%, ${theme.accent || profile.accent_color || "#3b82f6"}22 0%, transparent 80%)` }}
        />

        {profile.background_type === "video" && resolvedBgValue ? (
          ytId ? (
            <div className={`pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-700 ${videoReady ? "opacity-100" : "opacity-40"}`}>
              <iframe
                className="pointer-events-none absolute top-1/2 left-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 border-0"
                src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1&enablejsapi=1`}
                allow="autoplay; encrypted-media"
                title="Background Video"
                onLoad={() => setVideoReady(true)}
              />
            </div>
          ) : resolvedBgValue.toLowerCase().includes(".gif") ? (
            <img src={resolvedBgValue} alt="Background GIF" onLoad={() => setVideoReady(true)} className={`h-full w-full object-cover pointer-events-none transition-opacity duration-700 ${videoReady ? "opacity-100" : "opacity-0"}`} />
          ) : (
            <video
              ref={videoRef}
              className={`h-full w-full object-cover pointer-events-none transition-opacity duration-700 ${videoReady ? "opacity-100" : "opacity-0"}`}
              src={resolvedBgValue}
              autoPlay loop muted playsInline preload="auto"
              onCanPlay={() => setVideoReady(true)}
              onLoadedData={() => setVideoReady(true)}
              onEnded={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = 0;
                  videoRef.current.play().catch(() => {});
                }
              }}
            />
          )
        ) : profile.background_type === "image" && resolvedBgValue ? (
          <img src={resolvedBgValue} alt="" loading="lazy" className="h-full w-full object-cover pointer-events-none" />
        ) : null}

        <div className="pointer-events-none absolute inset-0 bg-foreground/15 backdrop-brightness-95" />
      </div>

      {!entered && (
        <button
          type="button"
          onClick={handleEnter}
          className={`absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 px-6 text-center select-none cursor-pointer transition-all duration-500 ${leaving ? "animate-enter-out pointer-events-none" : ""}`}
          style={{ background: "#000000" }}
          aria-label="Click to enter profile"
        >
          <div className="flex flex-col items-center gap-3.5">
            <span className="animate-pulse-soft font-display text-2xl sm:text-3xl font-bold tracking-wider text-white drop-shadow-[0_0_24px_rgba(255,255,255,0.45)]">
              {profile.enter_text || "Click To Enter"}
            </span>
            {profile.music_enabled && profile.music_url ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md shadow-lg">
                <Music className="h-3.5 w-3.5 text-blue-400 animate-pulse" />
                <span>Audio enabled · Tap anywhere</span>
              </span>
            ) : (
              <span className="text-xs font-medium tracking-widest text-white/40 uppercase">Tap anywhere to open</span>
            )}
          </div>
        </button>
      )}

      <div className={`relative z-10 flex h-full flex-col items-center justify-center overflow-y-auto px-4 py-10 ${entered ? "animate-float-in" : "opacity-0"}`}>
        <div className="w-full max-w-sm p-6 text-center shadow-glass relative" style={cardStyle}>
          {!preview && (
            <button type="button" onClick={handleShare} className="absolute right-4 top-4 rounded-full p-2 transition-colors" style={{ color: theme.text.secondary }} title="Share profile" aria-label="Share profile">
              {copied ? <Check className="h-4 w-4" style={{ color: theme.accent }} /> : <Share2 className="h-4 w-4" />}
            </button>
          )}

          <div className="mx-auto mb-4 h-[92px] w-[92px] overflow-hidden rounded-full border-2 shadow-soft" style={{ borderColor: theme.card.border }}>
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={`${profile.username ?? "user"} avatar`} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-secondary text-2xl font-bold" style={{ color: theme.text.secondary }}>
                {(profile.display_name ?? profile.username ?? "?").slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-1.5">
            <h1 className="font-display text-xl font-bold tracking-tight" style={{ color: theme.text.primary }}>
              {profile.display_name || profile.username || "unnamed"}
            </h1>
            {profile.is_premium && <BadgeCheck className="h-5 w-5" style={{ color: theme.accent }} />}
          </div>
          {profile.username && <p className="mt-0.5 text-xs font-semibold tracking-wide" style={{ color: theme.text.secondary }}>@{profile.username}</p>}
          {profile.bio && <p className="mt-3 text-sm leading-relaxed whitespace-pre-line" style={{ color: theme.text.primary, opacity: 0.86 }}>{profile.bio}</p>}

          {profile.social_links && profile.social_links.filter((s) => s.active !== false && !String(s.id).startsWith("__halo_theme")) .length > 0 && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {profile.social_links.filter((s) => s.active !== false && !String(s.id).startsWith("__halo_theme")).map((soc) => {
                const cfg = getPlatformConfig(soc.platform);
                const Icon = cfg.icon;
                const safeSocUrl = ensureProtocol(soc.url);
                const label = soc.title || cfg.label;
                return (
                  <a
                    key={soc.id}
                    href={preview ? undefined : safeSocUrl || "#"}
                    target={preview ? undefined : "_blank"}
                    rel={preview ? undefined : "noreferrer noopener"}
                    onClick={(e) => {
                      if (preview) {
                        e.preventDefault();
                        toast.info(`Preview: ${label} link`);
                      }
                    }}
                    className="group relative flex h-9 w-9 items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95 shadow-sm overflow-hidden"
                    style={{ backgroundColor: soc.icon_url ? "transparent" : `${theme.accent}18`, border: `1px solid ${theme.card.border}` }}
                    title={label}
                  >
                    {soc.icon_url ? <img src={soc.icon_url} alt={label} className="h-full w-full object-cover" loading="lazy" /> : <Icon className="h-4 w-4 transition-colors" style={{ color: theme.text.primary }} />}
                  </a>
                );
              })}
            </div>
          )}

          <div className="mt-5 space-y-2.5">
            {links.length === 0 && <p className="py-2 text-xs" style={{ color: theme.text.secondary }}>No links added yet</p>}
            {links.map((link) => {
              const safeUrl = ensureProtocol(link.url);
              const badge = getDomainBadge(link.url);
              return (
                <a
                  key={link.id}
                  href={preview ? undefined : safeUrl || "#"}
                  target={preview ? undefined : "_blank"}
                  rel={preview ? undefined : "noreferrer noopener"}
                  onClick={(e) => {
                    if (preview) e.preventDefault();
                    else onLinkClick?.(link);
                  }}
                  className="group relative flex items-center justify-between w-full px-4 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 active:scale-[0.98]"
                  style={{
                    background: theme.card.mode === "glass" ? `color-mix(in srgb, ${theme.card.background} 75%, transparent)` : theme.card.background,
                    color: theme.text.primary,
                    border: `1px solid ${theme.card.border}`,
                    borderRadius: `${Math.max(10, profile.card_radius - 8)}px`,
                    boxShadow: `0 6px 20px color-mix(in srgb, ${theme.accent} 20%, transparent)`,
                  }}
                >
                  <span className="truncate pr-2 text-left">{link.title}</span>
                  <div className="flex items-center gap-1.5 shrink-0" style={{ color: theme.text.secondary }}>
                    {badge && <span className="rounded-md px-1.5 py-0.5 text-[10px] font-medium tracking-tight" style={{ backgroundColor: `${theme.text.primary}10` }}>{badge}</span>}
                    <ExternalLink className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                </a>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-center gap-4 text-xs" style={{ color: theme.text.secondary }}>
            <span className="inline-flex items-center gap-1 font-medium"><Eye className="h-3.5 w-3.5" /> {profile.views} views</span>
            {profile.music_enabled && profile.music_url && !preview && entered && (
              <button type="button" onClick={toggleMute} className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-colors" style={{ backgroundColor: `${theme.text.primary}10`, color: theme.text.primary }} aria-label={muted ? "Unmute music" : "Mute music"}>
                {muted ? <VolumeX className="h-3.5 w-3.5" style={{ color: theme.text.secondary }} /> : <><Volume2 className="h-3.5 w-3.5" style={{ color: theme.accent }} />{isPlaying && <span className="flex items-center gap-0.5"><span className="h-2 w-0.5 animate-pulse rounded-full" style={{ backgroundColor: theme.accent }} /><span className="h-3 w-0.5 animate-pulse rounded-full" style={{ backgroundColor: theme.accent }} /><span className="h-1.5 w-0.5 animate-pulse rounded-full" style={{ backgroundColor: theme.accent }} /></span>}</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
