import { r as __toESM } from "../_runtime.mjs";
import { i as ensureProtocol } from "./bio-NPPVUTaD.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { $ as ExternalLink, E as Radio, G as Instagram, I as MessageSquare, J as Globe, K as Headphones, L as Mail, N as Music, S as Send, V as Linkedin, Y as Github, Z as Eye, a as Volume2, d as Twitch, h as Sparkles, i as VolumeX, n as Youtube, ot as BadgeCheck, rt as Check, u as Twitter, x as Share2 } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ProfileView-8EtPyXBV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var SUPPORTED_PLATFORMS = [
	{
		id: "instagram",
		label: "Instagram",
		placeholder: "username or https://instagram.com/username",
		icon: Instagram,
		color: "#E1306C",
		prefixUrl: "https://instagram.com/",
		hint: "Instagram profile or @handle"
	},
	{
		id: "tiktok",
		label: "TikTok",
		placeholder: "@username or https://tiktok.com/@username",
		icon: Music,
		color: "#00F2FE",
		prefixUrl: "https://tiktok.com/@",
		hint: "TikTok profile or @handle"
	},
	{
		id: "youtube",
		label: "YouTube",
		placeholder: "@channel or https://youtube.com/@channel",
		icon: Youtube,
		color: "#FF0000",
		prefixUrl: "https://youtube.com/@",
		hint: "YouTube channel or @handle"
	},
	{
		id: "twitter",
		label: "Twitter / X",
		placeholder: "username or https://x.com/username",
		icon: Twitter,
		color: "#1DA1F2",
		prefixUrl: "https://x.com/",
		hint: "X (Twitter) handle or link"
	},
	{
		id: "spotify",
		label: "Spotify",
		placeholder: "https://open.spotify.com/artist/...",
		icon: Headphones,
		color: "#1DB954",
		prefixUrl: "https://open.spotify.com/",
		hint: "Artist profile or playlist URL"
	},
	{
		id: "discord",
		label: "Discord",
		placeholder: "https://discord.gg/invite",
		icon: MessageSquare,
		color: "#5865F2",
		prefixUrl: "https://discord.gg/",
		hint: "Discord server invite or profile"
	},
	{
		id: "github",
		label: "GitHub",
		placeholder: "username or https://github.com/username",
		icon: Github,
		color: "#F0F6FC",
		prefixUrl: "https://github.com/",
		hint: "GitHub username or profile link"
	},
	{
		id: "twitch",
		label: "Twitch",
		placeholder: "username or https://twitch.tv/username",
		icon: Twitch,
		color: "#9146FF",
		prefixUrl: "https://twitch.tv/",
		hint: "Twitch channel or username"
	}
];
function getPlatformConfig(platform) {
	const normalized = platform.toLowerCase();
	if (normalized === "custom") return {
		id: "custom",
		label: "Custom",
		placeholder: "https://...",
		icon: Sparkles,
		color: "#8B5CF6",
		hint: "Custom icon link"
	};
	const found = SUPPORTED_PLATFORMS.find((p) => p.id === normalized || normalized === "x" && p.id === "twitter");
	if (found) return found;
	if (normalized === "linkedin") return {
		id: "linkedin",
		label: "LinkedIn",
		placeholder: "username",
		icon: Linkedin,
		color: "#0A66C2",
		hint: "LinkedIn profile"
	};
	if (normalized === "telegram") return {
		id: "telegram",
		label: "Telegram",
		placeholder: "username",
		icon: Send,
		color: "#229ED9",
		hint: "Telegram channel"
	};
	if (normalized === "soundcloud") return {
		id: "soundcloud",
		label: "SoundCloud",
		placeholder: "artist",
		icon: Radio,
		color: "#FF5500",
		hint: "SoundCloud profile"
	};
	if (normalized === "email") return {
		id: "email",
		label: "Email",
		placeholder: "hello@example.com",
		icon: Mail,
		color: "#EA4335",
		hint: "Email address"
	};
	return {
		id: "website",
		label: platform.charAt(0).toUpperCase() + platform.slice(1),
		placeholder: "https://...",
		icon: Globe,
		color: "#3B82F6",
		hint: "External link"
	};
}
function formatSocialUrl(platform, raw) {
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
		default: return `https://${val}`;
	}
}
var _jsxFileName = "/app/applet/src/components/ProfileView.tsx";
function getYouTubeId(url) {
	if (!url) return null;
	try {
		const match = url.trim().match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
		return match ? match[1] : null;
	} catch {
		return null;
	}
}
function getDomainBadge(url) {
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
function ProfileView({ profile, links, preview = false, onEnter, onLinkClick }) {
	const [entered, setEntered] = (0, import_react.useState)(preview);
	const [leaving, setLeaving] = (0, import_react.useState)(false);
	const [muted, setMuted] = (0, import_react.useState)(false);
	const [isPlaying, setIsPlaying] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [videoReady, setVideoReady] = (0, import_react.useState)(false);
	const audioRef = (0, import_react.useRef)(null);
	const videoRef = (0, import_react.useRef)(null);
	const resolvedBgValue = profile.background_type === "video" && profile.background_value?.includes("mixkit.co") ? "/videos/starry-night.mp4" : profile.background_value;
	const ytId = profile.background_type === "video" ? getYouTubeId(resolvedBgValue) : null;
	(0, import_react.useEffect)(() => {
		setVideoReady(false);
		if (videoRef.current) {
			videoRef.current.defaultMuted = true;
			videoRef.current.muted = true;
			videoRef.current.play().catch(() => {});
		}
	}, [resolvedBgValue, profile.background_type]);
	(0, import_react.useEffect)(() => {
		if (preview) setEntered(true);
	}, [preview]);
	const handleEnter = () => {
		if (leaving) return;
		setLeaving(true);
		onEnter?.();
		if (profile.music_enabled && profile.music_url) try {
			const audio = new Audio(profile.music_url);
			audio.loop = true;
			audio.volume = .45;
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
		window.setTimeout(() => setEntered(true), 520);
	};
	(0, import_react.useEffect)(() => {
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
		if (navigator.share) try {
			await navigator.share({
				title,
				url
			});
			return;
		} catch {}
		if (navigator.clipboard) try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			toast.success("Profile link copied to clipboard!");
			setTimeout(() => setCopied(false), 2e3);
		} catch {
			toast.error("Could not copy link");
		}
	};
	const intensity = profile.glass_intensity || "medium";
	const saturateMap = {
		subtle: "135%",
		medium: "165%",
		heavy: "195%",
		ultra: "235%"
	};
	const cardStyle = {
		backgroundColor: `color-mix(in oklab, white ${Math.round(profile.card_opacity * 100)}%, transparent)`,
		borderRadius: `${profile.card_radius}px`,
		backdropFilter: `blur(${profile.card_blur}px) saturate(${saturateMap[intensity] || "165%"})`,
		WebkitBackdropFilter: `blur(${profile.card_blur}px) saturate(${saturateMap[intensity] || "165%"})`,
		border: `1px solid rgba(255, 255, 255, ${{
			subtle: "0.18",
			medium: "0.28",
			heavy: "0.42",
			ultra: "0.62"
		}[intensity] || "0.28"})`,
		boxShadow: {
			subtle: "0 8px 30px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(255,255,255,0.15)",
			medium: "0 14px 44px rgba(0,0,0,0.22), inset 0 1px 1px rgba(255,255,255,0.30)",
			heavy: "0 20px 52px rgba(0,0,0,0.30), inset 0 1px 2px rgba(255,255,255,0.45)",
			ultra: "0 28px 64px rgba(0,0,0,0.40), inset 0 2px 4px rgba(255,255,255,0.65)"
		}[intensity] || void 0
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "relative h-full w-full overflow-hidden select-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "absolute inset-0 bg-[#0b0f19] overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "absolute inset-0 transition-opacity duration-1000",
						style: { background: `radial-gradient(circle at 50% 30%, ${profile.accent_color || "#3b82f6"}22 0%, #0b0f19 80%)` }
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 206,
						columnNumber: 9
					}, this),
					profile.background_type === "video" && resolvedBgValue ? ytId ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: `pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-700 ease-out ${videoReady ? "opacity-100" : "opacity-40"}`,
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("iframe", {
							className: "pointer-events-none absolute top-1/2 left-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 object-cover border-0",
							src: `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1&enablejsapi=1`,
							allow: "autoplay; encrypted-media",
							title: "Background Video",
							onLoad: () => setVideoReady(true)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 220,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 215,
						columnNumber: 13
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("video", {
						ref: videoRef,
						className: `h-full w-full object-cover pointer-events-none transition-opacity duration-700 ease-out ${videoReady ? "opacity-100" : "opacity-0"}`,
						src: resolvedBgValue,
						autoPlay: true,
						loop: true,
						muted: true,
						playsInline: true,
						preload: "auto",
						onCanPlay: () => setVideoReady(true),
						onLoadedData: () => setVideoReady(true),
						onEnded: () => {
							if (videoRef.current) {
								videoRef.current.currentTime = 0;
								videoRef.current.play().catch(() => {});
							}
						},
						onError: () => {
							console.warn("Video background playback error");
						}
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 229,
						columnNumber: 13
					}, this) : profile.background_type === "image" && resolvedBgValue ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
						src: resolvedBgValue,
						alt: "",
						className: "h-full w-full object-cover pointer-events-none",
						loading: "lazy"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 254,
						columnNumber: 11
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "h-full w-full",
						style: { backgroundColor: profile.background_value || "#0b0f19" }
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 261,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "pointer-events-none absolute inset-0 bg-foreground/15 backdrop-brightness-95" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 266,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 204,
				columnNumber: 7
			}, this),
			!entered && /* @__PURE__ */ (void 0)("button", {
				type: "button",
				onClick: handleEnter,
				className: `absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black px-6 text-center select-none cursor-pointer transition-all duration-500 ${leaving ? "animate-enter-out pointer-events-none" : ""}`,
				style: { backgroundColor: "#000000" },
				"aria-label": "Click to enter profile",
				children: /* @__PURE__ */ (void 0)("div", {
					className: "flex flex-col items-center gap-3.5",
					children: [/* @__PURE__ */ (void 0)("span", {
						className: "animate-pulse-soft font-display text-2xl sm:text-3xl font-bold tracking-wider text-white drop-shadow-[0_0_24px_rgba(255,255,255,0.45)]",
						children: profile.enter_text || "Click To Enter"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 281,
						columnNumber: 13
					}, this), profile.music_enabled && profile.music_url ? /* @__PURE__ */ (void 0)("span", {
						className: "inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md shadow-lg",
						children: [/* @__PURE__ */ (void 0)(Music, { className: "h-3.5 w-3.5 text-blue-400 animate-pulse" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 287,
							columnNumber: 17
						}, this), /* @__PURE__ */ (void 0)("span", { children: "Audio enabled · Tap anywhere" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 288,
							columnNumber: 17
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 286,
						columnNumber: 15
					}, this) : /* @__PURE__ */ (void 0)("span", {
						className: "text-xs font-medium tracking-widest text-white/40 uppercase",
						children: "Tap anywhere to open"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 291,
						columnNumber: 15
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 280,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 271,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: `relative z-10 flex h-full flex-col items-center justify-center overflow-y-auto px-4 py-10 ${entered ? "animate-float-in" : "opacity-0"}`,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "w-full max-w-sm border border-glass-border p-6 text-center shadow-glass relative",
					style: cardStyle,
					children: [
						!preview && /* @__PURE__ */ (void 0)("button", {
							type: "button",
							onClick: handleShare,
							className: "absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-black/5 transition-colors",
							title: "Share profile",
							"aria-label": "Share profile",
							children: copied ? /* @__PURE__ */ (void 0)(Check, { className: "h-4 w-4 text-success" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 319,
								columnNumber: 17
							}, this) : /* @__PURE__ */ (void 0)(Share2, { className: "h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 321,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 311,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mx-auto mb-4 h-[92px] w-[92px] overflow-hidden rounded-full border-2 border-glass-border shadow-soft",
							children: profile.avatar_url ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
								src: profile.avatar_url,
								alt: `${profile.username ?? "user"} avatar`,
								className: "h-full w-full object-cover"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 328,
								columnNumber: 15
							}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex h-full w-full items-center justify-center bg-secondary text-2xl font-bold text-secondary-foreground",
								children: (profile.display_name ?? profile.username ?? "?").slice(0, 1).toUpperCase()
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 334,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 326,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center justify-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
								className: "font-display text-xl font-bold text-foreground tracking-tight",
								children: profile.display_name || profile.username || "unnamed"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 343,
								columnNumber: 13
							}, this), profile.is_premium && /* @__PURE__ */ (void 0)(BadgeCheck, {
								className: "h-5 w-5",
								style: { color: profile.accent_color }
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 347,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 342,
							columnNumber: 11
						}, this),
						profile.username && /* @__PURE__ */ (void 0)("p", {
							className: "mt-0.5 text-xs font-semibold text-muted-foreground tracking-wide",
							children: ["@", profile.username]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 354,
							columnNumber: 13
						}, this),
						profile.bio && /* @__PURE__ */ (void 0)("p", {
							className: "mt-3 text-sm leading-relaxed text-foreground/85 whitespace-pre-line",
							children: profile.bio
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 359,
							columnNumber: 13
						}, this),
						profile.social_links && profile.social_links.filter((s) => s.active !== false).length > 0 && /* @__PURE__ */ (void 0)("div", {
							className: "mt-4 flex flex-wrap items-center justify-center gap-2",
							children: profile.social_links.filter((s) => s.active !== false).map((soc) => {
								const cfg = getPlatformConfig(soc.platform);
								const Icon = cfg.icon;
								const safeSocUrl = ensureProtocol(soc.url);
								const label = soc.title || cfg.label;
								const isCustom = !!soc.icon_url || soc.platform === "custom";
								const noBg = soc.remove_bg !== void 0 ? soc.remove_bg : isCustom;
								const fitMode = soc.fit_mode || "cover";
								return /* @__PURE__ */ (void 0)("a", {
									href: preview ? void 0 : safeSocUrl || "#",
									target: preview ? void 0 : "_blank",
									rel: preview ? void 0 : "noreferrer noopener",
									onClick: (e) => {
										if (preview) {
											e.preventDefault();
											toast.info(`Preview: ${label} link`);
										}
									},
									className: `group relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full transition-all duration-200 hover:scale-115 active:scale-95 overflow-hidden ${noBg ? "bg-transparent border-0 shadow-none" : "border border-glass-border shadow-sm"}`,
									style: noBg ? {
										backgroundColor: "transparent",
										backdropFilter: "none"
									} : {
										backgroundColor: "color-mix(in oklab, white 68%, transparent)",
										backdropFilter: `blur(${Math.max(6, profile.card_blur / 2)}px)`
									},
									title: label,
									"aria-label": label,
									children: soc.icon_url ? /* @__PURE__ */ (void 0)("img", {
										src: soc.icon_url,
										alt: label,
										className: `h-full w-full transition-transform duration-200 group-hover:scale-110 ${fitMode === "contain" ? "object-contain p-0.5" : "object-cover rounded-full"}`
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 416,
										columnNumber: 27
									}, this) : /* @__PURE__ */ (void 0)(Icon, { className: "h-4 w-4 text-foreground/85 transition-colors group-hover:text-foreground" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 426,
										columnNumber: 27
									}, this)
								}, soc.id, false, {
									fileName: _jsxFileName,
									lineNumber: 384,
									columnNumber: 23
								}, this);
							})
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 368,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mt-5 space-y-2.5",
							children: [links.length === 0 && /* @__PURE__ */ (void 0)("p", {
								className: "text-xs text-muted-foreground py-2",
								children: "No links added yet"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 436,
								columnNumber: 15
							}, this), links.map((link) => {
								const safeUrl = ensureProtocol(link.url);
								const badge = getDomainBadge(link.url);
								return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
									href: preview ? void 0 : safeUrl || "#",
									target: preview ? void 0 : "_blank",
									rel: preview ? void 0 : "noreferrer noopener",
									onClick: (e) => {
										if (preview) e.preventDefault();
										else onLinkClick?.(link);
									},
									className: "group relative flex items-center justify-between w-full border border-glass-border px-4 py-3 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 active:scale-[0.98]",
									style: {
										backgroundColor: "color-mix(in oklab, white 62%, transparent)",
										borderRadius: `${Math.max(10, profile.card_radius - 8)}px`,
										boxShadow: `0 6px 20px color-mix(in oklab, ${profile.accent_color} 20%, transparent)`
									},
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "truncate pr-2 text-left",
										children: link.title
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 461,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center gap-1.5 shrink-0 text-muted-foreground group-hover:text-foreground",
										children: [badge && /* @__PURE__ */ (void 0)("span", {
											className: "rounded-md bg-foreground/5 px-1.5 py-0.5 text-[10px] font-medium tracking-tight",
											children: badge
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 464,
											columnNumber: 23
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ExternalLink, { className: "h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-opacity" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 468,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 462,
										columnNumber: 19
									}, this)]
								}, link.id, true, {
									fileName: _jsxFileName,
									lineNumber: 444,
									columnNumber: 17
								}, this);
							})]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 434,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "inline-flex items-center gap-1 font-medium",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { className: "h-3.5 w-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 477,
										columnNumber: 15
									}, this),
									" ",
									profile.views,
									" views"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 476,
								columnNumber: 13
							}, this), profile.music_enabled && profile.music_url && !preview && entered && /* @__PURE__ */ (void 0)("button", {
								type: "button",
								onClick: toggleMute,
								className: "inline-flex items-center gap-1.5 rounded-full bg-glass px-2.5 py-1 text-foreground hover:bg-glass/80 transition-colors",
								"aria-label": muted ? "Unmute music" : "Mute music",
								children: muted ? /* @__PURE__ */ (void 0)(VolumeX, { className: "h-3.5 w-3.5 text-muted-foreground" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 490,
									columnNumber: 21
								}, this) : /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)(Volume2, { className: "h-3.5 w-3.5 text-primary" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 493,
									columnNumber: 23
								}, this), isPlaying && /* @__PURE__ */ (void 0)("span", {
									className: "flex items-center gap-0.5",
									children: [
										/* @__PURE__ */ (void 0)("span", { className: "h-2 w-0.5 animate-pulse bg-primary rounded-full" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 496,
											columnNumber: 27
										}, this),
										/* @__PURE__ */ (void 0)("span", { className: "h-3 w-0.5 animate-pulse bg-primary rounded-full delay-75" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 497,
											columnNumber: 27
										}, this),
										/* @__PURE__ */ (void 0)("span", { className: "h-1.5 w-0.5 animate-pulse bg-primary rounded-full delay-150" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 498,
											columnNumber: 27
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 495,
									columnNumber: 25
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 492,
									columnNumber: 21
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 483,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 475,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 305,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 300,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 202,
		columnNumber: 5
	}, this);
}
//#endregion
export { getPlatformConfig as i, SUPPORTED_PLATFORMS as n, formatSocialUrl as r, ProfileView as t };
