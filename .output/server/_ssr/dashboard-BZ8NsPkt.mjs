import { r as __toESM } from "../_runtime.mjs";
import { n as db, o as optimizeImageDataUrl, r as ensureProtocol, s as uploadMedia } from "./bio-BYbB952i.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { $ as ExternalLink, A as PenLine, B as LoaderCircle, D as Plus, F as MousePointerClick, H as Link2, M as Palette, O as Play, P as Music4, Q as EyeOff, R as LogOut, T as RotateCcw, U as Layers, Z as Eye, _ as SlidersVertical, a as Volume2, g as Smartphone, h as Sparkles, i as VolumeX, it as ChartColumn, j as Pause, k as Pen, l as Upload, lt as ArrowDown, m as Square, nt as CircleAlert, o as Video, ot as ArrowUp, p as Trash2, q as GripVertical, r as X, rt as Check, t as Zap, tt as Copy, v as Shield, w as Save, x as Share2, y as ShieldCheck } from "../_libs/lucide-react.mjs";
import { i as getPlatformConfig, n as SUPPORTED_PLATFORMS, r as formatSocialUrl, t as ProfileView } from "./ProfileView-D2zm3bl7.mjs";
import { n as firebaseAuth } from "./firebase-CxYrSYSJ.mjs";
import { n as useIsAdmin, r as useMyProfile, t as useAuth } from "./useAuth-BjSo3O7_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-BZ8NsPkt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$4 = "/app/applet/src/components/PhoneFrame.tsx";
/** iOS-style device frame used for the live preview in the builder. Fully responsive on mobile. */
function PhoneFrame({ children }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "relative mx-auto w-full max-w-[340px] px-2 sm:px-0",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "relative rounded-[2.5rem] sm:rounded-[3.2rem] border border-border bg-foreground/90 p-2 sm:p-[10px] shadow-lift",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "relative h-[580px] sm:h-[660px] w-full overflow-hidden rounded-[2rem] sm:rounded-[2.7rem] bg-background",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "pointer-events-none absolute left-1/2 top-2 z-30 h-5 w-20 sm:h-6 sm:w-24 -translate-x-1/2 rounded-full bg-foreground/90" }, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 9,
					columnNumber: 11
				}, this), children]
			}, void 0, true, {
				fileName: _jsxFileName$4,
				lineNumber: 8,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName$4,
			lineNumber: 7,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$4,
		lineNumber: 6,
		columnNumber: 5
	}, this);
}
var _jsxFileName$3 = "/app/applet/src/components/FrostedGlassToggle.tsx";
var GLASS_PRESETS = [
	{
		id: "subtle",
		label: "Subtle",
		tagline: "High clarity, soft sheen",
		opacity: .28,
		blur: 8,
		icon: Sparkles,
		previewBg: "rgba(255, 255, 255, 0.22)"
	},
	{
		id: "medium",
		label: "Medium",
		tagline: "Classic frosted acrylic",
		opacity: .52,
		blur: 18,
		icon: Layers,
		previewBg: "rgba(255, 255, 255, 0.48)"
	},
	{
		id: "heavy",
		label: "Heavy",
		tagline: "Deep velvety milk glass",
		opacity: .74,
		blur: 30,
		icon: SlidersVertical,
		previewBg: "rgba(255, 255, 255, 0.72)"
	},
	{
		id: "ultra",
		label: "Ultra",
		tagline: "Crystallized dense acrylic",
		opacity: .88,
		blur: 44,
		icon: Shield,
		previewBg: "rgba(255, 255, 255, 0.90)"
	}
];
function FrostedGlassToggle({ intensity = "medium", currentOpacity, currentBlur, onChange }) {
	const matchedPreset = GLASS_PRESETS.find((p) => p.id === intensity || Math.abs(p.opacity - currentOpacity) < .05 && Math.abs(p.blur - currentBlur) <= 3);
	const activeId = intensity || matchedPreset?.id || "medium";
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-2.5 w-full min-w-0",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
				className: "text-xs font-bold text-foreground flex items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sparkles, { className: "h-3.5 w-3.5 text-primary" }, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 84,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Frosted Glass Intensity Toggle" }, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 85,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 83,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "text-[10px] font-semibold text-primary uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10",
				children: [activeId, " Intensity"]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 87,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$3,
			lineNumber: 82,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid grid-cols-2 sm:grid-cols-4 gap-2 w-full min-w-0",
			children: GLASS_PRESETS.map((preset) => {
				const isSelected = activeId === preset.id;
				const Icon = preset.icon;
				return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					type: "button",
					onClick: () => onChange({
						intensity: preset.id,
						opacity: preset.opacity,
						blur: preset.blur
					}),
					className: `relative flex flex-col items-start p-3 rounded-xl border text-left transition-all active:scale-[0.98] overflow-hidden ${isSelected ? "border-primary bg-primary/10 shadow-sm ring-2 ring-primary/20" : "border-border/80 bg-secondary/40 hover:bg-secondary hover:border-primary/40 text-muted-foreground hover:text-foreground"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "w-full h-3 rounded-md mb-2 border border-white/20 shadow-inner",
							style: {
								backgroundColor: preset.previewBg,
								backdropFilter: `blur(${preset.blur / 2}px)`
							}
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 115,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-1.5 w-full",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { className: `h-3.5 w-3.5 shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground"}` }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 124,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: `text-xs font-bold truncate ${isSelected ? "text-foreground" : "text-foreground/80"}`,
								children: preset.label
							}, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 129,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 123,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-[10px] text-muted-foreground leading-tight mt-1 line-clamp-1",
							children: preset.tagline
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 138,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mt-2 flex items-center gap-2 text-[9px] font-mono text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [Math.round(preset.opacity * 100), "% opac"] }, void 0, true, {
									fileName: _jsxFileName$3,
									lineNumber: 143,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "·" }, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 144,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [preset.blur, "px blur"] }, void 0, true, {
									fileName: _jsxFileName$3,
									lineNumber: 145,
									columnNumber: 17
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 142,
							columnNumber: 15
						}, this)
					]
				}, preset.id, true, {
					fileName: _jsxFileName$3,
					lineNumber: 98,
					columnNumber: 13
				}, this);
			})
		}, void 0, false, {
			fileName: _jsxFileName$3,
			lineNumber: 92,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$3,
		lineNumber: 81,
		columnNumber: 5
	}, this);
}
var _jsxFileName$2 = "/app/applet/src/components/VideoPreviewPlayer.tsx";
function getYouTubeId(url) {
	if (!url) return null;
	try {
		const match = url.trim().match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
		return match ? match[1] : null;
	} catch {
		return null;
	}
}
function VideoPreviewPlayer({ videoUrl, accentColor = "#3b82f6" }) {
	const videoRef = (0, import_react.useRef)(null);
	const [isPlaying, setIsPlaying] = (0, import_react.useState)(true);
	const [isMuted, setIsMuted] = (0, import_react.useState)(true);
	const [hasError, setHasError] = (0, import_react.useState)(false);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [isBuffered, setIsBuffered] = (0, import_react.useState)(false);
	const [currentTime, setCurrentTime] = (0, import_react.useState)(0);
	const [duration, setDuration] = (0, import_react.useState)(0);
	const cleanUrl = videoUrl?.trim() || "";
	const ytId = getYouTubeId(cleanUrl);
	(0, import_react.useEffect)(() => {
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
			videoRef.current.play().then(() => {
				setIsPlaying(true);
				setIsLoading(false);
				setIsBuffered(true);
			}).catch(() => {
				if (videoRef.current) {
					videoRef.current.muted = true;
					setIsMuted(true);
					videoRef.current.play().then(() => {
						setIsPlaying(true);
						setIsLoading(false);
						setIsBuffered(true);
					}).catch(() => {
						setIsPlaying(false);
						setIsLoading(false);
					});
				}
			});
		}
	}, [
		cleanUrl,
		ytId,
		isMuted
	]);
	const togglePlay = () => {
		if (!videoRef.current) return;
		if (isPlaying) {
			videoRef.current.pause();
			setIsPlaying(false);
		} else videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setHasError(true));
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
		videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
	};
	const formatTime = (secs) => {
		if (isNaN(secs) || secs < 0) return "0:00";
		const m = Math.floor(secs / 60);
		const s = Math.floor(secs % 60);
		return `${m}:${s < 10 ? "0" : ""}${s}`;
	};
	if (!cleanUrl) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "relative aspect-video w-full rounded-xl border border-dashed border-border/80 bg-black/40 flex flex-col items-center justify-center p-6 text-center overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "h-10 w-10 rounded-full bg-secondary/80 flex items-center justify-center text-muted-foreground mb-2",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Video, { className: "h-5 w-5" }, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 131,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 130,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-xs font-semibold text-foreground",
				children: "No Video Selected"
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 133,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-[11px] text-muted-foreground max-w-xs mt-1",
				children: "Pick a curated video loop below or enter a video link to see a live preview in action."
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 136,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$2,
		lineNumber: 129,
		columnNumber: 7
	}, this);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "relative aspect-video w-full rounded-xl border border-border/80 bg-black overflow-hidden shadow-lg group",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "absolute inset-0 transition-opacity duration-1000 pointer-events-none",
			style: { background: `radial-gradient(circle at 50% 50%, ${accentColor}33 0%, #0b0f19 80%)` }
		}, void 0, false, {
			fileName: _jsxFileName$2,
			lineNumber: 147,
			columnNumber: 7
		}, this), ytId ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "relative h-full w-full pointer-events-auto",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("iframe", {
				className: "h-full w-full object-cover border-0",
				src: `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=1&showinfo=0&rel=0&modestbranding=1&playsinline=1`,
				allow: "autoplay; encrypted-media; picture-in-picture",
				title: "Video background preview",
				onLoad: () => {
					setIsLoading(false);
					setIsBuffered(true);
				}
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 157,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "absolute top-2 left-2 z-10 pointer-events-none",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "inline-flex items-center gap-1.5 rounded-full bg-black/75 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md border border-white/10",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" }, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 169,
						columnNumber: 15
					}, this), "YouTube Video Stream"]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 168,
					columnNumber: 13
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 167,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$2,
			lineNumber: 156,
			columnNumber: 9
		}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("video", {
				ref: videoRef,
				src: cleanUrl,
				className: `h-full w-full object-cover transition-opacity duration-500 ${isBuffered ? "opacity-100" : "opacity-0"}`,
				loop: true,
				playsInline: true,
				preload: "auto",
				muted: isMuted,
				autoPlay: true,
				onTimeUpdate: () => {
					if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
				},
				onLoadedData: () => {
					setIsLoading(false);
					setIsBuffered(true);
				},
				onCanPlay: () => {
					setIsLoading(false);
					setIsBuffered(true);
				},
				onLoadedMetadata: () => {
					if (videoRef.current) {
						setDuration(videoRef.current.duration);
						setIsLoading(false);
					}
				},
				onPlay: () => setIsPlaying(true),
				onPause: () => setIsPlaying(false),
				onEnded: () => {
					if (videoRef.current) {
						videoRef.current.currentTime = 0;
						videoRef.current.play().catch(() => {});
					}
				},
				onError: () => {
					setHasError(true);
					setIsLoading(false);
				}
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 176,
				columnNumber: 11
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-1.5 flex-wrap",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "inline-flex items-center gap-1.5 rounded-full bg-black/75 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md border border-white/15",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" }, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 224,
							columnNumber: 17
						}, this), "Live Video Preview"]
					}, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 223,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-mono font-medium text-white/90 backdrop-blur-md",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Zap, { className: "h-2.5 w-2.5 text-amber-400" }, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 228,
							columnNumber: 17
						}, this), cleanUrl.endsWith(".mp4") ? "Direct MP4" : cleanUrl.endsWith(".webm") ? "WebM Stream" : cleanUrl.startsWith("/api/media/") ? "Uploaded HD" : cleanUrl.startsWith("/videos") ? "Curated Loop" : "Optimistic Stream"]
					}, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 227,
						columnNumber: 15
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 222,
					columnNumber: 13
				}, this), duration > 0 && /* @__PURE__ */ (void 0)("span", {
					className: "rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-mono text-white/80 backdrop-blur-md",
					children: [
						formatTime(currentTime),
						" / ",
						formatTime(duration)
					]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 242,
					columnNumber: 15
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 221,
				columnNumber: 11
			}, this),
			hasError && /* @__PURE__ */ (void 0)("div", {
				className: "absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-4 text-center z-20",
				children: [
					/* @__PURE__ */ (void 0)(CircleAlert, { className: "h-8 w-8 text-destructive mb-2" }, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 251,
						columnNumber: 15
					}, this),
					/* @__PURE__ */ (void 0)("p", {
						className: "text-xs font-semibold text-white",
						children: "Video Playback Error"
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 252,
						columnNumber: 15
					}, this),
					/* @__PURE__ */ (void 0)("p", {
						className: "text-[11px] text-white/70 max-w-xs mt-1",
						children: "Unable to load video from this URL. Please verify the link is a direct public video file (MP4/WebM) or select a curated clip below."
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 255,
						columnNumber: 15
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 250,
				columnNumber: 13
			}, this),
			isLoading && !hasError && /* @__PURE__ */ (void 0)("div", {
				className: "absolute inset-0 bg-black/40 flex items-center justify-center z-10 pointer-events-none",
				children: /* @__PURE__ */ (void 0)("div", {
					className: "flex items-center gap-2 rounded-full bg-black/80 px-3 py-1.5 text-xs text-white backdrop-blur-md border border-white/10",
					children: [/* @__PURE__ */ (void 0)("span", { className: "h-3 w-3 rounded-full border-2 border-primary border-t-transparent animate-spin" }, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 267,
						columnNumber: 17
					}, this), /* @__PURE__ */ (void 0)("span", { children: "Optimistic Buffering..." }, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 268,
						columnNumber: 17
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 266,
					columnNumber: 15
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 265,
				columnNumber: 13
			}, this),
			!hasError && /* @__PURE__ */ (void 0)("div", {
				className: "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2.5 flex items-center justify-between z-10",
				children: [/* @__PURE__ */ (void 0)("div", {
					className: "flex items-center gap-1.5",
					children: [
						/* @__PURE__ */ (void 0)("button", {
							type: "button",
							onClick: togglePlay,
							className: "rounded-lg bg-white/20 hover:bg-white/30 text-white p-1.5 transition-all active:scale-95 cursor-pointer backdrop-blur-sm",
							title: isPlaying ? "Pause video" : "Play video",
							"aria-label": isPlaying ? "Pause video" : "Play video",
							children: isPlaying ? /* @__PURE__ */ (void 0)(Pause, { className: "h-3.5 w-3.5 fill-current" }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 285,
								columnNumber: 21
							}, this) : /* @__PURE__ */ (void 0)(Play, { className: "h-3.5 w-3.5 fill-current ml-0.5" }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 287,
								columnNumber: 21
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 277,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (void 0)("button", {
							type: "button",
							onClick: toggleMute,
							className: "rounded-lg bg-white/20 hover:bg-white/30 text-white p-1.5 transition-all active:scale-95 cursor-pointer backdrop-blur-sm",
							title: isMuted ? "Unmute audio" : "Mute audio",
							"aria-label": isMuted ? "Unmute audio" : "Mute audio",
							children: isMuted ? /* @__PURE__ */ (void 0)(VolumeX, { className: "h-3.5 w-3.5" }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 299,
								columnNumber: 21
							}, this) : /* @__PURE__ */ (void 0)(Volume2, { className: "h-3.5 w-3.5 text-emerald-400" }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 301,
								columnNumber: 21
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 291,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (void 0)("button", {
							type: "button",
							onClick: handleRestart,
							className: "rounded-lg bg-white/20 hover:bg-white/30 text-white p-1.5 transition-all active:scale-95 cursor-pointer backdrop-blur-sm",
							title: "Restart video",
							"aria-label": "Restart video",
							children: /* @__PURE__ */ (void 0)(RotateCcw, { className: "h-3.5 w-3.5" }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 312,
								columnNumber: 19
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 305,
							columnNumber: 17
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 276,
					columnNumber: 15
				}, this), /* @__PURE__ */ (void 0)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (void 0)("span", {
						className: "text-[10px] text-white/70 font-medium hidden sm:inline-flex items-center gap-1",
						children: [/* @__PURE__ */ (void 0)(Sparkles, { className: "h-3 w-3 text-amber-400" }, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 318,
							columnNumber: 19
						}, this), " Auto-loops on profile"]
					}, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 317,
						columnNumber: 17
					}, this), /* @__PURE__ */ (void 0)("a", {
						href: cleanUrl,
						target: "_blank",
						rel: "noopener noreferrer",
						className: "rounded-lg bg-white/20 hover:bg-white/30 text-white px-2 py-1 text-[10px] font-medium inline-flex items-center gap-1 backdrop-blur-sm transition-all",
						title: "Open source video URL",
						children: [/* @__PURE__ */ (void 0)("span", { children: "Source" }, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 329,
							columnNumber: 19
						}, this), /* @__PURE__ */ (void 0)(ExternalLink, { className: "h-2.5 w-2.5 opacity-80" }, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 330,
							columnNumber: 19
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 322,
						columnNumber: 17
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 316,
					columnNumber: 15
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 275,
				columnNumber: 13
			}, this)
		] }, void 0, true, {
			fileName: _jsxFileName$2,
			lineNumber: 175,
			columnNumber: 9
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$2,
		lineNumber: 145,
		columnNumber: 5
	}, this);
}
var _jsxFileName$1 = "/app/applet/src/components/SocialLinksEditor.tsx";
function SocialLinksEditor({ socialLinks = [], onChange, accentColor = "#3b82f6", userId = "default" }) {
	const [activeTab, setActiveTab] = (0, import_react.useState)("standard");
	const [selectedPlatform, setSelectedPlatform] = (0, import_react.useState)("instagram");
	const [urlInput, setUrlInput] = (0, import_react.useState)("");
	const [customTitle, setCustomTitle] = (0, import_react.useState)("");
	const [customUrl, setCustomUrl] = (0, import_react.useState)("");
	const [customIconUrl, setCustomIconUrl] = (0, import_react.useState)("");
	const [customFullCover, setCustomFullCover] = (0, import_react.useState)(false);
	const [customRemoveBg, setCustomRemoveBg] = (0, import_react.useState)(false);
	const [isUploadingIcon, setIsUploadingIcon] = (0, import_react.useState)(false);
	const [uploadProgress, setUploadProgress] = (0, import_react.useState)(null);
	const fileInputRef = (0, import_react.useRef)(null);
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [editUrlValue, setEditUrlValue] = (0, import_react.useState)("");
	const [editTitleValue, setEditTitleValue] = (0, import_react.useState)("");
	const [editIconUrlValue, setEditIconUrlValue] = (0, import_react.useState)("");
	const [editFullCover, setEditFullCover] = (0, import_react.useState)(false);
	const [editRemoveBg, setEditRemoveBg] = (0, import_react.useState)(false);
	const editFileInputRef = (0, import_react.useRef)(null);
	const currentPlatformConfig = getPlatformConfig(selectedPlatform);
	const handleAddStandard = (e) => {
		e?.preventDefault();
		if (!urlInput.trim()) return;
		const formatted = formatSocialUrl(selectedPlatform, urlInput);
		if (!formatted) return;
		const newLink = {
			id: "soc-" + Math.random().toString(36).substring(2, 9),
			platform: selectedPlatform,
			url: formatted,
			active: true
		};
		onChange([...socialLinks, newLink]);
		setUrlInput("");
		toast.success(`Added ${currentPlatformConfig.label} icon link`);
	};
	const handleAddCustom = (e) => {
		e?.preventDefault();
		if (!customUrl.trim()) {
			toast.error("Please enter a destination link URL");
			return;
		}
		if (!customTitle.trim()) {
			toast.error("Please enter a name or platform title");
			return;
		}
		const formatted = formatSocialUrl("custom", customUrl);
		const newLink = {
			id: "soc-" + Math.random().toString(36).substring(2, 9),
			platform: "custom",
			title: customTitle.trim(),
			icon_url: customIconUrl.trim() || void 0,
			full_cover: customFullCover,
			remove_bg: customRemoveBg,
			url: formatted,
			active: true
		};
		onChange([...socialLinks, newLink]);
		setCustomTitle("");
		setCustomUrl("");
		setCustomIconUrl("");
		setCustomFullCover(false);
		setCustomRemoveBg(false);
		toast.success(`Added custom ${newLink.title} icon link`);
	};
	const handleIconFileUpload = async (e, isForEdit = false) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			toast.error("Please upload an image file (PNG, SVG, JPG, WebP)");
			return;
		}
		setIsUploadingIcon(true);
		try {
			const localBlob = URL.createObjectURL(file);
			if (isForEdit) setEditIconUrlValue(localBlob);
			else setCustomIconUrl(localBlob);
			setUploadProgress(0);
			const uploadedUrl = await uploadMedia(userId, file, "icons", (p) => setUploadProgress(p));
			if (isForEdit) setEditIconUrlValue(uploadedUrl);
			else setCustomIconUrl(uploadedUrl);
			toast.success("Icon uploaded successfully");
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Failed to upload icon";
			toast.error(msg);
		} finally {
			setIsUploadingIcon(false);
			setUploadProgress(null);
			if (e.target) e.target.value = "";
		}
	};
	const handleRemove = (id) => {
		onChange(socialLinks.filter((item) => item.id !== id));
		toast.info("Social icon removed");
	};
	const handleToggleActive = (id) => {
		onChange(socialLinks.map((item) => item.id === id ? {
			...item,
			active: !item.active
		} : item));
	};
	const handleMove = (index, direction) => {
		const targetIndex = direction === "up" ? index - 1 : index + 1;
		if (targetIndex < 0 || targetIndex >= socialLinks.length) return;
		const updated = [...socialLinks];
		const temp = updated[index];
		updated[index] = updated[targetIndex];
		updated[targetIndex] = temp;
		onChange(updated);
	};
	const handleQuickAdd = (platform) => {
		setActiveTab("standard");
		setSelectedPlatform(platform);
		const existing = socialLinks.find((l) => l.platform === platform);
		if (existing) {
			setEditingId(existing.id);
			setEditUrlValue(existing.url);
			setEditTitleValue(existing.title || "");
			setEditIconUrlValue(existing.icon_url || "");
		}
	};
	const handleStartEdit = (link) => {
		setEditingId(link.id);
		setEditUrlValue(link.url);
		setEditTitleValue(link.title || "");
		setEditIconUrlValue(link.icon_url || "");
		setEditFullCover(!!link.full_cover);
		setEditRemoveBg(!!link.remove_bg);
	};
	const handleSaveInlineEdit = (id) => {
		const target = socialLinks.find((l) => l.id === id);
		if (!target) return;
		const formatted = formatSocialUrl(target.platform, editUrlValue);
		if (!formatted) return;
		onChange(socialLinks.map((l) => l.id === id ? {
			...l,
			url: formatted,
			title: editTitleValue.trim() || void 0,
			icon_url: editIconUrlValue.trim() || void 0,
			full_cover: editFullCover,
			remove_bg: editRemoveBg
		} : l));
		setEditingId(null);
		toast.success("Updated social icon link");
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6 w-full min-w-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/60",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
					className: "text-sm font-bold text-foreground flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Share2, { className: "h-4 w-4 text-primary" }, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 239,
						columnNumber: 13
					}, this), "Social Media Icon Links"]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 238,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-xs text-muted-foreground mt-0.5",
					children: "Select from famous creator platforms or upload your own custom icons."
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 242,
					columnNumber: 11
				}, this)] }, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 237,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "inline-flex items-center gap-1 self-start sm:self-auto rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sparkles, { className: "h-3 w-3" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 248,
							columnNumber: 11
						}, this),
						socialLinks.filter((l) => l.active !== false).length,
						" Active"
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 247,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 236,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-center gap-2 p-1 rounded-xl bg-secondary/50 border border-border/60 w-fit",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					type: "button",
					onClick: () => setActiveTab("standard"),
					className: `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === "standard" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
					children: "Famous Icons"
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 255,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					type: "button",
					onClick: () => setActiveTab("custom"),
					className: `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${activeTab === "custom" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Upload, { className: "h-3 w-3 text-primary" }, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 275,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Upload Custom Icon" }, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 276,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 266,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 254,
				columnNumber: 7
			}, this),
			activeTab === "standard" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
						className: "text-xs font-semibold text-muted-foreground block",
						children: "Famous Platforms"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 284,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-wrap gap-1.5",
						children: SUPPORTED_PLATFORMS.map((p) => {
							const Icon = p.icon;
							const isAdded = socialLinks.some((l) => l.platform === p.id);
							const isSelected = selectedPlatform === p.id;
							return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								onClick: () => handleQuickAdd(p.id),
								className: `inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all active:scale-95 ${isSelected ? "bg-primary text-primary-foreground shadow-sm" : isAdded ? "bg-secondary text-foreground border border-primary/30" : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { className: "h-3.5 w-3.5 shrink-0" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 306,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: p.label }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 307,
										columnNumber: 21
									}, this),
									isAdded && /* @__PURE__ */ (void 0)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 309,
										columnNumber: 23
									}, this)
								]
							}, p.id, true, {
								fileName: _jsxFileName$1,
								lineNumber: 294,
								columnNumber: 19
							}, this);
						})
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 287,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 283,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
					onSubmit: handleAddStandard,
					className: "rounded-xl border border-border/80 bg-secondary/30 p-3.5 sm:p-4 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-2",
							children: [(() => {
								const Icon = currentPlatformConfig.icon;
								return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm text-white",
									style: { backgroundColor: currentPlatformConfig.color },
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 330,
										columnNumber: 21
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 326,
									columnNumber: 19
								}, this);
							})(), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-xs font-bold text-foreground block truncate",
									children: ["Add ", currentPlatformConfig.label]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 335,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-[10px] text-muted-foreground block truncate",
									children: currentPlatformConfig.hint
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 338,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 334,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 322,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-col sm:flex-row gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "relative flex-1 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
									type: "text",
									value: urlInput,
									onChange: (e) => setUrlInput(e.target.value),
									placeholder: currentPlatformConfig.placeholder,
									className: "field w-full text-xs font-mono pr-8"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 346,
									columnNumber: 17
								}, this), urlInput && /* @__PURE__ */ (void 0)("button", {
									type: "button",
									onClick: () => setUrlInput(""),
									className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs",
									children: "×"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 354,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 345,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "submit",
								disabled: !urlInput.trim(),
								className: "btn-primary py-2 px-4 text-xs font-semibold shrink-0 inline-flex items-center justify-center gap-1.5 disabled:opacity-40",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "h-3.5 w-3.5" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 369,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Add Icon" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 370,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 364,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 344,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-[11px] text-muted-foreground flex items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sparkles, { className: "h-3 w-3 text-amber-500 shrink-0" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 375,
									columnNumber: 15
								}, this),
								"Tip: Enter your handle like",
								" ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "font-semibold text-foreground",
									children: "@username"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 377,
									columnNumber: 15
								}, this),
								" ",
								"or paste your full profile link."
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 374,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 318,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 281,
				columnNumber: 9
			}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
				onSubmit: handleAddCustom,
				className: "rounded-xl border border-border/80 bg-secondary/30 p-4 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-start gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-col items-center gap-2 shrink-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "relative h-14 w-14 rounded-2xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-background/60 shadow-sm transition-all hover:border-primary cursor-pointer group",
								onClick: () => fileInputRef.current?.click(),
								title: "Click to upload icon file",
								children: customIconUrl ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
									src: customIconUrl,
									alt: "Custom icon preview",
									className: "h-8 w-8 object-contain"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 399,
									columnNumber: 19
								}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex flex-col items-center justify-center text-muted-foreground group-hover:text-primary transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Upload, { className: "h-5 w-5" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 406,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-[9px] font-medium mt-1",
										children: "Upload"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 407,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 405,
									columnNumber: 19
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 393,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
								ref: fileInputRef,
								type: "file",
								accept: "image/png,image/svg+xml,image/jpeg,image/webp,image/gif",
								className: "hidden",
								onChange: (e) => handleIconFileUpload(e, false)
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 412,
								columnNumber: 15
							}, this),
							customIconUrl && /* @__PURE__ */ (void 0)("button", {
								type: "button",
								onClick: () => setCustomIconUrl(""),
								className: "text-[10px] text-destructive hover:underline",
								children: "Clear icon"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 421,
								columnNumber: 17
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 392,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex-1 space-y-3 min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "text-xs font-semibold text-foreground block mb-1",
								children: "Platform / Label Name"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 434,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
								type: "text",
								value: customTitle,
								onChange: (e) => setCustomTitle(e.target.value),
								placeholder: "e.g. Threads, WhatsApp, Pinterest, Steam, Kick, Portfolio",
								className: "field w-full text-xs"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 437,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 433,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "text-xs font-semibold text-foreground block mb-1",
								children: "Target Profile / Website URL"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 447,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
								type: "text",
								value: customUrl,
								onChange: (e) => setCustomUrl(e.target.value),
								placeholder: "https://...",
								className: "field w-full text-xs font-mono"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 450,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 446,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex gap-4 pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
									className: "flex items-center gap-1.5 text-xs font-medium text-muted-foreground cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
										type: "checkbox",
										checked: customFullCover,
										onChange: (e) => setCustomFullCover(e.target.checked),
										className: "rounded border-border bg-background"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 461,
										columnNumber: 19
									}, this), "Full Button Cover"]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 460,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
									className: "flex items-center gap-1.5 text-xs font-medium text-muted-foreground cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
										type: "checkbox",
										checked: customRemoveBg,
										onChange: (e) => setCustomRemoveBg(e.target.checked),
										className: "rounded border-border bg-background"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 465,
										columnNumber: 19
									}, this), "Remove Background"]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 464,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 459,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "text-[11px] text-muted-foreground block mb-1",
								children: "Or paste direct Image / SVG Icon URL (optional)"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 471,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
								type: "text",
								value: customIconUrl,
								onChange: (e) => setCustomIconUrl(e.target.value),
								placeholder: "https://example.com/icon.svg",
								className: "field w-full text-xs font-mono"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 474,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 470,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 432,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 390,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center justify-between pt-2 border-t border-border/40",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-[11px] text-muted-foreground flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sparkles, { className: "h-3 w-3 text-primary" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 487,
							columnNumber: 15
						}, this), "Supports PNG, SVG, WebP with transparency"]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 486,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						type: "submit",
						disabled: !customUrl.trim() || !customTitle.trim() || isUploadingIcon,
						className: "btn-primary py-2 px-4 text-xs font-semibold shrink-0 inline-flex items-center justify-center gap-1.5 disabled:opacity-40",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "h-3.5 w-3.5" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 498,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: isUploadingIcon ? uploadProgress !== null ? `Uploading ${uploadProgress}%...` : "Uploading..." : "Add Custom Icon" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 499,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 491,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 485,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 386,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-xs font-bold text-muted-foreground uppercase tracking-wider",
						children: [
							"Your Social Profiles (",
							socialLinks.length,
							")"
						]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 514,
						columnNumber: 11
					}, this), socialLinks.length > 1 && /* @__PURE__ */ (void 0)("span", {
						className: "text-[11px] text-muted-foreground",
						children: "Use arrows to reorder"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 518,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 513,
					columnNumber: 9
				}, this), socialLinks.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "rounded-xl border border-dashed border-border/80 p-6 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mx-auto h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mb-2",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Share2, { className: "h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 527,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 526,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs font-semibold text-foreground",
							children: "No Social Icon Links Added Yet"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 529,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-[11px] text-muted-foreground max-w-xs mx-auto mt-1",
							children: "Connect your Instagram, TikTok, YouTube, or upload custom icons. They will display as sleek frosted icons on your bio page."
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 532,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 525,
					columnNumber: 11
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-2",
					children: socialLinks.map((link, index) => {
						const isCustom = link.platform === "custom" || !!link.icon_url;
						const config = getPlatformConfig(link.platform);
						const Icon = config.icon;
						const isEditing = editingId === link.id;
						const isActive = link.active !== false;
						const displayName = link.title || config.label;
						return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: `surface flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl border transition-all ${isActive ? "border-border/80 hover:border-primary/50" : "border-border/40 opacity-60 bg-secondary/20"}`,
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-3 min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "h-10 w-10 flex items-center justify-center shrink-0 text-white shadow-sm overflow-hidden",
									style: {
										backgroundColor: isCustom && link.icon_url ? "transparent" : isCustom ? "rgba(139, 92, 246, 0.15)" : config.color,
										border: isCustom && link.icon_url ? "none" : isCustom ? "1px solid rgba(139, 92, 246, 0.3)" : void 0,
										borderRadius: "50%"
									},
									children: link.icon_url ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
										src: link.icon_url,
										alt: displayName,
										className: `h-full w-full object-cover ${link.full_cover ? "rounded-full scale-110" : "p-[6px]"}`
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 577,
										columnNumber: 25
									}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 583,
										columnNumber: 25
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 558,
									columnNumber: 21
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-xs font-bold text-foreground",
												children: displayName
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 589,
												columnNumber: 25
											}, this),
											isCustom && /* @__PURE__ */ (void 0)("span", {
												className: "rounded bg-primary/10 px-1.5 py-0.2 text-[9px] font-semibold text-primary",
												children: "Custom"
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 593,
												columnNumber: 27
											}, this),
											!isActive && /* @__PURE__ */ (void 0)("span", {
												className: "rounded bg-muted px-1.5 py-0.2 text-[9px] font-medium text-muted-foreground",
												children: "Hidden"
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 598,
												columnNumber: 27
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 588,
										columnNumber: 23
									}, this), isEditing ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "space-y-1.5 mt-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center gap-1.5",
											children: [
												isCustom && /* @__PURE__ */ (void 0)("input", {
													type: "text",
													value: editTitleValue,
													onChange: (e) => setEditTitleValue(e.target.value),
													placeholder: "Icon Title",
													className: "field py-1 px-2 text-xs w-1/3"
												}, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 608,
													columnNumber: 31
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
													type: "text",
													value: editUrlValue,
													onChange: (e) => setEditUrlValue(e.target.value),
													placeholder: "URL",
													className: "field py-1 px-2 text-xs font-mono flex-1"
												}, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 618,
													columnNumber: 29
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
													type: "button",
													onClick: () => handleSaveInlineEdit(link.id),
													className: "btn-primary py-1 px-2.5 text-xs shrink-0",
													title: "Save changes",
													children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, { className: "h-3.5 w-3.5" }, void 0, false, {
														fileName: _jsxFileName$1,
														lineNumber: 631,
														columnNumber: 31
													}, this)
												}, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 625,
													columnNumber: 29
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
													type: "button",
													onClick: () => setEditingId(null),
													className: "rounded-lg p-1.5 text-muted-foreground hover:text-foreground",
													title: "Cancel",
													children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { className: "h-3.5 w-3.5" }, void 0, false, {
														fileName: _jsxFileName$1,
														lineNumber: 639,
														columnNumber: 31
													}, this)
												}, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 633,
													columnNumber: 29
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 606,
											columnNumber: 27
										}, this), isCustom && /* @__PURE__ */ (void 0)("div", {
											className: "flex items-center gap-2 text-xs",
											children: [
												/* @__PURE__ */ (void 0)("input", {
													type: "text",
													value: editIconUrlValue,
													onChange: (e) => setEditIconUrlValue(e.target.value),
													placeholder: "Icon URL or upload new",
													className: "field py-0.5 px-2 text-[11px] font-mono flex-1"
												}, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 645,
													columnNumber: 31
												}, this),
												/* @__PURE__ */ (void 0)("button", {
													type: "button",
													onClick: () => editFileInputRef.current?.click(),
													className: "px-2 py-0.5 rounded bg-secondary text-[11px] hover:bg-secondary/80",
													children: "Replace File"
												}, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 654,
													columnNumber: 31
												}, this),
												/* @__PURE__ */ (void 0)("input", {
													ref: editFileInputRef,
													type: "file",
													accept: "image/*",
													className: "hidden",
													onChange: (e) => handleIconFileUpload(e, true)
												}, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 663,
													columnNumber: 31
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 644,
											columnNumber: 29
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 605,
										columnNumber: 25
									}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										onClick: () => handleStartEdit(link),
										className: "text-[11px] font-mono text-muted-foreground truncate hover:text-foreground cursor-pointer",
										title: "Click to edit link",
										children: link.url
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 674,
										columnNumber: 25
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 587,
									columnNumber: 21
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 556,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center justify-end gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										type: "button",
										onClick: () => handleMove(index, "up"),
										disabled: index === 0,
										className: "rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-25",
										title: "Move Up",
										"aria-label": "Move Up",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowUp, { className: "h-3.5 w-3.5" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 695,
											columnNumber: 23
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 687,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										type: "button",
										onClick: () => handleMove(index, "down"),
										disabled: index === socialLinks.length - 1,
										className: "rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-25",
										title: "Move Down",
										"aria-label": "Move Down",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowDown, { className: "h-3.5 w-3.5" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 706,
											columnNumber: 23
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 698,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										type: "button",
										onClick: () => handleToggleActive(link.id),
										className: `rounded-lg p-1.5 transition-colors ${isActive ? "text-primary hover:bg-primary/10" : "text-muted-foreground hover:bg-secondary"}`,
										title: isActive ? "Hide on profile" : "Show on profile",
										"aria-label": isActive ? "Hide on profile" : "Show on profile",
										children: isActive ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { className: "h-3.5 w-3.5" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 723,
											columnNumber: 25
										}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(EyeOff, { className: "h-3.5 w-3.5" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 725,
											columnNumber: 25
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 709,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										type: "button",
										onClick: () => handleStartEdit(link),
										className: "rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary",
										title: "Edit link",
										"aria-label": "Edit link",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Pen, { className: "h-3.5 w-3.5" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 736,
											columnNumber: 23
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 729,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
										href: link.url,
										target: "_blank",
										rel: "noopener noreferrer",
										className: "rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary",
										title: "Test open link",
										"aria-label": "Test open link",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ExternalLink, { className: "h-3.5 w-3.5" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 747,
											columnNumber: 23
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 739,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										type: "button",
										onClick: () => handleRemove(link.id),
										className: "rounded-lg p-1.5 text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-colors ml-1",
										title: "Remove social icon",
										"aria-label": "Remove social icon",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "h-3.5 w-3.5" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 757,
											columnNumber: 23
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 750,
										columnNumber: 21
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 686,
								columnNumber: 19
							}, this)]
						}, link.id, true, {
							fileName: _jsxFileName$1,
							lineNumber: 548,
							columnNumber: 17
						}, this);
					})
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 538,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 512,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 234,
		columnNumber: 5
	}, this);
}
var _jsxFileName = "/app/applet/src/routes/dashboard.tsx?tsr-split=component";
var PRESET_THEMES = [
	{
		name: "Obsidian",
		bgType: "color",
		bgValue: "#090d16",
		accent: "#6366f1",
		opacity: .65,
		blur: 24,
		radius: 24
	},
	{
		name: "Cyber Violet",
		bgType: "color",
		bgValue: "#180d2b",
		accent: "#a855f7",
		opacity: .6,
		blur: 28,
		radius: 26
	},
	{
		name: "Ocean Mist",
		bgType: "color",
		bgValue: "#0c1e2b",
		accent: "#06b6d4",
		opacity: .55,
		blur: 20,
		radius: 24
	},
	{
		name: "Sunset Glow",
		bgType: "color",
		bgValue: "#240c0f",
		accent: "#f97316",
		opacity: .65,
		blur: 22,
		radius: 20
	},
	{
		name: "Emerald",
		bgType: "color",
		bgValue: "#061a14",
		accent: "#10b981",
		opacity: .6,
		blur: 25,
		radius: 22
	},
	{
		name: "Pure Light",
		bgType: "color",
		bgValue: "#f8fafc",
		accent: "#3b82f6",
		opacity: .8,
		blur: 18,
		radius: 24
	}
];
var CURATED_WALLPAPERS = [
	{
		name: "Ethereal Blur",
		url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80"
	},
	{
		name: "Moody Sea",
		url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80"
	},
	{
		name: "Tokyo Night",
		url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&auto=format&fit=crop&q=80"
	},
	{
		name: "Gradient Fluid",
		url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80"
	}
];
var CURATED_VIDEOS = [
	{
		name: "Starry Night",
		url: "/videos/starry-night.mp4"
	},
	{
		name: "Neon Tunnel",
		url: "/videos/neon-tunnel.mp4"
	},
	{
		name: "Ocean Waves",
		url: "/videos/ocean-waves.mp4"
	},
	{
		name: "Gold Fluid",
		url: "/videos/gold-particles.mp4"
	}
];
var CURATED_AUDIO = [
	{
		name: "Lofi Dreamscape",
		url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3"
	},
	{
		name: "Midnight Ambient",
		url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=chill-abstract-intention-12099.mp3"
	},
	{
		name: "Gentle Piano",
		url: "https://cdn.pixabay.com/download/audio/2021/11/25/audio_946e300958.mp3?filename=ambient-piano-amp-strings-10711.mp3"
	}
];
function Dashboard() {
	const navigate = useNavigate();
	const { user, loading } = useAuth();
	const { profile, setProfile, loading: profileLoading } = useMyProfile(user?.id);
	const isAdmin = useIsAdmin(user?.id);
	const [links, setLinks] = (0, import_react.useState)([]);
	const [tab, setTab] = (0, import_react.useState)("links");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [isDirty, setIsDirty] = (0, import_react.useState)(false);
	const [shareModalOpen, setShareModalOpen] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [mobileView, setMobileView] = (0, import_react.useState)("editor");
	const [previewMode, setPreviewMode] = (0, import_react.useState)("profile");
	const [uploadProgress, setUploadProgress] = (0, import_react.useState)(null);
	const [testAudioPlaying, setTestAudioPlaying] = (0, import_react.useState)(false);
	const [testedAudioUrl, setTestedAudioUrl] = (0, import_react.useState)(null);
	const testAudioRef = (0, import_react.useRef)(null);
	const dragIndex = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!loading && !user) navigate({ to: "/auth" });
	}, [
		loading,
		user,
		navigate
	]);
	(0, import_react.useEffect)(() => {
		if (!profileLoading && profile && !profile.username) navigate({ to: "/claim" });
	}, [
		profile,
		profileLoading,
		navigate
	]);
	(0, import_react.useEffect)(() => {
		if (profile?.background_type === "video" && profile.background_value?.includes("mixkit.co")) setProfile((prev) => prev ? {
			...prev,
			background_value: CURATED_VIDEOS[0].url
		} : prev);
	}, [
		profile?.background_type,
		profile?.background_value,
		setProfile
	]);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		db.from("links").select("*").eq("user_id", user.id).order("position", { ascending: true }).then(({ data }) => setLinks(data ?? []));
	}, [user]);
	(0, import_react.useEffect)(() => {
		return () => {
			if (testAudioRef.current) {
				testAudioRef.current.pause();
				testAudioRef.current = null;
			}
		};
	}, []);
	const notifyStoreUpdated = () => {
		if (typeof window !== "undefined") {
			window.dispatchEvent(new CustomEvent("halo-store-updated"));
			try {
				localStorage.setItem("halo_sync_tick", String(Date.now()));
			} catch {}
		}
	};
	const patch = (changes) => {
		setIsDirty(true);
		setProfile((p) => p ? {
			...p,
			...changes
		} : p);
	};
	const saveProfile = async () => {
		if (!profile) return;
		setSaving(true);
		try {
			let finalBgValue = profile.background_value;
			let finalAvatarUrl = profile.avatar_url;
			if (profile.background_type === "image" && finalBgValue?.startsWith("data:image/") && finalBgValue.length > 204800) finalBgValue = await optimizeImageDataUrl(finalBgValue, "background");
			if (profile.background_type === "video") {
				if (!finalBgValue || finalBgValue.includes("mixkit.co")) finalBgValue = CURATED_VIDEOS[0].url;
				else if (finalBgValue.startsWith("data:video/") && finalBgValue.length > 972800) {
					setSaving(false);
					toast.error("Video file could not be saved to server storage and exceeds database limits. Please re-upload or select a video link.", { duration: 6e3 });
					return;
				}
			}
			if (finalAvatarUrl?.startsWith("data:image/") && finalAvatarUrl.length > 51200) finalAvatarUrl = await optimizeImageDataUrl(finalAvatarUrl, "avatar");
			if (finalBgValue !== profile.background_value || finalAvatarUrl !== profile.avatar_url) setProfile((prev) => prev ? {
				...prev,
				background_value: finalBgValue,
				avatar_url: finalAvatarUrl
			} : prev);
			const { error } = await db.from("profiles").update({
				id: profile.id,
				username: profile.username,
				display_name: profile.display_name,
				bio: profile.bio,
				avatar_url: finalAvatarUrl,
				background_type: profile.background_type,
				background_value: finalBgValue,
				card_opacity: profile.card_opacity,
				card_radius: profile.card_radius,
				card_blur: profile.card_blur,
				glass_intensity: profile.glass_intensity || "medium",
				social_links: profile.social_links || [],
				accent_color: profile.accent_color,
				music_url: profile.music_url,
				music_enabled: profile.music_enabled,
				enter_text: profile.enter_text
			}).eq("id", profile.id);
			setSaving(false);
			if (error) toast.error("Could not save changes: " + (error.message || "Please check connection"));
			else {
				setIsDirty(false);
				notifyStoreUpdated();
				toast.success("Page updated successfully! Live page is synced.");
			}
		} catch (err) {
			setSaving(false);
			toast.error("Could not save changes: " + (err instanceof Error ? err.message : "Network error"));
		}
	};
	const addLink = async () => {
		if (!user) return;
		const { data, error } = await db.from("links").insert({
			user_id: user.id,
			title: "New Link",
			url: "https://",
			position: links.length
		}).select().single();
		if (error) {
			toast.error("Could not add link");
			return;
		}
		setLinks((l) => [...l, data]);
		notifyStoreUpdated();
		toast.success("Link added");
	};
	const updateLink = async (id, changes) => {
		setLinks((l) => l.map((x) => x.id === id ? {
			...x,
			...changes
		} : x));
		await db.from("links").update(changes).eq("id", id);
		notifyStoreUpdated();
	};
	const removeLink = async (id) => {
		setLinks((l) => l.filter((x) => x.id !== id));
		await db.from("links").delete().eq("id", id);
		notifyStoreUpdated();
		toast.info("Link removed");
	};
	const moveLink = async (index, direction) => {
		const targetIndex = direction === "up" ? index - 1 : index + 1;
		if (targetIndex < 0 || targetIndex >= links.length) return;
		const next = [...links];
		const [item] = next.splice(index, 1);
		next.splice(targetIndex, 0, item);
		await commitOrder(next);
	};
	const commitOrder = async (ordered) => {
		setLinks(ordered);
		await Promise.all(ordered.map((l, i) => db.from("links").update({ position: i }).eq("id", l.id)));
		notifyStoreUpdated();
	};
	const onDrop = (index) => {
		const from = dragIndex.current;
		dragIndex.current = null;
		if (from === null || from === index) return;
		const next = [...links];
		const [moved] = next.splice(from, 1);
		if (moved) next.splice(index, 0, moved);
		commitOrder(next);
	};
	const upload = async (file, folder, onDone) => {
		if (!user) return;
		try {
			setUploadProgress(0);
			onDone(await uploadMedia(user.id, file, folder, (progress) => {
				setUploadProgress(progress);
			}));
			setIsDirty(true);
			toast.success("Uploaded successfully!");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Upload failed");
		} finally {
			setUploadProgress(null);
		}
	};
	const toggleTestAudio = (url) => {
		if (!url) {
			toast.error("Please enter or select a valid audio URL first");
			return;
		}
		if (testAudioPlaying && testAudioRef.current) {
			testAudioRef.current.pause();
			setTestAudioPlaying(false);
			setTestedAudioUrl(null);
			return;
		}
		try {
			if (testAudioRef.current) testAudioRef.current.pause();
			const audio = new Audio(url);
			audio.volume = .5;
			audio.onended = () => {
				setTestAudioPlaying(false);
				setTestedAudioUrl(null);
			};
			audio.onerror = () => {
				toast.error("Audio URL could not be loaded");
				setTestAudioPlaying(false);
				setTestedAudioUrl(null);
			};
			audio.play().then(() => {
				setTestAudioPlaying(true);
				setTestedAudioUrl(url);
			}).catch(() => {
				toast.error("Autoplay prevented or audio source invalid");
				setTestAudioPlaying(false);
				setTestedAudioUrl(null);
			});
			testAudioRef.current = audio;
		} catch {
			toast.error("Failed to initialize audio player");
		}
	};
	const applyTheme = (preset) => {
		patch({
			background_type: preset.bgType,
			background_value: preset.bgValue,
			accent_color: preset.accent,
			card_opacity: preset.opacity,
			card_blur: preset.blur,
			card_radius: preset.radius
		});
		toast.success(`Applied ${preset.name} theme!`);
	};
	if (loading || profileLoading || !profile) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-screen items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "h-6 w-6 animate-spin text-primary" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 373,
			columnNumber: 9
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 372,
		columnNumber: 12
	}, this);
	const totalClicks = links.reduce((acc, l) => acc + (l.clicks || 0), 0);
	const totalViews = profile.views || 0;
	const ctr = totalViews > 0 ? (totalClicks / totalViews * 100).toFixed(1) : "0.0";
	const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/${profile.username}` : `https://halo.bio/${profile.username}`;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "relative min-h-screen w-full overflow-x-hidden",
		children: [
			uploadProgress !== null && /* @__PURE__ */ (void 0)("div", {
				className: "fixed top-0 left-0 right-0 z-[100]",
				children: [/* @__PURE__ */ (void 0)("div", {
					className: "h-1.5 w-full bg-secondary overflow-hidden",
					children: /* @__PURE__ */ (void 0)("div", {
						className: "h-full bg-primary transition-all duration-300 ease-out",
						style: { width: `${uploadProgress}%` }
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 383,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 382,
					columnNumber: 11
				}, this), /* @__PURE__ */ (void 0)("div", {
					className: "absolute top-2 right-4 rounded-md bg-background/90 backdrop-blur-sm px-2 py-1 text-[10px] font-bold text-foreground border border-border shadow-sm",
					children: [
						"Uploading: ",
						uploadProgress,
						"%"
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 387,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 381,
				columnNumber: 35
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "aura pointer-events-none absolute inset-0 -z-10" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 391,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
				className: "mx-auto flex max-w-6xl w-full flex-wrap items-center justify-between gap-2.5 px-3.5 sm:px-5 py-3 sm:py-4 border-b border-border/40 min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-2.5 min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: "/",
							className: "font-display text-lg sm:text-xl font-bold tracking-tight text-foreground hover:opacity-85 shrink-0",
							children: ["halo", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-primary",
								children: ".bio"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 397,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 396,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "truncate rounded-full bg-secondary/80 px-2.5 py-0.5 text-xs font-semibold text-muted-foreground max-w-[130px] sm:max-w-[200px]",
							children: ["@", profile.username]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 399,
							columnNumber: 11
						}, this),
						isDirty && /* @__PURE__ */ (void 0)("span", {
							className: "shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary",
							children: "Unsaved"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 402,
							columnNumber: 23
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 395,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-wrap items-center gap-1.5 sm:gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex lg:hidden rounded-lg bg-secondary p-0.5 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								onClick: () => setMobileView("editor"),
								className: `flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${mobileView === "editor" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`,
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PenLine, { className: "h-3.5 w-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 411,
									columnNumber: 15
								}, this), " Editor"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 410,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								onClick: () => setMobileView("preview"),
								className: `flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${mobileView === "preview" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`,
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Smartphone, { className: "h-3.5 w-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 414,
									columnNumber: 15
								}, this), " Preview"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 413,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 409,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							type: "button",
							onClick: () => setShareModalOpen(true),
							className: "btn-ghost py-1.5 px-2.5 sm:px-3.5 text-xs shrink-0",
							title: "Share & QR Code",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Share2, { className: "h-3.5 w-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 419,
									columnNumber: 13
								}, this),
								" ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "hidden sm:inline",
									children: "Share"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 420,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 418,
							columnNumber: 11
						}, this),
						isAdmin && /* @__PURE__ */ (void 0)(Link, {
							to: "/admin",
							className: "btn-ghost py-1.5 px-2.5 sm:px-3 text-xs shrink-0",
							children: [/* @__PURE__ */ (void 0)(ShieldCheck, { className: "h-3.5 w-3.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 424,
								columnNumber: 15
							}, this), " Staff"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 423,
							columnNumber: 23
						}, this),
						profile.username && /* @__PURE__ */ (void 0)("button", {
							type: "button",
							onClick: async () => {
								if (isDirty) await saveProfile();
								window.open(`/${profile.username}`, "_blank");
							},
							className: "btn-ghost py-1.5 px-2.5 sm:px-3.5 text-xs shrink-0",
							title: "View live public profile (auto-saves changes)",
							children: [
								/* @__PURE__ */ (void 0)(ExternalLink, { className: "h-3.5 w-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 433,
									columnNumber: 15
								}, this),
								" ",
								/* @__PURE__ */ (void 0)("span", {
									className: "hidden sm:inline",
									children: "View Live"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 434,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 427,
							columnNumber: 32
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							onClick: saveProfile,
							disabled: saving,
							className: "btn-primary py-1.5 px-3 sm:px-4 text-xs shrink-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Save, { className: "h-3.5 w-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 438,
									columnNumber: 13
								}, this),
								" ",
								saving ? "Saving…" : "Save"
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 437,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							onClick: async () => {
								await firebaseAuth.signOut();
								navigate({ to: "/" });
							},
							className: "btn-ghost py-1.5 px-2 sm:px-2.5 text-xs shrink-0",
							title: "Log out",
							"aria-label": "Log out",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LogOut, { className: "h-3.5 w-3.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 447,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 441,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 407,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 394,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mx-auto max-w-6xl w-full px-3 sm:px-5 pt-4 sm:pt-6 min-w-0",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 w-full",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "glass rounded-xl p-3 sm:p-3.5 flex items-center gap-2.5 sm:gap-3 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { className: "h-4 w-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 457,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 456,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-[10px] sm:text-[11px] font-semibold text-muted-foreground truncate",
									children: "Total Views"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 460,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "font-display text-base sm:text-lg font-bold text-foreground truncate",
									children: totalViews
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 463,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 459,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 455,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "glass rounded-xl p-3 sm:p-3.5 flex items-center gap-2.5 sm:gap-3 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-success/15 text-success",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MousePointerClick, { className: "h-4 w-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 471,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 470,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-[10px] sm:text-[11px] font-semibold text-muted-foreground truncate",
									children: "Total Clicks"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 474,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "font-display text-base sm:text-lg font-bold text-foreground truncate",
									children: totalClicks
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 477,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 473,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 469,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "glass rounded-xl p-3 sm:p-3.5 flex items-center gap-2.5 sm:gap-3 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChartColumn, { className: "h-4 w-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 485,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 484,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-[10px] sm:text-[11px] font-semibold text-muted-foreground truncate",
									children: "Click Rate"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 488,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "font-display text-base sm:text-lg font-bold text-foreground truncate",
									children: [ctr, "%"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 491,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 487,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 483,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "glass rounded-xl p-3 sm:p-3.5 flex items-center gap-2.5 sm:gap-3 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link2, { className: "h-4 w-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 499,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 498,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-[10px] sm:text-[11px] font-semibold text-muted-foreground truncate",
									children: "Active Links"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 502,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "font-display text-base sm:text-lg font-bold text-foreground truncate",
									children: links.length
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 505,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 501,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 497,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 454,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 453,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
				className: "mx-auto grid max-w-6xl w-full min-w-0 gap-6 px-3 sm:px-5 py-4 sm:py-6 lg:grid-cols-[minmax(0,1fr)_360px]",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
					className: `glass-panel p-3.5 sm:p-7 shadow-lift w-full min-w-0 max-w-full overflow-hidden ${mobileView === "preview" ? "hidden lg:block" : "block"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mb-6 grid grid-cols-2 sm:grid-cols-4 gap-1 rounded-xl bg-secondary/80 p-1 w-full min-w-0",
							children: [
								[
									"links",
									"Links",
									Link2
								],
								[
									"socials",
									"Social Icons",
									Share2
								],
								[
									"appearance",
									"Appearance",
									Palette
								],
								[
									"effects",
									"Media & FX",
									Music4
								]
							].map(([key, label, Icon]) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								onClick: () => setTab(key),
								className: `inline-flex items-center justify-center gap-1 sm:gap-1.5 rounded-lg px-2 py-2 text-[11px] sm:text-xs font-semibold transition-all min-w-0 truncate ${tab === key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { className: "h-3.5 w-3.5 shrink-0" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 519,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "truncate",
									children: label
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 520,
									columnNumber: 17
								}, this)]
							}, key, true, {
								fileName: _jsxFileName,
								lineNumber: 518,
								columnNumber: 192
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 517,
							columnNumber: 11
						}, this),
						tab === "links" && /* @__PURE__ */ (void 0)("div", {
							className: "space-y-3.5 w-full min-w-0",
							children: [
								/* @__PURE__ */ (void 0)("div", {
									className: "flex items-center justify-between pb-1 min-w-0",
									children: [/* @__PURE__ */ (void 0)("span", {
										className: "text-xs font-semibold text-muted-foreground truncate",
										children: [
											"Your bio links (",
											links.length,
											")"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 527,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("button", {
										onClick: addLink,
										className: "btn-primary py-1 px-3 text-xs shrink-0 inline-flex items-center gap-1",
										children: [/* @__PURE__ */ (void 0)(Plus, { className: "h-3.5 w-3.5" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 531,
											columnNumber: 19
										}, this), " Add Link"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 530,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 526,
									columnNumber: 15
								}, this),
								links.length === 0 ? /* @__PURE__ */ (void 0)("div", {
									className: "rounded-2xl border border-dashed border-border/80 p-6 sm:p-8 text-center w-full min-w-0",
									children: [
										/* @__PURE__ */ (void 0)("p", {
											className: "text-sm font-semibold text-foreground",
											children: "No links yet"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 536,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (void 0)("p", {
											className: "mt-1 text-xs text-muted-foreground max-w-xs mx-auto",
											children: "Add your first link to YouTube, Spotify, store, or portfolio."
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 539,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (void 0)("button", {
											onClick: addLink,
											className: "btn-primary mt-4 py-2 px-4 text-xs",
											children: [/* @__PURE__ */ (void 0)(Plus, { className: "h-4 w-4" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 544,
												columnNumber: 21
											}, this), " Add your first link"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 543,
											columnNumber: 19
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 535,
									columnNumber: 37
								}, this) : links.map((link, i) => /* @__PURE__ */ (void 0)("div", {
									draggable: true,
									onDragStart: () => dragIndex.current = i,
									onDragOver: (e) => e.preventDefault(),
									onDrop: () => onDrop(i),
									className: "surface flex flex-col sm:flex-row items-stretch sm:items-start gap-2.5 p-3 sm:p-3.5 rounded-xl border border-border/70 min-w-0 w-full",
									children: [
										/* @__PURE__ */ (void 0)("div", {
											className: "flex items-center justify-between sm:justify-start gap-2 min-w-0",
											children: [
												/* @__PURE__ */ (void 0)(GripVertical, { className: "h-4 w-4 shrink-0 cursor-grab text-muted-foreground hover:text-foreground hidden sm:block mt-2.5" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 548,
													columnNumber: 23
												}, this),
												/* @__PURE__ */ (void 0)("span", {
													className: "text-[10px] font-bold text-muted-foreground uppercase sm:hidden",
													children: ["Link #", i + 1]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 549,
													columnNumber: 23
												}, this),
												/* @__PURE__ */ (void 0)("div", {
													className: "flex items-center gap-0.5 sm:hidden",
													children: [
														/* @__PURE__ */ (void 0)("button", {
															type: "button",
															onClick: () => moveLink(i, "up"),
															disabled: i === 0,
															className: "rounded p-1 text-muted-foreground hover:bg-secondary disabled:opacity-30",
															title: "Move up",
															children: /* @__PURE__ */ (void 0)(ArrowUp, { className: "h-3.5 w-3.5" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 554,
																columnNumber: 27
															}, this)
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 553,
															columnNumber: 25
														}, this),
														/* @__PURE__ */ (void 0)("button", {
															type: "button",
															onClick: () => moveLink(i, "down"),
															disabled: i === links.length - 1,
															className: "rounded p-1 text-muted-foreground hover:bg-secondary disabled:opacity-30",
															title: "Move down",
															children: /* @__PURE__ */ (void 0)(ArrowDown, { className: "h-3.5 w-3.5" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 557,
																columnNumber: 27
															}, this)
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 556,
															columnNumber: 25
														}, this),
														/* @__PURE__ */ (void 0)("button", {
															onClick: () => removeLink(link.id),
															"aria-label": `Delete ${link.title}`,
															className: "rounded p-1 text-muted-foreground hover:bg-secondary hover:text-destructive transition-colors ml-1",
															title: "Delete link",
															children: /* @__PURE__ */ (void 0)(Trash2, { className: "h-3.5 w-3.5" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 560,
																columnNumber: 27
															}, this)
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 559,
															columnNumber: 25
														}, this)
													]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 552,
													columnNumber: 23
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 547,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "grid flex-1 gap-2 sm:grid-cols-2 min-w-0 w-full",
											children: [/* @__PURE__ */ (void 0)("div", {
												className: "min-w-0 w-full",
												children: [/* @__PURE__ */ (void 0)("label", {
													className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1",
													children: "Label"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 567,
													columnNumber: 25
												}, this), /* @__PURE__ */ (void 0)("input", {
													className: "field w-full min-w-0 text-xs sm:text-sm",
													value: link.title,
													placeholder: "e.g. My Latest Song",
													onChange: (e) => updateLink(link.id, { title: e.target.value })
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 570,
													columnNumber: 25
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 566,
												columnNumber: 23
											}, this), /* @__PURE__ */ (void 0)("div", {
												className: "min-w-0 w-full",
												children: [/* @__PURE__ */ (void 0)("label", {
													className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1",
													children: "URL destination"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 575,
													columnNumber: 25
												}, this), /* @__PURE__ */ (void 0)("input", {
													className: "field w-full min-w-0 text-xs sm:text-sm",
													value: link.url,
													placeholder: "https://…",
													onChange: (e) => updateLink(link.id, { url: e.target.value }),
													onBlur: (e) => updateLink(link.id, { url: ensureProtocol(e.target.value) })
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 578,
													columnNumber: 25
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 574,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 565,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "hidden sm:flex flex-col items-end gap-1 shrink-0 pt-1",
											children: [/* @__PURE__ */ (void 0)("div", {
												className: "flex items-center gap-0.5",
												children: [
													/* @__PURE__ */ (void 0)("button", {
														type: "button",
														onClick: () => moveLink(i, "up"),
														disabled: i === 0,
														className: "rounded p-1 text-muted-foreground hover:bg-secondary disabled:opacity-30",
														title: "Move up",
														children: /* @__PURE__ */ (void 0)(ArrowUp, { className: "h-3.5 w-3.5" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 589,
															columnNumber: 27
														}, this)
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 588,
														columnNumber: 25
													}, this),
													/* @__PURE__ */ (void 0)("button", {
														type: "button",
														onClick: () => moveLink(i, "down"),
														disabled: i === links.length - 1,
														className: "rounded p-1 text-muted-foreground hover:bg-secondary disabled:opacity-30",
														title: "Move down",
														children: /* @__PURE__ */ (void 0)(ArrowDown, { className: "h-3.5 w-3.5" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 592,
															columnNumber: 27
														}, this)
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 591,
														columnNumber: 25
													}, this),
													/* @__PURE__ */ (void 0)("button", {
														onClick: () => removeLink(link.id),
														"aria-label": `Delete ${link.title}`,
														className: "rounded p-1 text-muted-foreground hover:bg-secondary hover:text-destructive transition-colors ml-1",
														title: "Delete link",
														children: /* @__PURE__ */ (void 0)(Trash2, { className: "h-3.5 w-3.5" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 595,
															columnNumber: 27
														}, this)
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 594,
														columnNumber: 25
													}, this)
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 587,
												columnNumber: 23
											}, this), /* @__PURE__ */ (void 0)("span", {
												className: "text-[10px] font-medium text-muted-foreground pr-1",
												children: [link.clicks || 0, " clicks"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 598,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 586,
											columnNumber: 21
										}, this)
									]
								}, link.id, true, {
									fileName: _jsxFileName,
									lineNumber: 546,
									columnNumber: 49
								}, this)),
								/* @__PURE__ */ (void 0)("p", {
									className: "text-xs text-muted-foreground pt-1",
									children: "Tip: Drag rows or use arrow buttons to reorder. Changes sync live on your page."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 604,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 525,
							columnNumber: 31
						}, this),
						tab === "socials" && /* @__PURE__ */ (void 0)(SocialLinksEditor, {
							socialLinks: profile.social_links || [],
							onChange: (updated) => patch({ social_links: updated }),
							accentColor: profile.accent_color,
							userId: user?.id
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 611,
							columnNumber: 33
						}, this),
						tab === "appearance" && /* @__PURE__ */ (void 0)("div", {
							className: "space-y-6 w-full min-w-0",
							children: [
								/* @__PURE__ */ (void 0)("div", {
									className: "w-full min-w-0",
									children: [/* @__PURE__ */ (void 0)("span", {
										className: "label-text flex items-center gap-1.5",
										children: [/* @__PURE__ */ (void 0)(Sparkles, { className: "h-3.5 w-3.5 text-primary" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 620,
											columnNumber: 19
										}, this), " Curated Design Themes"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 619,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "grid grid-cols-3 sm:grid-cols-6 gap-2 mt-2 w-full min-w-0",
										children: PRESET_THEMES.map((preset) => /* @__PURE__ */ (void 0)("button", {
											type: "button",
											onClick: () => applyTheme(preset),
											className: "group flex flex-col items-center gap-1.5 rounded-xl border border-border/80 bg-card p-2 text-center hover:border-primary/50 transition-all active:scale-95 min-w-0",
											children: [/* @__PURE__ */ (void 0)("div", {
												className: "h-7 sm:h-8 w-full rounded-lg border border-white/20 shadow-inner flex items-start",
												style: { backgroundColor: preset.bgValue },
												children: /* @__PURE__ */ (void 0)("div", {
													className: "h-2 w-2 rounded-full m-1",
													style: { backgroundColor: preset.accent }
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 628,
													columnNumber: 25
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 625,
												columnNumber: 23
											}, this), /* @__PURE__ */ (void 0)("span", {
												className: "text-[10px] font-semibold text-foreground truncate w-full",
												children: preset.name
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 632,
												columnNumber: 23
											}, this)]
										}, preset.name, true, {
											fileName: _jsxFileName,
											lineNumber: 624,
											columnNumber: 48
										}, this))
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 623,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 618,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "grid gap-4 sm:grid-cols-2 w-full min-w-0",
									children: [/* @__PURE__ */ (void 0)("label", {
										className: "block w-full min-w-0",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: "label-text",
											children: "Display Name"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 641,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("input", {
											className: "field w-full min-w-0",
											value: profile.display_name ?? "",
											onChange: (e) => patch({ display_name: e.target.value }),
											placeholder: "Your Name or Brand"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 642,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 640,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("label", {
										className: "block w-full min-w-0",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: "label-text",
											children: "Accent Color"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 647,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("div", {
											className: "flex items-center gap-2 w-full min-w-0",
											children: [/* @__PURE__ */ (void 0)("input", {
												type: "color",
												className: "field h-[42px] w-12 shrink-0 p-1 cursor-pointer rounded-lg",
												value: profile.accent_color,
												onChange: (e) => patch({ accent_color: e.target.value })
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 649,
												columnNumber: 21
											}, this), /* @__PURE__ */ (void 0)("input", {
												type: "text",
												className: "field flex-1 min-w-0 font-mono uppercase text-xs",
												value: profile.accent_color,
												onChange: (e) => patch({ accent_color: e.target.value })
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 652,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 648,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 646,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 639,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("label", {
									className: "block w-full min-w-0",
									children: [/* @__PURE__ */ (void 0)("span", {
										className: "label-text",
										children: "Bio description"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 660,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("textarea", {
										className: "field min-h-20 sm:min-h-24 resize-y text-sm w-full min-w-0",
										maxLength: 280,
										value: profile.bio ?? "",
										onChange: (e) => patch({ bio: e.target.value }),
										placeholder: "Tell people who you are, what you create, or your mission…"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 661,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 659,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "w-full min-w-0",
									children: [/* @__PURE__ */ (void 0)("span", {
										className: "label-text",
										children: "Profile Avatar"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 668,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "flex flex-col sm:flex-row sm:items-center gap-3.5 min-w-0 w-full",
										children: [/* @__PURE__ */ (void 0)("div", {
											className: "h-16 w-16 overflow-hidden rounded-full border border-border bg-secondary shrink-0 shadow-soft",
											children: profile.avatar_url ? /* @__PURE__ */ (void 0)("img", {
												src: profile.avatar_url,
												alt: "Avatar preview",
												className: "h-full w-full object-cover"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 671,
												columnNumber: 43
											}, this) : /* @__PURE__ */ (void 0)("div", {
												className: "flex h-full w-full items-center justify-center font-bold text-lg text-muted-foreground",
												children: (profile.display_name ?? profile.username ?? "?").slice(0, 1).toUpperCase()
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 671,
												columnNumber: 138
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 670,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("div", {
											className: "space-y-2 min-w-0 flex-1 w-full",
											children: [/* @__PURE__ */ (void 0)("div", {
												className: "flex flex-wrap items-center gap-2",
												children: [/* @__PURE__ */ (void 0)("label", {
													className: "btn-ghost py-1.5 px-3 text-xs cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-border hover:border-primary transition-all shrink-0",
													children: [
														/* @__PURE__ */ (void 0)(Upload, { className: "h-3.5 w-3.5 text-primary" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 678,
															columnNumber: 25
														}, this),
														/* @__PURE__ */ (void 0)("span", { children: "Upload Photo" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 679,
															columnNumber: 25
														}, this),
														/* @__PURE__ */ (void 0)("input", {
															type: "file",
															accept: "image/*",
															className: "hidden",
															onChange: (e) => {
																const file = e.target.files?.[0];
																if (file) upload(file, "avatar", (url) => patch({ avatar_url: url }));
															}
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 680,
															columnNumber: 25
														}, this)
													]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 677,
													columnNumber: 23
												}, this), profile.avatar_url && /* @__PURE__ */ (void 0)("button", {
													type: "button",
													onClick: () => patch({ avatar_url: null }),
													className: "btn-ghost py-1.5 px-2.5 text-xs text-destructive hover:text-destructive shrink-0",
													children: "Remove"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 687,
													columnNumber: 46
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 676,
												columnNumber: 21
											}, this), /* @__PURE__ */ (void 0)("input", {
												className: "field text-xs min-w-0 w-full",
												placeholder: "Or paste avatar image URL (https://…)",
												value: profile.avatar_url ?? "",
												onChange: (e) => patch({ avatar_url: e.target.value })
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 693,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 675,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 669,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 667,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "space-y-3 w-full min-w-0",
									children: [
										/* @__PURE__ */ (void 0)("span", {
											className: "label-text",
											children: "Background Wallpaper"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 702,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "grid grid-cols-3 gap-1 rounded-xl bg-secondary/80 p-1 w-full min-w-0",
											children: [
												"color",
												"image",
												"video"
											].map((t) => /* @__PURE__ */ (void 0)("button", {
												onClick: () => patch({
													background_type: t,
													background_value: t === "color" ? "#0b0f19" : t === "image" ? CURATED_WALLPAPERS[0].url : CURATED_VIDEOS[0].url
												}),
												className: `rounded-lg py-1.5 text-xs font-semibold capitalize transition-all min-w-0 truncate ${profile.background_type === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
												children: t
											}, t, false, {
												fileName: _jsxFileName,
												lineNumber: 704,
												columnNumber: 68
											}, this))
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 703,
											columnNumber: 17
										}, this),
										profile.background_type === "color" ? /* @__PURE__ */ (void 0)("div", {
											className: "flex items-center gap-2 w-full min-w-0",
											children: [/* @__PURE__ */ (void 0)("input", {
												type: "color",
												className: "field h-[42px] w-12 shrink-0 p-1 cursor-pointer rounded-lg",
												value: profile.background_value || "#0b0f19",
												onChange: (e) => patch({ background_value: e.target.value })
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 713,
												columnNumber: 21
											}, this), /* @__PURE__ */ (void 0)("input", {
												type: "text",
												className: "field flex-1 min-w-0 font-mono uppercase text-xs",
												value: profile.background_value || "#0b0f19",
												onChange: (e) => patch({ background_value: e.target.value })
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 716,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 712,
											columnNumber: 56
										}, this) : /* @__PURE__ */ (void 0)("div", {
											className: "space-y-3 w-full min-w-0",
											children: [
												profile.background_type === "video" && /* @__PURE__ */ (void 0)("div", {
													className: "space-y-1.5 w-full min-w-0",
													children: [/* @__PURE__ */ (void 0)("div", {
														className: "flex items-center justify-between",
														children: [/* @__PURE__ */ (void 0)("span", {
															className: "text-[11px] font-bold text-foreground flex items-center gap-1.5",
															children: [/* @__PURE__ */ (void 0)(Video, { className: "h-3.5 w-3.5 text-primary" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 723,
																columnNumber: 29
															}, this), "Live Background Video Player"]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 722,
															columnNumber: 27
														}, this), /* @__PURE__ */ (void 0)("span", {
															className: "text-[10px] text-muted-foreground",
															children: "Tests playback & loops before saving"
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 726,
															columnNumber: 27
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 721,
														columnNumber: 25
													}, this), /* @__PURE__ */ (void 0)(VideoPreviewPlayer, {
														videoUrl: profile.background_value,
														accentColor: profile.accent_color
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 730,
														columnNumber: 25
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 720,
													columnNumber: 61
												}, this),
												/* @__PURE__ */ (void 0)("input", {
													className: "field w-full min-w-0",
													placeholder: profile.background_type === "video" ? "Direct MP4/WebM URL or YouTube link (e.g. https://…)" : "Direct image URL (e.g. https://…)",
													value: profile.background_value,
													onChange: (e) => patch({ background_value: e.target.value })
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 733,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (void 0)("div", {
													className: "flex flex-wrap items-center gap-2",
													children: /* @__PURE__ */ (void 0)("label", {
														className: "btn-ghost py-1.5 px-3 text-xs cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-border hover:border-primary transition-all shrink-0",
														children: [
															/* @__PURE__ */ (void 0)(Upload, { className: "h-3.5 w-3.5 text-primary" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 739,
																columnNumber: 25
															}, this),
															/* @__PURE__ */ (void 0)("span", { children: profile.background_type === "video" ? "Upload Background Video (Up to 100MB)" : "Upload Wallpaper Image" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 740,
																columnNumber: 25
															}, this),
															/* @__PURE__ */ (void 0)("input", {
																type: "file",
																accept: profile.background_type === "video" ? "video/mp4,video/webm" : "image/*",
																className: "hidden",
																onChange: (e) => {
																	const file = e.target.files?.[0];
																	if (file) upload(file, "background", (url) => patch({ background_value: url }));
																}
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 743,
																columnNumber: 25
															}, this)
														]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 738,
														columnNumber: 23
													}, this)
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 737,
													columnNumber: 21
												}, this),
												profile.background_type === "video" && /* @__PURE__ */ (void 0)("p", {
													className: "text-[11px] text-muted-foreground",
													children: "Supports uploaded videos up to 100MB with high-performance streaming, direct MP4/WebM URLs, YouTube loops, or curated background video clips."
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 752,
													columnNumber: 61
												}, this),
												profile.background_type === "image" && /* @__PURE__ */ (void 0)("div", {
													className: "w-full min-w-0",
													children: [/* @__PURE__ */ (void 0)("p", {
														className: "text-[11px] font-semibold text-muted-foreground mb-1.5",
														children: "Or choose a curated backdrop:"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 759,
														columnNumber: 25
													}, this), /* @__PURE__ */ (void 0)("div", {
														className: "grid grid-cols-2 sm:grid-cols-4 gap-2 w-full min-w-0",
														children: CURATED_WALLPAPERS.map((wp) => /* @__PURE__ */ (void 0)("button", {
															type: "button",
															onClick: () => patch({ background_value: wp.url }),
															className: `group relative h-14 sm:h-16 rounded-lg overflow-hidden border transition-all active:scale-95 ${profile.background_value === wp.url ? "border-primary ring-2 ring-primary/30" : "border-border/80 hover:border-primary"}`,
															children: [/* @__PURE__ */ (void 0)("img", {
																src: wp.url,
																alt: wp.name,
																className: "h-full w-full object-cover group-hover:scale-105 transition-transform"
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 766,
																columnNumber: 31
															}, this), /* @__PURE__ */ (void 0)("div", {
																className: "absolute inset-x-0 bottom-0 bg-black/60 py-0.5 px-1 text-[9px] font-medium text-white truncate",
																children: wp.name
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 767,
																columnNumber: 31
															}, this)]
														}, wp.name, true, {
															fileName: _jsxFileName,
															lineNumber: 763,
															columnNumber: 57
														}, this))
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 762,
														columnNumber: 25
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 758,
													columnNumber: 61
												}, this),
												profile.background_type === "video" && /* @__PURE__ */ (void 0)("div", {
													className: "w-full min-w-0",
													children: [/* @__PURE__ */ (void 0)("p", {
														className: "text-[11px] font-semibold text-muted-foreground mb-1.5",
														children: "Or choose a curated background clip:"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 775,
														columnNumber: 25
													}, this), /* @__PURE__ */ (void 0)("div", {
														className: "grid grid-cols-2 sm:grid-cols-4 gap-2 w-full min-w-0",
														children: CURATED_VIDEOS.map((vid) => /* @__PURE__ */ (void 0)("button", {
															type: "button",
															onClick: () => patch({ background_value: vid.url }),
															className: `group relative h-14 sm:h-16 rounded-lg overflow-hidden border bg-black transition-all active:scale-95 ${profile.background_value === vid.url ? "border-primary ring-2 ring-primary/30" : "border-border/80 hover:border-primary"}`,
															children: [/* @__PURE__ */ (void 0)("video", {
																src: vid.url,
																muted: true,
																playsInline: true,
																loop: true,
																autoPlay: true,
																className: "h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 782,
																columnNumber: 31
															}, this), /* @__PURE__ */ (void 0)("div", {
																className: "absolute inset-x-0 bottom-0 bg-black/70 py-0.5 px-1 text-[9px] font-medium text-white truncate",
																children: vid.name
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 783,
																columnNumber: 31
															}, this)]
														}, vid.name, true, {
															fileName: _jsxFileName,
															lineNumber: 779,
															columnNumber: 54
														}, this))
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 778,
														columnNumber: 25
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 774,
													columnNumber: 61
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 719,
											columnNumber: 28
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 701,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "rounded-xl border border-border/80 bg-secondary/30 p-3.5 sm:p-4 space-y-4 w-full min-w-0",
									children: [/* @__PURE__ */ (void 0)(FrostedGlassToggle, {
										intensity: profile.glass_intensity || "medium",
										currentOpacity: profile.card_opacity,
										currentBlur: profile.card_blur,
										onChange: ({ intensity, opacity, blur }) => patch({
											glass_intensity: intensity,
											card_opacity: opacity,
											card_blur: blur
										})
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 794,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "pt-3 border-t border-border/60",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: "text-[11px] font-semibold text-muted-foreground block mb-2",
											children: "Fine-tune Parameters"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 805,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("div", {
											className: "grid gap-4 grid-cols-1 sm:grid-cols-3 w-full min-w-0",
											children: [
												/* @__PURE__ */ (void 0)(SliderRow, {
													label: "Card Opacity",
													value: profile.card_opacity,
													min: .1,
													max: 1,
													step: .05,
													display: `${Math.round(profile.card_opacity * 100)}%`,
													onChange: (v) => patch({ card_opacity: v })
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 809,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (void 0)(SliderRow, {
													label: "Corner Radius",
													value: profile.card_radius,
													min: 0,
													max: 44,
													step: 1,
													display: `${profile.card_radius}px`,
													onChange: (v) => patch({ card_radius: v })
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 812,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (void 0)(SliderRow, {
													label: "Backdrop Blur",
													value: profile.card_blur,
													min: 0,
													max: 40,
													step: 1,
													display: `${profile.card_blur}px`,
													onChange: (v) => patch({ card_blur: v })
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 815,
													columnNumber: 21
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 808,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 804,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 793,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 616,
							columnNumber: 36
						}, this),
						tab === "effects" && /* @__PURE__ */ (void 0)("div", {
							className: "space-y-6 w-full min-w-0",
							children: [
								/* @__PURE__ */ (void 0)("label", {
									className: "block w-full min-w-0",
									children: [
										/* @__PURE__ */ (void 0)("span", {
											className: "label-text",
											children: "“Click to Enter” Splash Text"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 826,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (void 0)("input", {
											className: "field w-full min-w-0",
											maxLength: 50,
											placeholder: "e.g. click to enter / explore & listen",
											value: profile.enter_text ?? "",
											onChange: (e) => patch({ enter_text: e.target.value })
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 827,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (void 0)("p", {
											className: "mt-1 text-[11px] text-muted-foreground",
											children: "The stylish prompt displayed before visitor enters and audio plays."
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 830,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 825,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "surface flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-border/80 min-w-0 w-full",
									children: [/* @__PURE__ */ (void 0)("div", {
										className: "min-w-0 pr-3",
										children: [/* @__PURE__ */ (void 0)("p", {
											className: "text-sm font-semibold truncate",
											children: "Background Soundtrack"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 838,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("p", {
											className: "text-xs text-muted-foreground",
											children: "Plays automatically once the visitor taps the enter screen."
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 841,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 837,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("button", {
										type: "button",
										onClick: () => patch({ music_enabled: !profile.music_enabled }),
										"aria-label": "Toggle background music",
										className: `h-7 w-12 shrink-0 rounded-full p-0.5 transition-colors ${profile.music_enabled ? "bg-primary" : "bg-input"}`,
										children: /* @__PURE__ */ (void 0)("span", { className: `block h-6 w-6 rounded-full bg-card shadow-soft transition-transform ${profile.music_enabled ? "translate-x-5" : ""}` }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 848,
											columnNumber: 19
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 845,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 836,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "space-y-3 w-full min-w-0",
									children: [
										/* @__PURE__ */ (void 0)("label", {
											className: "block w-full min-w-0",
											children: [/* @__PURE__ */ (void 0)("span", {
												className: "label-text",
												children: "Audio Track (.mp3 URL)"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 854,
												columnNumber: 19
											}, this), /* @__PURE__ */ (void 0)("div", {
												className: "flex flex-col sm:flex-row gap-2 w-full min-w-0",
												children: [/* @__PURE__ */ (void 0)("input", {
													className: "field flex-1 min-w-0 text-xs sm:text-sm",
													placeholder: "https://…/track.mp3",
													value: profile.music_url ?? "",
													onChange: (e) => patch({ music_url: e.target.value })
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 856,
													columnNumber: 21
												}, this), /* @__PURE__ */ (void 0)("button", {
													type: "button",
													onClick: () => toggleTestAudio(profile.music_url),
													className: "btn-ghost py-2 px-3 text-xs shrink-0 flex items-center justify-center gap-1.5",
													children: testAudioPlaying && testedAudioUrl === profile.music_url ? /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)(Square, { className: "h-3.5 w-3.5 fill-current" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 861,
														columnNumber: 27
													}, this), " Stop"] }, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 860,
														columnNumber: 83
													}, this) : /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)(Play, { className: "h-3.5 w-3.5 fill-current" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 863,
														columnNumber: 27
													}, this), " Test Audio"] }, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 862,
														columnNumber: 31
													}, this)
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 859,
													columnNumber: 21
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 855,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 853,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "flex flex-wrap items-center gap-2",
											children: /* @__PURE__ */ (void 0)("label", {
												className: "btn-ghost py-1.5 px-3 text-xs cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-border hover:border-primary transition-all shrink-0",
												children: [
													/* @__PURE__ */ (void 0)(Upload, { className: "h-3.5 w-3.5 text-primary" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 872,
														columnNumber: 21
													}, this),
													/* @__PURE__ */ (void 0)("span", { children: "Upload MP3 File (max 3.5MB)" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 873,
														columnNumber: 21
													}, this),
													/* @__PURE__ */ (void 0)("input", {
														type: "file",
														accept: "audio/*",
														className: "hidden",
														onChange: (e) => {
															const file = e.target.files?.[0];
															if (file) upload(file, "music", (url) => patch({
																music_url: url,
																music_enabled: true
															}));
														}
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 874,
														columnNumber: 21
													}, this)
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 871,
												columnNumber: 19
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 870,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "w-full min-w-0 pt-2",
											children: [/* @__PURE__ */ (void 0)("span", {
												className: "text-[11px] font-semibold text-muted-foreground block mb-1.5",
												children: "Or select a curated ambient background track:"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 886,
												columnNumber: 19
											}, this), /* @__PURE__ */ (void 0)("div", {
												className: "grid grid-cols-1 sm:grid-cols-3 gap-2 w-full min-w-0",
												children: CURATED_AUDIO.map((track) => {
													const isCurrent = profile.music_url === track.url;
													const isThisPlaying = testAudioPlaying && testedAudioUrl === track.url;
													return /* @__PURE__ */ (void 0)("div", {
														className: `flex items-center justify-between gap-2 p-2.5 rounded-xl border transition-all ${isCurrent ? "border-primary bg-primary/5" : "border-border/80 bg-card hover:border-border"}`,
														children: [/* @__PURE__ */ (void 0)("button", {
															type: "button",
															onClick: () => patch({
																music_url: track.url,
																music_enabled: true
															}),
															className: "flex-1 text-left min-w-0",
															children: [/* @__PURE__ */ (void 0)("p", {
																className: "text-xs font-semibold text-foreground truncate",
																children: track.name
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 898,
																columnNumber: 29
															}, this), /* @__PURE__ */ (void 0)("p", {
																className: "text-[10px] text-muted-foreground",
																children: isCurrent ? "Active track" : "Click to select"
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 901,
																columnNumber: 29
															}, this)]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 894,
															columnNumber: 27
														}, this), /* @__PURE__ */ (void 0)("button", {
															type: "button",
															onClick: () => toggleTestAudio(track.url),
															className: "p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground shrink-0",
															title: isThisPlaying ? "Stop" : "Preview",
															children: isThisPlaying ? /* @__PURE__ */ (void 0)(Square, { className: "h-3.5 w-3.5 fill-current text-primary" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 906,
																columnNumber: 46
															}, this) : /* @__PURE__ */ (void 0)(Volume2, { className: "h-3.5 w-3.5" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 906,
																columnNumber: 109
															}, this)
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 905,
															columnNumber: 27
														}, this)]
													}, track.name, true, {
														fileName: _jsxFileName,
														lineNumber: 893,
														columnNumber: 26
													}, this);
												})
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 889,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 885,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 852,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 824,
							columnNumber: 33
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 515,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("aside", {
					className: `w-full min-w-0 flex flex-col items-center lg:sticky lg:top-6 lg:self-start ${mobileView === "editor" ? "hidden lg:flex" : "flex"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mb-2 flex w-full max-w-[340px] items-center justify-between px-1",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-xs font-semibold text-muted-foreground",
								children: "Live Preview"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 919,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								onClick: () => setPreviewMode(previewMode === "profile" ? "enter" : "profile"),
								className: "text-xs font-medium text-primary hover:underline",
								children: previewMode === "enter" ? "← Direct Profile View" : "Test “Click to Enter”"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 922,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 918,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PhoneFrame, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ProfileView, {
							profile,
							links,
							preview: previewMode === "profile"
						}, previewMode, false, {
							fileName: _jsxFileName,
							lineNumber: 927,
							columnNumber: 13
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 926,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-3 text-center text-xs text-muted-foreground",
							children: "Changes reflect instantly on your live canvas"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 929,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 917,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 513,
				columnNumber: 7
			}, this),
			shareModalOpen && /* @__PURE__ */ (void 0)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-float-in",
				children: /* @__PURE__ */ (void 0)("div", {
					className: "glass-panel w-full max-w-sm p-6 shadow-lift relative",
					children: [
						/* @__PURE__ */ (void 0)("button", {
							type: "button",
							onClick: () => setShareModalOpen(false),
							className: "absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:text-foreground",
							children: /* @__PURE__ */ (void 0)(X, { className: "h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 939,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 938,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("h3", {
							className: "font-display text-lg font-bold text-foreground",
							children: "Share your Halo page"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 942,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Scan this QR code with any smartphone or copy your link."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 945,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "mt-5 flex justify-center",
							children: /* @__PURE__ */ (void 0)("div", {
								className: "rounded-2xl border border-border bg-white p-3 shadow-soft",
								children: /* @__PURE__ */ (void 0)("img", {
									src: `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(publicUrl)}`,
									alt: "QR Code",
									className: "h-40 w-40"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 951,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 950,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 949,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "mt-5 flex items-center gap-2 rounded-xl border border-input bg-secondary/50 p-2",
							children: [/* @__PURE__ */ (void 0)("span", {
								className: "truncate text-xs font-mono text-foreground flex-1 pl-1",
								children: publicUrl
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 956,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("button", {
								type: "button",
								onClick: async () => {
									try {
										await navigator.clipboard.writeText(publicUrl);
										setCopied(true);
										toast.success("Copied to clipboard!");
										setTimeout(() => setCopied(false), 2e3);
									} catch {
										toast.error("Could not copy URL");
									}
								},
								className: "btn-primary py-1 px-2.5 text-xs shrink-0",
								children: [copied ? /* @__PURE__ */ (void 0)(Check, { className: "h-3.5 w-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 969,
									columnNumber: 27
								}, this) : /* @__PURE__ */ (void 0)(Copy, { className: "h-3.5 w-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 969,
									columnNumber: 63
								}, this), copied ? "Copied" : "Copy"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 959,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 955,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "mt-4",
							children: /* @__PURE__ */ (void 0)("a", {
								href: publicUrl,
								target: "_blank",
								rel: "noopener noreferrer",
								className: "btn-ghost w-full justify-center text-xs",
								children: [/* @__PURE__ */ (void 0)(ExternalLink, { className: "h-3.5 w-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 976,
									columnNumber: 17
								}, this), " Open in new tab"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 975,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 974,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 937,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 936,
				columnNumber: 26
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 380,
		columnNumber: 10
	}, this);
}
function SliderRow({ label, value, min, max, step, display, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
		className: "block w-full min-w-0",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "label-text flex items-center justify-between text-xs w-full",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: label }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1002,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "font-mono text-foreground font-semibold",
				children: display
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1003,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 1001,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
			type: "range",
			className: "slider-ios w-full",
			min,
			max,
			step,
			value,
			onChange: (e) => onChange(Number(e.target.value))
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1007,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 1e3,
		columnNumber: 10
	}, this);
}
//#endregion
export { Dashboard as component };
