import fs from "node:fs";
import path from "node:path";
import { generateSessionToken, hashPasswordServer } from "./crypto";

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

export type StoredUser = {
  id: string;
  email: string;
  password: string; // PBKDF2 hash: <salt>:<hash>
  full_name: string;
  role: "admin" | "user";
  created_at: string;
};

export type ServerSession = {
  token: string;
  user_id: string;
  role: "admin" | "user";
  created_at: string;
  expires_at: string;
};

export type PublicProfile = {
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
  is_banned?: boolean;
  is_flagged?: boolean;
  views: number;
  created_at: string;
  updated_at?: string;
};

export type ServerData = {
  users: StoredUser[];
  profiles: Profile[];
  links: BioLink[];
  sessions: ServerSession[];
  viewed_ips: Record<string, string[]>; // username -> array of unique IP addresses
  view_cooldowns: Record<string, number>; // key: `${cleanIp}:${cleanUsername}` -> timestamp
  click_cooldowns: Record<string, number>; // key: `${cleanIp}:${linkId}` -> timestamp
};

// Seed users with PBKDF2-SHA512 hashes for 'password123'
const SEED_USERS: StoredUser[] = [
  {
    id: "usr-staff-admin",
    email: "staff@gmail.com",
    password:
      "fc1f6793e96e7be88d1fabb21494346f:67c468a2d816b2014225570f31961403f6b41fc5727c5eadaea70bbc987a72b881301d1d547a11d834e22c7d2270912abeba5a3bfe5ea82b19aa78ecf70bb4f2",
    full_name: "Halo Staff",
    role: "admin",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "usr-alex-creator",
    email: "alex@halo.bio",
    password:
      "569ab796e402513136a01c53e95acbe0:49f9e90694aec90639ea2975ef2010c33cd6b7a41b2ad3f6d834759fdde4c64b7ca701662aa6d3d9e7fe8f2bb535776f594ef15a31d8a6b228a5b0ae51669781",
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
    enter_text: "Click To Enter",
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
    enter_text: "Click To Enter",
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

const DATA_DIR = path.resolve(process.cwd(), "data");
const DATA_FILE = path.resolve(DATA_DIR, "halo_db.json");

const memoryServerStore: ServerData = {
  users: [...SEED_USERS],
  profiles: [...SEED_PROFILES],
  links: [...SEED_LINKS],
  sessions: [],
  viewed_ips: {},
  view_cooldowns: {},
  click_cooldowns: {},
};

let isStoreLoaded = false;

function ensureLoaded(): ServerData {
  if (!isStoreLoaded) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, "utf-8");
        const parsed = JSON.parse(raw) as Partial<ServerData>;
        memoryServerStore.users = parsed.users?.length
          ? parsed.users
          : [...SEED_USERS];
        memoryServerStore.profiles = parsed.profiles?.length
          ? parsed.profiles
          : [...SEED_PROFILES];
        memoryServerStore.links = parsed.links?.length
          ? parsed.links
          : [...SEED_LINKS];
        memoryServerStore.sessions = Array.isArray(parsed.sessions)
          ? parsed.sessions
          : [];
        memoryServerStore.viewed_ips = parsed.viewed_ips || {};
        memoryServerStore.view_cooldowns = parsed.view_cooldowns || {};
        memoryServerStore.click_cooldowns = parsed.click_cooldowns || {};

        // Migrate any unhashed passwords for staff/alex
        let upgraded = false;
        for (const u of memoryServerStore.users) {
          if (u.password === "password123") {
            u.password = hashPasswordServer("password123");
            upgraded = true;
          }
        }
        if (upgraded) {
          persist();
        }
      } else {
        persist();
      }
    } catch (err) {
      console.warn("Could not read/write server data file:", err);
    }
    isStoreLoaded = true;
  }
  return memoryServerStore;
}

function persist() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify(memoryServerStore, null, 2),
      "utf-8",
    );
  } catch (err) {
    console.warn("Failed to persist server store to disk:", err);
  }
}

export const RESERVED_SYSTEM_NAMES = new Set([
  "api",
  "dashboard",
  "claim",
  "auth",
  "admin",
  "settings",
  "profile",
  "halo",
  "root",
  "system",
  "login",
  "signup",
  "logout",
  "help",
  "support",
  "terms",
  "privacy",
]);

function sanitizeSafeUrl(url: string | null | undefined): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (/^(javascript|vbscript|file):/i.test(trimmed)) {
    return "";
  }
  if (trimmed.startsWith("data:") && !trimmed.startsWith("data:image/")) {
    return "";
  }
  return trimmed;
}

export const serverStorage = {
  // Session Management
  createSession(userId: string, role: "admin" | "user"): ServerSession {
    const data = ensureLoaded();
    const token = generateSessionToken();
    const now = new Date();
    const expiresAt = new Date(
      now.getTime() + 7 * 24 * 60 * 60 * 1000,
    ).toISOString();

    const session: ServerSession = {
      token,
      user_id: userId,
      role,
      created_at: now.toISOString(),
      expires_at: expiresAt,
    };

    data.sessions.push(session);
    persist();
    return session;
  },

  getSession(token: string): ServerSession | null {
    if (!token) return null;
    const data = ensureLoaded();
    const idx = data.sessions.findIndex((s) => s.token === token);
    if (idx < 0) return null;

    const session = data.sessions[idx];
    if (new Date(session.expires_at).getTime() <= Date.now()) {
      // Session expired, clean it up
      data.sessions.splice(idx, 1);
      persist();
      return null;
    }
    return session;
  },

  revokeSession(token: string): boolean {
    const data = ensureLoaded();
    const initialLen = data.sessions.length;
    data.sessions = data.sessions.filter((s) => s.token !== token);
    if (data.sessions.length !== initialLen) {
      persist();
      return true;
    }
    return false;
  },

  revokeAllUserSessions(userId: string): void {
    const data = ensureLoaded();
    data.sessions = data.sessions.filter((s) => s.user_id !== userId);
    persist();
  },

  // User Management
  getUserById(id: string): StoredUser | null {
    const data = ensureLoaded();
    return data.users.find((u) => u.id === id) || null;
  },

  getUserByEmail(email: string): StoredUser | null {
    const data = ensureLoaded();
    const clean = email.toLowerCase().trim();
    return data.users.find((u) => u.email.toLowerCase() === clean) || null;
  },

  createUser(params: {
    email: string;
    passwordHash: string;
    full_name: string;
    role?: "admin" | "user";
  }): { user: StoredUser; profile: Profile } {
    const data = ensureLoaded();
    const cleanEmail = params.email.toLowerCase().trim();
    const userId = "usr-" + Math.random().toString(36).substring(2, 10);
    const role: "admin" | "user" =
      params.role || (cleanEmail === "staff@gmail.com" ? "admin" : "user");
    const now = new Date().toISOString();

    const user: StoredUser = {
      id: userId,
      email: cleanEmail,
      password: params.passwordHash,
      full_name: params.full_name || cleanEmail.split("@")[0] || "User",
      role,
      created_at: now,
    };

    const profile: Profile = {
      id: userId,
      username: null,
      display_name: user.full_name,
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
      enter_text: "Click To Enter",
      is_premium: false,
      is_banned: false,
      is_flagged: false,
      views: 0,
      created_at: now,
    };

    data.users.push(user);
    data.profiles.push(profile);
    persist();

    return { user, profile };
  },

  updateUserPassword(userId: string, newPasswordHash: string): boolean {
    const data = ensureLoaded();
    const user = data.users.find((u) => u.id === userId);
    if (!user) return false;

    user.password = newPasswordHash;
    persist();
    return true;
  },

  updateUserRole(userId: string, newRole: "admin" | "user"): boolean {
    const data = ensureLoaded();
    const user = data.users.find((u) => u.id === userId);
    if (!user) return false;

    user.role = newRole;
    // Update active sessions for this user
    for (const s of data.sessions) {
      if (s.user_id === userId) {
        s.role = newRole;
      }
    }
    persist();
    return true;
  },

  // Safe Store Data Scoping
  getCallerStore(
    userId: string,
    isAdmin: boolean,
  ): {
    myProfile: Profile | null;
    myLinks: BioLink[];
    publicProfiles: PublicProfile[];
  } {
    const data = ensureLoaded();
    const myProfile = data.profiles.find((p) => p.id === userId) || null;
    const myLinks = data.links
      .filter((l) => l.user_id === userId)
      .sort((a, b) => a.position - b.position);

    // Return only sanitized public fields for other profiles — NEVER password or email!
    const publicProfiles: PublicProfile[] = data.profiles
      .filter((p) => (isAdmin ? true : !p.is_banned))
      .map((p) => ({
        id: p.id,
        username: p.username,
        display_name: p.display_name,
        bio: p.bio,
        avatar_url: p.avatar_url,
        background_type: p.background_type,
        background_value: p.background_value,
        card_opacity: p.card_opacity,
        card_radius: p.card_radius,
        card_blur: p.card_blur,
        accent_color: p.accent_color,
        music_url: p.music_url,
        music_enabled: p.music_enabled,
        enter_text: p.enter_text,
        is_premium: p.is_premium,
        is_banned: isAdmin ? p.is_banned : undefined,
        is_flagged: isAdmin ? p.is_flagged : undefined,
        views: p.views,
        created_at: p.created_at,
        updated_at: p.updated_at,
      }));

    return { myProfile, myLinks, publicProfiles };
  },

  getAllProfilesAdmin(isAdmin: boolean): Profile[] | null {
    if (!isAdmin) return null;
    const data = ensureLoaded();
    // Return all profiles with moderation flags, sorted by creation date
    return [...data.profiles].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  },

  adminMutateProfile(
    targetUserId: string,
    changes: Partial<Profile>,
  ): { success: boolean; error?: string } {
    const data = ensureLoaded();
    const profile = data.profiles.find((p) => p.id === targetUserId);
    if (!profile) return { success: false, error: "Profile not found" };

    if (typeof changes.is_premium === "boolean")
      profile.is_premium = changes.is_premium;
    if (typeof changes.is_banned === "boolean")
      profile.is_banned = changes.is_banned;
    if (typeof changes.is_flagged === "boolean")
      profile.is_flagged = changes.is_flagged;
    if (changes.avatar_url === null) profile.avatar_url = null;
    if (changes.bio !== undefined)
      profile.bio = String(changes.bio || "").slice(0, 500);

    profile.updated_at = new Date().toISOString();
    persist();
    return { success: true };
  },

  adminDeleteProfile(targetUserId: string): {
    success: boolean;
    error?: string;
  } {
    const data = ensureLoaded();
    const profIdx = data.profiles.findIndex((p) => p.id === targetUserId);
    if (profIdx < 0) return { success: false, error: "Profile not found" };

    data.profiles.splice(profIdx, 1);
    data.links = data.links.filter((l) => l.user_id !== targetUserId);
    persist();
    return { success: true };
  },

  isUsernameAvailable(
    username: string,
    currentUserId?: string,
  ): { available: boolean; reason?: string } {
    const data = ensureLoaded();
    const clean = username.toLowerCase().trim();

    if (!clean) return { available: false, reason: "Username cannot be empty" };
    if (clean.length < 3)
      return {
        available: false,
        reason: "Username must be at least 3 characters",
      };
    if (clean.length > 20)
      return {
        available: false,
        reason: "Username cannot exceed 20 characters",
      };
    if (!/^[a-z0-9_.]{3,20}$/.test(clean)) {
      return {
        available: false,
        reason: "Only lowercase letters, numbers, underscores and dots allowed",
      };
    }
    if (RESERVED_SYSTEM_NAMES.has(clean)) {
      return {
        available: false,
        reason: "This handle is reserved by the system",
      };
    }

    const conflict = data.profiles.find(
      (p) =>
        p.username &&
        p.username.toLowerCase() === clean &&
        p.id !== currentUserId,
    );

    if (conflict) {
      return {
        available: false,
        reason: `The handle @${clean} is already claimed by another user`,
      };
    }

    return { available: true };
  },

  claimUsername(
    userId: string,
    username: string,
  ): { success: boolean; username?: string; error?: string } {
    const data = ensureLoaded();
    const clean = username.toLowerCase().trim();

    const availability = this.isUsernameAvailable(clean, userId);
    if (!availability.available) {
      return {
        success: false,
        error: availability.reason || "Username is not available",
      };
    }

    let profile = data.profiles.find((p) => p.id === userId);
    if (profile) {
      profile.username = clean;
      profile.display_name = profile.display_name || clean;
      profile.updated_at = new Date().toISOString();
    } else {
      profile = {
        id: userId,
        username: clean,
        display_name: clean,
        bio: "",
        avatar_url: null,
        background_type: "color",
        background_value: "#0b0f19",
        card_opacity: 0.65,
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
        created_at: new Date().toISOString(),
      };
      data.profiles.push(profile);
    }

    persist();
    return { success: true, username: clean };
  },

  getProfile(username: string): { profile: Profile; links: BioLink[] } | null {
    const data = ensureLoaded();
    const clean = username.toLowerCase().trim();
    const profile = data.profiles.find(
      (p) => p.username && p.username.toLowerCase() === clean,
    );
    if (!profile) return null;
    const links = data.links
      .filter((l) => l.user_id === profile.id)
      .sort((a, b) => a.position - b.position);
    return { profile, links };
  },

  /**
   * Hardened sync endpoint.
   * STRICT ENFORCEMENT:
   * 1. Requires caller's userId.
   * 2. Regular users may ONLY sync profile/links matching their own userId.
   * 3. Regular users cannot alter is_premium, is_banned, is_flagged, or views.
   * 4. Users array payload is STRICTLY IGNORED AND FORBIDDEN.
   */
  syncUser(
    userId: string,
    isAdmin: boolean,
    payload: { profiles?: Profile[]; links?: BioLink[] },
  ): { success: boolean; error?: string } {
    const data = ensureLoaded();

    if (payload.profiles && Array.isArray(payload.profiles)) {
      payload.profiles.forEach((incoming) => {
        // Enforce ownership: non-admins can ONLY touch their own profile
        if (!isAdmin && incoming.id !== userId) {
          return;
        }

        const idx = data.profiles.findIndex((p) => p.id === incoming.id);
        if (idx >= 0) {
          const existing = data.profiles[idx];
          let safeUsername = existing.username;

          // If username is changing, ensure availability
          if (
            incoming.username &&
            incoming.username.toLowerCase() !== existing.username?.toLowerCase()
          ) {
            const avail = this.isUsernameAvailable(
              incoming.username,
              existing.id,
            );
            if (avail.available) {
              safeUsername = incoming.username.toLowerCase().trim();
            }
          }

          data.profiles[idx] = {
            ...existing,
            display_name: incoming.display_name
              ? String(incoming.display_name).slice(0, 100)
              : existing.display_name,
            bio:
              incoming.bio !== undefined
                ? String(incoming.bio || "").slice(0, 500)
                : existing.bio,
            avatar_url: sanitizeSafeUrl(incoming.avatar_url) || null,
            background_type: ["color", "image", "video"].includes(
              incoming.background_type,
            )
              ? incoming.background_type
              : existing.background_type,
            background_value:
              sanitizeSafeUrl(incoming.background_value) ||
              existing.background_value,
            card_opacity:
              typeof incoming.card_opacity === "number"
                ? Math.min(1, Math.max(0, incoming.card_opacity))
                : existing.card_opacity,
            card_radius:
              typeof incoming.card_radius === "number"
                ? Math.min(60, Math.max(0, incoming.card_radius))
                : existing.card_radius,
            card_blur:
              typeof incoming.card_blur === "number"
                ? Math.min(60, Math.max(0, incoming.card_blur))
                : existing.card_blur,
            accent_color:
              incoming.accent_color &&
              /^#[0-9a-fA-F]{3,8}$/.test(incoming.accent_color)
                ? incoming.accent_color
                : existing.accent_color,
            music_url: sanitizeSafeUrl(incoming.music_url) || null,
            music_enabled: Boolean(incoming.music_enabled),
            enter_text: incoming.enter_text
              ? String(incoming.enter_text).slice(0, 50)
              : existing.enter_text,
            // Privileged fields can ONLY be altered by admin
            is_premium:
              isAdmin && typeof incoming.is_premium === "boolean"
                ? incoming.is_premium
                : existing.is_premium,
            is_banned:
              isAdmin && typeof incoming.is_banned === "boolean"
                ? incoming.is_banned
                : existing.is_banned,
            is_flagged:
              isAdmin && typeof incoming.is_flagged === "boolean"
                ? incoming.is_flagged
                : existing.is_flagged,
            views: existing.views,
            username: safeUsername,
            updated_at: new Date().toISOString(),
          };
        }
      });
    }

    if (payload.links && Array.isArray(payload.links)) {
      // Filter links to ONLY those owned by the caller (or any if admin)
      const allowedIncoming = payload.links
        .filter((l) => (isAdmin ? true : l.user_id === userId))
        .map((l) => ({
          ...l,
          title: String(l.title || "Link").slice(0, 100),
          url: sanitizeSafeUrl(l.url) || "https://",
          clicks: typeof l.clicks === "number" ? l.clicks : 0,
        }));

      // Replace caller's links
      data.links = data.links
        .filter((l) => (isAdmin ? false : l.user_id !== userId))
        .concat(allowedIncoming);
    }

    persist();
    return { success: true };
  },

  /**
   * Records a unique view by IP address with a 12-hour per-IP cooldown.
   */
  recordView(
    username: string,
    ip: string,
  ): { success: boolean; counted: boolean; views: number; reason?: string } {
    const data = ensureLoaded();
    const clean = username.toLowerCase().trim();
    const profile = data.profiles.find(
      (p) => p.username && p.username.toLowerCase() === clean,
    );
    if (!profile) {
      return {
        success: false,
        counted: false,
        views: 0,
        reason: "profile_not_found",
      };
    }

    const cleanIp = (ip || "127.0.0.1").trim();
    const cooldownKey = `${cleanIp}:${clean}`;
    const now = Date.now();
    const lastView = data.view_cooldowns[cooldownKey] || 0;

    // 12-hour cooldown check
    if (now - lastView < 12 * 60 * 60 * 1000) {
      return {
        success: true,
        counted: false,
        views: profile.views || 0,
        reason: "cooldown_active",
      };
    }

    const viewedList = data.viewed_ips[clean] || [];
    if (viewedList.includes(cleanIp)) {
      // Already viewed by this IP previously
      data.view_cooldowns[cooldownKey] = now;
      return {
        success: true,
        counted: false,
        views: profile.views || 0,
        reason: "duplicate_ip",
      };
    }

    // Count new view
    viewedList.push(cleanIp);
    data.viewed_ips[clean] = viewedList;
    data.view_cooldowns[cooldownKey] = now;
    profile.views = (profile.views || 0) + 1;

    persist();

    return {
      success: true,
      counted: true,
      views: profile.views,
    };
  },

  /**
   * Records a link click with a 10-second cooldown per IP per link.
   */
  recordClick(
    linkId: string,
    ip: string,
  ): { success: boolean; clicks: number; counted: boolean } {
    const data = ensureLoaded();
    const link = data.links.find((l) => l.id === linkId);
    if (!link) {
      return { success: false, clicks: 0, counted: false };
    }

    const cleanIp = (ip || "127.0.0.1").trim();
    const cooldownKey = `${cleanIp}:${linkId}`;
    const now = Date.now();
    const lastClick = data.click_cooldowns[cooldownKey] || 0;

    if (now - lastClick < 10000) {
      return { success: true, clicks: link.clicks || 0, counted: false };
    }

    data.click_cooldowns[cooldownKey] = now;
    link.clicks = (link.clicks || 0) + 1;
    persist();
    return { success: true, clicks: link.clicks, counted: true };
  },

  getStats() {
    const data = ensureLoaded();
    const total_profiles = data.profiles.length;
    const active_profiles = data.profiles.filter(
      (p) => p.username && !p.is_banned,
    ).length;
    const total_views = data.profiles.reduce((a, b) => a + (b.views || 0), 0);
    const total_clicks = data.links.reduce((a, b) => a + (b.clicks || 0), 0);
    const total_links = data.links.length;

    return {
      total_profiles,
      active_profiles,
      total_views,
      total_clicks,
      total_links,
    };
  },
};

// Expose serverStorage globally in Node for SSR
if (typeof globalThis !== "undefined") {
  (
    globalThis as unknown as { __HALO_SERVER_STORE__: typeof serverStorage }
  ).__HALO_SERVER_STORE__ = serverStorage;
}
