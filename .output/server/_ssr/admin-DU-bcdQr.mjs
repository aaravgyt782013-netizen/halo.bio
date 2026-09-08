import { r as __toESM } from "../_runtime.mjs";
import { r as db } from "./bio-NPPVUTaD.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { $ as ExternalLink, B as LoaderCircle, C as Search, F as MousePointerClick, H as Link2, X as Flag, Z as Eye, at as Ban, et as Crown, f as TriangleAlert, lt as ArrowLeft, p as Trash2, r as X, s as Users } from "../_libs/lucide-react.mjs";
import { n as useIsAdmin, t as useAuth } from "./useAuth-CCjzNA5i.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-DU-bcdQr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/admin.tsx?tsr-split=component";
function AdminPage() {
	const navigate = useNavigate();
	const { user, loading } = useAuth();
	const isAdmin = useIsAdmin(user?.id);
	const [profiles, setProfiles] = (0, import_react.useState)([]);
	const [stats, setStats] = (0, import_react.useState)(null);
	const [q, setQ] = (0, import_react.useState)("");
	const [filterTab, setFilterTab] = (0, import_react.useState)("all");
	const [profileToDelete, setProfileToDelete] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(true);
	const load = (0, import_react.useCallback)(async () => {
		const [{ data: rows }, { data: statRows }] = await Promise.all([db.from("profiles").select("*").order("created_at", { ascending: false }).limit(500), db.rpc("platform_stats")]);
		setProfiles(rows ?? []);
		setStats(statRows?.[0] ?? null);
		setBusy(false);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!loading && !user) navigate({ to: "/auth" });
	}, [
		loading,
		user,
		navigate
	]);
	(0, import_react.useEffect)(() => {
		if (isAdmin) load();
		if (isAdmin === false) setBusy(false);
	}, [isAdmin, load]);
	const mutate = async (id, changes, message) => {
		setProfiles((p) => p.map((x) => x.id === id ? {
			...x,
			...changes
		} : x));
		const { error } = await db.from("profiles").update(changes).eq("id", id);
		if (error) toast.error("Action failed");
		else toast.success(message);
	};
	const removeProfile = async (id) => {
		const { error } = await db.from("profiles").delete().eq("id", id);
		if (error) {
			toast.error("Could not delete profile");
			return;
		}
		setProfiles((p) => p.filter((x) => x.id !== id));
		setProfileToDelete(null);
		toast.success("Profile permanently deleted");
	};
	if (loading || isAdmin === null || busy) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-screen items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "h-6 w-6 animate-spin text-primary" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 73,
			columnNumber: 9
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 72,
		columnNumber: 12
	}, this);
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-screen flex-col items-center justify-center gap-4 px-5 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
				className: "font-display text-2xl font-bold",
				children: "Staff only"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 78,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "max-w-sm text-sm text-muted-foreground",
				children: "This portal is restricted to Halo staff accounts."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 79,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
				to: "/dashboard",
				className: "btn-primary",
				children: "Back to builder"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 82,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 77,
		columnNumber: 12
	}, this);
	const flaggedCount = profiles.filter((p) => p.is_flagged).length;
	const proCount = profiles.filter((p) => p.is_premium).length;
	const bannedCount = profiles.filter((p) => p.is_banned).length;
	const filtered = profiles.filter((p) => {
		if (!`${p.username ?? ""} ${p.display_name ?? ""}`.toLowerCase().includes(q.toLowerCase())) return false;
		if (filterTab === "flagged") return p.is_flagged;
		if (filterTab === "pro") return p.is_premium;
		if (filterTab === "banned") return p.is_banned;
		return true;
	});
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "relative min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "aura pointer-events-none absolute inset-0 -z-10" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 99,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
				className: "mx-auto flex max-w-6xl items-center justify-between px-5 py-6",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "font-display text-xl font-bold",
					children: "Staff Portal"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 103,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-xs text-muted-foreground",
					children: "User directory, content moderation & tier management"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 104,
					columnNumber: 11
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 102,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
					to: "/dashboard",
					className: "btn-ghost",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowLeft, { className: "h-4 w-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 109,
						columnNumber: 11
					}, this), " Builder"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 108,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 101,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
				className: "mx-auto max-w-6xl space-y-6 px-5 pb-20",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
					className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
							icon: Users,
							label: "Total users",
							value: stats?.total_profiles ?? 0
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 115,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
							icon: Users,
							label: "Active profiles",
							value: stats?.active_profiles ?? 0
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 116,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
							icon: Eye,
							label: "Page views",
							value: stats?.total_views ?? 0
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 117,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
							icon: MousePointerClick,
							label: "Link clicks",
							value: stats?.total_clicks ?? 0
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 118,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
							icon: Link2,
							label: "Links created",
							value: stats?.total_links ?? 0
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 119,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 114,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
					className: "glass-panel p-5 sm:p-6 shadow-lift",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-1 items-center gap-2 rounded-xl border border-input bg-card px-4 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "h-4 w-4 text-muted-foreground" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 125,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
								value: q,
								onChange: (e) => setQ(e.target.value),
								placeholder: "Search username or display name…",
								"aria-label": "Search users",
								className: "flex-1 bg-transparent text-sm outline-none"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 126,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 124,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex rounded-xl bg-secondary/80 p-1 gap-1",
							children: [
								["all", `All (${profiles.length})`],
								["flagged", `Flagged (${flaggedCount})`],
								["pro", `Pro (${proCount})`],
								["banned", `Banned (${bannedCount})`]
							].map(([key, label]) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								onClick: () => setFilterTab(key),
								className: `rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${filterTab === key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
								children: label
							}, key, false, {
								fileName: _jsxFileName,
								lineNumber: 131,
								columnNumber: 198
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 130,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 123,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-2.5",
						children: [filtered.length === 0 && /* @__PURE__ */ (void 0)("div", {
							className: "py-12 text-center text-sm text-muted-foreground",
							children: "No profiles match your filter criteria."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 138,
							columnNumber: 39
						}, this), filtered.map((p) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "surface flex flex-wrap items-center gap-3 p-3.5 rounded-xl border border-border/70",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "h-10 w-10 overflow-hidden rounded-full bg-secondary shrink-0",
									children: p.avatar_url ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
										src: p.avatar_url,
										alt: "",
										className: "h-full w-full object-cover"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 143,
										columnNumber: 35
									}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex h-full w-full items-center justify-center font-bold text-xs text-muted-foreground",
										children: (p.display_name ?? p.username ?? "?").slice(0, 1).toUpperCase()
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 143,
										columnNumber: 110
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 142,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "min-w-40 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center gap-2 flex-wrap",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-sm font-semibold",
												children: p.username ? `@${p.username}` : "— no username —"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 149,
												columnNumber: 21
											}, this),
											p.is_premium && /* @__PURE__ */ (void 0)("span", {
												className: "rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary",
												children: "PRO"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 152,
												columnNumber: 38
											}, this),
											p.is_banned && /* @__PURE__ */ (void 0)("span", {
												className: "rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold text-destructive",
												children: "BANNED"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 155,
												columnNumber: 37
											}, this),
											p.is_flagged && /* @__PURE__ */ (void 0)("span", {
												className: "rounded-full bg-amber-500/15 text-amber-600 px-2 py-0.5 text-[10px] font-bold",
												children: "FLAGGED"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 158,
												columnNumber: 38
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 148,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-xs text-muted-foreground mt-0.5",
										children: [
											p.display_name ?? "unnamed",
											" · ",
											p.views || 0,
											" views"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 162,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 147,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex flex-wrap items-center gap-1.5",
									children: [
										p.username && /* @__PURE__ */ (void 0)(Link, {
											to: "/$username",
											params: { username: p.username },
											target: "_blank",
											className: "btn-ghost p-2 text-muted-foreground hover:text-foreground",
											title: "View public profile",
											children: /* @__PURE__ */ (void 0)(ExternalLink, { className: "h-4 w-4" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 171,
												columnNumber: 23
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 168,
											columnNumber: 34
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(IconAction, {
											icon: Crown,
											label: p.is_premium ? "Remove Pro" : "Grant Pro",
											onClick: () => mutate(p.id, { is_premium: !p.is_premium }, p.is_premium ? "Pro removed" : "Pro granted"),
											active: p.is_premium
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 174,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(IconAction, {
											icon: Flag,
											label: p.is_flagged ? "Unflag" : "Flag content",
											onClick: () => mutate(p.id, { is_flagged: !p.is_flagged }, p.is_flagged ? "Flag cleared" : "Flagged for review"),
											active: p.is_flagged
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 177,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(IconAction, {
											icon: Ban,
											label: p.is_banned ? "Unban" : "Suspend",
											onClick: () => mutate(p.id, { is_banned: !p.is_banned }, p.is_banned ? "Account restored" : "Account suspended"),
											active: p.is_banned
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 180,
											columnNumber: 19
										}, this),
										p.avatar_url && /* @__PURE__ */ (void 0)("button", {
											onClick: () => mutate(p.id, { avatar_url: null }, "Avatar removed"),
											className: "rounded-lg bg-secondary px-2.5 py-1 text-xs font-semibold hover:bg-accent",
											children: "Reset avatar"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 183,
											columnNumber: 36
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(IconAction, {
											icon: Trash2,
											label: "Delete profile",
											destructive: true,
											onClick: () => setProfileToDelete(p)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 188,
											columnNumber: 19
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 167,
									columnNumber: 17
								}, this)
							]
						}, p.id, true, {
							fileName: _jsxFileName,
							lineNumber: 141,
							columnNumber: 32
						}, this))]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 137,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 122,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 113,
				columnNumber: 7
			}, this),
			profileToDelete && /* @__PURE__ */ (void 0)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-float-in",
				children: /* @__PURE__ */ (void 0)("div", {
					className: "glass-panel w-full max-w-sm p-6 shadow-lift relative",
					children: [
						/* @__PURE__ */ (void 0)("button", {
							type: "button",
							onClick: () => setProfileToDelete(null),
							className: "absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:text-foreground",
							children: /* @__PURE__ */ (void 0)(X, { className: "h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 199,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 198,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "flex items-center gap-2 text-destructive mb-2",
							children: [/* @__PURE__ */ (void 0)(TriangleAlert, { className: "h-5 w-5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 203,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("h3", {
								className: "font-display text-lg font-bold",
								children: "Delete Profile?"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 204,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 202,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("p", {
							className: "text-sm text-muted-foreground",
							children: [
								"Are you sure you want to permanently delete profile",
								" ",
								/* @__PURE__ */ (void 0)("strong", {
									className: "text-foreground",
									children: ["@", profileToDelete.username ?? profileToDelete.id]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 210,
									columnNumber: 15
								}, this),
								"? This action cannot be undone and deletes all associated links."
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 208,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "mt-6 flex justify-end gap-2",
							children: [/* @__PURE__ */ (void 0)("button", {
								type: "button",
								onClick: () => setProfileToDelete(null),
								className: "btn-ghost text-xs",
								children: "Cancel"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 217,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("button", {
								type: "button",
								onClick: () => removeProfile(profileToDelete.id),
								className: "rounded-xl bg-destructive px-4 py-2 text-xs font-semibold text-destructive-foreground hover:opacity-90",
								children: "Delete Profile"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 220,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 216,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 197,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 196,
				columnNumber: 27
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 98,
		columnNumber: 10
	}, this);
}
function StatCard({ icon: Icon, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "glass-panel p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { className: "h-4 w-4 text-primary" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 238,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "mt-2 font-display text-2xl font-bold",
				children: value.toLocaleString()
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 239,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-xs text-muted-foreground",
				children: label
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 242,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 237,
		columnNumber: 10
	}, this);
}
function IconAction({ icon: Icon, label, onClick, active, destructive }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
		onClick,
		title: label,
		"aria-label": label,
		className: `rounded-full p-2 transition-colors ${destructive ? "text-muted-foreground hover:bg-destructive/10 hover:text-destructive" : active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`,
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { className: "h-4 w-4" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 259,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 258,
		columnNumber: 10
	}, this);
}
//#endregion
export { AdminPage as component };
