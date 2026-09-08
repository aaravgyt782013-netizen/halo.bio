import { r as __toESM } from "./_runtime.mjs";
import { i as fetchProfileByUsername, n as db } from "./_ssr/bio-BYbB952i.mjs";
import { r as require_react } from "./_libs/react+tanstack__react-query.mjs";
import { t as require_jsx_dev_runtime } from "./_libs/react.mjs";
import { r as Route$4 } from "./_ssr/router-A7fSexpq.mjs";
import { t as ProfileView } from "./_ssr/ProfileView-D2zm3bl7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_username-DRcy6829.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/$username.tsx?tsr-split=component";
function PublicProfile() {
	const loaderData = Route$4.useLoaderData();
	const [profile, setProfile] = (0, import_react.useState)(loaderData.profile);
	const [links, setLinks] = (0, import_react.useState)(loaderData.links);
	(0, import_react.useEffect)(() => {
		const syncFresh = () => {
			fetchProfileByUsername(profile.username).then((fresh) => {
				if (fresh && fresh.profile) {
					setProfile(fresh.profile);
					setLinks(fresh.links);
				}
			});
		};
		window.addEventListener("halo-store-updated", syncFresh);
		window.addEventListener("storage", syncFresh);
		window.addEventListener("focus", syncFresh);
		return () => {
			window.removeEventListener("halo-store-updated", syncFresh);
			window.removeEventListener("storage", syncFresh);
			window.removeEventListener("focus", syncFresh);
		};
	}, [profile.username]);
	const handleEnter = async () => {
		const res = await db.rpc("increment_profile_view", { _username: profile.username });
		if (res.data && typeof res.data.views === "number") setProfile((prev) => ({
			...prev,
			views: res.data.views
		}));
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "h-screen w-full",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ProfileView, {
			profile,
			links,
			onEnter: handleEnter,
			onLinkClick: (link) => {
				db.rpc("increment_link_click", { _link_id: link.id });
			}
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 47,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 46,
		columnNumber: 10
	}, this);
}
//#endregion
export { PublicProfile as component };
