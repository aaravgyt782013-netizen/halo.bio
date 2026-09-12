import { useEffect, useRef, useState } from "react";
import { Music, Volume2, VolumeX, Eye, BadgeCheck, Share2, ExternalLink, Check } from "lucide-react";
import { toast } from "sonner";
import type { BioLink, Profile } from "@/lib/bio";
import { ensureProtocol } from "@/lib/bio";
import { getPlatformConfig } from "@/lib/socials";
import { extractBadges } from "@/lib/profileBadges";
import { ProfileBadges } from "@/components/ProfileBadges";

type Props = { profile: Profile; links: BioLink[]; preview?: boolean; onEnter?: () => void; onLinkClick?: (link: BioLink) => void };

function getYouTubeId(url?: string | null): string | null {
  if (!url) return null;
  try {
    const match = url.trim().match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
    return match ? match[1] : null;
  } catch { return null; }
}

function getDomainPlatform(url: string) {
  const lower = url.toLowerCase();
  if (lower.includes("spotify.com")) return "spotify";
  if (lower.includes("youtube.com") || lower.includes("youtu.be")) return "youtube";
  if (lower.includes("instagram.com")) return "instagram";
  if (lower.includes("twitter.com") || lower.includes("x.com")) return "twitter";
  if (lower.includes("github.com")) return "github";
  if (lower.includes("discord.gg") || lower.includes("discord.com")) return "discord";
  if (lower.includes("tiktok.com")) return "tiktok";
  if (lower.includes("linkedin.com")) return "linkedin";
  if (lower.includes("soundcloud.com")) return "soundcloud";
  if (lower.includes("twitch.tv")) return "twitch";
  if (lower.includes("t.me") || lower.includes("telegram.me")) return "telegram";
  return "website";
}

export function ProfileView({ profile, links, preview = false, onEnter, onLinkClick }: Props) {
  const [entered, setEntered] = useState(preview);
  const [leaving, setLeaving] = useState(false);
  const [muted, setMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const resolvedBgValue = profile.background_type === "video" && profile.background_value?.includes("mixkit.co") ? "/videos/starry-night.mp4" : profile.background_value;
  const ytId = profile.background_type === "video" ? getYouTubeId(resolvedBgValue) : null;

  useEffect(() => {
    setVideoReady(false);
    if (videoRef.current) { videoRef.current.defaultMuted = true; videoRef.current.muted = true; videoRef.current.play().catch(() => {}); }
  }, [resolvedBgValue, profile.background_type]);
  useEffect(() => { if (preview) setEntered(true); }, [preview]);

  const handleEnter = () => {
    if (leaving) return;
    setLeaving(true); onEnter?.();
    if (profile.music_enabled && profile.music_url) {
      try {
        const audio = new Audio(profile.music_url); audio.loop = true; audio.volume = 0.45;
        audio.onplay = () => setIsPlaying(true); audio.onpause = () => setIsPlaying(false); audio.onerror = () => setIsPlaying(false);
        audio.play().catch(() => setIsPlaying(false)); audioRef.current = audio;
      } catch (err) { console.warn("Audio init error:", err); }
    }
    window.setTimeout(() => setEntered(true), 520);
  };
  useEffect(() => () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } }, []);

  const toggleMute = () => { if (!audioRef.current) return; audioRef.current.muted = !audioRef.current.muted; setMuted(audioRef.current.muted); };
  const handleShare = async () => {
    if (preview) return;
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = `${profile.display_name || profile.username}'s Spider Website profile`;
    if (navigator.share) { try { await navigator.share({ title, url }); return; } catch {} }
    if (navigator.clipboard) { try { await navigator.clipboard.writeText(url); setCopied(true); toast.success("Profile link copied to clipboard!"); setTimeout(() => setCopied(false), 2000); } catch { toast.error("Could not copy link"); } }
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
  const cardStyle = { backgroundColor: `color-mix(in oklab, white ${Math.round(profile.card_opacity * 100)}%, transparent)`, borderRadius: `${profile.card_radius}px`, backdropFilter: `blur(${profile.card_blur}px) saturate(${saturateMap[intensity] || "165%"})`, WebkitBackdropFilter: `blur(${profile.card_blur}px) saturate(${saturateMap[intensity] || "165%"})`, border: `1px solid rgba(255, 255, 255, ${borderOpacityMap[intensity] || "0.28"})`, boxShadow: shadowMap[intensity] || undefined } as const;
  const badges = extractBadges(profile.social_links);

  return <div className="relative h-full w-full overflow-hidden select-none">
    <div className="absolute inset-0 bg-[#0b0f19] overflow-hidden">
      <div className="absolute inset-0 transition-opacity duration-1000" style={{ background: `radial-gradient(circle at 50% 30%, ${profile.accent_color || "#3b82f6"}22 0%, #0b0f19 80%)` }} />
      {profile.background_type === "video" && resolvedBgValue ? (ytId ? <div className={`pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-700 ease-out ${videoReady ? "opacity-100" : "opacity-40"}`}><iframe className="pointer-events-none absolute top-1/2 left-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 object-cover border-0" src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1&enablejsapi=1`} allow="autoplay; encrypted-media" title="Background Video" onLoad={() => setVideoReady(true)} /></div> : resolvedBgValue.toLowerCase().includes(".gif") ? <img className={`h-full w-full object-cover pointer-events-none transition-opacity duration-700 ease-out ${videoReady ? "opacity-100" : "opacity-0"}`} src={resolvedBgValue} alt="Background GIF" onLoad={() => setVideoReady(true)} /> : <video ref={videoRef} className={`h-full w-full object-cover pointer-events-none transition-opacity duration-700 ease-out ${videoReady ? "opacity-100" : "opacity-0"}`} src={resolvedBgValue} autoPlay loop muted playsInline preload="auto" onCanPlay={() => setVideoReady(true)} onLoadedData={() => setVideoReady(true)} onEnded={() => { if (videoRef.current) { videoRef.current.currentTime = 0; videoRef.current.play().catch(() => {}); } }} onError={() => console.warn("Video background playback error")} />) : profile.background_type === "image" && resolvedBgValue ? <img src={resolvedBgValue} alt="" className="h-full w-full object-cover pointer-events-none" loading="lazy" /> : <div className="h-full w-full" style={{ backgroundColor: profile.background_value || "#0b0f19" }} />}
      <div className="pointer-events-none absolute inset-0 bg-foreground/15 backdrop-brightness-95" />
    </div>

    {!entered && <button type="button" onClick={handleEnter} className={`absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black px-6 text-center select-none cursor-pointer transition-all duration-500 ${leaving ? "animate-enter-out pointer-events-none" : ""}`} style={{ backgroundColor: "#000000" }} aria-label="Click to enter profile"><div className="flex flex-col items-center gap-3.5"><span className="animate-pulse-soft font-display text-2xl sm:text-3xl font-bold tracking-wider text-white drop-shadow-[0_0_24px_rgba(255,255,255,0.45)]">{profile.enter_text || "Click To Enter"}</span>{profile.music_enabled && profile.music_url ? <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md shadow-lg"><Music className="h-3.5 w-3.5 text-blue-400 animate-pulse" /><span>Audio enabled · Tap anywhere</span></span> : <span className="text-xs font-medium tracking-widest text-white/40 uppercase">Tap anywhere to open</span>}</div></button>}

    <div className={`relative z-10 flex h-full flex-col items-center justify-center overflow-y-auto px-4 py-10 ${entered ? "animate-float-in" : "opacity-0"}`}>
      <div className="w-full max-w-sm border border-glass-border p-6 text-center shadow-glass relative" style={cardStyle}>
        {!preview && <button type="button" onClick={handleShare} className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-black/5 transition-colors" title="Share profile" aria-label="Share profile">{copied ? <Check className="h-4 w-4 text-success" /> : <Share2 className="h-4 w-4" />}</button>}
        <div className="mx-auto mb-4 h-[92px] w-[92px] overflow-hidden rounded-full border-2 border-glass-border shadow-soft">{profile.avatar_url ? <img src={profile.avatar_url} alt={`${profile.username ?? "user"} avatar`} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center bg-secondary text-2xl font-bold text-secondary-foreground">{(profile.display_name ?? profile.username ?? "?").slice(0, 1).toUpperCase()}</div>}</div>
        <div className="flex items-center justify-center gap-1.5"><h1 className="font-display text-xl font-bold text-foreground tracking-tight">{profile.display_name || profile.username || "unnamed"}</h1>{profile.is_premium && <BadgeCheck className="h-5 w-5" style={{ color: profile.accent_color }} />}</div>
        {profile.username && <p className="mt-0.5 text-xs font-semibold text-muted-foreground tracking-wide">@{profile.username}</p>}
        {profile.bio && <p className="mt-3 text-sm leading-relaxed text-foreground/85 whitespace-pre-line">{profile.bio}</p>}

        {badges.length > 0 && <ProfileBadges badges={badges} />}

        {profile.social_links && profile.social_links.filter((s) => s.active !== false && s.platform !== "__spider_profile_badge__" && s.platform !== "__spider_badge_definition__").length > 0 && <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {profile.social_links.filter((s) => s.active !== false && s.platform !== "__spider_profile_badge__" && s.platform !== "__spider_badge_definition__").map((soc) => {
            const cfg = getPlatformConfig(soc.platform); const Icon = cfg.icon; const safeSocUrl = ensureProtocol(soc.url); const label = soc.title || cfg.label;
            return <a key={soc.id} href={preview ? undefined : safeSocUrl || "#"} target={preview ? undefined : "_blank"} rel={preview ? undefined : "noreferrer noopener"} onClick={(e) => { if (preview) { e.preventDefault(); toast.info(`Preview: ${label} link`); } }} className="group relative flex h-9 w-9 items-center justify-center rounded-full border border-glass-border bg-white/5 transition-all hover:scale-110 active:scale-95 shadow-sm overflow-hidden" style={{ color: cfg.color, backdropFilter: `blur(${Math.max(6, profile.card_blur / 2)}px)`, boxShadow: `0 0 12px color-mix(in oklab, ${cfg.color} 22%, transparent)` }} title={label} aria-label={label}>{soc.icon_url ? <img src={soc.icon_url} alt={label} className="h-full w-full object-cover transition-transform group-hover:scale-110" /> : <Icon className="h-4 w-4 transition-colors" />}</a>;
          })}
        </div>}

        <div className="mt-5 space-y-2.5">
          {links.length === 0 && <p className="text-xs text-muted-foreground py-2">No links added yet</p>}
          {links.map((link) => {
            const safeUrl = ensureProtocol(link.url); const platform = getDomainPlatform(link.url); const cfg = getPlatformConfig(platform); const Icon = cfg.icon;
            return <a key={link.id} href={preview ? undefined : safeUrl || "#"} target={preview ? undefined : "_blank"} rel={preview ? undefined : "noreferrer noopener"} onClick={(e) => { if (preview) e.preventDefault(); else onLinkClick?.(link); }} className="group relative flex items-center gap-3 w-full border border-glass-border px-4 py-3 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 active:scale-[0.98]" style={{ backgroundColor: "color-mix(in oklab, white 62%, transparent)", borderRadius: `${Math.max(10, profile.card_radius - 8)}px`, boxShadow: `0 6px 20px color-mix(in oklab, ${profile.accent_color} 20%, transparent)` }}>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-black/15" style={{ color: cfg.color, filter: `drop-shadow(0 0 6px ${cfg.color}55)` }}><Icon className="h-4 w-4" /></span>
              <span className="min-w-0 flex-1 truncate pr-2 text-left">{link.title}</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
            </a>;
          })}
        </div>

        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1 font-medium"><Eye className="h-3.5 w-3.5" /> {profile.views} views</span>{profile.music_enabled && profile.music_url && !preview && entered && <button type="button" onClick={toggleMute} className="inline-flex items-center gap-1.5 rounded-full bg-glass px-2.5 py-1 text-foreground hover:bg-glass/80 transition-colors" aria-label={muted ? "Unmute music" : "Mute music"}>{muted ? <VolumeX className="h-3.5 w-3.5 text-muted-foreground" /> : <><Volume2 className="h-3.5 w-3.5 text-primary" />{isPlaying && <span className="flex items-center gap-0.5"><span className="h-2 w-0.5 animate-pulse bg-primary rounded-full" /><span className="h-3 w-0.5 animate-pulse bg-primary rounded-full delay-75" /><span className="h-1.5 w-0.5 animate-pulse bg-primary rounded-full delay-150" /></span>}</>}</button>}</div>
      </div>
    </div>
  </div>;
}
