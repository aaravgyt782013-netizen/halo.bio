import { r as __toESM } from "../_runtime.mjs";
import { i as ensureProtocol } from "./bio-Drf3dUJc.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { B as BadgeCheck, L as Check, M as Eye, P as ExternalLink, m as Share2, n as VolumeX, r as Volume2, x as Music } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ProfileView-4DZC1nlM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/components/ProfileView.tsx";
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
	const audioRef = (0, import_react.useRef)(null);
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
	const cardStyle = {
		backgroundColor: `color-mix(in oklab, white ${Math.round(profile.card_opacity * 100)}%, transparent)`,
		borderRadius: `${profile.card_radius}px`,
		backdropFilter: `blur(${profile.card_blur}px) saturate(180%)`,
		WebkitBackdropFilter: `blur(${profile.card_blur}px) saturate(180%)`
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "relative h-full w-full overflow-hidden select-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "absolute inset-0",
				children: [profile.background_type === "video" && profile.background_value ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("video", {
					className: "h-full w-full object-cover",
					src: profile.background_value,
					autoPlay: true,
					loop: true,
					muted: true,
					playsInline: true
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 143,
					columnNumber: 11
				}, this) : profile.background_type === "image" && profile.background_value ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
					src: profile.background_value,
					alt: "",
					className: "h-full w-full object-cover",
					loading: "lazy"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 152,
					columnNumber: 11
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "h-full w-full",
					style: { backgroundColor: profile.background_value || "#0b0f19" }
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 159,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute inset-0 bg-foreground/15 backdrop-brightness-95" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 164,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 141,
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
						lineNumber: 179,
						columnNumber: 13
					}, this), profile.music_enabled && profile.music_url ? /* @__PURE__ */ (void 0)("span", {
						className: "inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md shadow-lg",
						children: [/* @__PURE__ */ (void 0)(Music, { className: "h-3.5 w-3.5 text-blue-400 animate-pulse" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 185,
							columnNumber: 17
						}, this), /* @__PURE__ */ (void 0)("span", { children: "Audio enabled · Tap anywhere" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 186,
							columnNumber: 17
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 184,
						columnNumber: 15
					}, this) : /* @__PURE__ */ (void 0)("span", {
						className: "text-xs font-medium tracking-widest text-white/40 uppercase",
						children: "Tap anywhere to open"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 189,
						columnNumber: 15
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 178,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 169,
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
								lineNumber: 217,
								columnNumber: 17
							}, this) : /* @__PURE__ */ (void 0)(Share2, { className: "h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 219,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 209,
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
								lineNumber: 226,
								columnNumber: 15
							}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex h-full w-full items-center justify-center bg-secondary text-2xl font-bold text-secondary-foreground",
								children: (profile.display_name ?? profile.username ?? "?").slice(0, 1).toUpperCase()
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 232,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 224,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center justify-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
								className: "font-display text-xl font-bold text-foreground tracking-tight",
								children: profile.display_name || profile.username || "unnamed"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 241,
								columnNumber: 13
							}, this), profile.is_premium && /* @__PURE__ */ (void 0)(BadgeCheck, {
								className: "h-5 w-5",
								style: { color: profile.accent_color }
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 245,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 240,
							columnNumber: 11
						}, this),
						profile.username && /* @__PURE__ */ (void 0)("p", {
							className: "mt-0.5 text-xs font-semibold text-muted-foreground tracking-wide",
							children: ["@", profile.username]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 252,
							columnNumber: 13
						}, this),
						profile.bio && /* @__PURE__ */ (void 0)("p", {
							className: "mt-3 text-sm leading-relaxed text-foreground/85 whitespace-pre-line",
							children: profile.bio
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 257,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mt-5 space-y-2.5",
							children: [links.length === 0 && /* @__PURE__ */ (void 0)("p", {
								className: "text-xs text-muted-foreground py-2",
								children: "No links added yet"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 264,
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
										lineNumber: 289,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center gap-1.5 shrink-0 text-muted-foreground group-hover:text-foreground",
										children: [badge && /* @__PURE__ */ (void 0)("span", {
											className: "rounded-md bg-foreground/5 px-1.5 py-0.5 text-[10px] font-medium tracking-tight",
											children: badge
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 292,
											columnNumber: 23
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ExternalLink, { className: "h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-opacity" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 296,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 290,
										columnNumber: 19
									}, this)]
								}, link.id, true, {
									fileName: _jsxFileName,
									lineNumber: 272,
									columnNumber: 17
								}, this);
							})]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 262,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "inline-flex items-center gap-1 font-medium",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { className: "h-3.5 w-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 305,
										columnNumber: 15
									}, this),
									" ",
									profile.views,
									" views"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 304,
								columnNumber: 13
							}, this), profile.music_enabled && profile.music_url && !preview && entered && /* @__PURE__ */ (void 0)("button", {
								type: "button",
								onClick: toggleMute,
								className: "inline-flex items-center gap-1.5 rounded-full bg-glass px-2.5 py-1 text-foreground hover:bg-glass/80 transition-colors",
								"aria-label": muted ? "Unmute music" : "Mute music",
								children: muted ? /* @__PURE__ */ (void 0)(VolumeX, { className: "h-3.5 w-3.5 text-muted-foreground" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 318,
									columnNumber: 21
								}, this) : /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)(Volume2, { className: "h-3.5 w-3.5 text-primary" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 321,
									columnNumber: 23
								}, this), isPlaying && /* @__PURE__ */ (void 0)("span", {
									className: "flex items-center gap-0.5",
									children: [
										/* @__PURE__ */ (void 0)("span", { className: "h-2 w-0.5 animate-pulse bg-primary rounded-full" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 324,
											columnNumber: 27
										}, this),
										/* @__PURE__ */ (void 0)("span", { className: "h-3 w-0.5 animate-pulse bg-primary rounded-full delay-75" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 325,
											columnNumber: 27
										}, this),
										/* @__PURE__ */ (void 0)("span", { className: "h-1.5 w-0.5 animate-pulse bg-primary rounded-full delay-150" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 326,
											columnNumber: 27
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 323,
									columnNumber: 25
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 320,
									columnNumber: 21
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 311,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 303,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 203,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 198,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 139,
		columnNumber: 5
	}, this);
}
//#endregion
export { ProfileView as t };
