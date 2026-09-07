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
  user_metadata?: {
    full_name?: string;
  };
  created_at?: string;
};

export type AuthSession = {
  access_token: string;
  user: AuthUser;
};

type StoredUser = {
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

export async function hashPassword(password: string): Promise<string> {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode("halo_salt_2026_" + password);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    } catch {
      // Fallback
    }
  }
  return "h_" + btoa("halo:" + password);
}

async function verifyPassword(
  plainInput: string,
  storedHash: string,
): Promise<boolean> {
  if (plainInput === storedHash) return true; // Legacy fallback
  const hashed = await hashPassword(plainInput);
  return hashed === storedHash;
}

const failedLogins = new Map<string, { count: number; lockedUntil: number }>();

const STORAGE_PREFIX = "halo_bio_store_v1";

const SEED_USERS: StoredUser[] = [
  {
    id: "usr-staff-admin",
    email: "staff@gmail.com",
    password: "password123",
    full_name: "Halo Staff",
    role: "admin",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "usr-alex-creator",
    email: "alex@halo.bio",
    password: "password123",
    full_name: "Alex Rivera",
    role: "user",
    created_at: "2026-02-15T00:00:00Z",
  },
];

const SEED_PROFILES: Profile[] = [
  {
    id: "usr-staff-admin",
    username: "halo",
    display_name: "Halo Official",
    bio: "Next-gen media-rich link-in-bio platform with sound, video backgrounds and frosted glass aesthetics.",
    avatar_url:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80",
    background_type: "color",
    background_value: "#0b0f19",
    card_opacity: 0.65,
    card_radius: 24,
    card_blur: 24,
    accent_color: "#6366f1",
    music_url: null,
    music_enabled: false,
    enter_text: "click to enter",
    is_premium: true,
    is_banned: false,
    is_flagged: false,
    views: 1420,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "usr-alex-creator",
    username: "alex",
    display_name: "Alex Rivera",
    bio: "Visual Artist & Ambient Sound Designer based in Tokyo & Berlin.",
    avatar_url:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    background_type: "image",
    background_value:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80",
    card_opacity: 0.55,
    card_radius: 26,
    card_blur: 20,
    accent_color: "#3b82f6",
    music_url:
      "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3",
    music_enabled: true,
    enter_text: "listen & explore",
    is_premium: true,
    is_banned: false,
    is_flagged: false,
    views: 3890,
    created_at: "2026-02-15T00:00:00Z",
  },
];

const SEED_LINKS: BioLink[] = [
  {
    id: "lnk-halo-1",
    user_id: "usr-staff-admin",
    title: "Join the Discord Community",
    url: "https://discord.gg",
    position: 0,
    clicks: 342,
  },
  {
    id: "lnk-halo-2",
    user_id: "usr-staff-admin",
    title: "Follow on X / Twitter",
    url: "https://x.com",
    position: 1,
    clicks: 520,
  },
  {
    id: "lnk-halo-3",
    user_id: "usr-staff-admin",
    title: "Official Documentation",
    url: "https://github.com",
    position: 2,
    clicks: 189,
  },
  {
    id: "lnk-alex-1",
    user_id: "usr-alex-creator",
    title: "Stream Latest Ambient EP on Spotify",
    url: "https://spotify.com",
    position: 0,
    clicks: 1204,
  },
  {
    id: "lnk-alex-2",
    user_id: "usr-alex-creator",
    title: "Visual Art & Photography Portfolio",
    url: "https://behance.net",
    position: 1,
    clicks: 890,
  },
  {
    id: "lnk-alex-3",
    user_id: "usr-alex-creator",
    title: "Limited Edition Art Prints (Store)",
    url: "https://etsy.com",
    position: 2,
    clicks: 432,
  },
  {
    id: "lnk-alex-4",
    user_id: "usr-alex-creator",
    title: "Follow on Instagram",
    url: "https://instagram.com",
    position: 3,
    clicks: 1650,
  },
];

type StoreData = {
  users: StoredUser[];
  profiles: Profile[];
  links: BioLink[];
  session: AuthSession | null;
};

let memoryStore: StoreData = {
  users: [...SEED_USERS],
  profiles: [...SEED_PROFILES],
  links: [...SEED_LINKS],
  session: null,
};

function getStore(): StoreData {
  if (typeof window === "undefined") {
    return memoryStore;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX);
    if (!raw) {
      window.localStorage.setItem(STORAGE_PREFIX, JSON.stringify(memoryStore));
      return memoryStore;
    }
    const parsed = JSON.parse(raw) as Partial<StoreData>;
    memoryStore = {
      users: parsed.users?.length ? parsed.users : [...SEED_USERS],
      profiles: parsed.profiles?.length ? parsed.profiles : [...SEED_PROFILES],
      links: parsed.links?.length ? parsed.links : [...SEED_LINKS],
      session: parsed.session ?? null,
    };
    return memoryStore;
  } catch {
    return memoryStore;
  }
}

function saveStore(data: StoreData) {
  memoryStore = data;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_PREFIX, JSON.stringify(data));
      window.dispatchEvent(new Event("halo-store-updated"));
    } catch (e) {
      console.warn("Error persisting to localStorage:", e);
    }

    if (typeof fetch !== "undefined") {
      fetch("/api/sync", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          profiles: data.profiles,
          links: data.links,
          users: data.users,
        }),
      }).catch(() => {
        // Ignore network offline errors
      });
    }
  }
}

if (typeof window !== "undefined" && typeof fetch !== "undefined") {
  fetch("/api/store")
    .then((r) => (r.ok ? r.json() : null))
    .then((serverData) => {
      if (serverData && Array.isArray(serverData.profiles)) {
        const store = getStore();
        let changed = false;
        serverData.profiles.forEach((sp: Profile) => {
          const idx = store.profiles.findIndex((p) => p.id === sp.id);
          if (idx >= 0) {
            if ((sp.views || 0) > (store.profiles[idx].views || 0)) {
              store.profiles[idx].views = sp.views;
              changed = true;
            }
          } else {
            store.profiles.push(sp);
            changed = true;
          }
        });
        if (Array.isArray(serverData.links)) {
          serverData.links.forEach((sl: BioLink) => {
            if (!store.links.some((l) => l.id === sl.id)) {
              store.links.push(sl);
              changed = true;
            }
          });
        }
        if (changed) {
          memoryStore = store;
          try {
            window.localStorage.setItem(STORAGE_PREFIX, JSON.stringify(store));
            window.dispatchEvent(new Event("halo-store-updated"));
          } catch {
            // ignore
          }
        }
      }
    })
    .catch(() => {
      // ignore
    });
}

type AuthCallback = (event: string, session: AuthSession | null) => void;
const authListeners = new Set<AuthCallback>();

function emitAuth(event: string, session: AuthSession | null) {
  authListeners.forEach((cb) => {
    try {
      cb(event, session);
    } catch (e) {
      console.error("Auth listener error:", e);
    }
  });
}

export const auth = {
  async getSession(): Promise<{
    data: { session: AuthSession | null };
    error: null;
  }> {
    const store = getStore();
    return { data: { session: store.session }, error: null };
  },

  onAuthStateChange(callback: AuthCallback) {
    authListeners.add(callback);
    const store = getStore();
    callback("INITIAL_SESSION", store.session);

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
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      return {
        data: { user: null, session: null },
        error: new Error("Please enter a valid email address."),
      };
    }
    if (cleanPassword.length < 6) {
      return {
        data: { user: null, session: null },
        error: new Error("Password must be at least 6 characters."),
      };
    }

    const store = getStore();
    const existing = store.users.find(
      (u) => u.email.toLowerCase() === cleanEmail,
    );
    if (existing) {
      return {
        data: { user: null, session: null },
        error: new Error(
          "An account with this email already exists. Please log in.",
        ),
      };
    }

    const userId = "usr-" + Math.random().toString(36).substring(2, 10);
    const fullName =
      options?.data?.full_name || cleanEmail.split("@")[0] || "User";
    const role: "admin" | "user" =
      cleanEmail === "staff@gmail.com" ? "admin" : "user";
    const hashedPassword = await hashPassword(cleanPassword);

    const newUser: StoredUser = {
      id: userId,
      email: cleanEmail,
      password: hashedPassword,
      full_name: fullName,
      role,
      created_at: new Date().toISOString(),
    };

    const newProfile: Profile = {
      id: userId,
      username: null,
      display_name: fullName,
      bio: "",
      avatar_url: null,
      background_type: "color",
      background_value: "#0b0f19",
      card_opacity: 0.6,
      card_radius: 24,
      card_blur: 20,
      accent_color: "#3b82f6",
      music_url: null,
      music_enabled: false,
      enter_text: "click to enter",
      is_premium: false,
      is_banned: false,
      is_flagged: false,
      views: 0,
      created_at: new Date().toISOString(),
    };

    const authUser: AuthUser = {
      id: userId,
      email: cleanEmail,
      user_metadata: { full_name: fullName },
      created_at: newUser.created_at,
    };

    const session: AuthSession = {
      access_token: "manual-token-" + Math.random().toString(36).substring(2),
      user: authUser,
    };

    store.users.push(newUser);
    store.profiles.push(newProfile);
    store.session = session;

    saveStore(store);
    emitAuth("SIGNED_IN", session);

    return { data: { user: authUser, session }, error: null };
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
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Check failed attempt rate-limit
    const now = Date.now();
    const failRecord = failedLogins.get(cleanEmail);
    if (failRecord && failRecord.lockedUntil > now) {
      const waitSec = Math.ceil((failRecord.lockedUntil - now) / 1000);
      return {
        data: { user: null, session: null },
        error: new Error(
          `Too many failed sign-in attempts. Please wait ${waitSec}s.`,
        ),
      };
    }

    const store = getStore();
    const user = store.users.find((u) => u.email.toLowerCase() === cleanEmail);

    const isMatch = user
      ? await verifyPassword(cleanPassword, user.password)
      : false;

    if (!user || !isMatch) {
      const currentFails = (failRecord?.count || 0) + 1;
      if (currentFails >= 5) {
        failedLogins.set(cleanEmail, {
          count: 0,
          lockedUntil: now + 60_000, // 60s lockout
        });
      } else {
        failedLogins.set(cleanEmail, {
          count: currentFails,
          lockedUntil: 0,
        });
      }
      return {
        data: { user: null, session: null },
        error: new Error("Invalid email or password. Please try again."),
      };
    }

    // Clear failed attempts on success
    failedLogins.delete(cleanEmail);

    // If legacy plaintext password, upgrade to hash
    if (user.password === cleanPassword) {
      user.password = await hashPassword(cleanPassword);
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      user_metadata: { full_name: user.full_name },
      created_at: user.created_at,
    };

    const session: AuthSession = {
      access_token: "manual-token-" + Math.random().toString(36).substring(2),
      user: authUser,
    };

    store.session = session;
    saveStore(store);
    emitAuth("SIGNED_IN", session);

    return { data: { user: authUser, session }, error: null };
  },

  async signOut(): Promise<{ error: null }> {
    const store = getStore();
    store.session = null;
    saveStore(store);
    emitAuth("SIGNED_OUT", null);
    return { error: null };
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
    this.operation = "select";
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

    if (this.tableName === "user_roles") {
      let list: UserRole[] = store.users.map((u) => ({
        id: "role-" + u.id,
        user_id: u.id,
        role: u.role,
      }));
      list = this.applyFilters(list);
      const data =
        this.isSingle || this.isMaybeSingle ? (list[0] ?? null) : list;
      return { data, error: null };
    }

    if (this.tableName === "profiles") {
      if (this.operation === "select") {
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
        const targetUsername =
          this.payload && "username" in this.payload && this.payload.username
            ? String(this.payload.username).toLowerCase().trim()
            : null;

        // If a username is being set or changed, strictly ensure NO OTHER USER owns it
        if (targetUsername) {
          const matchingProfiles = store.profiles.filter((p) =>
            this.filters.every((f) => {
              if (f.operator === "eq")
                return p[f.column as keyof Profile] === f.value;
              if (f.operator === "ilike") {
                const pv = p[f.column as keyof Profile];
                return (
                  String(pv).toLowerCase() === String(f.value).toLowerCase()
                );
              }
              return true;
            }),
          );

          for (const target of matchingProfiles) {
            const conflict = store.profiles.some(
              (other) =>
                other.id !== target.id &&
                other.username &&
                other.username.toLowerCase() === targetUsername,
            );
            if (conflict) {
              return {
                data: null,
                error: new Error(
                  `The username "${targetUsername}" is already reserved by another user.`,
                ),
              };
            }
          }

          // Verify with server-side claim endpoint as single source of truth
          if (typeof fetch !== "undefined" && matchingProfiles.length > 0) {
            const target = matchingProfiles[0];
            try {
              const res = await fetch("/api/claim", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                  userId: target.id,
                  username: targetUsername,
                }),
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
                      `The username "${targetUsername}" is already reserved by another user.`,
                  ),
                };
              }
            } catch {
              // network offline fallback
            }
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
        saveStore(store);
        return { data: { count: updatedCount }, error: null };
      }

      if (this.operation === "delete") {
        store.profiles = store.profiles.filter((p) => {
          return !this.filters.every((f) => {
            if (f.operator === "eq")
              return p[f.column as keyof Profile] === f.value;
            return true;
          });
        });
        saveStore(store);
        return { data: null, error: null };
      }
    }

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
          user_id: this.payload.user_id,
          title: this.payload.title || "New Link",
          url: this.payload.url || "https://",
          position: this.payload.position ?? store.links.length,
          clicks: 0,
          created_at: new Date().toISOString(),
          ...this.payload,
        };
        store.links.push(newLink);
        saveStore(store);
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
        saveStore(store);
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
        saveStore(store);
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

      if (!username || username.length < 3 || username.length > 30) {
        return { data: false, error: null };
      }

      // Check local store
      const localConflict = store.profiles.some(
        (p) =>
          p.username &&
          p.username.toLowerCase() === username &&
          p.id !== userId,
      );
      if (localConflict) {
        return { data: false, error: null };
      }

      // Check with live server single source of truth
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
          // offline fallback: use local check
        }
      }

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

      // Check local conflict first
      const conflict = store.profiles.some(
        (p) =>
          p.id !== userId &&
          p.username &&
          p.username.toLowerCase() === username,
      );
      if (conflict) {
        return {
          data: null,
          error: new Error(
            `The username "${username}" is already reserved by another user.`,
          ),
        };
      }

      // Verify on server
      if (typeof fetch !== "undefined") {
        try {
          const res = await fetch("/api/claim", {
            method: "POST",
            headers: { "content-type": "application/json" },
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
        } catch {
          // network error fallback
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
      saveStore(store);
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
            headers: { "content-type": "application/json" },
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
            saveStore(store);
            return { data: json, error: null };
          }
        } catch {
          // fallback to local increment
        }
      }

      let found = false;
      store.profiles = store.profiles.map((p) => {
        if (p.username && p.username.toLowerCase() === username) {
          found = true;
          return { ...p, views: (p.views || 0) + 1 };
        }
        return p;
      });
      if (found) saveStore(store);
      return { data: null, error: null };
    }

    if (fnName === "increment_link_click") {
      const linkId = String(args["_link_id"] || "");
      if (typeof fetch !== "undefined") {
        fetch("/api/click", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ linkId }),
        }).catch(() => {});
      }
      let found = false;
      store.links = store.links.map((link) => {
        if (link.id === linkId) {
          found = true;
          return { ...link, clicks: (link.clicks || 0) + 1 };
        }
        return link;
      });
      if (found) saveStore(store);
      return { data: null, error: null };
    }

    if (fnName === "platform_stats") {
      const total_profiles = store.profiles.length;
      const active_profiles = store.profiles.filter(
        (p) => p.username && !p.is_banned,
      ).length;
      const total_views = store.profiles.reduce(
        (acc, p) => acc + (p.views || 0),
        0,
      );
      const total_clicks = store.links.reduce(
        (acc, l) => acc + (l.clicks || 0),
        0,
      );
      const total_links = store.links.length;

      return {
        data: [
          {
            total_profiles,
            active_profiles,
            total_views,
            total_clicks,
            total_links,
          },
        ],
        error: null,
      };
    }

    return { data: null, error: null };
  },
};

/**
 * Uploads media files into local storage data URLs with image compression
 * and file size protections to prevent quota limits.
 */
export async function uploadMedia(
  _userId: string,
  file: File,
  folder: string,
): Promise<string> {
  // Guard audio size
  if (file.type.startsWith("audio/")) {
    if (file.size > 3.5 * 1024 * 1024) {
      throw new Error(
        "Audio file exceeds 3.5MB. Please use an MP3 URL or compress your track.",
      );
    }
  }

  // Guard video size
  if (file.type.startsWith("video/")) {
    if (file.size > 5 * 1024 * 1024) {
      throw new Error(
        "Video file exceeds 5MB. Please use a direct video URL or smaller clip.",
      );
    }
  }

  // Optimize and downscale images via Canvas
  if (file.type.startsWith("image/") && typeof window !== "undefined") {
    try {
      return await new Promise<string>((resolve, reject) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        img.onload = () => {
          URL.revokeObjectURL(objectUrl);
          const maxDim = folder === "avatar" ? 400 : 1280;
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;

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
            // Fallback to direct read
            readDirect(file).then(resolve).catch(reject);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", 0.82);
          resolve(compressed);
        };
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          readDirect(file).then(resolve).catch(reject);
        };
        img.src = objectUrl;
      });
    } catch {
      // Fallback
    }
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
            ) => { profile: Profile; links: BioLink[] } | null;
          };
        }
      ).__HALO_SERVER_STORE__;

      if (globalStore && typeof globalStore.getProfile === "function") {
        const found = globalStore.getProfile(cleanUser);
        if (found) return found;
      }
    }

    const store = getStore();
    let profile = store.profiles.find(
      (p) => p.username && p.username.toLowerCase() === cleanUser,
    );

    // If on client, also try fetching from /api/profile/:username for freshest updates
    if (typeof window !== "undefined" && typeof fetch !== "undefined") {
      try {
        const res = await fetch(
          `/api/profile/${encodeURIComponent(cleanUser)}`,
        );
        if (res.ok) {
          const data = (await res.json()) as {
            profile: Profile;
            links: BioLink[];
          };
          if (data && data.profile) {
            profile = data.profile;
            const pIdx = store.profiles.findIndex((p) => p.id === profile!.id);
            if (pIdx >= 0) store.profiles[pIdx] = profile!;
            else store.profiles.push(profile!);
            if (data.links && Array.isArray(data.links)) {
              store.links = store.links
                .filter((l) => l.user_id !== profile!.id)
                .concat(data.links);
            }
            saveStore(store);
            return { profile: data.profile, links: data.links || [] };
          }
        }
      } catch {
        // Fallback to local
      }
    }

    if (!profile) return null;

    const links = store.links
      .filter((l) => l.user_id === profile.id)
      .sort((a, b) => a.position - b.position);

    return { profile, links };
  } catch (e) {
    console.warn("fetchProfileByUsername failed:", e);
    return null;
  }
}
