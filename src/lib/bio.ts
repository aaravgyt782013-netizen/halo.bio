export type GlassIntensity = "subtle" | "medium" | "heavy" | "ultra";

export type SocialPlatform =
  | "instagram"
  | "tiktok"
  | "youtube"
  | "twitter"
  | "spotify"
  | "discord"
  | "github"
  | "twitch"
  | "custom"
  | "linkedin"
  | "soundcloud"
  | "telegram"
  | "email"
  | "website";

export type SocialLink = {
  id: string;
  platform: SocialPlatform | string;
  url: string;
  title?: string;
  icon_url?: string;
  active?: boolean;
  remove_bg?: boolean; // When true, button background is transparent (no box/circle)
  fit_mode?: "cover" | "contain"; // "cover" fills whole button, "contain" scales inside
};

export type Profile = {
  id: string;
  username: string | null;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  background_type: "color" | "image" | "video";
  background_value: string;
  card_opacity: number;
  card_radius: number;
  card_blur: number;
  glass_intensity?: GlassIntensity;
  social_links?: SocialLink[];
  accent_color: string;
  music_url: string | null;
  music_enabled: boolean;
  enter_text: string;
  is_premium: boolean;
  is_banned: boolean;
  is_flagged: boolean;
  views: number;
  created_at: string;
  updated_at?: string;
};

export type BioLink = {
  id: string;
  user_id: string;
  title: string;
  url: string;
  position: number;
  clicks: number;
  created_at?: string;
};

export type UserRole = {
  id: string;
  user_id: string;
  role: "admin" | "user";
};

export type AuthUser = {
  id: string;
  email: string;
  role?: "admin" | "user";
  user_metadata?: {
    full_name?: string;
  };
  created_at?: string;
};

export type AuthSession = {
  access_token: string;
  user: AuthUser;
};

export type StoredUser = {
  id: string;
  email: string;
  password: string;
  full_name: string;
  role: "admin" | "user";
  created_at: string;
};

export const USERNAME_RE = /^[a-z0-9_.]{3,20}$/;

export function normalizeUsername(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_.]/g, "")
    .slice(0, 20);
}

/**
 * Validates and ensures URLs use safe protocols (http/https).
 * Blocks dangerous schemes like javascript:, data:, vbscript:, file: to prevent XSS.
 */
export function ensureProtocol(url: string) {
  if (!url) return "";
  const trimmed = url.trim();
  if (/^(javascript|data|vbscript|file):/i.test(trimmed)) {
    return "";
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }
  return `https://${trimmed}`;
}

const CSRF_HEADER = { "X-Requested-With": "halo-app" };

type StoreData = {
  profiles: Profile[];
  links: BioLink[];
  session: AuthSession | null;
};

const memoryStore: StoreData = {
  profiles: [],
  links: [],
  session: null,
};

let isInitialStoreLoaded = false;

// Client auth listeners
type AuthCallback = (event: string, session: AuthSession | null) => void;
const authListeners = new Set<AuthCallback>();

function emitAuth(event: string, session: AuthSession | null) {
  memoryStore.session = session;
  authListeners.forEach((cb) => {
    try {
      cb(event, session);
    } catch (e) {
      console.error("Auth listener error:", e);
    }
  });
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("halo-store-updated"));
  }
}

/**
 * Initializes session and store from server APIs.
 */
export async function initClientSession(): Promise<AuthSession | null> {
  if (typeof window === "undefined" || typeof fetch === "undefined") {
    return null;
  }

  try {
    const res = await fetch("/api/auth/me", {
      headers: CSRF_HEADER,
      credentials: "include",
    });

    if (res.ok) {
      const data = (await res.json()) as {
        user: {
          id: string;
          email: string;
          full_name: string;
          role: "admin" | "user";
        } | null;
        session: { user_id: string; role: "admin" | "user" } | null;
      };

      if (data && data.user && data.session) {
        const session: AuthSession = {
          access_token: "server-cookie-session",
          user: {
            id: data.user.id,
            email: data.user.email,
            role: data.user.role,
            user_metadata: { full_name: data.user.full_name },
          },
        };
        memoryStore.session = session;

        // Fetch user store data from server
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
export async function refreshUserData(): Promise<void> {
  if (typeof window === "undefined" || typeof fetch === "undefined") return;

  try {
    const res = await fetch("/api/store", {
      headers: CSRF_HEADER,
      credentials: "include",
    });

    if (res.ok) {
      const data = (await res.json()) as {
        myProfile: Profile | null;
        myLinks: BioLink[];
        publicProfiles: Profile[];
      };

      if (data) {
        const allProfiles: Profile[] = [];
        if (data.myProfile) {
          allProfiles.push(data.myProfile);
        }
        if (Array.isArray(data.publicProfiles)) {
          for (const pub of data.publicProfiles) {
            if (!allProfiles.some((p) => p.id === pub.id)) {
              allProfiles.push(pub);
            }
          }
        }

        memoryStore.profiles = allProfiles;
        memoryStore.links = Array.isArray(data.myLinks) ? data.myLinks : [];
        isInitialStoreLoaded = true;

        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("halo-store-updated"));
        }
      }
    }
  } catch {
    // Ignore offline errors
  }
}

// Client auto-initialization
if (typeof window !== "undefined") {
  initClientSession().then((session) => {
    emitAuth("INITIAL_SESSION", session);
  });
}

function getStore(): StoreData {
  return memoryStore;
}

/**
 * Synchronizes caller's profile and links changes to the server.
 * NOTE: NEVER sends users, passwords, or emails.
 */
export async function syncToServer(
  currentUserId?: string,
): Promise<{ success: boolean; error?: string }> {
  if (typeof window === "undefined" || typeof fetch === "undefined") {
    return { success: true };
  }

  const store = getStore();
  const uid = currentUserId || store.session?.user?.id;
  if (!uid) return { success: false, error: "Authentication required" };

  // Filter to caller's own records to prevent tampering
  const myProfiles = store.profiles.filter((p) => p.id === uid);
  const myLinks = store.links.filter((l) => l.user_id === uid);

  // Auto-compress oversized data URLs in background or avatar before network dispatch
  for (const p of myProfiles) {
    if (
      p.background_value?.startsWith("data:image/") &&
      p.background_value.length > 250 * 1024
    ) {
      try {
        p.background_value = await optimizeImageDataUrl(
          p.background_value,
          "background",
        );
      } catch {
        // preserve original if optimization fails
      }
    }
    if (
      p.avatar_url?.startsWith("data:image/") &&
      p.avatar_url.length > 60 * 1024
    ) {
      try {
        p.avatar_url = await optimizeImageDataUrl(p.avatar_url, "avatar");
      } catch {
        // preserve original
      }
    }
  }

  try {
    const res = await fetch("/api/sync", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...CSRF_HEADER,
      },
      credentials: "include",
      body: JSON.stringify({
        profiles: myProfiles,
        links: myLinks,
      }),
    });

    if (!res.ok) {
      const errJson = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      let errMsg = errJson.error;
      if (!errMsg) {
        if (res.status === 413) {
          errMsg =
            "Payload too large (413). Halo is optimizing your images, please try saving again.";
        } else {
          errMsg = `Sync error (status ${res.status})`;
        }
      }
      return {
        success: false,
        error: errMsg,
      };
    }

    window.dispatchEvent(new Event("halo-store-updated"));
    try {
      localStorage.setItem("halo_sync_tick", String(Date.now()));
    } catch {
      // ignore
    }
    return { success: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Network error syncing data";
    return { success: false, error: msg };
  }
}

export const auth = {
  async getSession(): Promise<{
    data: { session: AuthSession | null };
    error: null;
  }> {
    if (memoryStore.session) {
      return { data: { session: memoryStore.session }, error: null };
    }
    const session = await initClientSession();
    return { data: { session }, error: null };
  },

  onAuthStateChange(callback: AuthCallback) {
    authListeners.add(callback);
    // Initial callback with current memory store session
    callback("INITIAL_SESSION", memoryStore.session);

    return {
      data: {
        subscription: {
          unsubscribe: () => {
            authListeners.delete(callback);
          },
        },
      },
    };
  },

  async signUp({
    email,
    password,
    options,
  }: {
    email: string;
    password: string;
    options?: { data?: { full_name?: string } };
  }): Promise<{
    data: { user: AuthUser | null; session: AuthSession | null };
    error: Error | null;
  }> {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...CSRF_HEADER,
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          full_name: options?.data?.full_name,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        return {
          data: { user: null, session: null },
          error: new Error(json.error || "Failed to sign up"),
        };
      }

      const authUser: AuthUser = {
        id: json.user.id,
        email: json.user.email,
        role: json.user.role,
        user_metadata: { full_name: json.user.full_name },
      };

      const session: AuthSession = {
        access_token: "server-cookie-session",
        user: authUser,
      };

      memoryStore.session = session;
      await refreshUserData();
      emitAuth("SIGNED_IN", session);

      return { data: { user: authUser, session }, error: null };
    } catch (err) {
      return {
        data: { user: null, session: null },
        error:
          err instanceof Error
            ? err
            : new Error("Network error during sign up"),
      };
    }
  },

  async signInWithGoogle(): Promise<{
    data: { user: AuthUser | null; session: AuthSession | null };
    error: Error | null;
  }> {
    try {
      const { signInWithPopup, GoogleAuthProvider } =
        await import("firebase/auth");
      const { firebaseAuth } = await import("./firebase");

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(firebaseAuth, provider);
      const idToken = await result.user.getIdToken();

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...CSRF_HEADER,
        },
        credentials: "include",
        body: JSON.stringify({ idToken }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        return {
          data: { user: null, session: null },
          error: new Error(json.error || "Failed to log in with Google"),
        };
      }

      const authUser: AuthUser = {
        id: json.user.id,
        email: json.user.email,
        role: json.user.role,
        user_metadata: { full_name: json.user.full_name },
      };

      const session: AuthSession = {
        access_token: "server-cookie-session",
        user: authUser,
      };

      memoryStore.session = session;
      authListeners.forEach((cb) => cb("SIGNED_IN", session));

      return {
        data: { user: authUser, session },
        error: null,
      };
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : (err as { message?: string })?.message ||
            "Failed to authenticate with Google";
      return {
        data: { user: null, session: null },
        error: new Error(message),
      };
    }
  },

  async signInWithPassword({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{
    data: { user: AuthUser | null; session: AuthSession | null };
    error: Error | null;
  }> {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...CSRF_HEADER,
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        return {
          data: { user: null, session: null },
          error: new Error(json.error || "Failed to log in"),
        };
      }

      const authUser: AuthUser = {
        id: json.user.id,
        email: json.user.email,
        role: json.user.role,
        user_metadata: { full_name: json.user.full_name },
      };

      const session: AuthSession = {
        access_token: "server-cookie-session",
        user: authUser,
      };

      memoryStore.session = session;
      await refreshUserData();
      emitAuth("SIGNED_IN", session);

      return { data: { user: authUser, session }, error: null };
    } catch (err) {
      return {
        data: { user: null, session: null },
        error:
          err instanceof Error
            ? err
            : new Error("Network error during sign in"),
      };
    }
  },

  async signOut(): Promise<{ error: null }> {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: CSRF_HEADER,
        credentials: "include",
      });
    } catch {
      // ignore
    }
    memoryStore.session = null;
    memoryStore.profiles = [];
    memoryStore.links = [];
    emitAuth("SIGNED_OUT", null);
    return { error: null };
  },

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<{ error: Error | null }> {
    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...CSRF_HEADER,
        },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const json = await res.json();
      if (!res.ok) {
        return { error: new Error(json.error || "Failed to update password") };
      }
      return { error: null };
    } catch (err) {
      return {
        error:
          err instanceof Error ? err : new Error("Failed to change password"),
      };
    }
  },
};

type QueryFilter = {
  column: string;
  operator: "eq" | "ilike";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
};

type OrderConfig = {
  column: string;
  ascending: boolean;
};

class ManualQueryBuilder<T extends Record<string, unknown>> {
  private tableName: "profiles" | "links" | "user_roles";
  private filters: QueryFilter[] = [];
  private orderConfig: OrderConfig | null = null;
  private limitCount: number | null = null;
  private isSingle = false;
  private isMaybeSingle = false;
  private operation: "select" | "update" | "delete" | "insert" = "select";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private payload: any = null;

  constructor(tableName: "profiles" | "links" | "user_roles") {
    this.tableName = tableName;
  }

  select(_columns?: string) {
    if (this.operation !== "insert" && this.operation !== "update") {
      this.operation = "select";
    }
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  eq(column: string, value: any) {
    this.filters.push({ column, operator: "eq", value });
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ilike(column: string, value: any) {
    this.filters.push({ column, operator: "ilike", value });
    return this;
  }

  order(column: string, config: { ascending?: boolean } = {}) {
    this.orderConfig = { column, ascending: config.ascending ?? true };
    return this;
  }

  limit(count: number) {
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

  update(changes: Partial<T>) {
    this.operation = "update";
    this.payload = changes;
    return this;
  }

  insert(values: Partial<T>) {
    this.operation = "insert";
    this.payload = values;
    return this;
  }

  delete() {
    this.operation = "delete";
    return this;
  }

  private applyFilters<R extends Record<string, unknown>>(items: R[]): R[] {
    return items.filter((item) => {
      return this.filters.every((f) => {
        const val = item[f.column];
        if (f.operator === "eq") {
          return val === f.value;
        }
        if (f.operator === "ilike") {
          if (typeof val === "string" && typeof f.value === "string") {
            return val.toLowerCase() === f.value.toLowerCase();
          }
          return val === f.value;
        }
        return true;
      });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async execute(): Promise<{ data: any; error: Error | null }> {
    const store = getStore();
    const currentUser = store.session?.user;

    // 1. user_roles query
    if (this.tableName === "user_roles") {
      let list: UserRole[] = [];
      if (currentUser) {
        list = [
          {
            id: "role-" + currentUser.id,
            user_id: currentUser.id,
            role: currentUser.role || "user",
          },
        ];
      }
      list = this.applyFilters(list);
      const data =
        this.isSingle || this.isMaybeSingle ? (list[0] ?? null) : list;
      return { data, error: null };
    }

    // 2. profiles query
    if (this.tableName === "profiles") {
      if (this.operation === "select") {
        // If admin and fetching all, try server-side admin endpoint
        if (
          currentUser?.role === "admin" &&
          this.filters.length === 0 &&
          typeof window !== "undefined" &&
          typeof fetch !== "undefined"
        ) {
          try {
            const adminRes = await fetch("/api/admin/profiles", {
              headers: CSRF_HEADER,
              credentials: "include",
            });
            if (adminRes.ok) {
              const adminJson = await adminRes.json();
              if (adminJson && Array.isArray(adminJson.profiles)) {
                let list = [...adminJson.profiles];
                if (this.orderConfig) {
                  const { column, ascending } = this.orderConfig;
                  list.sort((a, b) => {
                    const av = a[column as keyof Profile];
                    const bv = b[column as keyof Profile];
                    if (av == null) return 1;
                    if (bv == null) return -1;
                    if (av < bv) return ascending ? -1 : 1;
                    if (av > bv) return ascending ? 1 : -1;
                    return 0;
                  });
                }
                if (this.limitCount != null) {
                  list = list.slice(0, this.limitCount);
                }
                return { data: list, error: null };
              }
            }
          } catch {
            // fallback to store
          }
        }

        let list = [...store.profiles];
        list = this.applyFilters(list);
        if (this.orderConfig) {
          const { column, ascending } = this.orderConfig;
          list.sort((a, b) => {
            const av = a[column as keyof Profile];
            const bv = b[column as keyof Profile];
            if (av == null) return 1;
            if (bv == null) return -1;
            if (av < bv) return ascending ? -1 : 1;
            if (av > bv) return ascending ? 1 : -1;
            return 0;
          });
        }
        if (this.limitCount != null) {
          list = list.slice(0, this.limitCount);
        }
        const data =
          this.isSingle || this.isMaybeSingle ? (list[0] ?? null) : list;
        return { data, error: null };
      }

      if (this.operation === "update") {
        const idFilter = this.filters.find(
          (f) => f.column === "id" && f.operator === "eq",
        );
        const targetId = idFilter ? String(idFilter.value) : undefined;

        // If target is someone else or admin action, route via admin endpoint
        if (
          targetId &&
          currentUser?.role === "admin" &&
          targetId !== currentUser.id
        ) {
          try {
            const res = await fetch("/api/admin/profile-mutate", {
              method: "POST",
              headers: { "content-type": "application/json", ...CSRF_HEADER },
              credentials: "include",
              body: JSON.stringify({
                targetUserId: targetId,
                changes: this.payload,
              }),
            });
            const json = await res.json();
            if (!res.ok) {
              return {
                data: null,
                error: new Error(json.error || "Failed to update profile"),
              };
            }
          } catch (err) {
            return {
              data: null,
              error: err instanceof Error ? err : new Error("Network error"),
            };
          }
        }

        let updatedCount = 0;
        store.profiles = store.profiles.map((p) => {
          const match = this.filters.every((f) => {
            if (f.operator === "eq")
              return p[f.column as keyof Profile] === f.value;
            if (f.operator === "ilike") {
              const pv = p[f.column as keyof Profile];
              return String(pv).toLowerCase() === String(f.value).toLowerCase();
            }
            return true;
          });
          if (match) {
            updatedCount++;
            return {
              ...p,
              ...this.payload,
              updated_at: new Date().toISOString(),
            };
          }
          return p;
        });

        if (updatedCount === 0 && (targetId || currentUser?.id)) {
          const effectiveId = targetId || currentUser?.id;
          if (effectiveId) {
            const existingIdx = store.profiles.findIndex(
              (p) => p.id === effectiveId,
            );
            if (existingIdx >= 0) {
              store.profiles[existingIdx] = {
                ...store.profiles[existingIdx],
                ...this.payload,
                updated_at: new Date().toISOString(),
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
                card_opacity: 0.65,
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
                created_at: new Date().toISOString(),
                ...this.payload,
                updated_at: new Date().toISOString(),
              });
              updatedCount = 1;
            }
          }
        }

        const syncRes = await syncToServer(currentUser?.id);
        if (!syncRes.success) {
          return { data: null, error: new Error(syncRes.error) };
        }
        return { data: { count: updatedCount }, error: null };
      }

      if (this.operation === "delete") {
        const idFilter = this.filters.find(
          (f) => f.column === "id" && f.operator === "eq",
        );
        const targetId = idFilter ? String(idFilter.value) : undefined;

        if (targetId && currentUser?.role === "admin") {
          try {
            const res = await fetch("/api/admin/delete-profile", {
              method: "POST",
              headers: { "content-type": "application/json", ...CSRF_HEADER },
              credentials: "include",
              body: JSON.stringify({ targetUserId: targetId }),
            });
            const json = await res.json();
            if (!res.ok) {
              return {
                data: null,
                error: new Error(json.error || "Failed to delete profile"),
              };
            }
          } catch (err) {
            return {
              data: null,
              error: err instanceof Error ? err : new Error("Network error"),
            };
          }
        }

        store.profiles = store.profiles.filter((p) => {
          return !this.filters.every((f) => {
            if (f.operator === "eq")
              return p[f.column as keyof Profile] === f.value;
            return true;
          });
        });
        const syncRes = await syncToServer(currentUser?.id);
        if (!syncRes.success) {
          return { data: null, error: new Error(syncRes.error) };
        }
        return { data: null, error: null };
      }
    }

    // 3. links query
    if (this.tableName === "links") {
      if (this.operation === "select") {
        let list = [...store.links];
        list = this.applyFilters(list);
        if (this.orderConfig) {
          const { column, ascending } = this.orderConfig;
          list.sort((a, b) => {
            const av = a[column as keyof BioLink];
            const bv = b[column as keyof BioLink];
            if (av == null) return 1;
            if (bv == null) return -1;
            if (av < bv) return ascending ? -1 : 1;
            if (av > bv) return ascending ? 1 : -1;
            return 0;
          });
        }
        const data =
          this.isSingle || this.isMaybeSingle ? (list[0] ?? null) : list;
        return { data, error: null };
      }

      if (this.operation === "insert") {
        const newLink: BioLink = {
          id: "lnk-" + Math.random().toString(36).substring(2, 10),
          user_id: this.payload.user_id || currentUser?.id,
          title: this.payload.title || "New Link",
          url: this.payload.url || "https://",
          position: this.payload.position ?? store.links.length,
          clicks: 0,
          created_at: new Date().toISOString(),
          ...this.payload,
        };
        store.links.push(newLink);
        const syncRes = await syncToServer(currentUser?.id);
        if (!syncRes.success) {
          return { data: null, error: new Error(syncRes.error) };
        }
        return { data: newLink, error: null };
      }

      if (this.operation === "update") {
        let updatedCount = 0;
        store.links = store.links.map((link) => {
          const match = this.filters.every((f) => {
            if (f.operator === "eq")
              return link[f.column as keyof BioLink] === f.value;
            return true;
          });
          if (match) {
            updatedCount++;
            return { ...link, ...this.payload };
          }
          return link;
        });
        const syncRes = await syncToServer(currentUser?.id);
        if (!syncRes.success) {
          return { data: null, error: new Error(syncRes.error) };
        }
        return { data: { count: updatedCount }, error: null };
      }

      if (this.operation === "delete") {
        store.links = store.links.filter((link) => {
          return !this.filters.every((f) => {
            if (f.operator === "eq")
              return link[f.column as keyof BioLink] === f.value;
            return true;
          });
        });
        const syncRes = await syncToServer(currentUser?.id);
        if (!syncRes.success) {
          return { data: null, error: new Error(syncRes.error) };
        }
        return { data: null, error: null };
      }
    }

    return { data: null, error: null };
  }

  then<TResult1 = { data: unknown; error: Error | null }, TResult2 = never>(
    onfulfilled?:
      | ((value: {
          data: unknown;
          error: Error | null;
        }) => TResult1 | PromiseLike<TResult1>)
      | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }
}

export const db = {
  from(tableName: "profiles" | "links" | "user_roles") {
    return new ManualQueryBuilder(tableName);
  },

  async rpc(
    fnName: string,
    args: Record<string, unknown> = {},
  ): Promise<{ data: unknown; error: Error | null }> {
    const store = getStore();

    if (fnName === "username_available") {
      const username = String(args["_username"] || "")
        .toLowerCase()
        .trim();
      const userId = args["_user_id"] ? String(args["_user_id"]) : undefined;

      if (!username || username.length < 3 || username.length > 20) {
        return { data: false, error: null };
      }

      if (typeof fetch !== "undefined") {
        try {
          const q = new URLSearchParams({ username });
          if (userId) q.set("userId", userId);
          const res = await fetch(`/api/username-available?${q.toString()}`);
          if (res.ok) {
            const json = (await res.json()) as { available?: boolean };
            if (typeof json.available === "boolean") {
              return { data: json.available, error: null };
            }
          }
        } catch {
          // offline
        }
      }

      const localConflict = store.profiles.some(
        (p) =>
          p.username &&
          p.username.toLowerCase() === username &&
          p.id !== userId,
      );
      return { data: !localConflict, error: null };
    }

    if (fnName === "claim_username") {
      const username = String(args["_username"] || "")
        .toLowerCase()
        .trim();
      const userId = String(args["_user_id"] || "");

      if (!userId || !username) {
        return {
          data: null,
          error: new Error("User ID and username are required"),
        };
      }

      if (typeof fetch !== "undefined") {
        try {
          const res = await fetch("/api/claim", {
            method: "POST",
            headers: { "content-type": "application/json", ...CSRF_HEADER },
            credentials: "include",
            body: JSON.stringify({ userId, username }),
          });
          const json = (await res.json()) as {
            success?: boolean;
            error?: string;
          };
          if (!res.ok || !json.success) {
            return {
              data: null,
              error: new Error(
                json.error ||
                  `The username "${username}" is already reserved by another user.`,
              ),
            };
          }
        } catch (err) {
          return {
            data: null,
            error: err instanceof Error ? err : new Error("Network error"),
          };
        }
      }

      store.profiles = store.profiles.map((p) =>
        p.id === userId
          ? {
              ...p,
              username,
              display_name: p.display_name || username,
              updated_at: new Date().toISOString(),
            }
          : p,
      );
      return { data: { success: true, username }, error: null };
    }

    if (fnName === "increment_profile_view") {
      const username = String(args["_username"] || "")
        .toLowerCase()
        .trim();
      if (!username) return { data: null, error: null };

      if (typeof fetch !== "undefined") {
        try {
          const res = await fetch("/api/view", {
            method: "POST",
            headers: { "content-type": "application/json", ...CSRF_HEADER },
            body: JSON.stringify({ username }),
          });
          const json = (await res.json()) as {
            success?: boolean;
            counted?: boolean;
            views?: number;
          };
          if (json && typeof json.views === "number") {
            store.profiles = store.profiles.map((p) =>
              p.username?.toLowerCase() === username
                ? { ...p, views: json.views! }
                : p,
            );
            return { data: json, error: null };
          }
        } catch {
          // fallback
        }
      }

      return { data: null, error: null };
    }

    if (fnName === "increment_link_click") {
      const linkId = String(args["_link_id"] || "");
      if (typeof fetch !== "undefined") {
        fetch("/api/click", {
          method: "POST",
          headers: { "content-type": "application/json", ...CSRF_HEADER },
          body: JSON.stringify({ linkId }),
        }).catch(() => {});
      }
      return { data: null, error: null };
    }

    if (fnName === "platform_stats") {
      if (typeof fetch !== "undefined") {
        try {
          const res = await fetch("/api/stats");
          if (res.ok) {
            const stats = await res.json();
            return { data: [stats], error: null };
          }
        } catch {
          // fallback
        }
      }
      return {
        data: [
          {
            total_profiles: store.profiles.length,
            active_profiles: store.profiles.filter(
              (p) => p.username && !p.is_banned,
            ).length,
            total_views: store.profiles.reduce((a, b) => a + (b.views || 0), 0),
            total_clicks: store.links.reduce((a, b) => a + (b.clicks || 0), 0),
            total_links: store.links.length,
          },
        ],
        error: null,
      };
    }

    return { data: null, error: null };
  },
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
export async function optimizeImageDataUrl(
  input: string | File,
  folder: "avatar" | "background" | string = "background",
): Promise<string> {
  if (typeof window === "undefined") {
    if (typeof input === "string") return input;
    return readDirect(input);
  }

  let objectUrl = "";
  let isObjectUrl = false;

  if (typeof input === "string") {
    if (!input.startsWith("data:image/")) {
      return input; // Normal external URL, preserve
    }
    // If it's already sufficiently small, skip recompression
    const threshold = folder === "avatar" ? 50 * 1024 : 200 * 1024;
    if (input.length < threshold) {
      return input;
    }
    objectUrl = input;
  } else {
    if (!input.type.startsWith("image/")) {
      return readDirect(input);
    }
    // SVGs are vector and already small
    if (input.type === "image/svg+xml") {
      return readDirect(input);
    }
    objectUrl = URL.createObjectURL(input);
    isObjectUrl = true;
  }

  try {
    return await new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        if (isObjectUrl) {
          try {
            URL.revokeObjectURL(objectUrl);
          } catch {
            // ignore
          }
        }

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
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
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

        // Initial export
        const initialQuality = isAvatar ? 0.82 : 0.78;
        let result = canvas.toDataURL("image/jpeg", initialQuality);

        // Maximum allowed characters: ~70KB for avatar, ~350KB for wallpaper
        const maxChars = isAvatar ? 75 * 1024 : 360 * 1024;

        if (result.length > maxChars) {
          // Second pass: slightly more aggressive compression
          result = canvas.toDataURL("image/jpeg", isAvatar ? 0.7 : 0.68);
        }

        if (result.length > maxChars && !isAvatar) {
          // Third pass: downscale dimension if still large
          const scaleCanvas = document.createElement("canvas");
          const scaleW = Math.round(width * 0.75);
          const scaleH = Math.round(height * 0.75);
          scaleCanvas.width = Math.max(scaleW, 1);
          scaleCanvas.height = Math.max(scaleH, 1);
          const scaleCtx = scaleCanvas.getContext("2d");
          if (scaleCtx) {
            scaleCtx.imageSmoothingEnabled = true;
            scaleCtx.imageSmoothingQuality = "medium";
            scaleCtx.drawImage(canvas, 0, 0, scaleW, scaleH);
            result = scaleCanvas.toDataURL("image/jpeg", 0.65);
          }
        }

        resolve(result);
      };

      img.onerror = () => {
        if (isObjectUrl) {
          try {
            URL.revokeObjectURL(objectUrl);
          } catch {
            // ignore
          }
        }
        if (typeof input === "string") {
          resolve(input);
        } else {
          readDirect(input).then(resolve).catch(reject);
        }
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
export async function uploadMedia(
  userId: string,
  file: File,
  folder: string,
): Promise<string> {
  // Support background video uploads up to 100MB
  if (file.type.startsWith("video/")) {
    if (file.size > 100 * 1024 * 1024) {
      throw new Error(
        "Uploaded video clip exceeds 100MB. Please select a video file under 100MB.",
      );
    }
  }

  // Guard audio size
  if (file.type.startsWith("audio/")) {
    if (file.size > 15 * 1024 * 1024) {
      throw new Error(
        "Audio file exceeds 15MB. For full songs, please paste a direct audio URL.",
      );
    }
  }

  // First attempt robust server-side media upload (writes to /public/uploads and streams via /api/media)
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    formData.append("userId", userId);

    const res = await fetch("/api/upload", {
      method: "POST",
      headers: {
        "x-requested-with": "halo-app",
      },
      body: formData,
    });

    if (res.ok) {
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
        return data.url;
      }
    } else {
      const errData = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      if (file.type.startsWith("video/")) {
        throw new Error(
          errData.error ||
            `Video upload failed with status ${res.status}. Please try again.`,
        );
      }
    }
  } catch (serverErr) {
    if (file.type.startsWith("video/")) {
      throw serverErr instanceof Error
        ? serverErr
        : new Error("Failed to upload video to media server.");
    }
    console.warn(
      "Direct server upload attempt failed, falling back:",
      serverErr,
    );
  }

  // Optimize and downscale images via Canvas if server upload wasn't used
  if (file.type.startsWith("image/") && typeof window !== "undefined") {
    return optimizeImageDataUrl(file, folder);
  }

  return readDirect(file);
}

function readDirect(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    reader.readAsDataURL(file);
  });
}

export async function fetchProfileByUsername(username: string) {
  try {
    const cleanUser = username.toLowerCase().trim();

    // Check server store during SSR if running on server
    if (typeof window === "undefined" && typeof globalThis !== "undefined") {
      const globalStore = (
        globalThis as unknown as {
          __HALO_SERVER_STORE__?: {
            getProfile: (
              u: string,
            ) => Promise<{ profile: Profile; links: BioLink[] } | null>;
          };
        }
      ).__HALO_SERVER_STORE__;

      if (globalStore && typeof globalStore.getProfile === "function") {
        const found = await globalStore.getProfile(cleanUser);
        if (found) return found;
      }
    }

    // Client fetch from live server API
    if (typeof window !== "undefined" && typeof fetch !== "undefined") {
      try {
        const res = await fetch(
          `/api/profile/${encodeURIComponent(cleanUser)}?t=${Date.now()}`,
          { cache: "no-store" },
        );
        if (res.ok) {
          const data = (await res.json()) as {
            profile: Profile;
            links: BioLink[];
          };
          if (data && data.profile) {
            const pIdx = memoryStore.profiles.findIndex(
              (p) => p.id === data.profile.id,
            );
            if (pIdx >= 0) memoryStore.profiles[pIdx] = data.profile;
            else memoryStore.profiles.push(data.profile);

            if (data.links && Array.isArray(data.links)) {
              memoryStore.links = memoryStore.links
                .filter((l) => l.user_id !== data.profile.id)
                .concat(data.links);
            }
            return { profile: data.profile, links: data.links || [] };
          }
        }
      } catch {
        // Fallback
      }
    }

    const profile = memoryStore.profiles.find(
      (p) => p.username && p.username.toLowerCase() === cleanUser,
    );
    if (!profile) return null;

    const links = memoryStore.links
      .filter((l) => l.user_id === profile.id)
      .sort((a, b) => a.position - b.position);

    return { profile, links };
  } catch (e) {
    console.warn("fetchProfileByUsername failed:", e);
    return null;
  }
}
