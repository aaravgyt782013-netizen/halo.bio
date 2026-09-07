import { useEffect, useRef, useState } from "react";
import { Music, Volume2, VolumeX, Eye, BadgeCheck } from "lucide-react";
import type { BioLink, Profile } from "@/lib/bio";
import { ensureProtocol } from "@/lib/bio";

type Props = {
  profile: Profile;
  links: BioLink[];
  /** Preview mode skips the enter overlay lock and disables outbound clicks. */
  preview?: boolean;
  onLinkClick?: (link: BioLink) => void;
};

export function ProfileView({ profile, links, preview = false, onLinkClick }: Props) {
  const [entered, setEntered] = useState(preview);
  const [leaving, setLeaving] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (preview) setEntered(true);
  }, [preview]);

  const handleEnter = () => {
    if (leaving) return;
    setLeaving(true);
    if (profile.music_enabled && profile.music_url) {
      const audio = new Audio(profile.music_url);
      audio.loop = true;
      audio.volume = 0.5;
      audio.play().catch(() => undefined);
      audioRef.current = audio;
    }
    window.setTimeout(() => setEntered(true), 520);
  };

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !audioRef.current.muted;
    setMuted(audioRef.current.muted);
  };

  const cardStyle = {
    backgroundColor: `color-mix(in oklab, white ${Math.round(profile.card_opacity * 100)}%, transparent)`,
    borderRadius: `${profile.card_radius}px`,
    backdropFilter: `blur(${profile.card_blur}px) saturate(180%)`,
    WebkitBackdropFilter: `blur(${profile.card_blur}px) saturate(180%)`,
  } as const;

  return (
    <div className="relative h-full w-full overflow-hidden">
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
            style={{ backgroundColor: profile.background_value || "#eef2f7" }}
          />
        )}
        <div className="absolute inset-0 bg-foreground/10" />
      </div>

      {/* Enter overlay */}
      {!entered && (
        <button
          type="button"
          onClick={handleEnter}
          className={`absolute inset-0 z-40 flex flex-col items-center justify-center gap-3 backdrop-blur-2xl ${
            leaving ? "animate-enter-out" : ""
          }`}
          style={{ backgroundColor: "color-mix(in oklab, white 35%, transparent)" }}
        >
          <span className="animate-pulse-soft font-display text-lg font-semibold tracking-tight text-foreground">
            {profile.enter_text || "click to enter"}
          </span>
          {profile.music_enabled && profile.music_url ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-glass px-3 py-1 text-xs text-muted-foreground">
              <Music className="h-3.5 w-3.5" /> sound on
            </span>
          ) : null}
        </button>
      )}

      {/* Content */}
      <div
        className={`relative z-10 flex h-full flex-col items-center justify-center overflow-y-auto px-5 py-12 ${
          entered ? "animate-float-in" : "opacity-0"
        }`}
      >
        <div
          className="w-full max-w-sm border border-glass-border p-6 text-center shadow-glass"
          style={cardStyle}
        >
          <div className="mx-auto mb-4 h-[86px] w-[86px] overflow-hidden rounded-full border-2 border-glass-border shadow-soft">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={`${profile.username ?? "user"} avatar`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-secondary text-2xl font-semibold text-secondary-foreground">
                {(profile.display_name ?? profile.username ?? "?").slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-1.5">
            <h1 className="font-display text-xl font-semibold text-foreground">
              {profile.display_name || profile.username || "unnamed"}
            </h1>
            {profile.is_premium && (
              <BadgeCheck className="h-4.5 w-4.5" style={{ color: profile.accent_color }} />
            )}
          </div>
          {profile.username && (
            <p className="mt-0.5 text-sm text-muted-foreground">@{profile.username}</p>
          )}
          {profile.bio && (
            <p className="mt-3 text-sm leading-relaxed text-foreground/80">{profile.bio}</p>
          )}

          <div className="mt-5 space-y-2.5">
            {links.length === 0 && (
              <p className="text-xs text-muted-foreground">no links yet</p>
            )}
            {links.map((link) => (
              <a
                key={link.id}
                href={preview ? undefined : ensureProtocol(link.url)}
                target="_blank"
                rel="noreferrer noopener"
                onClick={(e) => {
                  if (preview) e.preventDefault();
                  else onLinkClick?.(link);
                }}
                className="block w-full border border-glass-border px-4 py-3 text-sm font-semibold text-foreground transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
                style={{
                  backgroundColor: "color-mix(in oklab, white 55%, transparent)",
                  borderRadius: `${Math.max(10, profile.card_radius - 8)}px`,
                  boxShadow: `0 6px 20px color-mix(in oklab, ${profile.accent_color} 22%, transparent)`,
                }}
              >
                {link.title}
              </a>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" /> {profile.views}
            </span>
            {profile.music_enabled && profile.music_url && !preview && entered && (
              <button
                type="button"
                onClick={toggleMute}
                className="inline-flex items-center gap-1 rounded-full bg-glass px-2.5 py-1"
                aria-label={muted ? "Unmute music" : "Mute music"}
              >
                {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
