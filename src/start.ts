import {
  createStart,
  createCsrfMiddleware,
  createMiddleware,
} from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
    });
  }
});

const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  // The editor, auth screens and profile builder use browser state extensively
  // (localStorage/sessionStorage, media APIs and client-side auth hydration).
  // Rendering those components on the server was causing navigation-only
  // failures even though direct URLs rendered correctly. Keep the application
  // client-rendered so initial loads and subsequent navigations use the same
  // execution path.
  defaultSsr: false,
  requestMiddleware: [errorMiddleware, csrfMiddleware],
}));
