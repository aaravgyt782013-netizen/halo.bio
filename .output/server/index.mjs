globalThis.__nitro_main__ = import.meta.url;
import { i as HTTPError, n as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs").then((n) => n.r)) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-09-07T15:14:21.749Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-09-07T15:14:21.749Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/ProfileView-Dv_Mvk2w.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2e61-IpL7XtTre8/rIMHcMEOfJbllL6M\"",
		"mtime": "2026-09-07T15:14:20.748Z",
		"size": 11873,
		"path": "../public/assets/ProfileView-Dv_Mvk2w.js"
	},
	"/assets/_username-BffdBf4M.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8d1-tEu/YJ9Lp9Rifu3EW+Q+EPCPyIk\"",
		"mtime": "2026-09-07T15:14:20.748Z",
		"size": 2257,
		"path": "../public/assets/_username-BffdBf4M.js"
	},
	"/assets/_username-DGFIX2Mu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"48f-RaMuqmcu2F7i1mYSc0O7ilXRz8Y\"",
		"mtime": "2026-09-07T15:14:20.748Z",
		"size": 1167,
		"path": "../public/assets/_username-DGFIX2Mu.js"
	},
	"/assets/admin-CNt-fK8d.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3818-o8X4lKYUEoKcLuvmFexAwyGyggE\"",
		"mtime": "2026-09-07T15:14:20.748Z",
		"size": 14360,
		"path": "../public/assets/admin-CNt-fK8d.js"
	},
	"/assets/arrow-left-DiK2c7Df.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a5-wS9cJFF5f/Do6yBl/DqKNiwGDPk\"",
		"mtime": "2026-09-07T15:14:20.748Z",
		"size": 165,
		"path": "../public/assets/arrow-left-DiK2c7Df.js"
	},
	"/assets/auth-XiDAAWx8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2d86-LFnpjI4dDF269lz2PouK2puYIn8\"",
		"mtime": "2026-09-07T15:14:20.748Z",
		"size": 11654,
		"path": "../public/assets/auth-XiDAAWx8.js"
	},
	"/assets/check-CNz7Tozn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7c-IEHNslicenzX+S0VV4wz+MQ/+z4\"",
		"mtime": "2026-09-07T15:14:20.748Z",
		"size": 124,
		"path": "../public/assets/check-CNz7Tozn.js"
	},
	"/assets/claim-xmAnIIYw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"141d-t3UpWBLarYDI4OCinjdDEUQ7w2s\"",
		"mtime": "2026-09-07T15:14:20.748Z",
		"size": 5149,
		"path": "../public/assets/claim-xmAnIIYw.js"
	},
	"/assets/bio-CRootyoU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a32d-t+mUTwr7HnQ65pxmlO1KpYb/ZrI\"",
		"mtime": "2026-09-07T15:14:20.748Z",
		"size": 41773,
		"path": "../public/assets/bio-CRootyoU.js"
	},
	"/assets/createLucideIcon-p47yeNJZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4a3-VXRxi8eo9O9CBLw/7vyvtOJWXGY\"",
		"mtime": "2026-09-07T15:14:20.748Z",
		"size": 1187,
		"path": "../public/assets/createLucideIcon-p47yeNJZ.js"
	},
	"/assets/dashboard-Bxf6mtTP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9a99-bwph/SEljKw0Zfj/VPjL1aBIJAA\"",
		"mtime": "2026-09-07T15:14:20.748Z",
		"size": 39577,
		"path": "../public/assets/dashboard-Bxf6mtTP.js"
	},
	"/assets/dist-C2JAP8rT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a73e-DMOcyH+u3P1LXbfMXuF3/3J2HGo\"",
		"mtime": "2026-09-07T15:14:20.749Z",
		"size": 42814,
		"path": "../public/assets/dist-C2JAP8rT.js"
	},
	"/assets/external-link-D5rSrGPX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fb-jbNYG+lqvUeA66lA8frd6bzQNs4\"",
		"mtime": "2026-09-07T15:14:20.749Z",
		"size": 251,
		"path": "../public/assets/external-link-D5rSrGPX.js"
	},
	"/assets/firebase-jl3kLa1s.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"259-141fNaYwiqWlKYcUGbbWx6VlBkw\"",
		"mtime": "2026-09-07T15:14:20.749Z",
		"size": 601,
		"path": "../public/assets/firebase-jl3kLa1s.js"
	},
	"/assets/eye-Baoe6oqu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"100-Rjvcap7SmPJYfwzZV3pyecHaFLM\"",
		"mtime": "2026-09-07T15:14:20.749Z",
		"size": 256,
		"path": "../public/assets/eye-Baoe6oqu.js"
	},
	"/assets/index.esm-Bbn-eKCa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"176da-wglRn5zAqPW2F93K1u2GyB7uuAc\"",
		"mtime": "2026-09-07T15:14:20.749Z",
		"size": 95962,
		"path": "../public/assets/index.esm-Bbn-eKCa.js"
	},
	"/assets/lazyRouteComponent-CqaIJd4R.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1344-SvyDwFuu0IwWR0uFqcirkw7bbGM\"",
		"mtime": "2026-09-07T15:14:20.749Z",
		"size": 4932,
		"path": "../public/assets/lazyRouteComponent-CqaIJd4R.js"
	},
	"/assets/link-Chl_4CIg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7745-i65cnlDnn6z067YbcWnLQHtuWSY\"",
		"mtime": "2026-09-07T15:14:20.749Z",
		"size": 30533,
		"path": "../public/assets/link-Chl_4CIg.js"
	},
	"/assets/routes-Dd1eEiLs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1837-/JaY+UJrY7F662oaVgJrhJxjx4o\"",
		"mtime": "2026-09-07T15:14:20.749Z",
		"size": 6199,
		"path": "../public/assets/routes-Dd1eEiLs.js"
	},
	"/assets/shield-check-CFbrUwlg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"140-u10hJZyI5EtXOVRKqEfsAodDcfs\"",
		"mtime": "2026-09-07T15:14:20.749Z",
		"size": 320,
		"path": "../public/assets/shield-check-CFbrUwlg.js"
	},
	"/assets/sparkles-CKeJmcea.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"47b-dJ3KS+EyDAidVIxQo75wKpqY5uE\"",
		"mtime": "2026-09-07T15:14:20.749Z",
		"size": 1147,
		"path": "../public/assets/sparkles-CKeJmcea.js"
	},
	"/assets/styles-C_tkpu1q.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"168c7-/vF4w2pP2wXDYyDyJLsjseQq6wU\"",
		"mtime": "2026-09-07T15:14:20.750Z",
		"size": 92359,
		"path": "../public/assets/styles-C_tkpu1q.css"
	},
	"/assets/index-mDvB3FdZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7a047-v3la2jveA+GxDRay8V3jE8ebYIY\"",
		"mtime": "2026-09-07T15:14:20.748Z",
		"size": 499783,
		"path": "../public/assets/index-mDvB3FdZ.js"
	},
	"/assets/trash-2-DwsOri7R.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"364-//Rq20qd5gS6ROu9GPg5tukAWJM\"",
		"mtime": "2026-09-07T15:14:20.749Z",
		"size": 868,
		"path": "../public/assets/trash-2-DwsOri7R.js"
	},
	"/assets/useAuth-ByWBZfbI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"441-jdb0ye5nY+b5yLbOEUemEa5tJYw\"",
		"mtime": "2026-09-07T15:14:20.749Z",
		"size": 1089,
		"path": "../public/assets/useAuth-ByWBZfbI.js"
	},
	"/assets/x-DVjhcsJI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f5-TI+xQgjJpbr8sjAyysKV6jk+LvM\"",
		"mtime": "2026-09-07T15:14:20.749Z",
		"size": 245,
		"path": "../public/assets/x-DVjhcsJI.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_0jRgqU = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_0jRgqU
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
