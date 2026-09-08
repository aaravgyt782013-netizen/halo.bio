import { r as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import "../_libs/firebase.mjs";
import { E as doc, d as onSnapshot } from "../_libs/@firebase/firestore+[...].mjs";
import { r as onAuthStateChanged } from "../_libs/firebase__auth.mjs";
import { n as firebaseAuth, t as db } from "./firebase-CxYrSYSJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useAuth-BjSo3O7_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useAuth() {
	const [user, setUser] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
			setUser(firebaseUser);
			setLoading(false);
		});
		return () => unsubscribe();
	}, []);
	const compatSession = user ? { user: {
		id: user.uid,
		email: user.email,
		role: "user"
	} } : null;
	return {
		session: compatSession,
		user: compatSession ? compatSession.user : null,
		firebaseUser: user,
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
		setLoading(true);
		const unsubscribe = onSnapshot(doc(db, "profiles", userId), (docSnap) => {
			if (docSnap.exists()) setProfile(docSnap.data());
			else setProfile(null);
			setLoading(false);
		}, (error) => {
			console.error("Error fetching profile", error);
			setLoading(false);
		});
		return () => unsubscribe();
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
		const unsubscribe = onSnapshot(doc(db, "user_roles", userId), (docSnap) => {
			if (docSnap.exists()) setIsAdmin(docSnap.data().role === "admin");
			else setIsAdmin(false);
		}, (error) => {
			console.error("Error fetching admin status", error);
			setIsAdmin(false);
		});
		return () => unsubscribe();
	}, [userId]);
	return isAdmin;
}
//#endregion
export { useIsAdmin as n, useMyProfile as r, useAuth as t };
