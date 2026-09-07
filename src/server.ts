import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { serverStorage } from "./server/storage";
import { checkRateLimit } from "./server/rate-limiter";
import { hashPasswordServer, verifyPasswordServer } from "./server/crypto";

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
    serverEntryPromise = // @ts-ignore
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

export async function getSessionFromRequest(request: Request): Promise<{ token: string; userId: string; role: "admin" | "user"; } | null> {
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

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);

      // Handle custom API endpoints
      if (url.pathname.startsWith("/api/")) {
        const clientIp = getClientIp(request);
        const method = request.method.toUpperCase();

        // 1. Request Body Size Guard (max 2MB)
        const contentLength = request.headers.get("content-length");
        if (contentLength && parseInt(contentLength, 10) > 2 * 1024 * 1024) {
          return jsonResponse({ error: "Payload too large" }, 413);
        }

        // 2. CSRF Protection for state-changing requests
        if (["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
          const csrfHeader = request.headers.get("x-requested-with");
          if (csrfHeader !== "halo-app") {
            return jsonResponse(
              { error: "Invalid or missing CSRF header (X-Requested-With)" },
              403,
            );
          }
        }

        // 3. IP + Route based Rate Limiting
        let rateLimit = 120; // default read routes
        const windowMs = 60000;

        if (url.pathname.startsWith("/api/auth/")) {
          rateLimit = 20; // auth operations
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

            const session = await serverStorage.createSession(user.id, user.role);
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

            const session = await serverStorage.createSession(user.id, user.role);
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
          const result = await serverStorage.isUsernameAvailable(username, userId);
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
          return jsonResponse(res);
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
