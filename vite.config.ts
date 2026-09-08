// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { Readable } from "node:stream";

function apiMiddlewarePlugin() {
  return {
    name: "halo-api-server",
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (!req.url || (!req.url.startsWith("/api/") && req.url !== "/api")) {
          return next();
        }

        try {
          const mod = await server.ssrLoadModule("/src/server.ts");
          const handler = mod.default?.fetch || mod.fetch;
          if (!handler) {
            return next();
          }

          const host = req.headers.host || "localhost:3000";
          const protocol = req.headers["x-forwarded-proto"] || "http";
          const fullUrl = `${protocol}://${host}${req.url}`;

          const headers = new Headers();
          for (const [key, value] of Object.entries(req.headers)) {
            if (value !== undefined) {
              if (Array.isArray(value)) {
                for (const v of value) headers.append(key, v);
              } else {
                headers.set(key, String(value));
              }
            }
          }

          const method = req.method || "GET";
          let body: any = undefined;
          if (method !== "GET" && method !== "HEAD") {
            body = Readable.toWeb(req);
          }

          const webRequest = new Request(fullUrl, {
            method,
            headers,
            body,
            // @ts-expect-error Node duplex streaming
            duplex: "half",
          });

          const webResponse: Response = await handler(webRequest, {}, {});
          if (!webResponse) {
            return next();
          }

          res.statusCode = webResponse.status;
          webResponse.headers.forEach((value: string, key: string) => {
            res.setHeader(key, value);
          });

          if (webResponse.body) {
            const reader = webResponse.body.getReader();
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              res.write(value);
            }
          }
          res.end();
        } catch (err) {
          console.error("API middleware error:", err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                error:
                  err instanceof Error
                    ? err.message
                    : "Internal Server Error in API middleware",
              }),
            );
          }
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [apiMiddlewarePlugin()],
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
