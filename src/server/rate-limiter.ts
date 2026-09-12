import { hashPasswordServer } from "./crypto";
import { serverStorage, type Profile } from "./storage";

type RateLimitRecord = {
  count: number;
  resetAt: number;
};

const rateLimitMap = new Map<string, RateLimitRecord>();

// Cleanup expired buckets every minute
if (typeof setInterval !== "undefined") {
  const timer = setInterval(() => {
    const now = Date.now();
    rateLimitMap.forEach((record, key) => {
      if (record.resetAt <= now) {
        rateLimitMap.delete(key);
      }
    });
  }, 60000);
  if (timer.unref) {
    timer.unref();
  }
}

/**
 * Checks if a given identifier has exceeded the allowed request limit within the window.
 * @param key unique bucket key (e.g., `ip:route`)
 * @param limit max allowed requests in window
 * @param windowMs window duration in milliseconds
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || record.resetAt <= now) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  if (record.count < limit) {
    record.count++;
    return { allowed: true, retryAfter: 0 };
  }

  const retryAfter = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
  return { allowed: false, retryAfter };
}

/**
 * Extend the existing admin profile mutation endpoint with a password-only
 * operation. This keeps password hashing server-side and never stores a
 * plaintext password in a profile document.
 */
type AdminPasswordRequest = {
  email: string;
  password: string;
};

type AdminMutation = Partial<Profile> & {
  __adminPassword?: AdminPasswordRequest;
};

const originalAdminMutateProfile = serverStorage.adminMutateProfile.bind(serverStorage);
serverStorage.adminMutateProfile = async (userId: string, updates: Partial<Profile>) => {
  const mutation = updates as AdminMutation;
  const passwordRequest = mutation.__adminPassword;

  if (passwordRequest) {
    const email = String(passwordRequest.email || "").trim().toLowerCase();
    const password = String(passwordRequest.password || "");

    if (!email || !email.includes("@")) {
      return { success: false, error: "Please enter a valid user email" };
    }
    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long" };
    }
    if (password.length > 128) {
      return { success: false, error: "Password exceeds maximum length" };
    }

    const targetUser = await serverStorage.getUserByEmail(email);
    if (!targetUser || targetUser.id !== userId) {
      return { success: false, error: "Email does not match the selected member" };
    }

    const newHash = hashPasswordServer(password);
    const changed = await serverStorage.updateUserPassword(targetUser.id, newHash);
    if (!changed) {
      return { success: false, error: "Could not update the user's password" };
    }
  }

  const { __adminPassword: _ignored, ...profileChanges } = mutation;
  return originalAdminMutateProfile(userId, profileChanges);
};
