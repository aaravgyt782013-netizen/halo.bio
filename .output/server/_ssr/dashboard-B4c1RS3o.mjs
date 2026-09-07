import { r as __toESM } from "../_runtime.mjs";
import { i as ensureProtocol, n as auth, r as db, s as uploadMedia } from "./bio-DvztBpRh.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { A as GripVertical, C as MousePointerClick, D as LoaderCircle, I as Copy, L as Check, M as Eye, O as Link2, P as ExternalLink, R as ChartColumn, S as Music4, T as LogOut, V as ArrowUp, W as ArrowDown, _ as Plus, b as Palette, c as Trash2, d as Smartphone, f as ShieldCheck, g as Save, l as Square, m as Share2, t as X, u as Sparkles, v as Play, y as PenLine } from "../_libs/lucide-react.mjs";
import { t as ProfileView } from "./ProfileView-BRxpjyr1.mjs";
import { n as useIsAdmin, r as useMyProfile, t as useAuth } from "./useAuth-CtUGMe9k.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-B4c1RS3o.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$1 = "/app/applet/src/components/PhoneFrame.tsx";
/** iOS-style device frame used for the live preview in the builder. Fully responsive on mobile. */
function PhoneFrame({ children }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "relative mx-auto w-full max-w-[340px] px-2 sm:px-0",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "relative rounded-[2.5rem] sm:rounded-[3.2rem] border border-border bg-foreground/90 p-2 sm:p-[10px] shadow-lift",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "relative h-[580px] sm:h-[660px] w-full overflow-hidden rounded-[2rem] sm:rounded-[2.7rem] bg-background",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "pointer-events-none absolute left-1/2 top-2 z-30 h-5 w-20 sm:h-6 sm:w-24 -translate-x-1/2 rounded-full bg-foreground/90" }, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 9,
					columnNumber: 11
				}, this), children]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 8,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 7,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 6,
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
	const [testAudioPlaying, setTestAudioPlaying] = (0, import_react.useState)(false);
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
		const { error } = await db.from("profiles").update({
			display_name: profile.display_name,
			bio: profile.bio,
			avatar_url: profile.avatar_url,
			background_type: profile.background_type,
			background_value: profile.background_value,
			card_opacity: profile.card_opacity,
			card_radius: profile.card_radius,
			card_blur: profile.card_blur,
			accent_color: profile.accent_color,
			music_url: profile.music_url,
			music_enabled: profile.music_enabled,
			enter_text: profile.enter_text
		}).eq("id", profile.id);
		setSaving(false);
		if (error) toast.error("Could not save changes");
		else {
			setIsDirty(false);
			toast.success("Page updated successfully!");
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
		toast.success("Link added");
	};
	const updateLink = async (id, changes) => {
		setLinks((l) => l.map((x) => x.id === id ? {
			...x,
			...changes
		} : x));
		await db.from("links").update(changes).eq("id", id);
	};
	const removeLink = async (id) => {
		setLinks((l) => l.filter((x) => x.id !== id));
		await db.from("links").delete().eq("id", id);
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
			toast.info("Optimizing & uploading…");
			onDone(await uploadMedia(user.id, file, folder));
			toast.success("Uploaded successfully!");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Upload failed");
		}
	};
	const toggleTestAudio = (url) => {
		if (!url) {
			toast.error("Please enter a valid audio URL first");
			return;
		}
		if (testAudioPlaying && testAudioRef.current) {
			testAudioRef.current.pause();
			setTestAudioPlaying(false);
			return;
		}
		try {
			if (testAudioRef.current) testAudioRef.current.pause();
			const audio = new Audio(url);
			audio.volume = .5;
			audio.onended = () => setTestAudioPlaying(false);
			audio.onerror = () => {
				toast.error("Audio URL could not be loaded");
				setTestAudioPlaying(false);
			};
			audio.play().then(() => {
				setTestAudioPlaying(true);
			}).catch((e) => {
				toast.error("Autoplay prevented or audio source invalid");
				setTestAudioPlaying(false);
			});
			testAudioRef.current = audio;
		} catch (e) {
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
			lineNumber: 268,
			columnNumber: 9
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 267,
		columnNumber: 12
	}, this);
	const totalClicks = links.reduce((acc, l) => acc + (l.clicks || 0), 0);
	const totalViews = profile.views || 0;
	const ctr = totalViews > 0 ? (totalClicks / totalViews * 100).toFixed(1) : "0.0";
	const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/${profile.username}` : `https://halo.bio/${profile.username}`;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "relative min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "aura pointer-events-none absolute inset-0 -z-10" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 276,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
				className: "mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5 border-b border-border/40",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: "/",
							className: "font-display text-xl font-bold tracking-tight text-foreground hover:opacity-85",
							children: ["halo", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-primary",
								children: ".bio"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 282,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 281,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "rounded-full bg-secondary/80 px-2.5 py-0.5 text-xs font-semibold text-muted-foreground",
							children: ["@", profile.username]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 284,
							columnNumber: 11
						}, this),
						isDirty && /* @__PURE__ */ (void 0)("span", {
							className: "rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary",
							children: "Unsaved changes"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 287,
							columnNumber: 23
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 280,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex lg:hidden rounded-lg bg-secondary p-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								onClick: () => setMobileView("editor"),
								className: `flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${mobileView === "editor" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`,
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PenLine, { className: "h-3.5 w-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 296,
									columnNumber: 15
								}, this), " Editor"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 295,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								onClick: () => setMobileView("preview"),
								className: `flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${mobileView === "preview" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`,
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Smartphone, { className: "h-3.5 w-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 299,
									columnNumber: 15
								}, this), " Preview"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 298,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 294,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							type: "button",
							onClick: () => setShareModalOpen(true),
							className: "btn-ghost",
							title: "Share & QR Code",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Share2, { className: "h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 304,
								columnNumber: 13
							}, this), " Share"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 303,
							columnNumber: 11
						}, this),
						isAdmin && /* @__PURE__ */ (void 0)(Link, {
							to: "/admin",
							className: "btn-ghost",
							children: [/* @__PURE__ */ (void 0)(ShieldCheck, { className: "h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 308,
								columnNumber: 15
							}, this), " Staff"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 307,
							columnNumber: 23
						}, this),
						profile.username && /* @__PURE__ */ (void 0)("button", {
							type: "button",
							onClick: async () => {
								if (isDirty) await saveProfile();
								window.open(`/${profile.username}`, "_blank");
							},
							className: "btn-ghost",
							title: "View live public profile (auto-saves changes)",
							children: [/* @__PURE__ */ (void 0)(ExternalLink, { className: "h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 317,
								columnNumber: 15
							}, this), " View Live"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 311,
							columnNumber: 32
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							onClick: saveProfile,
							disabled: saving,
							className: "btn-primary",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Save, { className: "h-4 w-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 321,
									columnNumber: 13
								}, this),
								" ",
								saving ? "Saving…" : "Save"
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 320,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							onClick: async () => {
								await auth.signOut();
								navigate({ to: "/" });
							},
							className: "btn-ghost",
							title: "Log out",
							"aria-label": "Log out",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LogOut, { className: "h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 330,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 324,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 292,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 279,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mx-auto max-w-6xl px-5 pt-6",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "glass rounded-xl p-3.5 flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { className: "h-4.5 w-4.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 340,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 339,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-[11px] font-semibold text-muted-foreground",
								children: "Total Views"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 343,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "font-display text-lg font-bold text-foreground",
								children: totalViews
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 346,
								columnNumber: 15
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 342,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 338,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "glass rounded-xl p-3.5 flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex h-9 w-9 items-center justify-center rounded-lg bg-success/15 text-success",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MousePointerClick, { className: "h-4.5 w-4.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 354,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 353,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-[11px] font-semibold text-muted-foreground",
								children: "Total Clicks"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 357,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "font-display text-lg font-bold text-foreground",
								children: totalClicks
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 360,
								columnNumber: 15
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 356,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 352,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "glass rounded-xl p-3.5 flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChartColumn, { className: "h-4.5 w-4.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 368,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 367,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-[11px] font-semibold text-muted-foreground",
								children: "Click Rate (CTR)"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 371,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "font-display text-lg font-bold text-foreground",
								children: [ctr, "%"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 374,
								columnNumber: 15
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 370,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 366,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "glass rounded-xl p-3.5 flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link2, { className: "h-4.5 w-4.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 382,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 381,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-[11px] font-semibold text-muted-foreground",
								children: "Active Links"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 385,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "font-display text-lg font-bold text-foreground",
								children: links.length
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 388,
								columnNumber: 15
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 384,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 380,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 337,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 336,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
				className: "mx-auto grid max-w-6xl gap-6 px-5 py-6 lg:grid-cols-[1fr_360px]",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
					className: `glass-panel p-5 sm:p-7 shadow-lift ${mobileView === "preview" ? "hidden lg:block" : "block"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mb-6 flex flex-wrap gap-1 rounded-xl bg-secondary/80 p-1",
							children: [
								[
									"links",
									"Links",
									Link2
								],
								[
									"appearance",
									"Appearance",
									Palette
								],
								[
									"effects",
									"Media & Effects",
									Music4
								]
							].map(([key, label, Icon]) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								onClick: () => setTab(key),
								className: `inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${tab === key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { className: "h-3.5 w-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 401,
										columnNumber: 17
									}, this),
									" ",
									label
								]
							}, key, true, {
								fileName: _jsxFileName,
								lineNumber: 400,
								columnNumber: 160
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 399,
							columnNumber: 11
						}, this),
						tab === "links" && /* @__PURE__ */ (void 0)("div", {
							className: "space-y-3.5",
							children: [
								/* @__PURE__ */ (void 0)("div", {
									className: "flex items-center justify-between pb-1",
									children: [/* @__PURE__ */ (void 0)("span", {
										className: "text-xs font-semibold text-muted-foreground",
										children: [
											"Your bio links (",
											links.length,
											")"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 408,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("button", {
										onClick: addLink,
										className: "btn-primary py-1 px-3 text-xs",
										children: [/* @__PURE__ */ (void 0)(Plus, { className: "h-3.5 w-3.5" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 412,
											columnNumber: 19
										}, this), " Add Link"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 411,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 407,
									columnNumber: 15
								}, this),
								links.length === 0 ? /* @__PURE__ */ (void 0)("div", {
									className: "rounded-2xl border border-dashed border-border/80 p-8 text-center",
									children: [
										/* @__PURE__ */ (void 0)("p", {
											className: "text-sm font-semibold text-foreground",
											children: "No links yet"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 417,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (void 0)("p", {
											className: "mt-1 text-xs text-muted-foreground",
											children: "Add your first link to YouTube, Spotify, store, or portfolio."
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 420,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (void 0)("button", {
											onClick: addLink,
											className: "btn-primary mt-4",
											children: [/* @__PURE__ */ (void 0)(Plus, { className: "h-4 w-4" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 425,
												columnNumber: 21
											}, this), " Add your first link"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 424,
											columnNumber: 19
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 416,
									columnNumber: 37
								}, this) : links.map((link, i) => /* @__PURE__ */ (void 0)("div", {
									draggable: true,
									onDragStart: () => dragIndex.current = i,
									onDragOver: (e) => e.preventDefault(),
									onDrop: () => onDrop(i),
									className: "surface flex items-start gap-2.5 p-3.5 rounded-xl border border-border/70",
									children: [
										/* @__PURE__ */ (void 0)(GripVertical, { className: "mt-2.5 h-4 w-4 shrink-0 cursor-grab text-muted-foreground hover:text-foreground" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 428,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "grid flex-1 gap-2 sm:grid-cols-2 min-w-0",
											children: [/* @__PURE__ */ (void 0)("div", {
												className: "min-w-0",
												children: [/* @__PURE__ */ (void 0)("label", {
													className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1",
													children: "Label"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 432,
													columnNumber: 25
												}, this), /* @__PURE__ */ (void 0)("input", {
													className: "field w-full",
													value: link.title,
													placeholder: "e.g. My Latest Song",
													onChange: (e) => updateLink(link.id, { title: e.target.value })
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 435,
													columnNumber: 25
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 431,
												columnNumber: 23
											}, this), /* @__PURE__ */ (void 0)("div", {
												className: "min-w-0",
												children: [/* @__PURE__ */ (void 0)("label", {
													className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1",
													children: "URL destination"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 440,
													columnNumber: 25
												}, this), /* @__PURE__ */ (void 0)("input", {
													className: "field w-full",
													value: link.url,
													placeholder: "https://…",
													onChange: (e) => updateLink(link.id, { url: e.target.value }),
													onBlur: (e) => updateLink(link.id, { url: ensureProtocol(e.target.value) })
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 443,
													columnNumber: 25
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 439,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 430,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "flex flex-col items-end gap-1 shrink-0 pt-1",
											children: [/* @__PURE__ */ (void 0)("div", {
												className: "flex items-center gap-0.5",
												children: [
													/* @__PURE__ */ (void 0)("button", {
														type: "button",
														onClick: () => moveLink(i, "up"),
														disabled: i === 0,
														className: "rounded p-1 text-muted-foreground hover:bg-secondary disabled:opacity-30",
														title: "Move up",
														"aria-label": "Move up",
														children: /* @__PURE__ */ (void 0)(ArrowUp, { className: "h-3.5 w-3.5" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 454,
															columnNumber: 27
														}, this)
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 453,
														columnNumber: 25
													}, this),
													/* @__PURE__ */ (void 0)("button", {
														type: "button",
														onClick: () => moveLink(i, "down"),
														disabled: i === links.length - 1,
														className: "rounded p-1 text-muted-foreground hover:bg-secondary disabled:opacity-30",
														title: "Move down",
														"aria-label": "Move down",
														children: /* @__PURE__ */ (void 0)(ArrowDown, { className: "h-3.5 w-3.5" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 457,
															columnNumber: 27
														}, this)
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 456,
														columnNumber: 25
													}, this),
													/* @__PURE__ */ (void 0)("button", {
														onClick: () => removeLink(link.id),
														"aria-label": `Delete ${link.title}`,
														className: "rounded p-1 text-muted-foreground hover:bg-secondary hover:text-destructive transition-colors ml-1",
														title: "Delete link",
														children: /* @__PURE__ */ (void 0)(Trash2, { className: "h-3.5 w-3.5" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 460,
															columnNumber: 27
														}, this)
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 459,
														columnNumber: 25
													}, this)
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 452,
												columnNumber: 23
											}, this), /* @__PURE__ */ (void 0)("span", {
												className: "text-[10px] font-medium text-muted-foreground pr-1",
												children: [link.clicks || 0, " clicks"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 463,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 451,
											columnNumber: 21
										}, this)
									]
								}, link.id, true, {
									fileName: _jsxFileName,
									lineNumber: 427,
									columnNumber: 49
								}, this)),
								/* @__PURE__ */ (void 0)("p", {
									className: "text-xs text-muted-foreground pt-2",
									children: "Tip: Drag rows or use arrow buttons to reorder. Links update live on your page."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 469,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 406,
							columnNumber: 31
						}, this),
						tab === "appearance" && /* @__PURE__ */ (void 0)("div", {
							className: "space-y-6",
							children: [
								/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("span", {
									className: "label-text flex items-center gap-1.5",
									children: [/* @__PURE__ */ (void 0)(Sparkles, { className: "h-3.5 w-3.5 text-primary" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 480,
										columnNumber: 19
									}, this), " Curated Design Themes"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 479,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("div", {
									className: "grid grid-cols-3 sm:grid-cols-6 gap-2 mt-2",
									children: PRESET_THEMES.map((preset) => /* @__PURE__ */ (void 0)("button", {
										type: "button",
										onClick: () => applyTheme(preset),
										className: "group flex flex-col items-center gap-1.5 rounded-xl border border-border/80 bg-card p-2 text-center hover:border-primary/50 transition-all active:scale-95",
										children: [/* @__PURE__ */ (void 0)("div", {
											className: "h-8 w-full rounded-lg border border-white/20 shadow-inner",
											style: { backgroundColor: preset.bgValue },
											children: /* @__PURE__ */ (void 0)("div", {
												className: "h-2 w-2 rounded-full m-1",
												style: { backgroundColor: preset.accent }
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 488,
												columnNumber: 25
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 485,
											columnNumber: 23
										}, this), /* @__PURE__ */ (void 0)("span", {
											className: "text-[10px] font-semibold text-foreground truncate w-full",
											children: preset.name
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 492,
											columnNumber: 23
										}, this)]
									}, preset.name, true, {
										fileName: _jsxFileName,
										lineNumber: 484,
										columnNumber: 48
									}, this))
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 483,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 478,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "grid gap-4 sm:grid-cols-2",
									children: [/* @__PURE__ */ (void 0)("label", {
										className: "block",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: "label-text",
											children: "Display Name"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 501,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("input", {
											className: "field",
											value: profile.display_name ?? "",
											onChange: (e) => patch({ display_name: e.target.value })
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 502,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 500,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("label", {
										className: "block",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: "label-text",
											children: "Accent Color"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 507,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (void 0)("input", {
												type: "color",
												className: "field h-[42px] w-14 p-1 cursor-pointer",
												value: profile.accent_color,
												onChange: (e) => patch({ accent_color: e.target.value })
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 509,
												columnNumber: 21
											}, this), /* @__PURE__ */ (void 0)("input", {
												type: "text",
												className: "field flex-1 font-mono uppercase text-xs",
												value: profile.accent_color,
												onChange: (e) => patch({ accent_color: e.target.value })
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 512,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 508,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 506,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 499,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("label", {
									className: "block",
									children: [/* @__PURE__ */ (void 0)("span", {
										className: "label-text",
										children: "Bio description"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 520,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("textarea", {
										className: "field min-h-24 resize-y text-sm",
										maxLength: 280,
										value: profile.bio ?? "",
										onChange: (e) => patch({ bio: e.target.value }),
										placeholder: "Tell people who you are, what you create, or your mission…"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 521,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 519,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("span", {
									className: "label-text",
									children: "Profile Avatar"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 527,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("div", {
									className: "flex items-center gap-4",
									children: [/* @__PURE__ */ (void 0)("div", {
										className: "h-16 w-16 overflow-hidden rounded-full border border-border bg-secondary shrink-0 shadow-soft",
										children: profile.avatar_url ? /* @__PURE__ */ (void 0)("img", {
											src: profile.avatar_url,
											alt: "Avatar preview",
											className: "h-full w-full object-cover"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 530,
											columnNumber: 43
										}, this) : /* @__PURE__ */ (void 0)("div", {
											className: "flex h-full w-full items-center justify-center font-bold text-lg text-muted-foreground",
											children: (profile.display_name ?? profile.username ?? "?").slice(0, 1).toUpperCase()
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 530,
											columnNumber: 138
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 529,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (void 0)("input", {
											type: "file",
											accept: "image/*",
											className: "text-xs text-muted-foreground file:mr-2 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-foreground hover:file:bg-accent cursor-pointer",
											onChange: (e) => {
												const file = e.target.files?.[0];
												if (file) upload(file, "avatar", (url) => patch({ avatar_url: url }));
											}
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 535,
											columnNumber: 21
										}, this), /* @__PURE__ */ (void 0)("p", {
											className: "text-[11px] text-muted-foreground",
											children: "PNG, JPG, or WebP. Automatically compressed for fast loading."
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 541,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 534,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 528,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 526,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "space-y-3",
									children: [
										/* @__PURE__ */ (void 0)("span", {
											className: "label-text",
											children: "Background Wallpaper"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 550,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "flex gap-1 rounded-xl bg-secondary/80 p-1",
											children: [
												"color",
												"image",
												"video"
											].map((t) => /* @__PURE__ */ (void 0)("button", {
												onClick: () => patch({
													background_type: t,
													background_value: t === "color" ? "#0b0f19" : t === "image" ? CURATED_WALLPAPERS[0].url : ""
												}),
												className: `flex-1 rounded-lg py-1.5 text-xs font-semibold capitalize transition-all ${profile.background_type === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
												children: t
											}, t, false, {
												fileName: _jsxFileName,
												lineNumber: 552,
												columnNumber: 68
											}, this))
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 551,
											columnNumber: 17
										}, this),
										profile.background_type === "color" ? /* @__PURE__ */ (void 0)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (void 0)("input", {
												type: "color",
												className: "field h-[42px] w-14 p-1 cursor-pointer",
												value: profile.background_value || "#0b0f19",
												onChange: (e) => patch({ background_value: e.target.value })
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 561,
												columnNumber: 21
											}, this), /* @__PURE__ */ (void 0)("input", {
												type: "text",
												className: "field flex-1 font-mono uppercase text-xs",
												value: profile.background_value || "#0b0f19",
												onChange: (e) => patch({ background_value: e.target.value })
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 564,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 560,
											columnNumber: 56
										}, this) : /* @__PURE__ */ (void 0)("div", {
											className: "space-y-3",
											children: [
												/* @__PURE__ */ (void 0)("input", {
													className: "field",
													placeholder: `Direct URL for ${profile.background_type} (e.g. https://…)`,
													value: profile.background_value,
													onChange: (e) => patch({ background_value: e.target.value })
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 568,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (void 0)("div", {
													className: "flex items-center gap-2",
													children: /* @__PURE__ */ (void 0)("input", {
														type: "file",
														accept: profile.background_type === "video" ? "video/mp4,video/webm" : "image/*",
														className: "text-xs text-muted-foreground file:mr-2 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-foreground hover:file:bg-accent cursor-pointer max-w-full",
														onChange: (e) => {
															const file = e.target.files?.[0];
															if (file) upload(file, "background", (url) => patch({ background_value: url }));
														}
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 572,
														columnNumber: 23
													}, this)
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 571,
													columnNumber: 21
												}, this),
												profile.background_type === "image" && /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("p", {
													className: "text-[11px] font-semibold text-muted-foreground mb-1.5",
													children: "Or choose a curated backdrop:"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 581,
													columnNumber: 25
												}, this), /* @__PURE__ */ (void 0)("div", {
													className: "grid grid-cols-4 gap-2",
													children: CURATED_WALLPAPERS.map((wp) => /* @__PURE__ */ (void 0)("button", {
														type: "button",
														onClick: () => patch({ background_value: wp.url }),
														className: "group relative h-12 rounded-lg overflow-hidden border border-border/80 hover:border-primary transition-all active:scale-95",
														children: /* @__PURE__ */ (void 0)("img", {
															src: wp.url,
															alt: wp.name,
															className: "h-full w-full object-cover group-hover:scale-105 transition-transform"
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 588,
															columnNumber: 31
														}, this)
													}, wp.name, false, {
														fileName: _jsxFileName,
														lineNumber: 585,
														columnNumber: 57
													}, this))
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 584,
													columnNumber: 25
												}, this)] }, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 580,
													columnNumber: 61
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 567,
											columnNumber: 28
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 549,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "rounded-xl border border-border/80 bg-secondary/30 p-4 space-y-4",
									children: [/* @__PURE__ */ (void 0)("span", {
										className: "text-xs font-bold text-foreground block",
										children: "Frosted Glass Parameters"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 597,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "grid gap-5 sm:grid-cols-3",
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
												lineNumber: 601,
												columnNumber: 19
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
												lineNumber: 604,
												columnNumber: 19
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
												lineNumber: 607,
												columnNumber: 19
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 600,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 596,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 476,
							columnNumber: 36
						}, this),
						tab === "effects" && /* @__PURE__ */ (void 0)("div", {
							className: "space-y-6",
							children: [
								/* @__PURE__ */ (void 0)("label", {
									className: "block",
									children: [/* @__PURE__ */ (void 0)("span", {
										className: "label-text",
										children: "“Click to Enter” Splash Text"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 617,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("input", {
										className: "field",
										maxLength: 40,
										placeholder: "e.g. click to enter / explore & listen",
										value: profile.enter_text,
										onChange: (e) => patch({ enter_text: e.target.value })
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 618,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 616,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "surface flex items-center justify-between p-4 rounded-xl",
									children: [/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("p", {
										className: "text-sm font-semibold",
										children: "Background Music"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 625,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("p", {
										className: "text-xs text-muted-foreground",
										children: "Auto-plays after visitor taps to enter your profile."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 626,
										columnNumber: 19
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 624,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("button", {
										type: "button",
										onClick: () => patch({ music_enabled: !profile.music_enabled }),
										"aria-label": "Toggle background music",
										className: `h-7 w-12 rounded-full p-0.5 transition-colors ${profile.music_enabled ? "bg-primary" : "bg-input"}`,
										children: /* @__PURE__ */ (void 0)("span", { className: `block h-6 w-6 rounded-full bg-card shadow-soft transition-transform ${profile.music_enabled ? "translate-x-5" : ""}` }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 633,
											columnNumber: 19
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 630,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 623,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
									className: "block",
									children: [/* @__PURE__ */ (void 0)("span", {
										className: "label-text",
										children: "Audio Track URL (.mp3)"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 639,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (void 0)("input", {
											className: "field flex-1",
											placeholder: "https://…/track.mp3",
											value: profile.music_url ?? "",
											onChange: (e) => patch({ music_url: e.target.value })
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 641,
											columnNumber: 21
										}, this), /* @__PURE__ */ (void 0)("button", {
											type: "button",
											onClick: () => toggleTestAudio(profile.music_url),
											className: "btn-ghost px-3 text-xs shrink-0 flex items-center gap-1.5",
											children: testAudioPlaying ? /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)(Square, { className: "h-3.5 w-3.5 fill-current" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 646,
												columnNumber: 27
											}, this), " Stop"] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 645,
												columnNumber: 43
											}, this) : /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)(Play, { className: "h-3.5 w-3.5 fill-current" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 648,
												columnNumber: 27
											}, this), " Test"] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 647,
												columnNumber: 31
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 644,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 640,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 638,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("div", {
									className: "mt-3",
									children: [/* @__PURE__ */ (void 0)("span", {
										className: "text-[11px] font-semibold text-muted-foreground block mb-1",
										children: "Or upload an audio file (max 3.5MB):"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 655,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("input", {
										type: "file",
										accept: "audio/*",
										className: "text-xs text-muted-foreground file:mr-2 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-foreground hover:file:bg-accent cursor-pointer max-w-full",
										onChange: (e) => {
											const file = e.target.files?.[0];
											if (file) upload(file, "music", (url) => patch({
												music_url: url,
												music_enabled: true
											}));
										}
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 658,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 654,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 637,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 615,
							columnNumber: 33
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 398,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("aside", {
					className: `lg:sticky lg:top-6 lg:self-start ${mobileView === "editor" ? "hidden lg:block" : "block"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mb-2 flex items-center justify-between px-1",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-xs font-semibold text-muted-foreground",
								children: "Preview Canvas"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 673,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								onClick: () => setPreviewMode(previewMode === "profile" ? "enter" : "profile"),
								className: "text-xs font-medium text-primary hover:underline",
								children: previewMode === "enter" ? "← Direct Profile View" : "Test “Click to Enter”"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 676,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 672,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PhoneFrame, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ProfileView, {
							profile,
							links,
							preview: previewMode === "profile"
						}, previewMode, false, {
							fileName: _jsxFileName,
							lineNumber: 681,
							columnNumber: 13
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 680,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-3 text-center text-xs text-muted-foreground",
							children: "Live interactive canvas — changes reflect instantly"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 683,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 671,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 396,
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
								lineNumber: 693,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 692,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("h3", {
							className: "font-display text-lg font-bold text-foreground",
							children: "Share your Halo page"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 696,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Scan this QR code with any smartphone or copy your link."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 699,
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
									lineNumber: 705,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 704,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 703,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "mt-5 flex items-center gap-2 rounded-xl border border-input bg-secondary/50 p-2",
							children: [/* @__PURE__ */ (void 0)("span", {
								className: "truncate text-xs font-mono text-foreground flex-1 pl-1",
								children: publicUrl
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 710,
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
									lineNumber: 723,
									columnNumber: 27
								}, this) : /* @__PURE__ */ (void 0)(Copy, { className: "h-3.5 w-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 723,
									columnNumber: 63
								}, this), copied ? "Copied" : "Copy"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 713,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 709,
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
									lineNumber: 730,
									columnNumber: 17
								}, this), " Open in new tab"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 729,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 728,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 691,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 690,
				columnNumber: 26
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 275,
		columnNumber: 10
	}, this);
}
function SliderRow({ label, value, min, max, step, display, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "label-text flex items-center justify-between text-xs",
			children: [
				label,
				" ",
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "font-mono text-foreground font-semibold",
					children: display
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 757,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 755,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
			type: "range",
			className: "slider-ios",
			min,
			max,
			step,
			value,
			onChange: (e) => onChange(Number(e.target.value))
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 761,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 754,
		columnNumber: 10
	}, this);
}
//#endregion
export { Dashboard as component };
