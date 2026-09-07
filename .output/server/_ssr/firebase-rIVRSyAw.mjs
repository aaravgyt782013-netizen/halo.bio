import { o as initializeApp } from "../_libs/@firebase/app+[...].mjs";
import "../_libs/firebase.mjs";
import { n as getAuth } from "../_libs/firebase__auth.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/firebase-rIVRSyAw.js
var app = initializeApp({
	projectId: "sound-studio-rds98",
	appId: "1:126595014353:web:587696198fe8e9716c6ff0",
	apiKey: "AIzaSyDiTZdwgUJDkX0yCfjRTktWak4lSqbswyI",
	authDomain: "sound-studio-rds98.firebaseapp.com",
	firestoreDatabaseId: "ai-studio-halobio-7f8545bf-507e-46a5-b9ed-b8779c161271",
	storageBucket: "sound-studio-rds98.firebasestorage.app",
	messagingSenderId: "126595014353",
	measurementId: "",
	oAuthClientId: "126595014353-uqdm93ooerv3um4f7n0sj1su2ub0phg3.apps.googleusercontent.com",
	recaptchaSiteKey: ""
});
var firebaseAuth = getAuth(app);
//#endregion
export { firebaseAuth };
