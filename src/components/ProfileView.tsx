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

type Props = {
  profile: Profile;
  links: BioLink[];
  /** Preview mode skips the enter overlay lock and disables outbound clicks. */
  preview?: boolean;
  onEnter?: () => void;
  onLinkClick?: (link: BioLink) => void;
};

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
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  const cardStyle = {
    backgroundColor: `color-mix(in oklab, white ${Math.round(profile.card_opacity * 100)}%, transparent)`,
    borderRadius: `${profile.card_radius}px`,
    backdropFilter: `blur(${profile.card_blur}px) saturate(180%)`,
    WebkitBackdropFilter: `blur(${profile.card_blur}px) saturate(180%)`,
  } as const;

  return (
    <div className="relative h-full w-full overflow-hidden select-none">
      {/* Background layer */}
      <div className="absolute inset-0">
        {profile.background_type === "video" && profile.background_value ? (
          <video
            className="h-full w-full object-cover"
            src={profile.background_value}
            autoPlay
            loop
            muted
            playsInline
          />
        ) : profile.background_type === "image" && profile.background_value ? (
          <img
            src={profile.background_value}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className="h-full w-full"
            style={{ backgroundColor: profile.background_value || "#0b0f19" }}
          />
        )}
        <div className="absolute inset-0 bg-foreground/15 backdrop-brightness-95" />
      </div>

      {/* Black Enter Screen Overlay */}
      {!entered && (
        <button
          type="button"
          onClick={handleEnter}
          className={`absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black px-6 text-center select-none cursor-pointer transition-all duration-500 ${
            leaving ? "animate-enter-out pointer-events-none" : ""
          }`}
          style={{ backgroundColor: "#000000" }}
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
              <span className="text-xs font-medium tracking-widest text-white/40 uppercase">
                Tap anywhere to open
              </span>
            )}
          </div>
        </button>
      )}

      {/* Content */}
      <div
        className={`relative z-10 flex h-full flex-col items-center justify-center overflow-y-auto px-4 py-10 ${
          entered ? "animate-float-in" : "opacity-0"
        }`}
      >
        <div
          className="w-full max-w-sm border border-glass-border p-6 text-center shadow-glass relative"
          style={cardStyle}
        >
          {/* Top action: Share profile */}
          {!preview && (
            <button
              type="button"
              onClick={handleShare}
              className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-black/5 transition-colors"
              title="Share profile"
              aria-label="Share profile"
            >
              {copied ? (
                <Check className="h-4 w-4 text-success" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
            </button>
          )}

          <div className="mx-auto mb-4 h-[92px] w-[92px] overflow-hidden rounded-full border-2 border-glass-border shadow-soft">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={`${profile.username ?? "user"} avatar`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-secondary text-2xl font-bold text-secondary-foreground">
                {(profile.display_name ?? profile.username ?? "?")
                  .slice(0, 1)
                  .toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-1.5">
            <h1 className="font-display text-xl font-bold text-foreground tracking-tight">
              {profile.display_name || profile.username || "unnamed"}
            </h1>
            {profile.is_premium && (
              <BadgeCheck
                className="h-5 w-5"
                style={{ color: profile.accent_color }}
              />
            )}
          </div>
          {profile.username && (
            <p className="mt-0.5 text-xs font-semibold text-muted-foreground tracking-wide">
              @{profile.username}
            </p>
          )}
          {profile.bio && (
            <p className="mt-3 text-sm leading-relaxed text-foreground/85 whitespace-pre-line">
              {profile.bio}
            </p>
          )}

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
