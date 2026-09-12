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
        if (data.myProfile) allProfiles.push(data.myProfile);
        if (Array.isArray(data.publicProfiles)) {
          for (const pub of data.publicProfiles) {
            if (!allProfiles.some((p) => p.id === pub.id)) allProfiles.push(pub);
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

if (typeof window !== "undefined") {
  initClientSession().then((session) => {
    emitAuth("INITIAL_SESSION", session);
  });
}

function getStore(): StoreData {
  return memoryStore;
}

export async function syncToServer(
  currentUserId?: string,
): Promise<{ success: boolean; error?: string }> {
  if (typeof window === "undefined" || typeof fetch === "undefined") {
    return { success: true };
  }

  const store = getStore();
  const uid = currentUserId || store.session?.user?.id;
  if (!uid) return { success: false, error: "Authentication required" };

  const myProfiles = store.profiles.filter((p) => p.id === uid);
  const myLinks = store.links.filter((l) => l.user_id === uid);

  for (const p of myProfiles) {
    if (p.background_value?.startsWith("data:image/") && p.background_value.length > 250 * 1024) {
      try {
        p.background_value = await optimizeImageDataUrl(p.background_value, "background");
      } catch {}
    }
    if (p.avatar_url?.startsWith("data:image/") && p.avatar_url.length > 60 * 1024) {
      try {
        p.avatar_url = await optimizeImageDataUrl(p.avatar_url, "avatar");
      } catch {}
    }
  }

  try {
    const res = await fetch("/api/sync", {
      method: "POST",
      headers: { "content-type": "application/json", ...CSRF_HEADER },
      credentials: "include",
      body: JSON.stringify({ profiles: myProfiles, links: myLinks }),
    });

    if (!res.ok) {
      const errJson = (await res.json().catch(() => ({}))) as { error?: string };
      const errMsg = errJson.error || (res.status === 413
        ? "Payload too large (413). Spider Wensors is optimizing your images, please try saving again."
        : `Sync error (status ${res.status})`);
      return { success: false, error: errMsg };
    }

    window.dispatchEvent(new Event("halo-store-updated"));
    try { localStorage.setItem("halo_sync_tick", String(Date.now())); } catch {}
    return { success: true };
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : "Network error syncing data" };
  }
}

export const auth = {
  async getSession(): Promise<{ data: { session: AuthSession | null }; error: null }> {
    if (memoryStore.session) return { data: { session: memoryStore.session }, error: null };
    const session = await initClientSession();
    return { data: { session }, error: null };
  },

  // Kept as a small compatibility API because admin/profile hooks use getUser().
  // The previous implementation did not expose it, so dashboard mounting could
  // throw a TypeError inside useIsAdmin and render the generic error screen.
  async getUser(): Promise<{ data: { user: AuthUser | null }; error: null }> {
    if (memoryStore.session?.user) {
      return { data: { user: memoryStore.session.user }, error: null };
    }
    const session = await initClientSession();
    return { data: { user: session?.user ?? null }, error: null };
  },

  onAuthStateChange(callback: AuthCallback) {
    authListeners.add(callback);
    callback("INITIAL_SESSION", memoryStore.session);
    return {
      data: {
        subscription: {
          unsubscribe: () => authListeners.delete(callback),
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
  }): Promise<{ data: { user: AuthUser | null; session: AuthSession | null }; error: Error | null }> {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "content-type": "application/json", ...CSRF_HEADER },
        credentials: "include",
        body: JSON.stringify({ email, password, full_name: options?.data?.full_name }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) return { data: { user: null, session: null }, error: new Error(json.error || "Failed to sign up") };
      const authUser: AuthUser = { id: json.user.id, email: json.user.email, role: json.user.role, user_metadata: { full_name: json.user.full_name } };
      const session: AuthSession = { access_token: "server-cookie-session", user: authUser };
      memoryStore.session = session;
      await refreshUserData();
      emitAuth("SIGNED_IN", session);
      return { data: { user: authUser, session }, error: null };
    } catch (err) {
      return { data: { user: null, session: null }, error: err instanceof Error ? err : new Error("Network error during sign up") };
    }
  },

  async signInWithGoogle(): Promise<{ data: { user: AuthUser | null; session: AuthSession | null }; error: Error | null }> {
    try {
      const { signInWithPopup, GoogleAuthProvider } = await import("firebase/auth");
      const { firebaseAuth } = await import("./firebase");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(firebaseAuth, provider);
      const idToken = await result.user.getIdToken();
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "content-type": "application/json", ...CSRF_HEADER },
        credentials: "include",
        body: JSON.stringify({ idToken }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) return { data: { user: null, session: null }, error: new Error(json.error || "Failed to log in with Google") };
      const authUser: AuthUser = { id: json.user.id, email: json.user.email, role: json.user.role, user_metadata: { full_name: json.user.full_name } };
      const session: AuthSession = { access_token: "server-cookie-session", user: authUser };
      memoryStore.session = session;
      authListeners.forEach((cb) => cb("SIGNED_IN", session));
      return { data: { user: authUser, session }, error: null };
    } catch (err: unknown) {
      return { data: { user: null, session: null }, error: new Error(err instanceof Error ? err.message : "Failed to authenticate with Google") };
    }
  },

  async signInWithPassword({ email, password }: { email: string; password: string }): Promise<{ data: { user: AuthUser | null; session: AuthSession | null }; error: Error | null }> {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json", ...CSRF_HEADER },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) return { data: { user: null, session: null }, error: new Error(json.error || "Failed to log in") };
      const authUser: AuthUser = { id: json.user.id, email: json.user.email, role: json.user.role, user_metadata: { full_name: json.user.full_name } };
      const session: AuthSession = { access_token: "server-cookie-session", user: authUser };
      memoryStore.session = session;
      await refreshUserData();
      emitAuth("SIGNED_IN", session);
      return { data: { user: authUser, session }, error: null };
    } catch (err) {
      return { data: { user: null, session: null }, error: err instanceof Error ? err : new Error("Network error during sign in") };
    }
  },

  async signOut(): Promise<{ error: null }> {
    try {
      await fetch("/api/auth/logout", { method: "POST", headers: CSRF_HEADER, credentials: "include" });
    } catch {}
    memoryStore.session = null;
    memoryStore.profiles = [];
    memoryStore.links = [];
    emitAuth("SIGNED_OUT", null);
    return { error: null };
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ error: Error | null }> {
    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "content-type": "application/json", ...CSRF_HEADER },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const json = await res.json();
      if (!res.ok) return { error: new Error(json.error || "Failed to update password") };
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err : new Error("Failed to change password") };
    }
  },
};

type QueryFilter = { column: string; operator: "eq" | "ilike"; value: any };
type OrderConfig = { column: string; ascending: boolean };
