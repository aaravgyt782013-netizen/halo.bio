//#region node_modules/.nitro/vite/services/ssr/assets/bio-NPPVUTaD.js
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
/**
* Synchronizes caller's profile and links changes to the server.
* NOTE: NEVER sends users, passwords, or emails.
*/
async function syncToServer(currentUserId) {
	if (typeof window === "undefined" || typeof fetch === "undefined") return { success: true };
	const store = getStore();
	const uid = currentUserId || store.session?.user?.id;
	if (!uid) return {
		success: false,
		error: "Authentication required"
	};
	const myProfiles = store.profiles.filter((p) => p.id === uid);
	const myLinks = store.links.filter((l) => l.user_id === uid);
	for (const p of myProfiles) {
		if (p.background_value?.startsWith("data:image/") && p.background_value.length > 256e3) try {
			p.background_value = await optimizeImageDataUrl(p.background_value, "background");
		} catch {}
		if (p.avatar_url?.startsWith("data:image/") && p.avatar_url.length > 61440) try {
			p.avatar_url = await optimizeImageDataUrl(p.avatar_url, "avatar");
		} catch {}
	}
	try {
		const res = await fetch("/api/sync", {
			method: "POST",
			headers: {
				"content-type": "application/json",
				...CSRF_HEADER
			},
			credentials: "include",
			body: JSON.stringify({
				profiles: myProfiles,
				links: myLinks
			})
		});
		if (!res.ok) {
			let errMsg = (await res.json().catch(() => ({}))).error;
			if (!errMsg) {
				if (res.status === 413) errMsg = "Payload too large (413). Halo is optimizing your images, please try saving again.";
				else errMsg = `Sync error (status ${res.status})`;
			}
			return {
				success: false,
				error: errMsg
			};
		}
		window.dispatchEvent(new Event("halo-store-updated"));
		try {
			localStorage.setItem("halo_sync_tick", String(Date.now()));
		} catch {}
		return { success: true };
	} catch (e) {
		return {
			success: false,
			error: e instanceof Error ? e.message : "Network error syncing data"
		};
	}
}
var auth = {
	async getSession() {
		if (memoryStore.session) return {
			data: { session: memoryStore.session },
			error: null
		};
		return {
			data: { session: await initClientSession() },
			error: null
		};
	},
	onAuthStateChange(callback) {
		authListeners.add(callback);
		callback("INITIAL_SESSION", memoryStore.session);
		return { data: { subscription: { unsubscribe: () => {
			authListeners.delete(callback);
		} } } };
	},
	async signUp({ email, password, options }) {
		try {
			const res = await fetch("/api/auth/signup", {
				method: "POST",
				headers: {
					"content-type": "application/json",
					...CSRF_HEADER
				},
				credentials: "include",
				body: JSON.stringify({
					email,
					password,
					full_name: options?.data?.full_name
				})
			});
			const json = await res.json();
			if (!res.ok || !json.success) return {
				data: {
					user: null,
					session: null
				},
				error: new Error(json.error || "Failed to sign up")
			};
			const authUser = {
				id: json.user.id,
				email: json.user.email,
				role: json.user.role,
				user_metadata: { full_name: json.user.full_name }
			};
			const session = {
				access_token: "server-cookie-session",
				user: authUser
			};
			memoryStore.session = session;
			await refreshUserData();
			emitAuth("SIGNED_IN", session);
			return {
				data: {
					user: authUser,
					session
				},
				error: null
			};
		} catch (err) {
			return {
				data: {
					user: null,
					session: null
				},
				error: err instanceof Error ? err : /* @__PURE__ */ new Error("Network error during sign up")
			};
		}
	},
	async signInWithGoogle() {
		try {
			const { signInWithPopup, GoogleAuthProvider } = await import("../_libs/firebase.mjs").then((n) => n.n);
			const { firebaseAuth } = await import("./firebase-BL2RbOCC.mjs");
			const idToken = await (await signInWithPopup(firebaseAuth, new GoogleAuthProvider())).user.getIdToken();
			const res = await fetch("/api/auth/google", {
				method: "POST",
				headers: {
					"content-type": "application/json",
					...CSRF_HEADER
				},
				credentials: "include",
				body: JSON.stringify({ idToken })
			});
			const json = await res.json();
			if (!res.ok || !json.success) return {
				data: {
					user: null,
					session: null
				},
				error: new Error(json.error || "Failed to log in with Google")
			};
			const authUser = {
				id: json.user.id,
				email: json.user.email,
				role: json.user.role,
				user_metadata: { full_name: json.user.full_name }
			};
			const session = {
				access_token: "server-cookie-session",
				user: authUser
			};
			memoryStore.session = session;
			authListeners.forEach((cb) => cb("SIGNED_IN", session));
			return {
				data: {
					user: authUser,
					session
				},
				error: null
			};
		} catch (err) {
			const message = err instanceof Error ? err.message : err?.message || "Failed to authenticate with Google";
			return {
				data: {
					user: null,
					session: null
				},
				error: new Error(message)
			};
		}
	},
	async signInWithPassword({ email, password }) {
		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: {
					"content-type": "application/json",
					...CSRF_HEADER
				},
				credentials: "include",
				body: JSON.stringify({
					email,
					password
				})
			});
			const json = await res.json();
			if (!res.ok || !json.success) return {
				data: {
					user: null,
					session: null
				},
				error: new Error(json.error || "Failed to log in")
			};
			const authUser = {
				id: json.user.id,
				email: json.user.email,
				role: json.user.role,
				user_metadata: { full_name: json.user.full_name }
			};
			const session = {
				access_token: "server-cookie-session",
				user: authUser
			};
			memoryStore.session = session;
			await refreshUserData();
			emitAuth("SIGNED_IN", session);
			return {
				data: {
					user: authUser,
					session
				},
				error: null
			};
		} catch (err) {
			return {
				data: {
					user: null,
					session: null
				},
				error: err instanceof Error ? err : /* @__PURE__ */ new Error("Network error during sign in")
			};
		}
	},
	async signOut() {
		try {
			await fetch("/api/auth/logout", {
				method: "POST",
				headers: CSRF_HEADER,
				credentials: "include"
			});
		} catch {}
		memoryStore.session = null;
		memoryStore.profiles = [];
		memoryStore.links = [];
		emitAuth("SIGNED_OUT", null);
		return { error: null };
	},
	async changePassword(currentPassword, newPassword) {
		try {
			const res = await fetch("/api/change-password", {
				method: "POST",
				headers: {
					"content-type": "application/json",
					...CSRF_HEADER
				},
				credentials: "include",
				body: JSON.stringify({
					currentPassword,
					newPassword
				})
			});
			const json = await res.json();
			if (!res.ok) return { error: new Error(json.error || "Failed to update password") };
			return { error: null };
		} catch (err) {
			return { error: err instanceof Error ? err : /* @__PURE__ */ new Error("Failed to change password") };
		}
	}
};
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
	applyFilters(items) {
		return items.filter((item) => {
			return this.filters.every((f) => {
				const val = item[f.column];
				if (f.operator === "eq") return val === f.value;
				if (f.operator === "ilike") {
					if (typeof val === "string" && typeof f.value === "string") return val.toLowerCase() === f.value.toLowerCase();
					return val === f.value;
				}
				return true;
			});
		});
	}
	async execute() {
		const store = getStore();
		const currentUser = store.session?.user;
		if (this.tableName === "user_roles") {
			let list = [];
			if (currentUser) list = [{
				id: "role-" + currentUser.id,
				user_id: currentUser.id,
				role: currentUser.role || "user"
			}];
			list = this.applyFilters(list);
			return {
				data: this.isSingle || this.isMaybeSingle ? list[0] ?? null : list,
				error: null
			};
		}
		if (this.tableName === "profiles") {
			if (this.operation === "select") {
				if (currentUser?.role === "admin" && this.filters.length === 0 && typeof window !== "undefined" && typeof fetch !== "undefined") try {
					const adminRes = await fetch("/api/admin/profiles", {
						headers: CSRF_HEADER,
						credentials: "include"
					});
					if (adminRes.ok) {
						const adminJson = await adminRes.json();
						if (adminJson && Array.isArray(adminJson.profiles)) {
							let list = [...adminJson.profiles];
							if (this.orderConfig) {
								const { column, ascending } = this.orderConfig;
								list.sort((a, b) => {
									const av = a[column];
									const bv = b[column];
									if (av == null) return 1;
									if (bv == null) return -1;
									if (av < bv) return ascending ? -1 : 1;
									if (av > bv) return ascending ? 1 : -1;
									return 0;
								});
							}
							if (this.limitCount != null) list = list.slice(0, this.limitCount);
							return {
								data: list,
								error: null
							};
						}
					}
				} catch {}
				let list = [...store.profiles];
				list = this.applyFilters(list);
				if (this.orderConfig) {
					const { column, ascending } = this.orderConfig;
					list.sort((a, b) => {
						const av = a[column];
						const bv = b[column];
						if (av == null) return 1;
						if (bv == null) return -1;
						if (av < bv) return ascending ? -1 : 1;
						if (av > bv) return ascending ? 1 : -1;
						return 0;
					});
				}
				if (this.limitCount != null) list = list.slice(0, this.limitCount);
				return {
					data: this.isSingle || this.isMaybeSingle ? list[0] ?? null : list,
					error: null
				};
			}
			if (this.operation === "update") {
				const idFilter = this.filters.find((f) => f.column === "id" && f.operator === "eq");
				const targetId = idFilter ? String(idFilter.value) : void 0;
				if (targetId && currentUser?.role === "admin" && targetId !== currentUser.id) try {
					const res = await fetch("/api/admin/profile-mutate", {
						method: "POST",
						headers: {
							"content-type": "application/json",
							...CSRF_HEADER
						},
						credentials: "include",
						body: JSON.stringify({
							targetUserId: targetId,
							changes: this.payload
						})
					});
					const json = await res.json();
					if (!res.ok) return {
						data: null,
						error: new Error(json.error || "Failed to update profile")
					};
				} catch (err) {
					return {
						data: null,
						error: err instanceof Error ? err : /* @__PURE__ */ new Error("Network error")
					};
				}
				let updatedCount = 0;
				store.profiles = store.profiles.map((p) => {
					if (this.filters.every((f) => {
						if (f.operator === "eq") return p[f.column] === f.value;
						if (f.operator === "ilike") {
							const pv = p[f.column];
							return String(pv).toLowerCase() === String(f.value).toLowerCase();
						}
						return true;
					})) {
						updatedCount++;
						return {
							...p,
							...this.payload,
							updated_at: (/* @__PURE__ */ new Date()).toISOString()
						};
					}
					return p;
				});
				if (updatedCount === 0 && (targetId || currentUser?.id)) {
					const effectiveId = targetId || currentUser?.id;
					if (effectiveId) {
						const existingIdx = store.profiles.findIndex((p) => p.id === effectiveId);
						if (existingIdx >= 0) {
							store.profiles[existingIdx] = {
								...store.profiles[existingIdx],
								...this.payload,
								updated_at: (/* @__PURE__ */ new Date()).toISOString()
							};
							updatedCount = 1;
						} else {
							store.profiles.push({
								id: effectiveId,
								username: null,
								display_name: null,
								bio: null,
								avatar_url: null,
								background_type: "color",
								background_value: "#0b0f19",
								card_opacity: .65,
								card_radius: 24,
								card_blur: 20,
								glass_intensity: "medium",
								social_links: [],
								accent_color: "#3b82f6",
								music_url: null,
								music_enabled: false,
								enter_text: "Click to Enter",
								is_premium: false,
								is_banned: false,
								is_flagged: false,
								views: 0,
								created_at: (/* @__PURE__ */ new Date()).toISOString(),
								...this.payload,
								updated_at: (/* @__PURE__ */ new Date()).toISOString()
							});
							updatedCount = 1;
						}
					}
				}
				const syncRes = await syncToServer(currentUser?.id);
				if (!syncRes.success) return {
					data: null,
					error: new Error(syncRes.error)
				};
				return {
					data: { count: updatedCount },
					error: null
				};
			}
			if (this.operation === "delete") {
				const idFilter = this.filters.find((f) => f.column === "id" && f.operator === "eq");
				const targetId = idFilter ? String(idFilter.value) : void 0;
				if (targetId && currentUser?.role === "admin") try {
					const res = await fetch("/api/admin/delete-profile", {
						method: "POST",
						headers: {
							"content-type": "application/json",
							...CSRF_HEADER
						},
						credentials: "include",
						body: JSON.stringify({ targetUserId: targetId })
					});
					const json = await res.json();
					if (!res.ok) return {
						data: null,
						error: new Error(json.error || "Failed to delete profile")
					};
				} catch (err) {
					return {
						data: null,
						error: err instanceof Error ? err : /* @__PURE__ */ new Error("Network error")
					};
				}
				store.profiles = store.profiles.filter((p) => {
					return !this.filters.every((f) => {
						if (f.operator === "eq") return p[f.column] === f.value;
						return true;
					});
				});
				const syncRes = await syncToServer(currentUser?.id);
				if (!syncRes.success) return {
					data: null,
					error: new Error(syncRes.error)
				};
				return {
					data: null,
					error: null
				};
			}
		}
		if (this.tableName === "links") {
			if (this.operation === "select") {
				let list = [...store.links];
				list = this.applyFilters(list);
				if (this.orderConfig) {
					const { column, ascending } = this.orderConfig;
					list.sort((a, b) => {
						const av = a[column];
						const bv = b[column];
						if (av == null) return 1;
						if (bv == null) return -1;
						if (av < bv) return ascending ? -1 : 1;
						if (av > bv) return ascending ? 1 : -1;
						return 0;
					});
				}
				return {
					data: this.isSingle || this.isMaybeSingle ? list[0] ?? null : list,
					error: null
				};
			}
			if (this.operation === "insert") {
				const newLink = {
					id: "lnk-" + Math.random().toString(36).substring(2, 10),
					user_id: this.payload.user_id || currentUser?.id,
					title: this.payload.title || "New Link",
					url: this.payload.url || "https://",
					position: this.payload.position ?? store.links.length,
					clicks: 0,
					created_at: (/* @__PURE__ */ new Date()).toISOString(),
					...this.payload
				};
				store.links.push(newLink);
				const syncRes = await syncToServer(currentUser?.id);
				if (!syncRes.success) return {
					data: null,
					error: new Error(syncRes.error)
				};
				return {
					data: newLink,
					error: null
				};
			}
			if (this.operation === "update") {
				let updatedCount = 0;
				store.links = store.links.map((link) => {
					if (this.filters.every((f) => {
						if (f.operator === "eq") return link[f.column] === f.value;
						return true;
					})) {
						updatedCount++;
						return {
							...link,
							...this.payload
						};
					}
					return link;
				});
				const syncRes = await syncToServer(currentUser?.id);
				if (!syncRes.success) return {
					data: null,
					error: new Error(syncRes.error)
				};
				return {
					data: { count: updatedCount },
					error: null
				};
			}
			if (this.operation === "delete") {
				store.links = store.links.filter((link) => {
					return !this.filters.every((f) => {
						if (f.operator === "eq") return link[f.column] === f.value;
						return true;
					});
				});
				const syncRes = await syncToServer(currentUser?.id);
				if (!syncRes.success) return {
					data: null,
					error: new Error(syncRes.error)
				};
				return {
					data: null,
					error: null
				};
			}
		}
		return {
			data: null,
			error: null
		};
	}
	then(onfulfilled, onrejected) {
		return this.execute().then(onfulfilled, onrejected);
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
		if (input.type === "image/svg+xml") return readDirect(input);
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
async function uploadMedia(userId, file, folder) {
	if (file.type.startsWith("video/")) {
		if (file.size > 104857600) throw new Error("Uploaded video clip exceeds 100MB. Please select a video file under 100MB.");
	}
	if (file.type.startsWith("audio/")) {
		if (file.size > 15728640) throw new Error("Audio file exceeds 15MB. For full songs, please paste a direct audio URL.");
	}
	try {
		const { storage } = await import("./firebase-BL2RbOCC.mjs");
		if (!storage) throw new Error("Firebase storage not initialized");
		const { ref, uploadBytesResumable, getDownloadURL } = await import("../_libs/firebase.mjs").then((n) => n.t);
		const ext = file.name.split(".").pop()?.toLowerCase() || (file.type.startsWith("video/") ? "mp4" : "bin");
		const uploadTask = uploadBytesResumable(ref(storage, `${userId}/${folder}/${`${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`}`), file);
		return new Promise((resolve, reject) => {
			uploadTask.on("state_changed", () => {}, (error) => {
				reject(/* @__PURE__ */ new Error(`Failed to upload to storage: ${error.message}`));
			}, async () => {
				try {
					resolve(await getDownloadURL(uploadTask.snapshot.ref));
				} catch (err) {
					reject(/* @__PURE__ */ new Error("Failed to retrieve download URL after upload"));
				}
			});
		});
	} catch (err) {
		if (file.type.startsWith("video/") || file.type.startsWith("audio/")) throw err instanceof Error ? err : /* @__PURE__ */ new Error("Failed to upload media");
		console.warn("Direct storage upload failed, falling back to base64:", err);
	}
	if (file.type.startsWith("image/") && typeof window !== "undefined") return optimizeImageDataUrl(file, folder);
	return readDirect(file);
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
export { fetchProfileByUsername as a, uploadMedia as c, ensureProtocol as i, auth as n, normalizeUsername as o, db as r, optimizeImageDataUrl as s, USERNAME_RE as t };
