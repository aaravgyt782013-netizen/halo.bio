import { generateSessionToken, hashPasswordServer } from "./crypto";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

// @ts-expect-error JSON config import
import firebaseConfig from "../../firebase-applet-config.json";

const app = initializeApp(firebaseConfig || {});
const db = getFirestore(app, firebaseConfig?.firestoreDatabaseId);

export type GlassIntensity = "subtle" | "medium" | "heavy" | "ultra";

export type SocialLink = {
  id: string;
  platform: string;
  url: string;
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
};

function sanitizeSafeUrl(url: string | null | undefined): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (/^(javascript|vbscript|file):/i.test(trimmed)) return "";
  if (
    trimmed.startsWith("data:") &&
    !trimmed.startsWith("data:image/") &&
    !trimmed.startsWith("data:audio/") &&
    !trimmed.startsWith("data:video/")
  ) {
    return "";
  }
  return trimmed;
}

// In-memory cooldowns to avoid database spam
const view_cooldowns: Record<string, number> = {};
const click_cooldowns: Record<string, number> = {};
const viewed_ips: Record<string, string[]> = {};

export const serverStorage = {
  async getUserByEmail(email: string): Promise<StoredUser | null> {
    const q = query(
      collection(db, "users"),
      where("email", "==", email.toLowerCase().trim()),
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs[0].data() as StoredUser;
  },

  async getUserById(id: string): Promise<StoredUser | null> {
    const snap = await getDoc(doc(db, "users", id));
    if (!snap.exists()) return null;
    return snap.data() as StoredUser;
  },

  async updateUserPassword(id: string, hash: string): Promise<boolean> {
    const ref = doc(db, "users", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return false;
    await updateDoc(ref, { password: hash });
    return true;
  },

  async updateUserRole(id: string, role: "admin" | "user"): Promise<boolean> {
    const ref = doc(db, "users", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return false;
    await updateDoc(ref, { role });
    return true;
  },

  async getSession(token: string): Promise<ServerSession | null> {
    const snap = await getDoc(doc(db, "sessions", token));
    if (!snap.exists()) return null;
    return snap.data() as ServerSession;
  },

  async createSession(
    userId: string,
    role: "admin" | "user",
  ): Promise<ServerSession> {
    const token = generateSessionToken();
    const session: ServerSession = { token, user_id: userId, role };
    await setDoc(doc(db, "sessions", token), session);
    return session;
  },

  async revokeSession(token: string): Promise<void> {
    await deleteDoc(doc(db, "sessions", token));
  },

  async isUsernameAvailable(
    username: string,
    excludeUserId?: string,
  ): Promise<{ available: boolean; reason?: string }> {
    const clean = username.toLowerCase().trim();
    if (!clean || clean.length < 3 || clean.length > 20)
      return { available: false, reason: "invalid_length" };
    if (!/^[a-z0-9_.]+$/.test(clean))
      return { available: false, reason: "invalid_chars" };

    const reserved = [
      "admin",
      "api",
      "login",
      "signup",
      "logout",
      "help",
      "support",
      "terms",
      "privacy",
    ];
    if (reserved.includes(clean))
      return { available: false, reason: "reserved" };

    const q = query(collection(db, "profiles"), where("username", "==", clean));
    const snap = await getDocs(q);
    if (snap.empty) return { available: true };
    if (excludeUserId && snap.docs[0].data().id === excludeUserId)
      return { available: true };
    return { available: false, reason: "taken" };
  },

  async createUser(params: {
    email: string;
    passwordHash: string;
    full_name: string;
    role?: "admin" | "user";
  }): Promise<{ user: StoredUser; profile: Profile }> {
    const cleanEmail = params.email.toLowerCase().trim();
    const userId = "usr-" + Math.random().toString(36).substring(2, 10);
    const role =
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

    await setDoc(doc(db, "users", userId), user);
    await setDoc(doc(db, "profiles", userId), profile);
    return { user, profile };
  },

  async claimUsername(
    userId: string,
    username: string,
  ): Promise<{ success: boolean; error?: string; username?: string }> {
    const clean = username.toLowerCase().trim();
    const avail = await this.isUsernameAvailable(clean, userId);
    if (!avail.available) {
      return {
        success: false,
        error: avail.reason === "taken" ? "Username taken" : "Invalid username",
      };
    }

    const snap = await getDoc(doc(db, "profiles", userId));
    if (!snap.exists()) return { success: false, error: "Profile not found" };

    const profile = snap.data() as Profile;
    profile.username = clean;
    await updateDoc(doc(db, "profiles", userId), { username: clean });
    return { success: true, username: clean };
  },

  async getProfile(
    username: string,
  ): Promise<{ profile: Profile; links: BioLink[] } | null> {
    const clean = username.toLowerCase().trim();
    const q = query(collection(db, "profiles"), where("username", "==", clean));
    const snap = await getDocs(q);
    if (snap.empty) return null;

    const profile = snap.docs[0].data() as Profile;
    const lq = query(
      collection(db, "links"),
      where("user_id", "==", profile.id),
    );
    const lsnap = await getDocs(lq);
    const links = lsnap.docs
      .map((d) => d.data() as BioLink)
      .sort((a, b) => a.position - b.position);

    return { profile, links };
  },

  async syncUser(
    userId: string,
    isAdmin: boolean,
    payload: { profiles?: Profile[]; links?: BioLink[] },
  ): Promise<{ success: boolean; error?: string }> {
    if (payload.profiles && Array.isArray(payload.profiles)) {
      for (const incoming of payload.profiles) {
        if (!isAdmin && incoming.id !== userId) continue;

        const snap = await getDoc(doc(db, "profiles", incoming.id));
        const nowIso = new Date().toISOString();
        if (snap.exists()) {
          const existing = snap.data() as Profile;
          let safeUsername = existing.username;
          if (
            incoming.username &&
            incoming.username.toLowerCase() !== existing.username?.toLowerCase()
          ) {
            const avail = await this.isUsernameAvailable(
              incoming.username,
              existing.id,
            );
            if (avail.available)
              safeUsername = incoming.username.toLowerCase().trim();
          }

          const bgType = ["color", "image", "video"].includes(
            incoming.background_type,
          )
            ? incoming.background_type
            : existing.background_type;

          let bgValue = existing.background_value;
          if (bgType === "color") {
            bgValue =
              incoming.background_value &&
              /^#[0-9a-fA-F]{3,8}$/.test(incoming.background_value)
                ? incoming.background_value
                : existing.background_value || "#0b0f19";
          } else if (incoming.background_value) {
            bgValue = sanitizeSafeUrl(incoming.background_value) || bgValue;
          }

          const validIntensities = [
            "subtle",
            "medium",
            "heavy",
            "ultra",
          ] as const;
          const glassIntensity = validIntensities.includes(
            incoming.glass_intensity as GlassIntensity,
          )
            ? incoming.glass_intensity
            : existing.glass_intensity || "medium";

          let socialLinks: SocialLink[] = existing.social_links || [];
          if (Array.isArray(incoming.social_links)) {
            socialLinks = incoming.social_links
              .filter(
                (s) =>
                  s &&
                  typeof s.platform === "string" &&
                  typeof s.url === "string" &&
                  s.url.trim().length > 0,
              )
              .slice(0, 25)
              .map((s) => ({
                id: String(s.id || Math.random().toString(36).substring(2, 9)),
                platform: String(s.platform).slice(0, 30),
                url: sanitizeSafeUrl(s.url),
                active: s.active !== false,
              }));
          }

          const updated: Profile = {
            ...existing,
            display_name:
              incoming.display_name !== undefined
                ? String(incoming.display_name).slice(0, 100)
                : existing.display_name,
            bio:
              incoming.bio !== undefined
                ? String(incoming.bio || "").slice(0, 500)
                : existing.bio,
            avatar_url:
              incoming.avatar_url !== undefined
                ? sanitizeSafeUrl(incoming.avatar_url) || null
                : existing.avatar_url,
            background_type: bgType,
            background_value: bgValue,
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
            glass_intensity: glassIntensity,
            social_links: socialLinks,
            accent_color:
              incoming.accent_color &&
              /^#[0-9a-fA-F]{3,8}$/.test(incoming.accent_color)
                ? incoming.accent_color
                : existing.accent_color,
            music_url:
              incoming.music_url !== undefined
                ? sanitizeSafeUrl(incoming.music_url) || null
                : existing.music_url,
            music_enabled: Boolean(incoming.music_enabled),
            enter_text: incoming.enter_text
              ? String(incoming.enter_text).slice(0, 50)
              : existing.enter_text || "Click to Enter",
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
            views: existing.views || 0,
            username: safeUsername,
            updated_at: nowIso,
          };
          try {
            await setDoc(doc(db, "profiles", incoming.id), updated);
          } catch (err: unknown) {
            const msg =
              err instanceof Error ? err.message : "Failed to update profile";
            return { success: false, error: msg };
          }
        } else {
          // Document does not exist yet; initialize it
          const initial: Profile = {
            id: incoming.id,
            username: incoming.username
              ? incoming.username.toLowerCase().trim()
              : null,
            display_name: incoming.display_name
              ? String(incoming.display_name).slice(0, 100)
              : "User",
            bio: incoming.bio ? String(incoming.bio).slice(0, 500) : "",
            avatar_url: sanitizeSafeUrl(incoming.avatar_url) || null,
            background_type: ["color", "image", "video"].includes(
              incoming.background_type,
            )
              ? incoming.background_type
              : "color",
            background_value: incoming.background_value || "#0b0f19",
            card_opacity:
              typeof incoming.card_opacity === "number"
                ? incoming.card_opacity
                : 0.65,
            card_radius:
              typeof incoming.card_radius === "number"
                ? incoming.card_radius
                : 24,
            card_blur:
              typeof incoming.card_blur === "number" ? incoming.card_blur : 20,
            glass_intensity:
              typeof incoming.glass_intensity === "string" &&
              ["subtle", "medium", "heavy", "ultra"].includes(
                incoming.glass_intensity,
              )
                ? (incoming.glass_intensity as GlassIntensity)
                : "medium",
            social_links: Array.isArray(incoming.social_links)
              ? incoming.social_links.slice(0, 25)
              : [],
            accent_color: incoming.accent_color || "#3b82f6",
            music_url: sanitizeSafeUrl(incoming.music_url) || null,
            music_enabled: Boolean(incoming.music_enabled),
            enter_text: incoming.enter_text || "Click to Enter",
            is_premium: false,
            is_banned: false,
            is_flagged: false,
            views: 0,
            created_at: nowIso,
            updated_at: nowIso,
          };
          try {
            await setDoc(doc(db, "profiles", incoming.id), initial);
          } catch (err: unknown) {
            const msg =
              err instanceof Error ? err.message : "Failed to create profile";
            return { success: false, error: msg };
          }
        }
      }
    }

    if (payload.links && Array.isArray(payload.links)) {
      try {
        const allowedIncoming = payload.links
          .filter((l) => (isAdmin ? true : l.user_id === userId))
          .map((l) => ({
            ...l,
            title: String(l.title || "Link").slice(0, 100),
            url: sanitizeSafeUrl(l.url) || "https://",
            clicks: typeof l.clicks === "number" ? l.clicks : 0,
          }));

        const q = query(
          collection(db, "links"),
          where("user_id", "==", userId),
        );
        const existingSnaps = await getDocs(q);

        // Delete old links
        for (const d of existingSnaps.docs) await deleteDoc(d.ref);

        // Set new links
        for (const l of allowedIncoming) {
          if (!l.id)
            l.id = "lnk-" + Math.random().toString(36).substring(2, 10);
          await setDoc(doc(db, "links", l.id), l);
        }
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Failed to update links";
        return { success: false, error: msg };
      }
    }

    return { success: true };
  },

  async recordView(
    username: string,
    ip: string,
  ): Promise<{
    success: boolean;
    counted: boolean;
    views: number;
    reason?: string;
  }> {
    const clean = username.toLowerCase().trim();
    const q = query(collection(db, "profiles"), where("username", "==", clean));
    const snap = await getDocs(q);
    if (snap.empty)
      return {
        success: false,
        counted: false,
        views: 0,
        reason: "profile_not_found",
      };

    const profile = snap.docs[0].data() as Profile;
    const cleanIp = (ip || "127.0.0.1").trim();
    const cooldownKey = `${cleanIp}:${clean}`;
    const now = Date.now();
    const lastView = view_cooldowns[cooldownKey] || 0;

    if (now - lastView < 12 * 60 * 60 * 1000) {
      return {
        success: true,
        counted: false,
        views: profile.views || 0,
        reason: "cooldown_active",
      };
    }

    const vl = viewed_ips[clean] || [];
    if (vl.includes(cleanIp)) {
      view_cooldowns[cooldownKey] = now;
      return {
        success: true,
        counted: false,
        views: profile.views || 0,
        reason: "duplicate_ip",
      };
    }

    vl.push(cleanIp);
    viewed_ips[clean] = vl;
    view_cooldowns[cooldownKey] = now;

    const newViews = (profile.views || 0) + 1;
    await updateDoc(snap.docs[0].ref, { views: newViews });

    return { success: true, counted: true, views: newViews };
  },

  async recordClick(
    linkId: string,
    ip: string,
  ): Promise<{ success: boolean; clicks: number; counted: boolean }> {
    const snap = await getDoc(doc(db, "links", linkId));
    if (!snap.exists()) return { success: false, clicks: 0, counted: false };

    const link = snap.data() as BioLink;
    const cleanIp = (ip || "127.0.0.1").trim();
    const cooldownKey = `${cleanIp}:${linkId}`;
    const now = Date.now();
    const lastClick = click_cooldowns[cooldownKey] || 0;

    if (now - lastClick < 10000) {
      return { success: true, clicks: link.clicks || 0, counted: false };
    }

    click_cooldowns[cooldownKey] = now;
    const newClicks = (link.clicks || 0) + 1;
    await updateDoc(snap.ref, { clicks: newClicks });

    return { success: true, clicks: newClicks, counted: true };
  },

  async getStats(): Promise<{
    total_profiles: number;
    active_profiles: number;
    total_views: number;
    total_clicks: number;
    total_links: number;
  }> {
    const pSnap = await getDocs(collection(db, "profiles"));
    const lSnap = await getDocs(collection(db, "links"));

    const profiles = pSnap.docs.map((d) => d.data() as Profile);
    const links = lSnap.docs.map((d) => d.data() as BioLink);

    return {
      total_profiles: profiles.length,
      active_profiles: profiles.filter((p) => p.username && !p.is_banned)
        .length,
      total_views: profiles.reduce((a, b) => a + (b.views || 0), 0),
      total_clicks: links.reduce((a, b) => a + (b.clicks || 0), 0),
      total_links: links.length,
    };
  },

  async getCallerStore(
    userId: string,
    isAdmin: boolean,
  ): Promise<{
    myProfile: Profile | null;
    myLinks: BioLink[];
    publicProfiles: Profile[];
  }> {
    let myProfile: Profile | null = null;
    let myLinks: BioLink[] = [];

    const snap = await getDoc(doc(db, "profiles", userId));
    if (snap.exists()) myProfile = snap.data() as Profile;

    const lq = query(collection(db, "links"), where("user_id", "==", userId));
    const lSnap = await getDocs(lq);
    myLinks = lSnap.docs
      .map((d) => d.data() as BioLink)
      .sort((a, b) => a.position - b.position);

    const pubSnap = await getDocs(collection(db, "profiles"));
    const publicProfiles = pubSnap.docs
      .map((d) => d.data() as Profile)
      .filter((p) => p.username && !p.is_banned);

    return { myProfile, myLinks, publicProfiles };
  },

  async getAllProfilesAdmin(includeBanned: boolean): Promise<Profile[]> {
    const snap = await getDocs(collection(db, "profiles"));
    let profiles = snap.docs.map((d) => d.data() as Profile);
    if (!includeBanned) profiles = profiles.filter((p) => !p.is_banned);
    return profiles;
  },

  async adminMutateProfile(
    userId: string,
    updates: Partial<Profile>,
  ): Promise<{ success: boolean }> {
    const snap = await getDoc(doc(db, "profiles", userId));
    if (!snap.exists()) return { success: false };
    await updateDoc(snap.ref, updates);
    return { success: true };
  },

  async adminDeleteProfile(userId: string): Promise<{ success: boolean }> {
    const snap = await getDoc(doc(db, "profiles", userId));
    if (!snap.exists()) return { success: false };

    // delete profile
    await deleteDoc(snap.ref);
    // delete user
    await deleteDoc(doc(db, "users", userId));
    // delete links
    const lq = query(collection(db, "links"), where("user_id", "==", userId));
    const lSnap = await getDocs(lq);
    for (const d of lSnap.docs) await deleteDoc(d.ref);

    return { success: true };
  },
};
