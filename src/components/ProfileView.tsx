import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Music,
  Volume2,
  VolumeX,
  Eye,
  BadgeCheck,
  Share2,
  ExternalLink,
  Check,
  Sparkles,
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

  // Hybrid Glassmorphic + Skeuomorphic + Neomorphic card styling
  const cardStyle = {
    backgroundColor: `color-mix(in oklab, white ${Math.round(profile.card_opacity * 100)}%, transparent)`,
    borderRadius: `${profile.card_radius}px`,
    backdropFilter: `blur(${profile.card_blur}px) saturate(200%)`,
    WebkitBackdropFilter: `blur(${profile.card_blur}px) saturate(200%)`,
    boxShadow: `
      0 24px 60px color-mix(in oklab, black 16%, transparent),
      0 4px 16px color-mix(in oklab, ${profile.accent_color} 18%, transparent),
      inset 0 1.5px 2px rgba(255, 255, 255, 0.75),
      inset 0 -1.5px 2px rgba(0, 0, 0, 0.12)
    `,
    borderTop: "1px solid rgba(255, 255, 255, 0.7)",
    borderLeft: "1px solid rgba(255, 255, 255, 0.4)",
    borderRight: "1px solid rgba(255, 255, 255, 0.2)",
    borderBottom: "1px solid rgba(0, 0, 0, 0.15)",
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

        {/* Ambient liquid lighting tint */}
        <div
          className="absolute inset-0 mix-blend-overlay opacity-30"
          style={{
            background: `radial-gradient(circle at 50% 20%, ${profile.accent_color} 0%, transparent 70%)`,
          }}
        />
        <div className="absolute inset-0 bg-black/25 backdrop-brightness-95" />
      </div>

      {/* Animated Liquid Crystal Enter Screen Overlay */}
      <AnimatePresence>
        {!entered && (
          <motion.button
            key="enter-overlay"
            type="button"
            onClick={handleEnter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.08, filter: "blur(10px)" }}
            transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-black/95 px-6 text-center select-none cursor-pointer"
            aria-label="Click to enter profile"
          >
            {/* Concentric liquid ripple waves */}
            <div className="relative flex items-center justify-center">
              <div className="absolute h-36 w-36 rounded-full border border-white/20 animate-ripple-ring" />
              <div
                className="absolute h-48 w-48 rounded-full border border-white/10 animate-ripple-ring"
                style={{ animationDelay: "0.9s" }}
              />

              {/* Skeuomorphic tactile crystal trigger button */}
              <motion.div
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className="relative flex h-24 w-24 items-center justify-center rounded-full p-1 bg-gradient-to-b from-white/30 via-white/10 to-black/60 shadow-[0_12px_32px_rgba(0,0,0,0.8),_inset_0_2px_3px_rgba(255,255,255,0.6)]"
              >
                <div
                  className="flex h-full w-full items-center justify-center rounded-full backdrop-blur-xl transition-all"
                  style={{
                    background: `radial-gradient(circle at 35% 30%, ${profile.accent_color} 0%, rgba(15,23,42,0.9) 80%)`,
                    boxShadow: `0 0 35px ${profile.accent_color}66, inset 0 1px 2px rgba(255,255,255,0.7)`,
                  }}
                >
                  <Sparkles className="h-8 w-8 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] animate-pulse" />
                </div>
              </motion.div>
            </div>

            <div className="flex flex-col items-center gap-2.5 max-w-xs">
              <motion.span
                animate={{ opacity: [0.75, 1, 0.75] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="font-display text-2xl sm:text-3xl font-bold tracking-wider text-white drop-shadow-[0_2px_20px_rgba(255,255,255,0.6)]"
              >
                {profile.enter_text || "Click To Enter"}
              </motion.span>

              {profile.music_enabled && profile.music_url ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/95 backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.5),_inset_0_1px_1px_rgba(255,255,255,0.4)]">
                  <Music className="h-3.5 w-3.5 text-cyan-300 animate-bounce" />
                  <span>Tap anywhere to unlock soundtrack</span>
                </span>
              ) : (
                <span className="text-[11px] font-semibold tracking-widest text-white/50 uppercase">
                  Touch anywhere to open
                </span>
              )}
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Profile Content */}
      <div
        className={`relative z-10 flex h-full flex-col items-center justify-center overflow-y-auto px-3.5 sm:px-4 py-8 sm:py-10 transition-opacity duration-500 ${
          entered ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={entered ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm p-6 text-center relative overflow-hidden"
          style={cardStyle}
        >
          {/* Subtle Liquid Glass diagonal sheen sweep overlay */}
          <div
            className="pointer-events-none absolute -inset-full opacity-20 mix-blend-overlay rotate-12"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)",
            }}
          />

          {/* Top action: Share profile */}
          {!preview && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={handleShare}
              className="absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-foreground shadow-[0_2px_8px_rgba(0,0,0,0.1),_inset_0_1px_1px_rgba(255,255,255,0.8)] transition-colors hover:bg-white/35"
              title="Share profile"
              aria-label="Share profile"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-600" />
              ) : (
                <Share2 className="h-3.5 w-3.5" />
              )}
            </motion.button>
          )}

          {/* Skeuomorphic & Liquid Avatar */}
          <div className="relative mx-auto mb-4 inline-block">
            {/* Pulsing ambient glow ring behind avatar when music is active */}
            <motion.div
              animate={{
                scale: isPlaying ? [1, 1.12, 1] : 1,
                opacity: isPlaying ? [0.5, 0.8, 0.5] : 0.3,
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -inset-1.5 rounded-full blur-md"
              style={{ backgroundColor: profile.accent_color }}
            />

            {/* Avatar frame with raised double bevel */}
            <div className="relative h-[92px] w-[92px] overflow-hidden rounded-full p-[3px] bg-gradient-to-b from-white/90 via-white/40 to-black/20 shadow-[0_8px_20px_rgba(0,0,0,0.25),_inset_0_1px_1px_rgba(255,255,255,0.9)]">
              <div className="h-full w-full overflow-hidden rounded-full bg-card shadow-inner">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={`${profile.username ?? "user"} avatar`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300 text-2xl font-bold text-slate-800">
                    {(profile.display_name ?? profile.username ?? "?")
                      .slice(0, 1)
                      .toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5">
            <h1 className="font-display text-xl font-bold text-foreground tracking-tight">
              {profile.display_name || profile.username || "unnamed"}
            </h1>
            {profile.is_premium && (
              <BadgeCheck
                className="h-5 w-5 drop-shadow-sm"
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
            <p className="mt-3 text-sm leading-relaxed text-foreground/85 whitespace-pre-line px-1">
              {profile.bio}
            </p>
          )}

          {/* Links list with Neomorphic + Skeuomorphic + Liquid Glass styling */}
          <div className="mt-5 space-y-2.5">
            {links.length === 0 && (
              <p className="text-xs text-muted-foreground py-2">
                No links added yet
              </p>
            )}

            {links.map((link, idx) => {
              const safeUrl = ensureProtocol(link.url);
              const badge = getDomainBadge(link.url);
              return (
                <motion.a
                  key={link.id}
                  href={preview ? undefined : safeUrl || "#"}
                  target={preview ? undefined : "_blank"}
                  rel={preview ? undefined : "noreferrer noopener"}
                  onClick={(e) => {
                    if (preview) e.preventDefault();
                    else onLinkClick?.(link);
                  }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.1 + idx * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ scale: 1.025, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative flex items-center justify-between w-full px-4 py-3 text-sm font-semibold text-foreground overflow-hidden cursor-pointer"
                  style={{
                    backgroundColor:
                      "color-mix(in oklab, white 68%, transparent)",
                    borderRadius: `${Math.max(12, profile.card_radius - 8)}px`,
                    backdropFilter: "blur(18px) saturate(180%)",
                    WebkitBackdropFilter: "blur(18px) saturate(180%)",
                    borderTop: "1px solid rgba(255, 255, 255, 0.85)",
                    borderLeft: "1px solid rgba(255, 255, 255, 0.5)",
                    borderRight: "1px solid rgba(255, 255, 255, 0.2)",
                    borderBottom: "1px solid rgba(0, 0, 0, 0.18)",
                    boxShadow: `
                      0 8px 24px color-mix(in oklab, ${profile.accent_color} 22%, rgba(0,0,0,0.08)),
                      0 2px 6px rgba(0,0,0,0.05),
                      inset 0 1px 2px rgba(255, 255, 255, 0.9)
                    `,
                  }}
                >
                  {/* Liquid Glass Shimmer reflection on hover */}
                  <span
                    className="pointer-events-none absolute -inset-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-overlay rotate-12"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.75) 50%, transparent 100%)",
                    }}
                  />

                  <span className="truncate pr-2 text-left tracking-tight">
                    {link.title}
                  </span>

                  <div className="flex items-center gap-1.5 shrink-0 text-muted-foreground group-hover:text-foreground">
                    {badge && (
                      <span className="rounded-md neo-sunken px-2 py-0.5 text-[10px] font-semibold tracking-tight text-foreground/85 shadow-sm">
                        {badge}
                      </span>
                    )}
                    <ExternalLink className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </motion.a>
              );
            })}
          </div>

          {/* Footer Bar: Views & Skeuomorphic Soundwave Equalizer */}
          <div className="mt-6 flex items-center justify-between px-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[11px]">
              <Eye className="h-3.5 w-3.5 text-muted-foreground" />{" "}
              {profile.views || 0} views
            </span>

            {profile.music_enabled &&
              profile.music_url &&
              !preview &&
              entered && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={toggleMute}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-foreground bg-white/25 backdrop-blur-md border border-white/40 shadow-[0_2px_8px_rgba(0,0,0,0.1),_inset_0_1px_1px_rgba(255,255,255,0.8)] transition-all"
                  aria-label={muted ? "Unmute music" : "Mute music"}
                >
                  {muted ? (
                    <>
                      <VolumeX className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-[10px] font-semibold text-muted-foreground">
                        Muted
                      </span>
                    </>
                  ) : (
                    <>
                      <Volume2
                        className="h-3.5 w-3.5"
                        style={{ color: profile.accent_color }}
                      />
                      {/* Animated Equalizer soundwave bars */}
                      <span className="flex items-center gap-0.5 h-3">
                        <span
                          className="w-0.5 rounded-full animate-soundwave-1"
                          style={{ backgroundColor: profile.accent_color }}
                        />
                        <span
                          className="w-0.5 rounded-full animate-soundwave-2"
                          style={{ backgroundColor: profile.accent_color }}
                        />
                        <span
                          className="w-0.5 rounded-full animate-soundwave-3"
                          style={{ backgroundColor: profile.accent_color }}
                        />
                        <span
                          className="w-0.5 rounded-full animate-soundwave-4"
                          style={{ backgroundColor: profile.accent_color }}
                        />
                      </span>
                    </>
                  )}
                </motion.button>
              )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
