import { r as __toESM } from "../_runtime.mjs";
import { o as normalizeUsername } from "./bio-NPPVUTaD.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { M as Palette, P as Music4, ct as ArrowRight, h as Sparkles, o as Video, y as ShieldCheck } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CbVD4BM-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/index.tsx?tsr-split=component";
var FEATURES = [
	{
		icon: Video,
		title: "Video backgrounds",
		body: "Upload a clip or paste a URL. Your page becomes a moving poster."
	},
	{
		icon: Music4,
		title: "Auto-play music",
		body: "A click-to-enter screen unlocks sound the way browsers require."
	},
	{
		icon: Palette,
		title: "Glass controls",
		body: "Dial in card opacity, blur and corner radius with live sliders."
	},
	{
		icon: ShieldCheck,
		title: "Yours alone",
		body: "Every page is locked to your account with strict access rules."
	}
];
function Landing() {
	const [username, setUsername] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "relative min-h-screen overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "aura pointer-events-none absolute inset-0 -z-10" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 25,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
				className: "mx-auto flex max-w-6xl items-center justify-between px-5 py-6",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "font-display text-lg font-bold tracking-tight",
					children: "halo.bio"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 28,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: "/auth",
						className: "btn-ghost",
						children: "Log in"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 32,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: "/auth",
						search: { mode: "signup" },
						className: "btn-primary",
						children: "Get started"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 35,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 31,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 27,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
				className: "mx-auto max-w-6xl px-5 pb-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
						className: "animate-float-in pt-10 text-center sm:pt-16",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "inline-flex items-center gap-1.5 rounded-full bg-glass px-3 py-1 text-xs font-semibold text-muted-foreground shadow-soft",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sparkles, { className: "h-3.5 w-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 46,
									columnNumber: 13
								}, this), " one link, all of you"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 45,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
								className: "mx-auto mt-6 max-w-3xl text-4xl font-bold leading-[1.05] sm:text-6xl",
								children: ["A bio page that feels like a", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "block bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent",
									children: "frosted piece of glass"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 50,
									columnNumber: 13
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 48,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "mx-auto mt-5 max-w-xl text-base text-muted-foreground",
								children: "Video backgrounds, ambient music, buttery animations and a builder with a real-time phone preview. Claim your handle in seconds."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 54,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
								className: "glass mx-auto mt-8 flex max-w-md items-center gap-2 rounded-full p-1.5 pl-4",
								onSubmit: (e) => {
									e.preventDefault();
									if (username) try {
										sessionStorage.setItem("halo:desired-username", username);
									} catch {}
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-sm font-semibold text-muted-foreground",
										children: "halo.bio/"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 69,
										columnNumber: 13
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
										value: username,
										onChange: (e) => setUsername(normalizeUsername(e.target.value)),
										placeholder: "yourname",
										"aria-label": "Choose your username",
										className: "min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none text-foreground placeholder:text-muted-foreground/60"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 72,
										columnNumber: 13
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
										to: "/auth",
										search: {
											mode: "signup",
											u: username || void 0
										},
										onClick: () => {
											if (username) try {
												sessionStorage.setItem("halo:desired-username", username);
											} catch {}
										},
										className: "btn-primary shrink-0",
										children: ["Claim ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { className: "h-4 w-4" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 85,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 73,
										columnNumber: 13
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 59,
								columnNumber: 11
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 44,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
						className: "mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
						children: FEATURES.map((f) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", {
							className: "glass-panel p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(f.icon, { className: "h-6 w-6 text-primary" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 92,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
									className: "mt-4 font-display text-base font-semibold",
									children: f.title
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 93,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "mt-1.5 text-sm text-muted-foreground",
									children: f.body
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 96,
									columnNumber: 15
								}, this)
							]
						}, f.title, true, {
							fileName: _jsxFileName,
							lineNumber: 91,
							columnNumber: 30
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 90,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
						className: "glass-panel mt-20 flex flex-col items-center gap-4 p-10 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
								className: "max-w-lg text-2xl font-bold sm:text-3xl",
								children: "Your audience clicks once. Make it count."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 101,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "max-w-md text-sm text-muted-foreground",
								children: "Free to start. Upgradeable to Pro for premium badges and extras."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 104,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/auth",
								search: { mode: "signup" },
								className: "btn-primary",
								children: "Build my page"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 107,
								columnNumber: 11
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 100,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 43,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("footer", {
				className: "border-t border-border py-8 text-center text-xs text-muted-foreground",
				children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" halo.bio — made for creators"
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 115,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 24,
		columnNumber: 10
	}, this);
}
//#endregion
export { Landing as component };
