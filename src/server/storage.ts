import fs from "node:fs";
import path from "node:path";
import type { Profile, BioLink, StoredUser } from "../lib/bio";

export type ServerData = {
  users: StoredUser[];
  profiles: Profile[];
  links: BioLink[];
  viewed_ips: Record<string, string[]>; // username -> array of IP addresses that viewed
};

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
  viewed_ips: {},
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
        memoryServerStore.viewed_ips = parsed.viewed_ips || {};
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
  "login",
  "signup",
  "register",
  "settings",
  "admin",
  "staff",
  "help",
  "support",
  "terms",
  "privacy",
  "static",
  "assets",
  "favicon",
  "robots",
]);

export const serverStorage = {
  getData(): ServerData {
    return ensureLoaded();
  },

  isUsernameAvailable(
    username: string,
    excludeUserId?: string,
  ): { available: boolean; reason?: string } {
    const data = ensureLoaded();
    const clean = username.toLowerCase().trim();

    if (!clean || clean.length < 3 || clean.length > 30) {
      return { available: false, reason: "Username must be 3-30 characters." };
    }

    if (!/^[a-z0-9_.-]+$/.test(clean)) {
      return {
        available: false,
        reason:
          "Only lowercase letters, numbers, underscores, dashes, and dots allowed.",
      };
    }

    // System reserved keywords (unless it is the existing staff seed user for 'halo')
    if (RESERVED_SYSTEM_NAMES.has(clean)) {
      const existingOwner = data.profiles.find(
        (p) => p.username && p.username.toLowerCase() === clean,
      );
      if (!existingOwner || existingOwner.id !== excludeUserId) {
        return {
          available: false,
          reason: "This username is reserved for system routes.",
        };
      }
    }

    // Check if another profile already owns this username
    const existing = data.profiles.find(
      (p) =>
        p.username &&
        p.username.toLowerCase() === clean &&
        p.id !== excludeUserId,
    );

    if (existing) {
      return {
        available: false,
        reason: "This username is already reserved by another user.",
      };
    }

    return { available: true };
  },

  claimUsername(
    userId: string,
    username: string,
  ): { success: boolean; error?: string; username?: string } {
    const data = ensureLoaded();
    const clean = username.toLowerCase().trim();

    const check = this.isUsernameAvailable(clean, userId);
    if (!check.available) {
      return {
        success: false,
        error:
          check.reason || "This username is already taken by another user.",
      };
    }

    let profile = data.profiles.find((p) => p.id === userId);
    if (profile) {
      profile.username = clean;
      if (!profile.display_name) profile.display_name = clean;
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

  sync(payload: Partial<ServerData>): { success: boolean } {
    const data = ensureLoaded();
    if (payload.profiles && Array.isArray(payload.profiles)) {
      // Merge or replace profiles with strict username collision prevention
      payload.profiles.forEach((incoming) => {
        const idx = data.profiles.findIndex((p) => p.id === incoming.id);
        if (idx >= 0) {
          let safeUsername = incoming.username;
          if (safeUsername) {
            const conflict = data.profiles.find(
              (p) =>
                p.id !== incoming.id &&
                p.username &&
                p.username.toLowerCase() === safeUsername?.toLowerCase(),
            );
            if (conflict) {
              // Preserve the original owner's username
              safeUsername = data.profiles[idx].username;
            }
          }
          data.profiles[idx] = {
            ...data.profiles[idx],
            ...incoming,
            username: safeUsername,
          };
        } else {
          let safeUsername = incoming.username;
          if (safeUsername) {
            const conflict = data.profiles.find(
              (p) =>
                p.username &&
                p.username.toLowerCase() === safeUsername?.toLowerCase(),
            );
            if (conflict) {
              safeUsername = null;
            }
          }
          data.profiles.push({ ...incoming, username: safeUsername });
        }
      });
    }

    if (payload.links && Array.isArray(payload.links)) {
      // Group incoming links by user_id to replace each user's links cleanly
      const userIds = Array.from(new Set(payload.links.map((l) => l.user_id)));
      if (userIds.length > 0) {
        data.links = data.links.filter((l) => !userIds.includes(l.user_id));
        data.links.push(...payload.links);
      }
    }

    if (payload.users && Array.isArray(payload.users)) {
      payload.users.forEach((incoming) => {
        const idx = data.users.findIndex((u) => u.id === incoming.id);
        if (idx >= 0) {
          data.users[idx] = { ...data.users[idx], ...incoming };
        } else {
          data.users.push(incoming);
        }
      });
    }

    persist();
    return { success: true };
  },

  /**
   * Records a unique view by IP address.
   * Only 1 view per IP per profile username is counted!
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
    const viewedList = data.viewed_ips[clean] || [];

    // Check if this IP has already viewed this profile
    if (viewedList.includes(cleanIp)) {
      return {
        success: true,
        counted: false,
        views: profile.views || 0,
        reason: "duplicate_ip",
      };
    }

    // Record unique view
    viewedList.push(cleanIp);
    data.viewed_ips[clean] = viewedList;
    profile.views = (profile.views || 0) + 1;

    persist();

    return {
      success: true,
      counted: true,
      views: profile.views,
    };
  },

  recordClick(linkId: string): { success: boolean; clicks: number } {
    const data = ensureLoaded();
    const link = data.links.find((l) => l.id === linkId);
    if (link) {
      link.clicks = (link.clicks || 0) + 1;
      persist();
      return { success: true, clicks: link.clicks };
    }
    return { success: false, clicks: 0 };
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
