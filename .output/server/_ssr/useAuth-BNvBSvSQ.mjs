import { r as __toESM } from "../_runtime.mjs";
import { n as auth, r as db } from "./bio-Drf3dUJc.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useAuth-BNvBSvSQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useAuth() {
	const [session, setSession] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const { data: sub } = auth.onAuthStateChange((_e, s) => {
			setSession(s);
			setLoading(false);
		});
		auth.getSession().then(({ data }) => {
			setSession(data.session);
			setLoading(false);
		});
		return () => sub.subscription.unsubscribe();
	}, []);
	return {
		session,
		user: session?.user ?? null,
		loading
	};
}
function useMyProfile(userId) {
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (!userId) {
			setProfile(null);
			setLoading(false);
			return;
		}
		let cancelled = false;
		setLoading(true);
		const loadProfile = () => {
			db.from("profiles").select("*").eq("id", userId).maybeSingle().then(({ data }) => {
				if (!cancelled) {
					setProfile(data ?? null);
					setLoading(false);
				}
			});
		};
		loadProfile();
		const handleUpdate = () => {
			loadProfile();
		};
		if (typeof window !== "undefined") window.addEventListener("halo-store-updated", handleUpdate);
		return () => {
			cancelled = true;
			if (typeof window !== "undefined") window.removeEventListener("halo-store-updated", handleUpdate);
		};
	}, [userId]);
	return {
		profile,
		setProfile,
		loading
	};
}
function useIsAdmin(userId) {
	const [isAdmin, setIsAdmin] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!userId) {
			setIsAdmin(null);
			return;
		}
		let cancelled = false;
		db.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle().then(({ data }) => {
			if (!cancelled) setIsAdmin(!!data);
		});
		return () => {
			cancelled = true;
		};
	}, [userId]);
	return isAdmin;
}
//#endregion
export { useIsAdmin as n, useMyProfile as r, useAuth as t };
