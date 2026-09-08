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
		"mtime": "2026-09-08T03:48:36.163Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-09-08T03:48:36.163Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/ProfileView-CAwctvER.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"42dc-91kipowFGFaHAts8x00Ne5+p6xE\"",
		"mtime": "2026-09-08T03:48:35.003Z",
		"size": 17116,
		"path": "../public/assets/ProfileView-CAwctvER.js"
	},
	"/assets/_username-CpmWMcDy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"495-P265QHbwfaZzVoQ+PTrqQ4mNnOU\"",
		"mtime": "2026-09-08T03:48:35.003Z",
		"size": 1173,
		"path": "../public/assets/_username-CpmWMcDy.js"
	},
	"/assets/_username-rk7EM0oe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8cd-v3MrdoKz68otZN6ca/kSqjMyJj8\"",
		"mtime": "2026-09-08T03:48:35.003Z",
		"size": 2253,
		"path": "../public/assets/_username-rk7EM0oe.js"
	},
	"/assets/admin-CV1eNXDj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3844-RS+5inGmzy4vnBTQM7MzeuDKkVs\"",
		"mtime": "2026-09-08T03:48:35.004Z",
		"size": 14404,
		"path": "../public/assets/admin-CV1eNXDj.js"
	},
	"/assets/arrow-left-dAPdZ_gO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a5-OvnR71TbTG2Hke1IHS7w/0VDth8\"",
		"mtime": "2026-09-08T03:48:35.004Z",
		"size": 165,
		"path": "../public/assets/arrow-left-dAPdZ_gO.js"
	},
	"/assets/auth-DFqGY4AH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"22f9-N+F71KEXglqjpCSz9ES+McvU7zw\"",
		"mtime": "2026-09-08T03:48:35.004Z",
		"size": 8953,
		"path": "../public/assets/auth-DFqGY4AH.js"
	},
	"/assets/check-Csy5oyI1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7c-zL1Epfk2wDcVf2Ze/RvLj/ss5Fw\"",
		"mtime": "2026-09-08T03:48:35.004Z",
		"size": 124,
		"path": "../public/assets/check-Csy5oyI1.js"
	},
	"/assets/claim-D0wyWfou.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"143f-I9h2Bnh3JMYGTG5gRNDLQq6GZZ8\"",
		"mtime": "2026-09-08T03:48:35.004Z",
		"size": 5183,
		"path": "../public/assets/claim-D0wyWfou.js"
	},
	"/assets/createLucideIcon-B4CjCUY3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4ae-Z1e58zUCG09N1wmORNxBPjHIhnQ\"",
		"mtime": "2026-09-08T03:48:35.004Z",
		"size": 1198,
		"path": "../public/assets/createLucideIcon-B4CjCUY3.js"
	},
	"/assets/dashboard-CHblIKIA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1698d-298QzyJNRwE9hEk/pRNFdWKVt7Q\"",
		"mtime": "2026-09-08T03:48:35.004Z",
		"size": 92557,
		"path": "../public/assets/dashboard-CHblIKIA.js"
	},
	"/assets/dist-DiaQZ8XJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a744-fU13iM6AWA/dpNn3sBqXBMhTmic\"",
		"mtime": "2026-09-08T03:48:35.004Z",
		"size": 42820,
		"path": "../public/assets/dist-DiaQZ8XJ.js"
	},
	"/assets/external-link-BlQwIzRD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fb-QEZ4vyCjebD6M9QaSTJsRMPnx7E\"",
		"mtime": "2026-09-08T03:48:35.004Z",
		"size": 251,
		"path": "../public/assets/external-link-BlQwIzRD.js"
	},
	"/assets/eye-B2XZgT_f.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"100-mky0/fdv7Ao+nPQzZvZPvVbZOkg\"",
		"mtime": "2026-09-08T03:48:35.004Z",
		"size": 256,
		"path": "../public/assets/eye-B2XZgT_f.js"
	},
	"/assets/eye-off-HXNs16iT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ae-+dc+UR0r499XC5wPv2Tg3BCx4fw\"",
		"mtime": "2026-09-08T03:48:35.004Z",
		"size": 430,
		"path": "../public/assets/eye-off-HXNs16iT.js"
	},
	"/assets/firebase-Bg8u-aoD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"131b9-zoGTq2tMyRoC5loHVZC6u6xeti4\"",
		"mtime": "2026-09-08T03:48:35.004Z",
		"size": 78265,
		"path": "../public/assets/firebase-Bg8u-aoD.js"
	},
	"/assets/index-BxcsPbRR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7ca35-ua6Peisug0e6vRobaCm5Ovq/jck\"",
		"mtime": "2026-09-08T03:48:35.003Z",
		"size": 510517,
		"path": "../public/assets/index-BxcsPbRR.js"
	},
	"/assets/index.esm-B-XAxlCt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6b735-iq3pdYL9e8SGsI5Mh5nnCzhSjPQ\"",
		"mtime": "2026-09-08T03:48:35.005Z",
		"size": 440117,
		"path": "../public/assets/index.esm-B-XAxlCt.js"
	},
	"/assets/index.esm-BPLYQnN1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"794b-ylBkWiajXxPTAPKdJFdX5YPLNaw\"",
		"mtime": "2026-09-08T03:48:35.005Z",
		"size": 31051,
		"path": "../public/assets/index.esm-BPLYQnN1.js"
	},
	"/assets/index.esm-BtfMKRYp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6e14-IrYQXli5+ySODpgCkwkTJWLqUsg\"",
		"mtime": "2026-09-08T03:48:35.005Z",
		"size": 28180,
		"path": "../public/assets/index.esm-BtfMKRYp.js"
	},
	"/assets/lazyRouteComponent-BZfT70Me.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"134f-g/SrRdn/AWMr415kFndu65X5ffE\"",
		"mtime": "2026-09-08T03:48:35.005Z",
		"size": 4943,
		"path": "../public/assets/lazyRouteComponent-BZfT70Me.js"
	},
	"/assets/link-DXIWwjJd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"774b-XEG/pYyINjdhbk+Y8bDwLVJ5Bas\"",
		"mtime": "2026-09-08T03:48:35.005Z",
		"size": 30539,
		"path": "../public/assets/link-DXIWwjJd.js"
	},
	"/assets/mail-BG8uFwPb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d5-SMUfGKwiIpQjva64i3A1kmyesPU\"",
		"mtime": "2026-09-08T03:48:35.005Z",
		"size": 213,
		"path": "../public/assets/mail-BG8uFwPb.js"
	},
	"/assets/preload-helper-Bi_pB1Y4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6af7-hxdDZdp2E4eh8ppy4nwswG1tqtk\"",
		"mtime": "2026-09-08T03:48:35.005Z",
		"size": 27383,
		"path": "../public/assets/preload-helper-Bi_pB1Y4.js"
	},
	"/assets/routes-DI-lyxBe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"17cf-C4/PuGsu4KECSqFLPyy1IlN3C1U\"",
		"mtime": "2026-09-08T03:48:35.005Z",
		"size": 6095,
		"path": "../public/assets/routes-DI-lyxBe.js"
	},
	"/assets/shield-check-BQ0ABIYV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"140-ZDGegr+Ht2leR7ReOU9l/5cZRB8\"",
		"mtime": "2026-09-08T03:48:35.005Z",
		"size": 320,
		"path": "../public/assets/shield-check-BQ0ABIYV.js"
	},
	"/assets/sparkles-pE2sL7HW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ee-KJRjxSjPj+ZqtMIJQ/g2yFtn5z4\"",
		"mtime": "2026-09-08T03:48:35.005Z",
		"size": 494,
		"path": "../public/assets/sparkles-pE2sL7HW.js"
	},
	"/assets/styles-BLiROXwe.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"1903a-Ymw70vzvSHkXAaClu92h02rDD/s\"",
		"mtime": "2026-09-08T03:48:35.005Z",
		"size": 102458,
		"path": "../public/assets/styles-BLiROXwe.css"
	},
	"/assets/trash-2-CqnP0WYf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"364-fhjfNZfQR7Y3Pu1Udnj9C/5pT0k\"",
		"mtime": "2026-09-08T03:48:35.005Z",
		"size": 868,
		"path": "../public/assets/trash-2-CqnP0WYf.js"
	},
	"/assets/useAuth-BKisy9tD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3fc-mDcxGirfF+F3duGGCM9qOVLi1BI\"",
		"mtime": "2026-09-08T03:48:35.005Z",
		"size": 1020,
		"path": "../public/assets/useAuth-BKisy9tD.js"
	},
	"/assets/video-C_iE06ol.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"385-nAJUFHaKYkRDD4sqSq82FFF7S6M\"",
		"mtime": "2026-09-08T03:48:35.005Z",
		"size": 901,
		"path": "../public/assets/video-C_iE06ol.js"
	},
	"/assets/x-CDicBULn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f5-wGIUG9ZReY9jnylGWGaz7ZaqOrQ\"",
		"mtime": "2026-09-08T03:48:35.005Z",
		"size": 245,
		"path": "../public/assets/x-CDicBULn.js"
	},
	"/uploads/test.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"11-JSe3018nxyiHwLxBeJ4XYPW/gRQ\"",
		"mtime": "2026-09-08T03:48:36.162Z",
		"size": 17,
		"path": "../public/uploads/test.txt"
	},
	"/videos/gold-particles.mp4": {
		"type": "video/mp4",
		"etag": "\"210b1-QPiOc2Z3jpzZ+931shHOz6CwQT8\"",
		"mtime": "2026-09-08T03:48:36.163Z",
		"size": 135345,
		"path": "../public/videos/gold-particles.mp4"
	},
	"/videos/ocean-waves.mp4": {
		"type": "video/mp4",
		"etag": "\"17da4-DdfT6rXHrB7FW7TSq4rsBhChJLg\"",
		"mtime": "2026-09-08T03:48:36.163Z",
		"size": 97700,
		"path": "../public/videos/ocean-waves.mp4"
	},
	"/videos/starry-night.mp4": {
		"type": "video/mp4",
		"etag": "\"16caf-bbQh1WlQD8HfK+zdKe5bg5jUDUw\"",
		"mtime": "2026-09-08T03:48:36.163Z",
		"size": 93359,
		"path": "../public/videos/starry-night.mp4"
	},
	"/videos/neon-tunnel.mp4": {
		"type": "video/mp4",
		"etag": "\"14e1d-O6UUFN0MLHtJeUYbD7uVKPp3s3o\"",
		"mtime": "2026-09-08T03:48:36.163Z",
		"size": 85533,
		"path": "../public/videos/neon-tunnel.mp4"
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
