import { r as __toESM } from "../_runtime.mjs";
import { o as normalizeUsername, r as db, t as USERNAME_RE } from "./bio-DvztBpRh.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { D as LoaderCircle, L as Check, f as ShieldCheck, p as ShieldAlert, t as X } from "../_libs/lucide-react.mjs";
import { r as useMyProfile, t as useAuth } from "./useAuth-CtUGMe9k.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/claim-DhkGnwzF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/claim.tsx?tsr-split=component";
function ClaimPage() {
	const navigate = useNavigate();
	const { user, loading } = useAuth();
	const { profile, loading: profileLoading } = useMyProfile(user?.id);
	const [value, setValue] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!loading && !user) navigate({ to: "/auth" });
	}, [
		loading,
		user,
		navigate
	]);
	(0, import_react.useEffect)(() => {
		const desired = typeof window !== "undefined" ? sessionStorage.getItem("halo:desired-username") : null;
		if (desired) setValue(normalizeUsername(desired));
	}, []);
	(0, import_react.useEffect)(() => {
		if (profile?.username) navigate({ to: "/dashboard" });
	}, [profile, navigate]);
	const valid = (0, import_react.useMemo)(() => USERNAME_RE.test(value), [value]);
	(0, import_react.useEffect)(() => {
		if (!value) return setStatus("idle");
		if (!valid) return setStatus("invalid");
		setStatus("checking");
		const t = window.setTimeout(async () => {
			const { data, error } = await db.rpc("username_available", {
				_username: value,
				_user_id: user?.id
			});
			if (error) return setStatus("idle");
			setStatus(data ? "free" : "taken");
		}, 300);
		return () => window.clearTimeout(t);
	}, [
		value,
		valid,
		user?.id
	]);
	const save = async () => {
		if (!user || status !== "free") return;
		setSaving(true);
		const { error } = await db.rpc("claim_username", {
			_username: value,
			_user_id: user.id
		});
		setSaving(false);
		if (error) {
			toast.error(error.message || "This username is already reserved by another user. Try another.");
			setStatus("taken");
			return;
		}
		sessionStorage.removeItem("halo:desired-username");
		toast.success(`halo.bio/${value} is now reserved exclusively for you!`);
		navigate({ to: "/dashboard" });
	};
	if (loading || profileLoading) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-screen items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 75,
			columnNumber: 9
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 74,
		columnNumber: 12
	}, this);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "relative flex min-h-screen items-center justify-center px-5 py-12",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "aura pointer-events-none absolute inset-0 -z-10" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 79,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "glass-panel w-full max-w-md animate-float-in p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "font-display text-2xl font-bold",
					children: "Claim your username"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 81,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-1.5 text-sm text-muted-foreground",
					children: "This becomes your permanent public page: halo.bio/username"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 82,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-6 flex items-center gap-2 rounded-full border border-input bg-card px-4 py-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-sm text-muted-foreground",
							children: "halo.bio/"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 87,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
							autoFocus: true,
							value,
							onChange: (e) => setValue(normalizeUsername(e.target.value)),
							placeholder: "yourname",
							"aria-label": "Username",
							className: "min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 88,
							columnNumber: 11
						}, this),
						status === "checking" && /* @__PURE__ */ (void 0)(LoaderCircle, { className: "h-4 w-4 animate-spin text-muted-foreground" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 89,
							columnNumber: 37
						}, this),
						status === "free" && /* @__PURE__ */ (void 0)(Check, { className: "h-4 w-4 text-emerald-500" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 90,
							columnNumber: 33
						}, this),
						(status === "taken" || status === "invalid") && /* @__PURE__ */ (void 0)(X, { className: "h-4 w-4 text-destructive" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 91,
							columnNumber: 60
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 86,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-2.5 min-h-6 text-xs",
					children: [
						status === "invalid" && /* @__PURE__ */ (void 0)("p", {
							className: "text-destructive",
							children: "3–20 characters: lowercase letters, numbers, dot or underscore."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 95,
							columnNumber: 36
						}, this),
						status === "taken" && /* @__PURE__ */ (void 0)("p", {
							className: "text-destructive font-medium flex items-center gap-1.5",
							children: [/* @__PURE__ */ (void 0)(ShieldAlert, { className: "h-3.5 w-3.5 inline shrink-0" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 99,
								columnNumber: 15
							}, this), "Reserved: Another user has already claimed this username."]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 98,
							columnNumber: 34
						}, this),
						status === "free" && /* @__PURE__ */ (void 0)("p", {
							className: "text-emerald-500 font-medium flex items-center gap-1.5",
							children: [/* @__PURE__ */ (void 0)(ShieldCheck, { className: "h-3.5 w-3.5 inline shrink-0" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 103,
								columnNumber: 15
							}, this), "Available! Will be permanently locked to your account."]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 102,
							columnNumber: 33
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 94,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					type: "button",
					onClick: save,
					disabled: status !== "free" || saving,
					className: "btn-primary mt-4 w-full",
					children: saving ? "Reserving Handle…" : "Claim username"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 108,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 80,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 78,
		columnNumber: 10
	}, this);
}
//#endregion
export { ClaimPage as component };
