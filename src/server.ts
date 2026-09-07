import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { serverStorage } from "./server/storage";

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
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
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
        if (url.pathname === "/api/sync" && request.method === "POST") {
          try {
            const body = await request.json();
            const result = serverStorage.sync(body);
            return jsonResponse(result);
          } catch (e) {
            return jsonResponse({ error: "Invalid JSON sync payload" }, 400);
          }
        }

        if (
          url.pathname === "/api/username-available" &&
          request.method === "GET"
        ) {
          const username = url.searchParams.get("username") || "";
          const userId = url.searchParams.get("userId") || undefined;
          const result = serverStorage.isUsernameAvailable(username, userId);
          return jsonResponse(result);
        }

        if (url.pathname === "/api/claim" && request.method === "POST") {
          try {
            const body = await request.json();
            const username = String(body.username || "");
            const userId = String(body.userId || "");
            if (!userId) {
              return jsonResponse(
                { success: false, error: "User ID is required" },
                400,
              );
            }
            const result = serverStorage.claimUsername(userId, username);
            if (!result.success) {
              return jsonResponse(result, 409); // Conflict: already taken
            }
            return jsonResponse(result);
          } catch (e) {
            return jsonResponse(
              { success: false, error: "Failed to claim username" },
              400,
            );
          }
        }

        if (url.pathname === "/api/view" && request.method === "POST") {
          try {
            const body = await request.json();
            const username = String(body.username || "");
            const xForwarded = request.headers.get("x-forwarded-for");
            const clientIp = xForwarded
              ? xForwarded.split(",")[0].trim()
              : request.headers.get("x-real-ip") ||
                request.headers.get("cf-connecting-ip") ||
                "127.0.0.1";

            const result = serverStorage.recordView(username, clientIp);
            return jsonResponse(result);
          } catch (e) {
            return jsonResponse({ error: "Failed to record view" }, 400);
          }
        }

        if (url.pathname === "/api/click" && request.method === "POST") {
          try {
            const body = await request.json();
            const linkId = String(body.linkId || "");
            const result = serverStorage.recordClick(linkId);
            return jsonResponse(result);
          } catch (e) {
            return jsonResponse({ error: "Failed to record click" }, 400);
          }
        }

        if (url.pathname.startsWith("/api/profile/")) {
          const username = decodeURIComponent(
            url.pathname.slice("/api/profile/".length),
          );
          const res = serverStorage.getProfile(username);
          if (!res) return jsonResponse({ error: "Profile not found" }, 404);
          return jsonResponse(res);
        }

        if (url.pathname === "/api/store") {
          return jsonResponse(serverStorage.getData());
        }

        if (url.pathname === "/api/stats") {
          return jsonResponse(serverStorage.getStats());
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
