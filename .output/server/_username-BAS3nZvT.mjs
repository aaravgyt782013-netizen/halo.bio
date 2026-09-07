import { r as __toESM } from "./_runtime.mjs";
import { a as fetchProfileByUsername, r as db } from "./_ssr/bio-Drf3dUJc.mjs";
import { r as require_react } from "./_libs/react+tanstack__react-query.mjs";
import { v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { t as require_jsx_dev_runtime } from "./_libs/react.mjs";
import { r as Route$4 } from "./_ssr/router-B7cgKpxn.mjs";
import { t as ProfileView } from "./_ssr/ProfileView-4DZC1nlM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_username-BAS3nZvT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/$username.tsx?tsr-split=notFoundComponent";
function ProfileNotFound() {
	const { username } = Route$4.useParams();
	const [clientProfile, setClientProfile] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		fetchProfileByUsername(username).then((res) => {
			if (res && res.profile && res.profile.username && !res.profile.is_banned) setClientProfile(res);
		});
	}, [username]);
	if (clientProfile) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "h-screen w-full",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ProfileView, {
			profile: clientProfile.profile,
			links: clientProfile.links,
			onEnter: async () => {
				const res = await db.rpc("increment_profile_view", { _username: clientProfile.profile.username });
				if (res.data && typeof res.data.views === "number") setClientProfile((prev) => prev ? {
					...prev,
					profile: {
						...prev.profile,
						views: res.data.views
					}
				} : null);
			},
			onLinkClick: (link) => {
				db.rpc("increment_link_click", { _link_id: link.id });
			}
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 26,
			columnNumber: 9
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 25,
		columnNumber: 12
	}, this);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "relative flex min-h-screen flex-col items-center justify-center gap-4 px-5 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "aura pointer-events-none absolute inset-0 -z-10" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 51,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "glass-panel max-w-md p-8 animate-float-in",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "font-display text-3xl font-bold tracking-tight",
					children: [
						"@",
						username,
						" is available!"
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 53,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Nobody has claimed this custom link-in-bio handle yet."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 56,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-6 flex justify-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: "/auth",
						search: {
							mode: "signup",
							u: username
						},
						className: "btn-primary",
						children: [
							"Claim @",
							username,
							" now"
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 60,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: "/",
						className: "btn-ghost",
						children: "Explore Halo"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 66,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 59,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 52,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 50,
		columnNumber: 10
	}, this);
}
//#endregion
export { ProfileNotFound as notFoundComponent };
