import { n as __exportAll } from "../_runtime.mjs";
import { s as initializeApp } from "../_libs/@firebase/app+[...].mjs";
import "../_libs/firebase.mjs";
import { E as doc, O as getFirestore, c as getDoc, g as where, h as updateDoc, l as getDocs, m as setDoc, o as deleteDoc, p as query, w as collection } from "../_libs/@firebase/firestore+[...].mjs";
import processModule from "node:process";
import { Buffer } from "node:buffer";
import { Readable } from "node:stream";
import fs from "node:fs";
import path from "node:path";
import * as crypto from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/index.js
var ssr_exports = /* @__PURE__ */ __exportAll({
	default: () => server_default,
	getSessionFromRequest: () => getSessionFromRequest,
	n: () => renderErrorPage,
	t: () => firebase_applet_config_default
});
var lastCapturedError;
var TTL_MS = 5e3;
function record(error) {
	lastCapturedError = {
		error,
		at: Date.now()
	};
}
var CAUSE_DEPTH_LIMIT = 5;
var DESCRIPTION_LENGTH_LIMIT = 8e3;
function describeError(error) {
	const parts = [];
	let current = error;
	for (let depth = 0; depth < CAUSE_DEPTH_LIMIT && current != null; depth++) {
		if (!(current instanceof Error)) {
			parts.push(typeof current === "string" ? current : safeStringify(current));
			break;
		}
		const label = depth === 0 ? "" : "caused by: ";
		const status = describeStatus(current);
		parts.push(`${label}${current.stack ?? `${current.name}: ${current.message}`}${status}`);
		current = current.cause;
	}
	return parts.join("\n").slice(0, DESCRIPTION_LENGTH_LIMIT);
}
function describeStatus(error) {
	const { status, statusCode } = error;
	const value = status ?? statusCode;
	return typeof value === "number" ? ` (status ${value})` : "";
}
function safeStringify(value) {
	try {
		return JSON.stringify(value) ?? String(value);
	} catch {
		return String(value);
	}
}
function isErrorLike(value) {
	return value instanceof Error;
}
var originalConsoleError = console.error.bind(console);
console.error = (...args) => {
	originalConsoleError(...args.map((arg) => {
		if (!isErrorLike(arg)) return arg;
		record(arg);
		return describeError(arg);
	}));
};
if (typeof globalThis.addEventListener === "function") {
	globalThis.addEventListener("error", (event) => record(event.error ?? event));
	globalThis.addEventListener("unhandledrejection", (event) => record(event.reason));
}
function consumeLastCapturedError() {
	if (!lastCapturedError) return void 0;
	if (Date.now() - lastCapturedError.at > TTL_MS) {
		lastCapturedError = void 0;
		return;
	}
	const { error } = lastCapturedError;
	lastCapturedError = void 0;
	return error;
}
function renderErrorPage() {
	return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
var PBKDF2_ITERATIONS = 1e5;
var PBKDF2_KEYLEN = 64;
var PBKDF2_DIGEST = "sha512";
/**
* Computes a secure PBKDF2-SHA512 hash with a cryptographically random salt.
* Output format: `<salt_hex>:<hash_hex>`
*/
function hashPasswordServer(password, customSalt) {
	const salt = customSalt || crypto.randomBytes(16).toString("hex");
	return `${salt}:${crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, PBKDF2_KEYLEN, PBKDF2_DIGEST).toString("hex")}`;
}
/**
* Verifies a plaintext password against a stored hash.
* Only accepts valid salt:hash format or safely upgrades legacy SHA-256 hashes.
* STRICTLY NO PLAINTEXT FALLBACK - plain strings will never authenticate.
*/
function verifyPasswordServer(plainInput, storedRecord) {
	if (!plainInput || !storedRecord) return {
		valid: false,
		needsRehash: false
	};
	if (storedRecord.includes(":")) {
		const parts = storedRecord.split(":");
		if (parts.length !== 2) return {
			valid: false,
			needsRehash: false
		};
		const [salt, hash] = parts;
		if (!salt || !hash) return {
			valid: false,
			needsRehash: false
		};
		try {
			const derivedKey = crypto.pbkdf2Sync(plainInput, salt, PBKDF2_ITERATIONS, PBKDF2_KEYLEN, PBKDF2_DIGEST);
			const derivedBuffer = Buffer.from(derivedKey.toString("hex"), "hex");
			const hashBuffer = Buffer.from(hash, "hex");
			if (derivedBuffer.length !== hashBuffer.length) return {
				valid: false,
				needsRehash: false
			};
			return {
				valid: crypto.timingSafeEqual(derivedBuffer, hashBuffer),
				needsRehash: false
			};
		} catch {
			return {
				valid: false,
				needsRehash: false
			};
		}
	}
	if (storedRecord.length === 64) try {
		const legacyHash = crypto.createHash("sha256").update("halo_salt_2026_" + plainInput).digest("hex");
		const a = Buffer.from(legacyHash, "hex");
		const b = Buffer.from(storedRecord, "hex");
		if (a.length === b.length && crypto.timingSafeEqual(a, b)) return {
			valid: true,
			needsRehash: true
		};
	} catch {}
	return {
		valid: false,
		needsRehash: false
	};
}
/**
* Generates a cryptographically strong session token.
*/
function generateSessionToken() {
	return `${crypto.randomUUID()}.${crypto.randomBytes(32).toString("hex")}`;
}
var firebase_applet_config_default = {
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
};
var app = initializeApp(firebase_applet_config_default || {});
var db = getFirestore(app, firebase_applet_config_default?.firestoreDatabaseId);
function sanitizeSafeUrl(url) {
	if (!url) return "";
	const trimmed = url.trim();
	if (/^(javascript|vbscript|file):/i.test(trimmed)) return "";
	if (trimmed.startsWith("data:") && !trimmed.startsWith("data:image/") && !trimmed.startsWith("data:audio/") && !trimmed.startsWith("data:video/")) return "";
	return trimmed;
}
var view_cooldowns = {};
var click_cooldowns = {};
var viewed_ips = {};
var serverStorage = {
	async getUserByEmail(email) {
		const q = query(collection(db, "users"), where("email", "==", email.toLowerCase().trim()));
		const snap = await getDocs(q);
		if (snap.empty) return null;
		return snap.docs[0].data();
	},
	async getUserById(id) {
		const snap = await getDoc(doc(db, "users", id));
		if (!snap.exists()) return null;
		return snap.data();
	},
	async updateUserPassword(id, hash) {
		const ref = doc(db, "users", id);
		if (!(await getDoc(ref)).exists()) return false;
		await updateDoc(ref, { password: hash });
		return true;
	},
	async updateUserRole(id, role) {
		const ref = doc(db, "users", id);
		if (!(await getDoc(ref)).exists()) return false;
		await updateDoc(ref, { role });
		return true;
	},
	async getSession(token) {
		const snap = await getDoc(doc(db, "sessions", token));
		if (!snap.exists()) return null;
		return snap.data();
	},
	async createSession(userId, role) {
		const token = generateSessionToken();
		const session = {
			token,
			user_id: userId,
			role
		};
		await setDoc(doc(db, "sessions", token), session);
		return session;
	},
	async revokeSession(token) {
		await deleteDoc(doc(db, "sessions", token));
	},
	async isUsernameAvailable(username, excludeUserId) {
		const clean = username.toLowerCase().trim();
		if (!clean || clean.length < 3 || clean.length > 20) return {
			available: false,
			reason: "invalid_length"
		};
		if (!/^[a-z0-9_.]+$/.test(clean)) return {
			available: false,
			reason: "invalid_chars"
		};
		if ([
			"admin",
			"api",
			"login",
			"signup",
			"logout",
			"help",
			"support",
			"terms",
			"privacy"
		].includes(clean)) return {
			available: false,
			reason: "reserved"
		};
		const q = query(collection(db, "profiles"), where("username", "==", clean));
		const snap = await getDocs(q);
		if (snap.empty) return { available: true };
		if (excludeUserId && snap.docs[0].data().id === excludeUserId) return { available: true };
		return {
			available: false,
			reason: "taken"
		};
	},
	async createUser(params) {
		const cleanEmail = params.email.toLowerCase().trim();
		const userId = "usr-" + Math.random().toString(36).substring(2, 10);
		const role = params.role || (cleanEmail === "staff@gmail.com" ? "admin" : "user");
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const user = {
			id: userId,
			email: cleanEmail,
			password: params.passwordHash,
			full_name: params.full_name || cleanEmail.split("@")[0] || "User",
			role,
			created_at: now
		};
		const profile = {
			id: userId,
			username: null,
			display_name: user.full_name,
			bio: "",
			avatar_url: null,
			background_type: "color",
			background_value: "#0b0f19",
			card_opacity: .6,
			card_radius: 24,
			card_blur: 20,
			accent_color: "#3b82f6",
			music_url: null,
			music_enabled: false,
			enter_text: "Click To Enter",
			is_premium: false,
			is_banned: false,
			is_flagged: false,
			views: 0,
			created_at: now
		};
		await setDoc(doc(db, "users", userId), user);
		await setDoc(doc(db, "profiles", userId), profile);
		return {
			user,
			profile
		};
	},
	async claimUsername(userId, username) {
		const clean = username.toLowerCase().trim();
		const avail = await this.isUsernameAvailable(clean, userId);
		if (!avail.available) return {
			success: false,
			error: avail.reason === "taken" ? "Username taken" : "Invalid username"
		};
		const snap = await getDoc(doc(db, "profiles", userId));
		if (!snap.exists()) return {
			success: false,
			error: "Profile not found"
		};
		const profile = snap.data();
		profile.username = clean;
		await updateDoc(doc(db, "profiles", userId), { username: clean });
		return {
			success: true,
			username: clean
		};
	},
	async getProfile(username) {
		const clean = username.toLowerCase().trim();
		const q = query(collection(db, "profiles"), where("username", "==", clean));
		const snap = await getDocs(q);
		if (snap.empty) return null;
		const profile = snap.docs[0].data();
		const lq = query(collection(db, "links"), where("user_id", "==", profile.id));
		return {
			profile,
			links: (await getDocs(lq)).docs.map((d) => d.data()).sort((a, b) => a.position - b.position)
		};
	},
	async syncUser(userId, isAdmin, payload) {
		if (payload.profiles && Array.isArray(payload.profiles)) for (const incoming of payload.profiles) {
			if (!isAdmin && incoming.id !== userId) continue;
			const snap = await getDoc(doc(db, "profiles", incoming.id));
			const nowIso = (/* @__PURE__ */ new Date()).toISOString();
			if (snap.exists()) {
				const existing = snap.data();
				let safeUsername = existing.username;
				if (incoming.username && incoming.username.toLowerCase() !== existing.username?.toLowerCase()) {
					if ((await this.isUsernameAvailable(incoming.username, existing.id)).available) safeUsername = incoming.username.toLowerCase().trim();
				}
				const bgType = [
					"color",
					"image",
					"video"
				].includes(incoming.background_type) ? incoming.background_type : existing.background_type;
				let bgValue = existing.background_value;
				if (bgType === "color") bgValue = incoming.background_value && /^#[0-9a-fA-F]{3,8}$/.test(incoming.background_value) ? incoming.background_value : existing.background_value || "#0b0f19";
				else if (incoming.background_value) bgValue = sanitizeSafeUrl(incoming.background_value) || bgValue;
				const glassIntensity = [
					"subtle",
					"medium",
					"heavy",
					"ultra"
				].includes(incoming.glass_intensity) ? incoming.glass_intensity : existing.glass_intensity || "medium";
				let socialLinks = existing.social_links || [];
				if (Array.isArray(incoming.social_links)) socialLinks = incoming.social_links.filter((s) => s && typeof s.platform === "string" && typeof s.url === "string" && s.url.trim().length > 0).slice(0, 25).map((s) => ({
					id: String(s.id || Math.random().toString(36).substring(2, 9)),
					platform: String(s.platform).slice(0, 30),
					title: s.title ? String(s.title).slice(0, 50) : void 0,
					icon_url: s.icon_url ? sanitizeSafeUrl(s.icon_url) || void 0 : void 0,
					url: sanitizeSafeUrl(s.url),
					active: s.active !== false
				}));
				const updated = {
					...existing,
					display_name: incoming.display_name !== void 0 ? String(incoming.display_name).slice(0, 100) : existing.display_name,
					bio: incoming.bio !== void 0 ? String(incoming.bio || "").slice(0, 500) : existing.bio,
					avatar_url: incoming.avatar_url !== void 0 ? sanitizeSafeUrl(incoming.avatar_url) || null : existing.avatar_url,
					background_type: bgType,
					background_value: bgValue,
					card_opacity: typeof incoming.card_opacity === "number" ? Math.min(1, Math.max(0, incoming.card_opacity)) : existing.card_opacity,
					card_radius: typeof incoming.card_radius === "number" ? Math.min(60, Math.max(0, incoming.card_radius)) : existing.card_radius,
					card_blur: typeof incoming.card_blur === "number" ? Math.min(60, Math.max(0, incoming.card_blur)) : existing.card_blur,
					glass_intensity: glassIntensity,
					social_links: socialLinks,
					accent_color: incoming.accent_color && /^#[0-9a-fA-F]{3,8}$/.test(incoming.accent_color) ? incoming.accent_color : existing.accent_color,
					music_url: incoming.music_url !== void 0 ? sanitizeSafeUrl(incoming.music_url) || null : existing.music_url,
					music_enabled: Boolean(incoming.music_enabled),
					enter_text: incoming.enter_text ? String(incoming.enter_text).slice(0, 50) : existing.enter_text || "Click to Enter",
					is_premium: isAdmin && typeof incoming.is_premium === "boolean" ? incoming.is_premium : existing.is_premium,
					is_banned: isAdmin && typeof incoming.is_banned === "boolean" ? incoming.is_banned : existing.is_banned,
					is_flagged: isAdmin && typeof incoming.is_flagged === "boolean" ? incoming.is_flagged : existing.is_flagged,
					views: existing.views || 0,
					username: safeUsername,
					updated_at: nowIso
				};
				try {
					await setDoc(doc(db, "profiles", incoming.id), updated);
				} catch (err) {
					return {
						success: false,
						error: err instanceof Error ? err.message : "Failed to update profile"
					};
				}
			} else {
				const initial = {
					id: incoming.id,
					username: incoming.username ? incoming.username.toLowerCase().trim() : null,
					display_name: incoming.display_name ? String(incoming.display_name).slice(0, 100) : "User",
					bio: incoming.bio ? String(incoming.bio).slice(0, 500) : "",
					avatar_url: sanitizeSafeUrl(incoming.avatar_url) || null,
					background_type: [
						"color",
						"image",
						"video"
					].includes(incoming.background_type) ? incoming.background_type : "color",
					background_value: incoming.background_value || "#0b0f19",
					card_opacity: typeof incoming.card_opacity === "number" ? incoming.card_opacity : .65,
					card_radius: typeof incoming.card_radius === "number" ? incoming.card_radius : 24,
					card_blur: typeof incoming.card_blur === "number" ? incoming.card_blur : 20,
					glass_intensity: typeof incoming.glass_intensity === "string" && [
						"subtle",
						"medium",
						"heavy",
						"ultra"
					].includes(incoming.glass_intensity) ? incoming.glass_intensity : "medium",
					social_links: Array.isArray(incoming.social_links) ? incoming.social_links.slice(0, 25) : [],
					accent_color: incoming.accent_color || "#3b82f6",
					music_url: sanitizeSafeUrl(incoming.music_url) || null,
					music_enabled: Boolean(incoming.music_enabled),
					enter_text: incoming.enter_text || "Click to Enter",
					is_premium: false,
					is_banned: false,
					is_flagged: false,
					views: 0,
					created_at: nowIso,
					updated_at: nowIso
				};
				try {
					await setDoc(doc(db, "profiles", incoming.id), initial);
				} catch (err) {
					return {
						success: false,
						error: err instanceof Error ? err.message : "Failed to create profile"
					};
				}
			}
		}
		if (payload.links && Array.isArray(payload.links)) try {
			const allowedIncoming = payload.links.filter((l) => isAdmin ? true : l.user_id === userId).map((l) => ({
				...l,
				title: String(l.title || "Link").slice(0, 100),
				url: sanitizeSafeUrl(l.url) || "https://",
				clicks: typeof l.clicks === "number" ? l.clicks : 0
			}));
			const q = query(collection(db, "links"), where("user_id", "==", userId));
			const existingSnaps = await getDocs(q);
			for (const d of existingSnaps.docs) await deleteDoc(d.ref);
			for (const l of allowedIncoming) {
				if (!l.id) l.id = "lnk-" + Math.random().toString(36).substring(2, 10);
				await setDoc(doc(db, "links", l.id), l);
			}
		} catch (err) {
			return {
				success: false,
				error: err instanceof Error ? err.message : "Failed to update links"
			};
		}
		return { success: true };
	},
	async recordView(username, ip) {
		const clean = username.toLowerCase().trim();
		const q = query(collection(db, "profiles"), where("username", "==", clean));
		const snap = await getDocs(q);
		if (snap.empty) return {
			success: false,
			counted: false,
			views: 0,
			reason: "profile_not_found"
		};
		const profile = snap.docs[0].data();
		const cleanIp = (ip || "127.0.0.1").trim();
		const cooldownKey = `${cleanIp}:${clean}`;
		const now = Date.now();
		if (now - (view_cooldowns[cooldownKey] || 0) < 432e5) return {
			success: true,
			counted: false,
			views: profile.views || 0,
			reason: "cooldown_active"
		};
		const vl = viewed_ips[clean] || [];
		if (vl.includes(cleanIp)) {
			view_cooldowns[cooldownKey] = now;
			return {
				success: true,
				counted: false,
				views: profile.views || 0,
				reason: "duplicate_ip"
			};
		}
		vl.push(cleanIp);
		viewed_ips[clean] = vl;
		view_cooldowns[cooldownKey] = now;
		const newViews = (profile.views || 0) + 1;
		await updateDoc(snap.docs[0].ref, { views: newViews });
		return {
			success: true,
			counted: true,
			views: newViews
		};
	},
	async recordClick(linkId, ip) {
		const snap = await getDoc(doc(db, "links", linkId));
		if (!snap.exists()) return {
			success: false,
			clicks: 0,
			counted: false
		};
		const link = snap.data();
		const cooldownKey = `${(ip || "127.0.0.1").trim()}:${linkId}`;
		const now = Date.now();
		if (now - (click_cooldowns[cooldownKey] || 0) < 1e4) return {
			success: true,
			clicks: link.clicks || 0,
			counted: false
		};
		click_cooldowns[cooldownKey] = now;
		const newClicks = (link.clicks || 0) + 1;
		await updateDoc(snap.ref, { clicks: newClicks });
		return {
			success: true,
			clicks: newClicks,
			counted: true
		};
	},
	async getStats() {
		const pSnap = await getDocs(collection(db, "profiles"));
		const lSnap = await getDocs(collection(db, "links"));
		const profiles = pSnap.docs.map((d) => d.data());
		const links = lSnap.docs.map((d) => d.data());
		return {
			total_profiles: profiles.length,
			active_profiles: profiles.filter((p) => p.username && !p.is_banned).length,
			total_views: profiles.reduce((a, b) => a + (b.views || 0), 0),
			total_clicks: links.reduce((a, b) => a + (b.clicks || 0), 0),
			total_links: links.length
		};
	},
	async getCallerStore(userId, isAdmin) {
		let myProfile = null;
		let myLinks = [];
		const snap = await getDoc(doc(db, "profiles", userId));
		if (snap.exists()) myProfile = snap.data();
		const lq = query(collection(db, "links"), where("user_id", "==", userId));
		myLinks = (await getDocs(lq)).docs.map((d) => d.data()).sort((a, b) => a.position - b.position);
		const publicProfiles = (await getDocs(collection(db, "profiles"))).docs.map((d) => d.data()).filter((p) => p.username && !p.is_banned);
		return {
			myProfile,
			myLinks,
			publicProfiles
		};
	},
	async getAllProfilesAdmin(includeBanned) {
		let profiles = (await getDocs(collection(db, "profiles"))).docs.map((d) => d.data());
		if (!includeBanned) profiles = profiles.filter((p) => !p.is_banned);
		return profiles;
	},
	async adminMutateProfile(userId, updates) {
		const snap = await getDoc(doc(db, "profiles", userId));
		if (!snap.exists()) return { success: false };
		await updateDoc(snap.ref, updates);
		return { success: true };
	},
	async adminDeleteProfile(userId) {
		const snap = await getDoc(doc(db, "profiles", userId));
		if (!snap.exists()) return { success: false };
		await deleteDoc(snap.ref);
		await deleteDoc(doc(db, "users", userId));
		const lq = query(collection(db, "links"), where("user_id", "==", userId));
		const lSnap = await getDocs(lq);
		for (const d of lSnap.docs) await deleteDoc(d.ref);
		return { success: true };
	}
};
var rateLimitMap = /* @__PURE__ */ new Map();
if (typeof setInterval !== "undefined") {
	const timer = setInterval(() => {
		const now = Date.now();
		rateLimitMap.forEach((record, key) => {
			if (record.resetAt <= now) rateLimitMap.delete(key);
		});
	}, 6e4);
	if (timer.unref) timer.unref();
}
/**
* Checks if a given identifier has exceeded the allowed request limit within the window.
* @param key unique bucket key (e.g., `ip:route`)
* @param limit max allowed requests in window
* @param windowMs window duration in milliseconds
*/
function checkRateLimit(key, limit, windowMs) {
	const now = Date.now();
	const record = rateLimitMap.get(key);
	if (!record || record.resetAt <= now) {
		rateLimitMap.set(key, {
			count: 1,
			resetAt: now + windowMs
		});
		return {
			allowed: true,
			retryAfter: 0
		};
	}
	if (record.count < limit) {
		record.count++;
		return {
			allowed: true,
			retryAfter: 0
		};
	}
	return {
		allowed: false,
		retryAfter: Math.max(1, Math.ceil((record.resetAt - now) / 1e3))
	};
}
var serverEntryPromise;
async function getServerEntry() {
	if (!serverEntryPromise) serverEntryPromise = import("./server-DS5swCXp.mjs").then((n) => n.t).then((m) => m.default ?? m);
	return serverEntryPromise;
}
function jsonResponse(data, status = 200, extraHeaders = {}) {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			"content-type": "application/json; charset=utf-8",
			"cache-control": "no-store",
			...extraHeaders
		}
	});
}
function getClientIp(request) {
	const xForwarded = request.headers.get("x-forwarded-for");
	if (xForwarded) return xForwarded.split(",")[0].trim();
	return request.headers.get("x-real-ip") || request.headers.get("cf-connecting-ip") || "127.0.0.1";
}
function parseCookies(cookieHeader) {
	if (!cookieHeader) return {};
	const cookies = {};
	const pairs = cookieHeader.split(";");
	for (const pair of pairs) {
		const idx = pair.indexOf("=");
		if (idx > 0) {
			const key = pair.slice(0, idx).trim();
			const val = pair.slice(idx + 1).trim();
			try {
				cookies[key] = decodeURIComponent(val);
			} catch {
				cookies[key] = val;
			}
		}
	}
	return cookies;
}
async function getSessionFromRequest(request) {
	const token = parseCookies(request.headers.get("cookie"))["halo_session"];
	if (!token) return null;
	const session = await serverStorage.getSession(token);
	if (!session) return null;
	return {
		token: session.token,
		userId: session.user_id,
		role: session.role
	};
}
function createSessionCookie(token, request, maxAge = 604800) {
	const isSecure = new URL(request.url).protocol === "https:" || request.headers.get("x-forwarded-proto") === "https";
	let cookie = `halo_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`;
	if (isSecure) cookie += "; Secure";
	return cookie;
}
function clearSessionCookie(request) {
	const isSecure = new URL(request.url).protocol === "https:" || request.headers.get("x-forwarded-proto") === "https";
	let cookie = `halo_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
	if (isSecure) cookie += "; Secure";
	return cookie;
}
var failedLogins = /* @__PURE__ */ new Map();
async function normalizeCatastrophicSsrResponse(response) {
	if (response.status < 500) return response;
	if (!(response.headers.get("content-type") ?? "").includes("application/json")) return response;
	const body = await response.clone().text();
	if (!isH3SwallowedErrorBody(body)) return response;
	console.error(consumeLastCapturedError() ?? /* @__PURE__ */ new Error(`h3 swallowed SSR error: ${body}`));
	return new Response(renderErrorPage(), {
		status: 500,
		headers: { "content-type": "text/html; charset=utf-8" }
	});
}
function isH3SwallowedErrorBody(body) {
	try {
		const payload = JSON.parse(body);
		return payload.unhandled === true && payload.message === "HTTPError";
	} catch {
		return false;
	}
}
globalThis.__HALO_SERVER_STORE__ = { getProfile: (username) => serverStorage.getProfile(username) };
var server_default = { async fetch(request, env, ctx) {
	try {
		const url = new URL(request.url);
		if (url.pathname.startsWith("/api/")) {
			const clientIp = getClientIp(request);
			const method = request.method.toUpperCase();
			if (url.pathname.startsWith("/api/media/") && method === "GET") {
				const rawName = url.pathname.slice(11);
				const filename = path.basename(decodeURIComponent(rawName));
				const filePath = path.join(processModule.cwd(), "public", "uploads", filename);
				if (!fs.existsSync(filePath)) return new Response("Media not found", { status: 404 });
				const fileSize = fs.statSync(filePath).size;
				const contentType = {
					".mp4": "video/mp4",
					".webm": "video/webm",
					".ogv": "video/ogg",
					".mov": "video/quicktime",
					".png": "image/png",
					".jpg": "image/jpeg",
					".jpeg": "image/jpeg",
					".gif": "image/gif",
					".svg": "image/svg+xml",
					".webp": "image/webp",
					".ico": "image/x-icon",
					".mp3": "audio/mpeg",
					".wav": "audio/wav"
				}[path.extname(filename).toLowerCase()] || "application/octet-stream";
				const range = request.headers.get("range");
				if (range) {
					const parts = range.replace(/bytes=/, "").split("-");
					const start = parseInt(parts[0], 10);
					const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
					if (start >= fileSize || end >= fileSize || start > end) return new Response(null, {
						status: 416,
						headers: { "Content-Range": `bytes */${fileSize}` }
					});
					const chunksize = end - start + 1;
					const nodeStream = fs.createReadStream(filePath, {
						start,
						end
					});
					const webStream = Readable.toWeb(nodeStream);
					return new Response(webStream, {
						status: 206,
						headers: {
							"Content-Range": `bytes ${start}-${end}/${fileSize}`,
							"Accept-Ranges": "bytes",
							"Content-Length": String(chunksize),
							"Content-Type": contentType,
							"Cache-Control": "public, max-age=31536000, immutable"
						}
					});
				}
				const nodeStream = fs.createReadStream(filePath);
				const webStream = Readable.toWeb(nodeStream);
				return new Response(webStream, {
					status: 200,
					headers: {
						"Content-Length": String(fileSize),
						"Content-Type": contentType,
						"Accept-Ranges": "bytes",
						"Cache-Control": "public, max-age=31536000, immutable"
					}
				});
			}
			const isUpload = url.pathname === "/api/upload";
			const maxLimit = isUpload ? 104857600 : 4718592;
			const contentLength = request.headers.get("content-length");
			if (contentLength && parseInt(contentLength, 10) > maxLimit) return jsonResponse({ error: isUpload ? "File exceeds the 100MB upload limit." : "Payload too large. Please use a smaller file or compressed image." }, 413);
			if ([
				"POST",
				"PUT",
				"DELETE",
				"PATCH"
			].includes(method)) {
				if (request.headers.get("x-requested-with") !== "halo-app") return jsonResponse({ error: "Invalid or missing CSRF header (X-Requested-With)" }, 200);
			}
			let rateLimit = 120;
			const windowMs = 6e4;
			if (url.pathname.startsWith("/api/auth/")) rateLimit = 20;
			else if (url.pathname === "/api/upload") rateLimit = 60;
			else if (url.pathname === "/api/change-password" || url.pathname.startsWith("/api/admin/")) rateLimit = 30;
			else if (url.pathname === "/api/sync" || url.pathname === "/api/claim") rateLimit = 30;
			else if (url.pathname === "/api/view" || url.pathname === "/api/click") rateLimit = 60;
			const rateCheck = checkRateLimit(`${clientIp}:${url.pathname}`, rateLimit, windowMs);
			if (!rateCheck.allowed) return jsonResponse({ error: "Too many requests. Please try again later." }, 429, { "Retry-After": String(rateCheck.retryAfter) });
			if (url.pathname === "/api/upload" && method === "POST") try {
				const file = (await request.formData()).get("file");
				if (!file) return jsonResponse({ error: "No file provided" }, 400);
				if (file.size > 104857600) return jsonResponse({ error: "File exceeds 100MB limit" }, 413);
				const rawExt = path.extname(file.name || "").toLowerCase();
				const defaultExt = file.type.startsWith("video/") ? ".mp4" : file.type.startsWith("image/svg") ? ".svg" : ".png";
				const ext = /^\.[a-zA-Z0-9]+$/.test(rawExt) ? rawExt : defaultExt;
				const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;
				const uploadDir = path.join(processModule.cwd(), "public", "uploads");
				if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
				const filePath = path.join(uploadDir, filename);
				const arrayBuf = await file.arrayBuffer();
				fs.writeFileSync(filePath, Buffer.from(arrayBuf));
				return jsonResponse({
					success: true,
					url: `/api/media/${filename}`,
					name: file.name,
					size: file.size,
					type: file.type
				});
			} catch (err) {
				console.error("Upload handler error:", err);
				return jsonResponse({ error: "Failed to process media upload" }, 500);
			}
			if (url.pathname === "/api/auth/signup" && method === "POST") try {
				const body = await request.json();
				const email = String(body.email || "").trim().toLowerCase();
				const password = String(body.password || "").trim();
				const fullName = String(body.full_name || "").trim();
				if (!email || !email.includes("@")) return jsonResponse({ error: "Please enter a valid email address" }, 400);
				if (password.length < 6) return jsonResponse({ error: "Password must be at least 6 characters long" }, 400);
				if (password.length > 128) return jsonResponse({ error: "Password exceeds maximum length" }, 400);
				if (await serverStorage.getUserByEmail(email)) return jsonResponse({ error: "An account with this email already exists" }, 409);
				const passwordHash = hashPasswordServer(password);
				const { user } = await serverStorage.createUser({
					email,
					passwordHash,
					full_name: fullName
				});
				const cookie = createSessionCookie((await serverStorage.createSession(user.id, user.role)).token, request);
				return jsonResponse({
					success: true,
					user: {
						id: user.id,
						email: user.email,
						full_name: user.full_name,
						role: user.role
					}
				}, 200, { "Set-Cookie": cookie });
			} catch {
				return jsonResponse({ error: "Failed to create account" }, 400);
			}
			if (url.pathname === "/api/auth/google" && method === "POST") try {
				const idToken = (await request.json()).idToken;
				if (!idToken) return jsonResponse({ error: "No ID token provided" }, 400);
				let apiKey = "";
				try {
					apiKey = firebase_applet_config_default.apiKey;
				} catch (e) {
					console.warn("Could not load API key for Google verification", e);
				}
				if (!apiKey) return jsonResponse({ error: "Firebase config not found on server" }, 500);
				const verifyRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ idToken })
				});
				const verifyData = await verifyRes.json();
				if (!verifyRes.ok || !verifyData.users || verifyData.users.length === 0) return jsonResponse({ error: "Invalid Google token" }, 401);
				const googleUser = verifyData.users[0];
				const email = googleUser.email.toLowerCase().trim();
				const fullName = googleUser.displayName || email.split("@")[0];
				let user = await serverStorage.getUserByEmail(email);
				if (!user) {
					const { user: newUser } = await serverStorage.createUser({
						email,
						passwordHash: "oauth:google:" + googleUser.localId,
						full_name: fullName
					});
					user = newUser;
				}
				const cookie = createSessionCookie((await serverStorage.createSession(user.id, user.role)).token, request);
				return jsonResponse({
					success: true,
					user: {
						id: user.id,
						email: user.email,
						full_name: user.full_name,
						role: user.role
					}
				}, 200, { "set-cookie": cookie });
			} catch (err) {
				console.error(err);
				return jsonResponse({ error: "Failed to log in with Google" }, 500);
			}
			if (url.pathname === "/api/auth/login" && method === "POST") try {
				const body = await request.json();
				const email = String(body.email || "").trim().toLowerCase();
				const password = String(body.password || "").trim();
				const now = Date.now();
				const failRecord = failedLogins.get(email);
				if (failRecord && failRecord.lockedUntil > now) return jsonResponse({ error: `Too many failed attempts. Please wait ${Math.ceil((failRecord.lockedUntil - now) / 1e3)}s.` }, 429);
				const user = await serverStorage.getUserByEmail(email);
				const verifyResult = user ? verifyPasswordServer(password, user.password) : {
					valid: false,
					needsRehash: false
				};
				if (!user || !verifyResult.valid) {
					const count = (failRecord?.count || 0) + 1;
					if (count >= 5) failedLogins.set(email, {
						count: 0,
						lockedUntil: now + 6e4
					});
					else failedLogins.set(email, {
						count,
						lockedUntil: 0
					});
					return jsonResponse({ error: "Invalid email or password" }, 401);
				}
				failedLogins.delete(email);
				if (verifyResult.needsRehash) await serverStorage.updateUserPassword(user.id, hashPasswordServer(password));
				const cookie = createSessionCookie((await serverStorage.createSession(user.id, user.role)).token, request);
				return jsonResponse({
					success: true,
					user: {
						id: user.id,
						email: user.email,
						full_name: user.full_name,
						role: user.role
					}
				}, 200, { "Set-Cookie": cookie });
			} catch {
				return jsonResponse({ error: "Authentication failed" }, 400);
			}
			if (url.pathname === "/api/auth/logout" && method === "POST") {
				const session = await getSessionFromRequest(request);
				if (session) await serverStorage.revokeSession(session.token);
				return jsonResponse({ success: true }, 200, { "Set-Cookie": clearSessionCookie(request) });
			}
			if (url.pathname === "/api/auth/me" && method === "GET") {
				const session = await getSessionFromRequest(request);
				if (!session) return jsonResponse({
					user: null,
					session: null
				});
				const user = await serverStorage.getUserById(session.userId);
				if (!user) return jsonResponse({
					user: null,
					session: null
				});
				return jsonResponse({
					user: {
						id: user.id,
						email: user.email,
						full_name: user.full_name,
						role: user.role
					},
					session: {
						user_id: session.userId,
						role: session.role
					}
				});
			}
			if (url.pathname === "/api/change-password" && method === "POST") {
				const session = await getSessionFromRequest(request);
				if (!session) return jsonResponse({ error: "Unauthorized" }, 401);
				try {
					const body = await request.json();
					const currentPassword = String(body.currentPassword || "");
					const newPassword = String(body.newPassword || "").trim();
					if (newPassword.length < 6) return jsonResponse({ error: "New password must be at least 6 characters" }, 400);
					const user = await serverStorage.getUserById(session.userId);
					if (!user) return jsonResponse({ error: "User not found" }, 404);
					if (!verifyPasswordServer(currentPassword, user.password).valid) return jsonResponse({ error: "Current password is incorrect" }, 400);
					const newHash = hashPasswordServer(newPassword);
					await serverStorage.updateUserPassword(user.id, newHash);
					return jsonResponse({ success: true });
				} catch {
					return jsonResponse({ error: "Failed to change password" }, 400);
				}
			}
			if (url.pathname === "/api/admin/set-role" && method === "POST") {
				const session = await getSessionFromRequest(request);
				if (!session || session.role !== "admin") return jsonResponse({ error: "Admin access required" }, 403);
				try {
					const body = await request.json();
					const targetUserId = String(body.targetUserId || "");
					const role = body.role;
					if (!targetUserId || !["admin", "user"].includes(role)) return jsonResponse({ error: "Invalid role payload" }, 400);
					await serverStorage.updateUserRole(targetUserId, role);
					return jsonResponse({ success: true });
				} catch {
					return jsonResponse({ error: "Failed to update role" }, 400);
				}
			}
			if (url.pathname === "/api/admin/profile-mutate" && method === "POST") {
				const session = await getSessionFromRequest(request);
				if (!session || session.role !== "admin") return jsonResponse({ error: "Admin access required" }, 403);
				try {
					const body = await request.json();
					const targetUserId = String(body.targetUserId || "");
					const changes = body.changes || {};
					const result = await serverStorage.adminMutateProfile(targetUserId, changes);
					if (!result.success) return jsonResponse(result, 404);
					return jsonResponse(result);
				} catch {
					return jsonResponse({ error: "Failed to mutate profile" }, 400);
				}
			}
			if (url.pathname === "/api/admin/delete-profile" && method === "POST") {
				const session = await getSessionFromRequest(request);
				if (!session || session.role !== "admin") return jsonResponse({ error: "Admin access required" }, 403);
				try {
					const body = await request.json();
					const targetUserId = String(body.targetUserId || "");
					const result = await serverStorage.adminDeleteProfile(targetUserId);
					if (!result.success) return jsonResponse(result, 404);
					return jsonResponse(result);
				} catch {
					return jsonResponse({ error: "Failed to delete profile" }, 400);
				}
			}
			if (url.pathname === "/api/admin/profiles" && method === "GET") {
				const session = await getSessionFromRequest(request);
				if (!session || session.role !== "admin") return jsonResponse({ error: "Admin access required" }, 403);
				return jsonResponse({ profiles: await serverStorage.getAllProfilesAdmin(true) });
			}
			if (url.pathname === "/api/sync" && method === "POST") {
				const session = await getSessionFromRequest(request);
				if (!session) return jsonResponse({ error: "Unauthorized" }, 401);
				try {
					const body = await request.json();
					return jsonResponse(await serverStorage.syncUser(session.userId, session.role === "admin", body));
				} catch {
					return jsonResponse({ error: "Invalid sync payload" }, 400);
				}
			}
			if (url.pathname === "/api/store" && method === "GET") {
				const session = await getSessionFromRequest(request);
				if (!session) return jsonResponse({ error: "Unauthorized" }, 401);
				return jsonResponse(await serverStorage.getCallerStore(session.userId, session.role === "admin"));
			}
			if (url.pathname === "/api/username-available" && method === "GET") {
				const username = url.searchParams.get("username") || "";
				const userId = url.searchParams.get("userId") || void 0;
				return jsonResponse(await serverStorage.isUsernameAvailable(username, userId));
			}
			if (url.pathname === "/api/claim" && method === "POST") {
				const session = await getSessionFromRequest(request);
				if (!session) return jsonResponse({ error: "Unauthorized" }, 401);
				try {
					const body = await request.json();
					const username = String(body.username || "");
					const targetUserId = String(body.userId || "");
					if (session.role !== "admin" && targetUserId !== session.userId) return jsonResponse({
						success: false,
						error: "Cannot claim username for another account"
					}, 403);
					const result = await serverStorage.claimUsername(targetUserId || session.userId, username);
					if (!result.success) return jsonResponse(result, 409);
					return jsonResponse(result);
				} catch {
					return jsonResponse({
						success: false,
						error: "Failed to claim username"
					}, 400);
				}
			}
			if (url.pathname === "/api/view" && method === "POST") try {
				const body = await request.json();
				const username = String(body.username || "");
				return jsonResponse(await serverStorage.recordView(username, clientIp));
			} catch {
				return jsonResponse({ error: "Failed to record view" }, 400);
			}
			if (url.pathname === "/api/click" && method === "POST") try {
				const body = await request.json();
				const linkId = String(body.linkId || "");
				return jsonResponse(await serverStorage.recordClick(linkId, clientIp));
			} catch {
				return jsonResponse({ error: "Failed to record click" }, 400);
			}
			if (url.pathname.startsWith("/api/profile/")) {
				const username = decodeURIComponent(url.pathname.slice(13));
				const res = await serverStorage.getProfile(username);
				if (!res) return jsonResponse({ error: "Profile not found" }, 404);
				return jsonResponse(res, 200, {
					"Cache-Control": "no-cache, no-store, must-revalidate",
					Pragma: "no-cache",
					Expires: "0"
				});
			}
			if (url.pathname === "/api/stats") return jsonResponse(await serverStorage.getStats());
		}
		return await normalizeCatastrophicSsrResponse(await (await getServerEntry()).fetch(request, env, ctx));
	} catch (error) {
		console.error(error);
		return new Response(renderErrorPage(), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
} };
//#endregion
export { server_default as default, getSessionFromRequest, renderErrorPage as n, ssr_exports as r, firebase_applet_config_default as t };
