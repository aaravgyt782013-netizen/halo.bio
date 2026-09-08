//#region node_modules/.nitro/vite/services/ssr/assets/bio-BYbB952i.js
var USERNAME_RE = /^[a-z0-9_.]{3,20}$/;
function normalizeUsername(value) {
	return value.toLowerCase().replace(/[^a-z0-9_.]/g, "").slice(0, 20);
}
/**
* Validates and ensures URLs use safe protocols (http/https).
* Blocks dangerous schemes like javascript:, data:, vbscript:, file: to prevent XSS.
*/
function ensureProtocol(url) {
	if (!url) return "";
	const trimmed = url.trim();
	if (/^(javascript|data|vbscript|file):/i.test(trimmed)) return "";
	if (/^https?:\/\//i.test(trimmed)) return trimmed;
	if (trimmed.startsWith("//")) return `https:${trimmed}`;
	return `https://${trimmed}`;
}
var CSRF_HEADER = { "X-Requested-With": "halo-app" };
var memoryStore = {
	profiles: [],
	links: [],
	session: null
};
var authListeners = /* @__PURE__ */ new Set();
function emitAuth(event, session) {
	memoryStore.session = session;
	authListeners.forEach((cb) => {
		try {
			cb(event, session);
		} catch (e) {
			console.error("Auth listener error:", e);
		}
	});
	if (typeof window !== "undefined") window.dispatchEvent(new Event("halo-store-updated"));
}
/**
* Initializes session and store from server APIs.
*/
async function initClientSession() {
	if (typeof window === "undefined" || typeof fetch === "undefined") return null;
	try {
		const res = await fetch("/api/auth/me", {
			headers: CSRF_HEADER,
			credentials: "include"
		});
		if (res.ok) {
			const data = await res.json();
			if (data && data.user && data.session) {
				const session = {
					access_token: "server-cookie-session",
					user: {
						id: data.user.id,
						email: data.user.email,
						role: data.user.role,
						user_metadata: { full_name: data.user.full_name }
					}
				};
				memoryStore.session = session;
				await refreshUserData();
				return session;
			}
		}
	} catch (err) {
		console.warn("Could not fetch server session:", err);
	}
	memoryStore.session = null;
	return null;
}
/**
* Refreshes caller's store from `/api/store`.
*/
async function refreshUserData() {
	if (typeof window === "undefined" || typeof fetch === "undefined") return;
	try {
		const res = await fetch("/api/store", {
			headers: CSRF_HEADER,
			credentials: "include"
		});
		if (res.ok) {
			const data = await res.json();
			if (data) {
				const allProfiles = [];
				if (data.myProfile) allProfiles.push(data.myProfile);
				if (Array.isArray(data.publicProfiles)) {
					for (const pub of data.publicProfiles) if (!allProfiles.some((p) => p.id === pub.id)) allProfiles.push(pub);
				}
				memoryStore.profiles = allProfiles;
				memoryStore.links = Array.isArray(data.myLinks) ? data.myLinks : [];
				if (typeof window !== "undefined") window.dispatchEvent(new Event("halo-store-updated"));
			}
		}
	} catch {}
}
if (typeof window !== "undefined") initClientSession().then((session) => {
	emitAuth("INITIAL_SESSION", session);
});
function getStore() {
	return memoryStore;
}
var ManualQueryBuilder = class {
	tableName;
	filters = [];
	orderConfig = null;
	limitCount = null;
	isSingle = false;
	isMaybeSingle = false;
	operation = "select";
	payload = null;
	constructor(tableName) {
		this.tableName = tableName;
	}
	select(_columns) {
		if (this.operation !== "insert" && this.operation !== "update") this.operation = "select";
		return this;
	}
	eq(column, value) {
		this.filters.push({
			column,
			operator: "eq",
			value
		});
		return this;
	}
	ilike(column, value) {
		this.filters.push({
			column,
			operator: "ilike",
			value
		});
		return this;
	}
	order(column, config = {}) {
		this.orderConfig = {
			column,
			ascending: config.ascending ?? true
		};
		return this;
	}
	limit(count) {
		this.limitCount = count;
		return this;
	}
	single() {
		this.isSingle = true;
		return this;
	}
	maybeSingle() {
		this.isMaybeSingle = true;
		return this;
	}
	update(changes) {
		this.operation = "update";
		this.payload = changes;
		return this;
	}
	insert(values) {
		this.operation = "insert";
		this.payload = values;
		return this;
	}
	delete() {
		this.operation = "delete";
		return this;
	}
	async execute() {
		try {
			const { collection, doc, getDocs, getDoc, query, where, orderBy, limit, setDoc, updateDoc, deleteDoc } = await import("../_libs/firebase.mjs").then((n) => n.n);
			const { db } = await import("./firebase-CxYrSYSJ.mjs").then((n) => n.r).then((n) => n.r);
			let collectionRef = collection(db, this.tableName);
			if (this.operation === "select") {
				let q = query(collectionRef);
				for (const filter of this.filters) if (filter.operator === "eq") {
					if (filter.column === "id") {
						const dSnap = await getDoc(doc(db, this.tableName, filter.value));
						if (dSnap.exists()) {
							const data = dSnap.data();
							return {
								data: this.isSingle || this.isMaybeSingle ? data : [data],
								error: null
							};
						} else return {
							data: this.isSingle || this.isMaybeSingle ? null : [],
							error: null
						};
					}
					q = query(q, where(filter.column, "==", filter.value));
				} else if (filter.operator === "ilike") q = query(q, where(filter.column, "==", filter.value));
				if (this.orderConfig) q = query(q, orderBy(this.orderConfig.column, this.orderConfig.ascending ? "asc" : "desc"));
				if (this.limitCount) q = query(q, limit(this.limitCount));
				const results = (await getDocs(q)).docs.map((d) => d.data());
				if (this.isSingle || this.isMaybeSingle) return {
					data: results.length > 0 ? results[0] : null,
					error: null
				};
				return {
					data: results,
					error: null
				};
			}
			if (this.operation === "insert") {
				const id = this.payload.id || crypto.randomUUID();
				const data = {
					...this.payload,
					id
				};
				await setDoc(doc(db, this.tableName, id), data);
				return {
					data,
					error: null
				};
			}
			if (this.operation === "update") {
				const idFilter = this.filters.find((f) => f.column === "id");
				if (!idFilter) throw new Error("Update without ID filter is not supported yet.");
				await updateDoc(doc(db, this.tableName, idFilter.value), this.payload);
				return {
					data: null,
					error: null
				};
			}
			if (this.operation === "delete") {
				const idFilter = this.filters.find((f) => f.column === "id");
				if (!idFilter) throw new Error("Delete without ID filter is not supported yet.");
				await deleteDoc(doc(db, this.tableName, idFilter.value));
				return {
					data: null,
					error: null
				};
			}
			return {
				data: null,
				error: /* @__PURE__ */ new Error("Unsupported operation")
			};
		} catch (err) {
			return {
				data: null,
				error: err
			};
		}
	}
};
var db = {
	from(tableName) {
		return new ManualQueryBuilder(tableName);
	},
	async rpc(fnName, args = {}) {
		const store = getStore();
		if (fnName === "username_available") {
			const username = String(args["_username"] || "").toLowerCase().trim();
			const userId = args["_user_id"] ? String(args["_user_id"]) : void 0;
			if (!username || username.length < 3 || username.length > 20) return {
				data: false,
				error: null
			};
			if (typeof fetch !== "undefined") try {
				const q = new URLSearchParams({ username });
				if (userId) q.set("userId", userId);
				const res = await fetch(`/api/username-available?${q.toString()}`);
				if (res.ok) {
					const json = await res.json();
					if (typeof json.available === "boolean") return {
						data: json.available,
						error: null
					};
				}
			} catch {}
			return {
				data: !store.profiles.some((p) => p.username && p.username.toLowerCase() === username && p.id !== userId),
				error: null
			};
		}
		if (fnName === "claim_username") {
			const username = String(args["_username"] || "").toLowerCase().trim();
			const userId = String(args["_user_id"] || "");
			if (!userId || !username) return {
				data: null,
				error: /* @__PURE__ */ new Error("User ID and username are required")
			};
			if (typeof fetch !== "undefined") try {
				const res = await fetch("/api/claim", {
					method: "POST",
					headers: {
						"content-type": "application/json",
						...CSRF_HEADER
					},
					credentials: "include",
					body: JSON.stringify({
						userId,
						username
					})
				});
				const json = await res.json();
				if (!res.ok || !json.success) return {
					data: null,
					error: new Error(json.error || `The username "${username}" is already reserved by another user.`)
				};
			} catch (err) {
				return {
					data: null,
					error: err instanceof Error ? err : /* @__PURE__ */ new Error("Network error")
				};
			}
			store.profiles = store.profiles.map((p) => p.id === userId ? {
				...p,
				username,
				display_name: p.display_name || username,
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			} : p);
			return {
				data: {
					success: true,
					username
				},
				error: null
			};
		}
		if (fnName === "increment_profile_view") {
			const username = String(args["_username"] || "").toLowerCase().trim();
			if (!username) return {
				data: null,
				error: null
			};
			if (typeof fetch !== "undefined") try {
				const json = await (await fetch("/api/view", {
					method: "POST",
					headers: {
						"content-type": "application/json",
						...CSRF_HEADER
					},
					body: JSON.stringify({ username })
				})).json();
				if (json && typeof json.views === "number") {
					store.profiles = store.profiles.map((p) => p.username?.toLowerCase() === username ? {
						...p,
						views: json.views
					} : p);
					return {
						data: json,
						error: null
					};
				}
			} catch {}
			return {
				data: null,
				error: null
			};
		}
		if (fnName === "increment_link_click") {
			const linkId = String(args["_link_id"] || "");
			if (typeof fetch !== "undefined") fetch("/api/click", {
				method: "POST",
				headers: {
					"content-type": "application/json",
					...CSRF_HEADER
				},
				body: JSON.stringify({ linkId })
			}).catch(() => {});
			return {
				data: null,
				error: null
			};
		}
		if (fnName === "platform_stats") {
			if (typeof fetch !== "undefined") try {
				const res = await fetch("/api/stats");
				if (res.ok) return {
					data: [await res.json()],
					error: null
				};
			} catch {}
			return {
				data: [{
					total_profiles: store.profiles.length,
					active_profiles: store.profiles.filter((p) => p.username && !p.is_banned).length,
					total_views: store.profiles.reduce((a, b) => a + (b.views || 0), 0),
					total_clicks: store.links.reduce((a, b) => a + (b.clicks || 0), 0),
					total_links: store.links.length
				}],
				error: null
			};
		}
		return {
			data: null,
			error: null
		};
	}
};
/**
* Uploads media files into data URLs with image compression
* and file size protections to prevent quota limits.
*/
/**
* Progressively optimizes and downscales an image File or base64 Data URL using HTML5 Canvas.
* Guarantees output is compact (backgrounds ~150-250KB, avatars ~25-40KB) to prevent
* payload limits (HTTP 413) and ensure instant loading on mobile.
*/
async function optimizeImageDataUrl(input, folder = "background") {
	if (typeof window === "undefined") {
		if (typeof input === "string") return input;
		return readDirect(input);
	}
	let objectUrl = "";
	let isObjectUrl = false;
	if (typeof input === "string") {
		if (!input.startsWith("data:image/")) return input;
		const threshold = folder === "avatar" ? 51200 : 204800;
		if (input.length < threshold) return input;
		objectUrl = input;
	} else {
		if (!input.type.startsWith("image/")) return readDirect(input);
		if (input.type === "image/svg+xml" || input.type === "image/gif") return readDirect(input);
		objectUrl = URL.createObjectURL(input);
		isObjectUrl = true;
	}
	try {
		return await new Promise((resolve, reject) => {
			const img = new Image();
			img.crossOrigin = "anonymous";
			img.onload = () => {
				if (isObjectUrl) try {
					URL.revokeObjectURL(objectUrl);
				} catch {}
				const isAvatar = folder === "avatar";
				const maxDim = isAvatar ? 320 : 1080;
				let width = img.naturalWidth || img.width;
				let height = img.naturalHeight || img.height;
				if (!width || !height) {
					resolve(typeof input === "string" ? input : "");
					return;
				}
				if (width > maxDim || height > maxDim) {
					if (width > height) {
						height = Math.round(height * maxDim / width);
						width = maxDim;
					} else {
						width = Math.round(width * maxDim / height);
						height = maxDim;
					}
				}
				const canvas = document.createElement("canvas");
				canvas.width = Math.max(width, 1);
				canvas.height = Math.max(height, 1);
				const ctx = canvas.getContext("2d");
				if (!ctx) {
					resolve(typeof input === "string" ? input : "");
					return;
				}
				ctx.imageSmoothingEnabled = true;
				ctx.imageSmoothingQuality = "high";
				ctx.drawImage(img, 0, 0, width, height);
				const initialQuality = isAvatar ? .82 : .78;
				let result = canvas.toDataURL("image/jpeg", initialQuality);
				const maxChars = isAvatar ? 76800 : 368640;
				if (result.length > maxChars) result = canvas.toDataURL("image/jpeg", isAvatar ? .7 : .68);
				if (result.length > maxChars && !isAvatar) {
					const scaleCanvas = document.createElement("canvas");
					const scaleW = Math.round(width * .75);
					const scaleH = Math.round(height * .75);
					scaleCanvas.width = Math.max(scaleW, 1);
					scaleCanvas.height = Math.max(scaleH, 1);
					const scaleCtx = scaleCanvas.getContext("2d");
					if (scaleCtx) {
						scaleCtx.imageSmoothingEnabled = true;
						scaleCtx.imageSmoothingQuality = "medium";
						scaleCtx.drawImage(canvas, 0, 0, scaleW, scaleH);
						result = scaleCanvas.toDataURL("image/jpeg", .65);
					}
				}
				resolve(result);
			};
			img.onerror = () => {
				if (isObjectUrl) try {
					URL.revokeObjectURL(objectUrl);
				} catch {}
				if (typeof input === "string") resolve(input);
				else readDirect(input).then(resolve).catch(reject);
			};
			img.src = objectUrl;
		});
	} catch {
		return typeof input === "string" ? input : readDirect(input);
	}
}
/**
* Uploads media with automatic downscaling and compression
* to keep sync payloads within network and database boundaries.
*/
async function uploadMedia(userId, file, folder, onProgress) {
	if (file.type.startsWith("video/")) {
		if (file.size > 1048576) throw new Error("Uploaded video clip exceeds 1MB. Please select a video file under 1MB.");
	}
	if (file.type.startsWith("audio/")) {
		if (file.size > 15728640) throw new Error("Audio file exceeds 15MB. For full songs, please paste a direct audio URL.");
	}
	try {
		const { ref, uploadBytesResumable, getDownloadURL } = await import("../_libs/firebase.mjs").then((n) => n.t);
		const { storage } = await import("./firebase-CxYrSYSJ.mjs").then((n) => n.r).then((n) => n.r);
		const fileExt = file.name.split(".").pop();
		const uploadTask = uploadBytesResumable(ref(storage, `${folder}/${userId}/${`${crypto.randomUUID()}.${fileExt}`}`), file);
		return new Promise((resolve, reject) => {
			uploadTask.on("state_changed", (snapshot) => {
				const progress = snapshot.bytesTransferred / snapshot.totalBytes * 100;
				if (onProgress) onProgress(progress);
			}, (error) => {
				reject(/* @__PURE__ */ new Error("Failed to upload media to Firebase Storage"));
			}, async () => {
				resolve(await getDownloadURL(uploadTask.snapshot.ref));
			});
		});
	} catch (err) {
		throw new Error(err.message || "Failed to upload media");
	}
}
function readDirect(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			resolve(reader.result);
		};
		reader.onerror = () => {
			reject(/* @__PURE__ */ new Error("Failed to read file"));
		};
		reader.readAsDataURL(file);
	});
}
async function fetchProfileByUsername(username) {
	try {
		const cleanUser = username.toLowerCase().trim();
		if (typeof window === "undefined" && typeof globalThis !== "undefined") {
			const globalStore = globalThis.__HALO_SERVER_STORE__;
			if (globalStore && typeof globalStore.getProfile === "function") {
				const found = await globalStore.getProfile(cleanUser);
				if (found) return found;
			}
		}
		if (typeof window !== "undefined" && typeof fetch !== "undefined") try {
			const res = await fetch(`/api/profile/${encodeURIComponent(cleanUser)}?t=${Date.now()}`, { cache: "no-store" });
			if (res.ok) {
				const data = await res.json();
				if (data && data.profile) {
					const pIdx = memoryStore.profiles.findIndex((p) => p.id === data.profile.id);
					if (pIdx >= 0) memoryStore.profiles[pIdx] = data.profile;
					else memoryStore.profiles.push(data.profile);
					if (data.links && Array.isArray(data.links)) memoryStore.links = memoryStore.links.filter((l) => l.user_id !== data.profile.id).concat(data.links);
					return {
						profile: data.profile,
						links: data.links || []
					};
				}
			}
		} catch {}
		const profile = memoryStore.profiles.find((p) => p.username && p.username.toLowerCase() === cleanUser);
		if (!profile) return null;
		return {
			profile,
			links: memoryStore.links.filter((l) => l.user_id === profile.id).sort((a, b) => a.position - b.position)
		};
	} catch (e) {
		console.warn("fetchProfileByUsername failed:", e);
		return null;
	}
}
//#endregion
export { normalizeUsername as a, fetchProfileByUsername as i, db as n, optimizeImageDataUrl as o, ensureProtocol as r, uploadMedia as s, USERNAME_RE as t };
