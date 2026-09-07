import crypto from "node:crypto";

const PBKDF2_ITERATIONS = 100000;
const PBKDF2_KEYLEN = 64;
const PBKDF2_DIGEST = "sha512";

/**
 * Computes a secure PBKDF2-SHA512 hash with a cryptographically random salt.
 * Output format: `<salt_hex>:<hash_hex>`
 */
export function hashPasswordServer(
  password: string,
  customSalt?: string,
): string {
  const salt = customSalt || crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.pbkdf2Sync(
    password,
    salt,
    PBKDF2_ITERATIONS,
    PBKDF2_KEYLEN,
    PBKDF2_DIGEST,
  );
  return `${salt}:${derivedKey.toString("hex")}`;
}

/**
 * Verifies a plaintext password against a stored hash.
 * Only accepts valid salt:hash format or safely upgrades legacy SHA-256 hashes.
 * STRICTLY NO PLAINTEXT FALLBACK - plain strings will never authenticate.
 */
export function verifyPasswordServer(
  plainInput: string,
  storedRecord: string,
): { valid: boolean; needsRehash: boolean } {
  if (!plainInput || !storedRecord) {
    return { valid: false, needsRehash: false };
  }

  // 1. Check PBKDF2 format (salt:hash)
  if (storedRecord.includes(":")) {
    const parts = storedRecord.split(":");
    if (parts.length !== 2) return { valid: false, needsRehash: false };

    const [salt, hash] = parts;
    if (!salt || !hash) return { valid: false, needsRehash: false };

    try {
      const derivedKey = crypto.pbkdf2Sync(
        plainInput,
        salt,
        PBKDF2_ITERATIONS,
        PBKDF2_KEYLEN,
        PBKDF2_DIGEST,
      );
      const derivedBuffer = Buffer.from(derivedKey.toString("hex"), "hex");
      const hashBuffer = Buffer.from(hash, "hex");

      if (derivedBuffer.length !== hashBuffer.length) {
        return { valid: false, needsRehash: false };
      }

      const match = crypto.timingSafeEqual(derivedBuffer, hashBuffer);
      return { valid: match, needsRehash: false };
    } catch {
      return { valid: false, needsRehash: false };
    }
  }

  // 2. Backward compatibility for temporary sha256 with salt prefix
  if (storedRecord.length === 64) {
    try {
      const legacyHash = crypto
        .createHash("sha256")
        .update("halo_salt_2026_" + plainInput)
        .digest("hex");

      const a = Buffer.from(legacyHash, "hex");
      const b = Buffer.from(storedRecord, "hex");
      if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
        return { valid: true, needsRehash: true };
      }
    } catch {
      // ignore
    }
  }

  // Under NO circumstances do we compare plainInput === storedRecord!
  return { valid: false, needsRehash: false };
}

/**
 * Generates a cryptographically strong session token.
 */
export function generateSessionToken(): string {
  return `${crypto.randomUUID()}.${crypto.randomBytes(32).toString("hex")}`;
}
