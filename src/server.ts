import "./lib/error-capture";

import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { serverStorage } from "./server/storage";
import { checkRateLimit } from "./server/rate-limiter";
import { hashPasswordServer, verifyPasswordServer } from "./server/crypto";
// @ts-expect-error JSON config import
import fbConfig from "../firebase-applet-config.json";

type ServerEntry = {
  fetch: (
    request: Request,
    env: unknown,
    ctx: unknown,
  ) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise =
      // @ts-expect-error Dynamic import of TanStack Start server entry
      import("@tanstack/react-start/server-entry").then(
        (m) => (m.default ?? m) as ServerEntry,
      );
  }
  return serverEntryPromise;
}

function jsonResponse(
  data: unknown,
  status = 200,
  extraHeaders: Record<string, string> = {},
) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...extraHeaders,
    },
  });
}

function getClientIp(request: Request): string {
  const xForwarded = request.headers.get("x-forwarded-for");
  if (xForwarded) {
    return xForwarded.split(",")[0].trim();
  }
  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "127.0.0.1"
  );
}

function parseCookies(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) return {};
  const cookies: Record<string, string> = {};
  const pairs = cookieHeader.split(";");
  for (const pair of pairs) {
    const idx = pair.indexOf("=");
    if (idx > 0) {
      const key = pair.slice(0, idx).trim();
      const val = pair.slice(idx + 1).trim();
      try {
        cookies[key] = decodeURIComponent(val);
      } catch {
        cookies[key] = val;
      }
    }
  }
  return cookies;
}

export async function getSessionFromRequest(
  request: Request,
): Promise<{ token: string; userId: string; role: "admin" | "user" } | null> {
  const cookieHeader = request.headers.get("cookie");
  const cookies = parseCookies(cookieHeader);
  const token = cookies["halo_session"];
  if (!token) return null;

  const session = await serverStorage.getSession(token);
  if (!session) return null;

  return {
    token: session.token,
    userId: session.user_id,
    role: session.role,
  };
}

function createSessionCookie(
  token: string,
  request: Request,
  maxAge = 604800,
): string {
  const url = new URL(request.url);
  const isSecure =
    url.protocol === "https:" ||
    request.headers.get("x-forwarded-proto") === "https";
  let cookie = `halo_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`;
  if (isSecure) {
    cookie += "; Secure";
  }
  return cookie;
}

function clearSessionCookie(request: Request): string {
  const url = new URL(request.url);
  const isSecure =
    url.protocol === "https:" ||
    request.headers.get("x-forwarded-proto") === "https";
  let cookie = `halo_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
  if (isSecure) {
    cookie += "; Secure";
  }
  return cookie;
}

// In-memory failed logins for brute-force prevention
const failedLogins = new Map<string, { count: number; lockedUntil: number }>();

// h3 error normalization
async function normalizeCatastrophicSsrResponse(
  response: Response,
): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(
    consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`),
  );
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as {
      unhandled?: unknown;
      message?: unknown;
    };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

// Expose server storage to TanStack Start SSR loaders
(
  globalThis as unknown as {
    __HALO_SERVER_STORE__: {
      getProfile: (
        username: string,
      ) => Promise<{ profile: Profile; links: BioLink[] } | null>;
    };
  }
).__HALO_SERVER_STORE__ = {
  getProfile: (username: string) => serverStorage.getProfile(username),
};

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);

      // Handle custom API endpoints
      if (url.pathname.startsWith("/api/")) {
        const clientIp = getClientIp(request);
        const method = request.method.toUpperCase();

        // Handle direct media streaming (supports HTTP Range 206 for video buffering and seeking)
        if (url.pathname.startsWith("/api/media/") && method === "GET") {
          const rawName = url.pathname.slice("/api/media/".length);
          const filename = path.basename(decodeURIComponent(rawName));
          const filePath = path.join(
            process.cwd(),
            "public",
            "uploads",
            filename,
          );
          if (!fs.existsSync(filePath)) {
            return new Response("Media not found", { status: 404 });
          }

          const stat = fs.statSync(filePath);
          const fileSize = stat.size;
          const ext = path.extname(filename).toLowerCase();
          const mimeTypes: Record<string, string> = {
            ".mp4": "video/mp4",
            ".webm": "video/webm",
            ".ogv": "video/ogg",
            ".mov": "video/quicktime",
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".gif": "image/gif",
            ".svg": "image/svg+xml",
            ".webp": "image/webp",
            ".ico": "image/x-icon",
            ".mp3": "audio/mpeg",
            ".wav": "audio/wav",
          };
          const contentType = mimeTypes[ext] || "application/octet-stream";

          const range = request.headers.get("range");
          if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            if (start >= fileSize || end >= fileSize || start > end) {
              return new Response(null, {
                status: 416,
                headers: { "Content-Range": `bytes */${fileSize}` },
              });
            }
            const chunksize = end - start + 1;
            const nodeStream = fs.createReadStream(filePath, { start, end });
            const webStream = Readable.toWeb(nodeStream);
            return new Response(webStream as unknown as BodyInit, {
              status: 206,
              headers: {
                "Content-Range": `bytes ${start}-${end}/${fileSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": String(chunksize),
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
              },
            });
          }

          const nodeStream = fs.createReadStream(filePath);
          const webStream = Readable.toWeb(nodeStream);
          return new Response(webStream as unknown as BodyInit, {
            status: 200,
            headers: {
              "Content-Length": String(fileSize),
              "Content-Type": contentType,
              "Accept-Ranges": "bytes",
              "Cache-Control": "public, max-age=31536000, immutable",
            },
          });
        }

        // 1. Request Body Size Guard (15MB for /api/upload to allow audio, 4.5MB for JSON payloads)
        const isUpload = url.pathname === "/api/upload";
        const maxLimit = isUpload ? 15 * 1024 * 1024 : 4.5 * 1024 * 1024;
        const contentLength = request.headers.get("content-length");
        if (contentLength && parseInt(contentLength, 10) > maxLimit) {
          return jsonResponse(
            {
              error: isUpload
                ? "File exceeds the 15MB upload limit."
                : "Payload too large. Please use a smaller file or compressed image.",
            },
            413,
          );
        }

        // 2. CSRF Protection for state-changing requests
        if (["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
          const csrfHeader = request.headers.get("x-requested-with");
          if (csrfHeader !== "halo-app") {
            return jsonResponse(
              { error: "Invalid or missing CSRF header (X-Requested-With)" },
              200,
            );
          }
        }

        // 3. IP + Route based Rate Limiting
        let rateLimit = 120; // default read routes
        const windowMs = 60000;

        if (url.pathname.startsWith("/api/auth/")) {
          rateLimit = 20; // auth operations
        } else if (url.pathname === "/api/upload") {
          rateLimit = 60; // media uploads
        } else if (
          url.pathname === "/api/change-password" ||
          url.pathname.startsWith("/api/admin/")
        ) {
          rateLimit = 30; // administrative & sensitive
        } else if (
          url.pathname === "/api/sync" ||
          url.pathname === "/api/claim"
        ) {
          rateLimit = 30; // user mutations
        } else if (
          url.pathname === "/api/view" ||
          url.pathname === "/api/click"
        ) {
          rateLimit = 60; // counters
        }

        const rateCheck = checkRateLimit(
          `${clientIp}:${url.pathname}`,
          rateLimit,
          windowMs,
        );
        if (!rateCheck.allowed) {
          return jsonResponse(
            { error: "Too many requests. Please try again later." },
            429,
            { "Retry-After": String(rateCheck.retryAfter) },
          );
        }

        // --- MEDIA UPLOAD ROUTE (Supports videos up to 1MB and custom icons) ---
        if (url.pathname === "/api/upload" && method === "POST") {
          try {
            const formData = await request.formData();
            const file = formData.get("file") as File | null;
            if (!file) {
              return jsonResponse({ error: "No file provided" }, 400);
            }

            if (file.type.startsWith("video/") && file.size > 1 * 1024 * 1024) {
              return jsonResponse({ error: "Video exceeds 1MB limit" }, 413);
            }
            if (file.size > 15 * 1024 * 1024) {
              return jsonResponse({ error: "File exceeds 15MB limit" }, 413);
            }

            const rawExt = path.extname(file.name || "").toLowerCase();
            const defaultExt = file.type.startsWith("video/")
              ? ".mp4"
              : file.type.startsWith("image/svg")
                ? ".svg"
                : ".png";
            const ext = /^\.[a-zA-Z0-9]+$/.test(rawExt) ? rawExt : defaultExt;
            const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;
            const uploadDir = path.join(process.cwd(), "public", "uploads");
            if (!fs.existsSync(uploadDir)) {
              fs.mkdirSync(uploadDir, { recursive: true });
            }

            const filePath = path.join(uploadDir, filename);
            const arrayBuf = await file.arrayBuffer();
            fs.writeFileSync(filePath, Buffer.from(arrayBuf));

            return jsonResponse({
              success: true,
              url: `/api/media/${filename}`,
              name: file.name,
              size: file.size,
              type: file.type,
            });
          } catch (err) {
            console.error("Upload handler error:", err);
            return jsonResponse(
              { error: "Failed to process media upload" },
              500,
            );
          }
        }

        // --- AUTH ROUTES ---
        if (url.pathname === "/api/auth/signup" && method === "POST") {
          try {
            const body = await request.json();
            const email = String(body.email || "")
              .trim()
              .toLowerCase();
            const password = String(body.password || "").trim();
            const fullName = String(body.full_name || "").trim();

            if (!email || !email.includes("@")) {
              return jsonResponse(
                { error: "Please enter a valid email address" },
                400,
              );
            }
            if (password.length < 6) {
              return jsonResponse(
                { error: "Password must be at least 6 characters long" },
                400,
              );
            }
            if (password.length > 128) {
              return jsonResponse(
                { error: "Password exceeds maximum length" },
                400,
              );
            }

            const existing = await serverStorage.getUserByEmail(email);
            if (existing) {
              return jsonResponse(
                { error: "An account with this email already exists" },
                409,
              );
            }

            const passwordHash = hashPasswordServer(password);
            const { user } = await serverStorage.createUser({
              email,
              passwordHash,
              full_name: fullName,
            });

            const session = await serverStorage.createSession(
              user.id,
              user.role,
            );
            const cookie = createSessionCookie(session.token, request);

            return jsonResponse(
              {
                success: true,
                user: {
                  id: user.id,
                  email: user.email,
                  full_name: user.full_name,
                  role: user.role,
                },
              },
              200,
              { "Set-Cookie": cookie },
            );
          } catch {
            return jsonResponse({ error: "Failed to create account" }, 400);
          }
        }

        if (url.pathname === "/api/auth/google" && method === "POST") {
          try {
            const body = await request.json();
            const idToken = body.idToken;
            if (!idToken)
              return jsonResponse({ error: "No ID token provided" }, 400);

            let apiKey = "";
            try {
              apiKey = fbConfig.apiKey;
            } catch (e) {
              console.warn("Could not load API key for Google verification", e);
            }

            if (!apiKey)
              return jsonResponse(
                { error: "Firebase config not found on server" },
                500,
              );

            const verifyRes = await fetch(
              `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken }),
              },
            );

            const verifyData = await verifyRes.json();
            if (
              !verifyRes.ok ||
              !verifyData.users ||
              verifyData.users.length === 0
            ) {
              return jsonResponse({ error: "Invalid Google token" }, 401);
            }

            const googleUser = verifyData.users[0];
            const email = googleUser.email.toLowerCase().trim();
            const fullName = googleUser.displayName || email.split("@")[0];

            let user = await serverStorage.getUserByEmail(email);
            if (!user) {
              const { user: newUser } = await serverStorage.createUser({
                email,
                passwordHash: "oauth:google:" + googleUser.localId,
                full_name: fullName,
              });
              user = newUser;
            }

            const session = await serverStorage.createSession(
              user.id,
              user.role,
            );
            const cookie = createSessionCookie(session.token, request);

            return jsonResponse(
              {
                success: true,
                user: {
                  id: user.id,
                  email: user.email,
                  full_name: user.full_name,
                  role: user.role,
                },
              },
              200,
              { "set-cookie": cookie },
            );
          } catch (err) {
            console.error(err);
            return jsonResponse({ error: "Failed to log in with Google" }, 500);
          }
        }

        if (url.pathname === "/api/auth/login" && method === "POST") {
          try {
            const body = await request.json();
            const email = String(body.email || "")
              .trim()
              .toLowerCase();
            const password = String(body.password || "").trim();

            const now = Date.now();
            const failRecord = failedLogins.get(email);
            if (failRecord && failRecord.lockedUntil > now) {
              const waitSec = Math.ceil((failRecord.lockedUntil - now) / 1000);
              return jsonResponse(
                {
                  error: `Too many failed attempts. Please wait ${waitSec}s.`,
                },
                429,
              );
            }

            const user = await serverStorage.getUserByEmail(email);
            const verifyResult = user
              ? verifyPasswordServer(password, user.password)
              : { valid: false, needsRehash: false };

            if (!user || !verifyResult.valid) {
              const count = (failRecord?.count || 0) + 1;
              if (count >= 5) {
                failedLogins.set(email, { count: 0, lockedUntil: now + 60000 });
              } else {
                failedLogins.set(email, { count, lockedUntil: 0 });
              }
              return jsonResponse({ error: "Invalid email or password" }, 401);
            }

            // Clear failure counter
            failedLogins.delete(email);

            // Rehash legacy hash if needed
            if (verifyResult.needsRehash) {
              await serverStorage.updateUserPassword(
                user.id,
                hashPasswordServer(password),
              );
            }

            const session = await serverStorage.createSession(
              user.id,
              user.role,
            );
            const cookie = createSessionCookie(session.token, request);

            return jsonResponse(
              {
                success: true,
                user: {
                  id: user.id,
                  email: user.email,
                  full_name: user.full_name,
                  role: user.role,
                },
              },
              200,
              { "Set-Cookie": cookie },
            );
          } catch {
            return jsonResponse({ error: "Authentication failed" }, 400);
          }
        }

        if (url.pathname === "/api/auth/logout" && method === "POST") {
          const session = await getSessionFromRequest(request);
          if (session) {
            await serverStorage.revokeSession(session.token);
          }
          const cookie = clearSessionCookie(request);
          return jsonResponse({ success: true }, 200, { "Set-Cookie": cookie });
        }

        if (url.pathname === "/api/auth/me" && method === "GET") {
          const session = await getSessionFromRequest(request);
          if (!session) {
            return jsonResponse({ user: null, session: null });
          }
          const user = await serverStorage.getUserById(session.userId);
          if (!user) {
            return jsonResponse({ user: null, session: null });
          }
          return jsonResponse({
            user: {
              id: user.id,
              email: user.email,
              full_name: user.full_name,
              role: user.role,
            },
            session: {
              user_id: session.userId,
              role: session.role,
            },
          });
        }

        // --- PASSWORD CHANGE ---
        if (url.pathname === "/api/change-password" && method === "POST") {
          const session = await getSessionFromRequest(request);
          if (!session) {
            return jsonResponse({ error: "Unauthorized" }, 401);
          }
          try {
            const body = await request.json();
            const currentPassword = String(body.currentPassword || "");
            const newPassword = String(body.newPassword || "").trim();

            if (newPassword.length < 6) {
              return jsonResponse(
                { error: "New password must be at least 6 characters" },
                400,
              );
            }

            const user = await serverStorage.getUserById(session.userId);
            if (!user) return jsonResponse({ error: "User not found" }, 404);

            const verified = verifyPasswordServer(
              currentPassword,
              user.password,
            );
            if (!verified.valid) {
              return jsonResponse(
                { error: "Current password is incorrect" },
                400,
              );
            }

            const newHash = hashPasswordServer(newPassword);
            await serverStorage.updateUserPassword(user.id, newHash);
            return jsonResponse({ success: true });
          } catch {
            return jsonResponse({ error: "Failed to change password" }, 400);
          }
        }

        // --- ADMIN ENDPOINTS ---
        if (url.pathname === "/api/admin/set-role" && method === "POST") {
          const session = await getSessionFromRequest(request);
          if (!session || session.role !== "admin") {
            return jsonResponse({ error: "Admin access required" }, 403);
          }
          try {
            const body = await request.json();
            const targetUserId = String(body.targetUserId || "");
            const role = body.role;
            if (!targetUserId || !["admin", "user"].includes(role)) {
              return jsonResponse({ error: "Invalid role payload" }, 400);
            }
            await serverStorage.updateUserRole(targetUserId, role);
            return jsonResponse({ success: true });
          } catch {
            return jsonResponse({ error: "Failed to update role" }, 400);
          }
        }

        if (url.pathname === "/api/admin/profile-mutate" && method === "POST") {
          const session = await getSessionFromRequest(request);
          if (!session || session.role !== "admin") {
            return jsonResponse({ error: "Admin access required" }, 403);
          }
          try {
            const body = await request.json();
            const targetUserId = String(body.targetUserId || "");
            const changes = body.changes || {};
            const result = await serverStorage.adminMutateProfile(
              targetUserId,
              changes,
            );
            if (!result.success) {
              return jsonResponse(result, 404);
            }
            return jsonResponse(result);
          } catch {
            return jsonResponse({ error: "Failed to mutate profile" }, 400);
          }
        }

        if (url.pathname === "/api/admin/delete-profile" && method === "POST") {
          const session = await getSessionFromRequest(request);
          if (!session || session.role !== "admin") {
            return jsonResponse({ error: "Admin access required" }, 403);
          }
          try {
            const body = await request.json();
            const targetUserId = String(body.targetUserId || "");
            const result = await serverStorage.adminDeleteProfile(targetUserId);
            if (!result.success) {
              return jsonResponse(result, 404);
            }
            return jsonResponse(result);
          } catch {
            return jsonResponse({ error: "Failed to delete profile" }, 400);
          }
        }

        if (url.pathname === "/api/admin/profiles" && method === "GET") {
          const session = await getSessionFromRequest(request);
          if (!session || session.role !== "admin") {
            return jsonResponse({ error: "Admin access required" }, 403);
          }
          const profiles = await serverStorage.getAllProfilesAdmin(true);
          return jsonResponse({ profiles });
        }

        // --- AUTHENTICATED USER DATA SYNC ---
        if (url.pathname === "/api/sync" && method === "POST") {
          const session = await getSessionFromRequest(request);
          if (!session) {
            return jsonResponse({ error: "Unauthorized" }, 401);
          }
          try {
            const body = await request.json();
            const result = await serverStorage.syncUser(
              session.userId,
              session.role === "admin",
              body,
            );
            return jsonResponse(result);
          } catch {
            return jsonResponse({ error: "Invalid sync payload" }, 400);
          }
        }

        // --- AUTHENTICATED SAFE STORE ACCESS ---
        if (url.pathname === "/api/store" && method === "GET") {
          const session = await getSessionFromRequest(request);
          if (!session) {
            return jsonResponse({ error: "Unauthorized" }, 401);
          }
          const data = await serverStorage.getCallerStore(
            session.userId,
            session.role === "admin",
          );
          return jsonResponse(data);
        }

        // --- USERNAME AVAILABILITY & CLAIM ---
        if (url.pathname === "/api/username-available" && method === "GET") {
          const username = url.searchParams.get("username") || "";
          const userId = url.searchParams.get("userId") || undefined;
          const result = await serverStorage.isUsernameAvailable(
            username,
            userId,
          );
          return jsonResponse(result);
        }

        if (url.pathname === "/api/claim" && method === "POST") {
          const session = await getSessionFromRequest(request);
          if (!session) {
            return jsonResponse({ error: "Unauthorized" }, 401);
          }
          try {
            const body = await request.json();
            const username = String(body.username || "");
            const targetUserId = String(body.userId || "");

            // Users can ONLY claim a username for their own account unless admin
            if (session.role !== "admin" && targetUserId !== session.userId) {
              return jsonResponse(
                {
                  success: false,
                  error: "Cannot claim username for another account",
                },
                403,
              );
            }

            const result = await serverStorage.claimUsername(
              targetUserId || session.userId,
              username,
            );
            if (!result.success) {
              return jsonResponse(result, 409);
            }
            return jsonResponse(result);
          } catch {
            return jsonResponse(
              { success: false, error: "Failed to claim username" },
              400,
            );
          }
        }

        // --- COUNTER ENDPOINTS ---
        if (url.pathname === "/api/view" && method === "POST") {
          try {
            const body = await request.json();
            const username = String(body.username || "");
            const result = await serverStorage.recordView(username, clientIp);
            return jsonResponse(result);
          } catch {
            return jsonResponse({ error: "Failed to record view" }, 400);
          }
        }

        if (url.pathname === "/api/click" && method === "POST") {
          try {
            const body = await request.json();
            const linkId = String(body.linkId || "");
            const result = await serverStorage.recordClick(linkId, clientIp);
            return jsonResponse(result);
          } catch {
            return jsonResponse({ error: "Failed to record click" }, 400);
          }
        }

        // --- PUBLIC PROFILE & STATS ---
        if (url.pathname.startsWith("/api/profile/")) {
          const username = decodeURIComponent(
            url.pathname.slice("/api/profile/".length),
          );
          const res = await serverStorage.getProfile(username);
          if (!res) return jsonResponse({ error: "Profile not found" }, 404);
          return jsonResponse(res, 200, {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          });
        }

        if (url.pathname === "/api/stats") {
          return jsonResponse(await serverStorage.getStats());
        }
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
