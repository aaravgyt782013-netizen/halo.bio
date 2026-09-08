import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Video,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Zap,
} from "lucide-react";

type Props = {
  videoUrl: string;
  accentColor?: string;
  onOpenDirectUrl?: () => void;
};

function getYouTubeId(url?: string | null): string | null {
  if (!url) return null;
  try {
    const trimmed = url.trim();
    const match = trimmed.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/,
    );
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export function VideoPreviewPlayer({
  videoUrl,
  accentColor = "#3b82f6",
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuffered, setIsBuffered] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const cleanUrl = videoUrl?.trim() || "";
  const ytId = getYouTubeId(cleanUrl);

  // Optimistic reset & loading on URL change
  useEffect(() => {
    setHasError(false);
    setIsLoading(Boolean(cleanUrl));
    setIsBuffered(false);
    setCurrentTime(0);
    setDuration(0);

    if (videoRef.current && !ytId && cleanUrl) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = isMuted;
      videoRef.current.preload = "auto";
      videoRef.current.load();
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
          setIsBuffered(true);
        })
        .catch(() => {
          // If browser restricted autoplay, try muted fallback
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current
              .play()
              .then(() => {
                setIsPlaying(true);
                setIsLoading(false);
                setIsBuffered(true);
              })
              .catch(() => {
                setIsPlaying(false);
                setIsLoading(false);
              });
          }
        });
    }
  }, [cleanUrl, ytId, isMuted]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setHasError(true));
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleRestart = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {});
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (!cleanUrl) {
    return (
      <div className="relative aspect-video w-full rounded-xl border border-dashed border-border/80 bg-black/40 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
        <div className="h-10 w-10 rounded-full bg-secondary/80 flex items-center justify-center text-muted-foreground mb-2">
          <Video className="h-5 w-5" />
        </div>
        <p className="text-xs font-semibold text-foreground">
          No Video Selected
        </p>
        <p className="text-[11px] text-muted-foreground max-w-xs mt-1">
          Pick a curated video loop below or enter a video link to see a live
          preview in action.
        </p>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full rounded-xl border border-border/80 bg-black overflow-hidden shadow-lg group">
      {/* Optimistic Ambient Glow while buffering */}
      <div
        className="absolute inset-0 transition-opacity duration-1000 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${accentColor}33 0%, #0b0f19 80%)`,
        }}
      />

      {/* Video Viewport */}
      {ytId ? (
        <div className="relative h-full w-full pointer-events-auto">
          <iframe
            className="h-full w-full object-cover border-0"
            src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=1&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
            allow="autoplay; encrypted-media; picture-in-picture"
            title="Video background preview"
            onLoad={() => {
              setIsLoading(false);
              setIsBuffered(true);
            }}
          />
          <div className="absolute top-2 left-2 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/75 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md border border-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              YouTube Video Stream
            </span>
          </div>
        </div>
      ) : cleanUrl.toLowerCase().includes(".gif") ? (
        <>
          <img
            src={cleanUrl}
            alt="GIF preview"
            className={`h-full w-full object-cover transition-opacity duration-500 ${
              isBuffered ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => {
              setIsLoading(false);
              setIsBuffered(true);
            }}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
          />

          {/* Top Status Badges */}
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/75 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md border border-white/15">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live GIF Preview
              </span>
            </div>
          </div>
          {hasError && (
            <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-4 text-center z-20">
              <AlertCircle className="h-8 w-8 text-destructive mb-2" />
              <p className="text-xs font-semibold text-white">
                GIF Load Error
              </p>
            </div>
          )}
          {isLoading && !hasError && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 pointer-events-none">
              <div className="flex items-center gap-2 rounded-full bg-black/80 px-3 py-1.5 text-xs text-white backdrop-blur-md border border-white/10">
                <span className="h-3 w-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <span>Loading GIF...</span>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <video
            ref={videoRef}
            src={cleanUrl}
            className={`h-full w-full object-cover transition-opacity duration-500 ${
              isBuffered ? "opacity-100" : "opacity-0"
            }`}
            loop
            playsInline
            preload="auto"
            muted={isMuted}
            autoPlay
            onTimeUpdate={() => {
              if (videoRef.current) {
                setCurrentTime(videoRef.current.currentTime);
              }
            }}
            onLoadedData={() => {
              setIsLoading(false);
              setIsBuffered(true);
            }}
            onCanPlay={() => {
              setIsLoading(false);
              setIsBuffered(true);
            }}
            onLoadedMetadata={() => {
              if (videoRef.current) {
                setDuration(videoRef.current.duration);
                setIsLoading(false);
              }
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => {
              if (videoRef.current) {
                videoRef.current.currentTime = 0;
                videoRef.current.play().catch(() => {});
              }
            }}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
          />

          {/* Top Status Badges */}
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/75 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md border border-white/15">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Video Preview
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-mono font-medium text-white/90 backdrop-blur-md">
                <Zap className="h-2.5 w-2.5 text-amber-400" />
                {cleanUrl.endsWith(".mp4")
                  ? "Direct MP4"
                  : cleanUrl.endsWith(".webm")
                    ? "WebM Stream"
                    : cleanUrl.startsWith("/api/media/")
                      ? "Uploaded HD"
                      : cleanUrl.startsWith("/videos")
                        ? "Curated Loop"
                        : "Optimistic Stream"}
              </span>
            </div>

            {duration > 0 && (
              <span className="rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-mono text-white/80 backdrop-blur-md">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            )}
          </div>

          {/* Error Message Overlay */}
          {hasError && (
            <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-4 text-center z-20">
              <AlertCircle className="h-8 w-8 text-destructive mb-2" />
              <p className="text-xs font-semibold text-white">
                Video Playback Error
              </p>
              <p className="text-[11px] text-white/70 max-w-xs mt-1">
                Unable to load video from this URL. Please verify the link is a
                direct public video file (MP4/WebM) or select a curated clip
                below.
              </p>
            </div>
          )}

          {/* Optimistic Loading Indicator */}
          {isLoading && !hasError && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 pointer-events-none">
              <div className="flex items-center gap-2 rounded-full bg-black/80 px-3 py-1.5 text-xs text-white backdrop-blur-md border border-white/10">
                <span className="h-3 w-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <span>Optimistic Buffering...</span>
              </div>
            </div>
          )}

          {/* Controls Overlay Bar */}
          {!hasError && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2.5 flex items-center justify-between z-10">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="rounded-lg bg-white/20 hover:bg-white/30 text-white p-1.5 transition-all active:scale-95 cursor-pointer backdrop-blur-sm"
                  title={isPlaying ? "Pause video" : "Play video"}
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                >
                  {isPlaying ? (
                    <Pause className="h-3.5 w-3.5 fill-current" />
                  ) : (
                    <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={toggleMute}
                  className="rounded-lg bg-white/20 hover:bg-white/30 text-white p-1.5 transition-all active:scale-95 cursor-pointer backdrop-blur-sm"
                  title={isMuted ? "Unmute audio" : "Mute audio"}
                  aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                >
                  {isMuted ? (
                    <VolumeX className="h-3.5 w-3.5" />
                  ) : (
                    <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleRestart}
                  className="rounded-lg bg-white/20 hover:bg-white/30 text-white p-1.5 transition-all active:scale-95 cursor-pointer backdrop-blur-sm"
                  title="Restart video"
                  aria-label="Restart video"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/70 font-medium hidden sm:inline-flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-amber-400" /> Auto-loops on
                  profile
                </span>

                <a
                  href={cleanUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-white/20 hover:bg-white/30 text-white px-2 py-1 text-[10px] font-medium inline-flex items-center gap-1 backdrop-blur-sm transition-all"
                  title="Open source video URL"
                >
                  <span>Source</span>
                  <ExternalLink className="h-2.5 w-2.5 opacity-80" />
                </a>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
