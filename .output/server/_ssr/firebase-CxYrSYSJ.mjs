import { n as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./rolldown-runtime-D7D4PA-g.mjs";
import { o as getApps, s as initializeApp } from "../_libs/@firebase/app+[...].mjs";
import "../_libs/firebase.mjs";
import { O as getFirestore } from "../_libs/@firebase/firestore+[...].mjs";
import { t as firebase_applet_config_default } from "./ssr.mjs";
import { n as getAuth } from "../_libs/firebase__auth.mjs";
import { d as getStorage } from "../_libs/firebase__storage.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/firebase-CxYrSYSJ.js
var firebase_CxYrSYSJ_exports = /* @__PURE__ */ __exportAll({
	n: () => firebaseAuth,
	r: () => firebase_exports,
	t: () => db
});
var firebase_exports = /* @__PURE__ */ __exportAll$1({
	app: () => app,
	db: () => db,
	firebaseAuth: () => firebaseAuth,
	storage: () => storage
});
var app = getApps().length === 0 ? initializeApp(firebase_applet_config_default) : getApps()[0];
var firebaseAuth = getAuth(app);
var db = getFirestore(app, firebase_applet_config_default.firestoreDatabaseId);
var storage = getStorage(app);
//#endregion
export { firebaseAuth as n, firebase_CxYrSYSJ_exports as r, db as t };
