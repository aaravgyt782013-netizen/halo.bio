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

type Props = {
  profile: Profile;
  links: BioLink[];
  /** Preview mode skips the enter overlay lock and disables outbound clicks. */
  preview?: boolean;
  onEnter?: () => void;
  onLinkClick?: (link: BioLink) => void;
};

function getYouTubeId(url?: string | null): string | null {
  if (!url) return null;
  try {
    const trimmed = url.trim();
    const regExp =
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/;
    const match = trimmed.match(regExp);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

function getDomainBadge(url: string): string | null {
  try {
    const lower = url.toLowerCase();
    if (lower.includes("spotify.com")) return "Spotify";
    if (lower.includes("youtube.com") || lower.includes("youtu.be"))
      return "YouTube";
    if (lower.includes("instagram.com")) return "Instagram";
    if (lower.includes("twitter.com") || lower.includes("x.com")) return "X";
    if (lower.includes("github.com")) return "GitHub";
    if (lower.includes("discord.gg") || lower.includes("discord.com"))
      return "Discord";
    if (lower.includes("tiktok.com")) return "TikTok";
    if (lower.includes("linkedin.com")) return "LinkedIn";
    if (lower.includes("soundcloud.com")) return "SoundCloud";
    return null;
  } catch {
    return null;
  }
}

export function ProfileView({
  profile,
  links,
  preview = false,
  onEnter,
  onLinkClick,
}: Props) {
  const [entered, setEntered] = useState(preview);
  const [leaving, setLeaving] = useState(false);
  const [muted, setMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Auto-migrate legacy broken Mixkit URLs to local background video
  const resolvedBgValue =
    profile.background_type === "video" &&
    profile.background_value?.includes("mixkit.co")
      ? "/videos/starry-night.mp4"
      : profile.background_value;

  const ytId =
    profile.background_type === "video" ? getYouTubeId(resolvedBgValue) : null;

  useEffect(() => {
    setVideoReady(false);
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {
        // Handled silently for browser restrictions
      });
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
        audio.onerror = () => {
          console.warn("Audio file could not be played.");
          setIsPlaying(false);
        };
        audio.play().catch(() => {
          setIsPlaying(false);
        });
        audioRef.current = audio;
      } catch (err) {
        console.warn("Audio init error:", err);
      }
    }
    window.setTimeout(() => setEntered(true), 520);
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
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
        // Fallback to clipboard
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
  const saturateMap: Record<string, string> = {
    subtle: "135%",
    medium: "165%",
    heavy: "195%",
    ultra: "235%",
  };
  const borderOpacityMap: Record<string, string> = {
    subtle: "0.18",
    medium: "0.28",
    heavy: "0.42",
    ultra: "0.62",
  };
  const shadowMap: Record<string, string> = {
    subtle:
      "0 8px 30px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(255,255,255,0.15)",
    medium:
      "0 14px 44px rgba(0,0,0,0.22), inset 0 1px 1px rgba(255,255,255,0.30)",
    heavy:
      "0 20px 52px rgba(0,0,0,0.30), inset 0 1px 2px rgba(255,255,255,0.45)",
    ultra:
      "0 28px 64px rgba(0,0,0,0.40), inset 0 2px 4px rgba(255,255,255,0.65)",
  };

  const cardStyle = {
    backgroundColor: `color-mix(in oklab, white ${Math.round(profile.card_opacity * 100)}%, transparent)`,
    borderRadius: `${profile.card_radius}px`,
    backdropFilter: `blur(${profile.card_blur}px) saturate(${saturateMap[intensity] || "165%"})`,
    WebkitBackdropFilter: `blur(${profile.card_blur}px) saturate(${saturateMap[intensity] || "165%"})`,
    border: `1px solid rgba(255, 255, 255, ${borderOpacityMap[intensity] || "0.28"})`,
    boxShadow: shadowMap[intensity] || undefined,
  } as const;

  return (
    <div className="relative h-full w-full overflow-hidden select-none">
      {/* Background layer */}
      <div className="absolute inset-0 bg-[#0b0f19] overflow-hidden">
        {/* Optimistic ambient backdrop layer to eliminate black screen flickers while video links buffer */}
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            background: `radial-gradient(circle at 50% 30%, ${profile.accent_color || "#3b82f6"}22 0%, #0b0f19 80%)`,
          }}
        />

        {profile.background_type === "video" && resolvedBgValue ? (
          ytId ? (
            <div
              className={`pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-700 ease-out ${
                videoReady ? "opacity-100" : "opacity-40"
              }`}
            >
              <iframe
                className="pointer-events-none absolute top-1/2 left-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 object-cover border-0"
                src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1&enablejsapi=1`}
                allow="autoplay; encrypted-media"
                title="Background Video"
                onLoad={() => setVideoReady(true)}
              />
            </div>
          ) : (
            <video
              ref={videoRef}
              className={`h-full w-full object-cover pointer-events-none transition-opacity duration-700 ease-out ${
                videoReady ? "opacity-100" : "opacity-0"
              }`}
              src={resolvedBgValue}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              onCanPlay={() => setVideoReady(true)}
              onLoadedData={() => setVideoReady(true)}
              onEnded={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = 0;
                  videoRef.current.play().catch(() => {});
                }
              }}
              onError={() => {
                console.warn("Video background playback error");
              }}
            />
          )
        ) : profile.background_type === "image" && resolvedBgValue ? (
          <img
            src={resolvedBgValue}
            alt="Background"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : profile.background_type === "color" && resolvedBgValue ? (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: resolvedBgValue }}
          />
        ) : null}
      </div>

      <div className="relative z-10 flex min-h-full flex-col items-center justify-start p-4 sm:p-8">
        <div
          className="w-full max-w-[480px] animate-float-in pb-16"
          style={{
            backgroundColor: `rgba(255, 255, 255, ${(profile.card_opacity / 100) * 0.1})`,
            backdropFilter: `blur(${profile.card_blur}px)`,
            borderRadius: `${profile.card_radius}px`,
            border: "1px solid color-mix(in oklab, white 20%, transparent)",
          }}
        >
          <div className="flex flex-col items-center p-6 text-center">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name || profile.username || "Avatar"}
                className="mb-4 h-24 w-24 rounded-full object-cover shadow-md"
              />
            ) : (
              <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/20 text-3xl text-primary shadow-md">
                {(profile.display_name || profile.username || "?")
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              {profile.display_name || `@${profile.username}`}
            </h1>
            {profile.bio && (
              <p className="mt-2 text-sm text-foreground/90 whitespace-pre-wrap">
                {profile.bio}
              </p>
            )}

            {profile.social_links &&
              profile.social_links.filter((s) => s.active !== false).length >
                0 && (
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  {profile.social_links
                    .filter((s) => s.active !== false)
                    .map((soc) => {
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
                          className={`group relative flex h-9 w-9 items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95 shadow-sm overflow-hidden ${
                            soc.icon_url
                              ? "border-transparent"
                              : "border border-glass-border"
                          }`}
                          style={{
                            backgroundColor:
                              soc.remove_bg || soc.icon_url
                                ? "transparent"
                                : "color-mix(in oklab, white 68%, transparent)",
                            backdropFilter:
                              soc.remove_bg || soc.icon_url
                                ? "none"
                                : `blur(${Math.max(6, profile.card_blur / 2)}px)`,
                          }}
                          title={label}
                          aria-label={label}
                        >
                          {soc.icon_url ? (
                            <img
                              src={soc.icon_url}
                              alt={label}
                              className={`h-full w-full object-cover transition-transform group-hover:scale-110 ${soc.full_cover ? "rounded-full scale-110" : "p-[6px]"}`}
                            />
                          ) : (
                            <Icon className="h-4 w-4 text-foreground/85 transition-colors group-hover:text-foreground" />
                          )}
                        </a>
                      );
                    })}
                </div>
              )}
          </div>
          <div className="mt-5 space-y-2.5">
            {links.length === 0 && (
              <p className="text-xs text-muted-foreground py-2">
                No links added yet
              </p>
            )}
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
                  className="group relative flex items-center justify-between w-full border border-glass-border px-4 py-3 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 active:scale-[0.98]"
                  style={{
                    backgroundColor:
                      "color-mix(in oklab, white 62%, transparent)",
                    borderRadius: `${Math.max(10, profile.card_radius - 8)}px`,
                    boxShadow: `0 6px 20px color-mix(in oklab, ${profile.accent_color} 20%, transparent)`,
                  }}
                >
                  <span className="truncate pr-2 text-left">{link.title}</span>
                  <div className="flex items-center gap-1.5 shrink-0 text-muted-foreground group-hover:text-foreground">
                    {badge && (
                      <span className="rounded-md bg-foreground/5 px-1.5 py-0.5 text-[10px] font-medium tracking-tight">
                        {badge}
                      </span>
                    )}
                    <ExternalLink className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                </a>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 font-medium">
              <Eye className="h-3.5 w-3.5" /> {profile.views} views
            </span>
            {profile.music_enabled &&
              profile.music_url &&
              !preview &&
              entered && (
                <button
                  type="button"
                  onClick={toggleMute}
                  className="inline-flex items-center gap-1.5 rounded-full bg-glass px-2.5 py-1 text-foreground hover:bg-glass/80 transition-colors"
                  aria-label={muted ? "Unmute music" : "Mute music"}
                >
                  {muted ? (
                    <VolumeX className="h-3.5 w-3.5 text-muted-foreground" />
                  ) : (
                    <>
                      <Volume2 className="h-3.5 w-3.5 text-primary" />
                      {isPlaying && (
                        <span className="flex items-center gap-0.5">
                          <span className="h-2 w-0.5 animate-pulse bg-primary rounded-full" />
                          <span className="h-3 w-0.5 animate-pulse bg-primary rounded-full delay-75" />
                          <span className="h-1.5 w-0.5 animate-pulse bg-primary rounded-full delay-150" />
                        </span>
                      )}
                    </>
                  )}
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
