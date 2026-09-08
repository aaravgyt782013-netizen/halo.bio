import { o as initializeApp } from "../_libs/@firebase/app+[...].mjs";
import "../_libs/firebase.mjs";
import { t as firebase_applet_config_default } from "./ssr.mjs";
import { n as getAuth } from "../_libs/firebase__auth.mjs";
import { d as getStorage } from "../_libs/firebase__storage.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/firebase-BL2RbOCC.js
var app = initializeApp(firebase_applet_config_default);
var firebaseAuth = getAuth(app);
var storage = getStorage(app);
//#endregion
export { firebaseAuth, storage };
