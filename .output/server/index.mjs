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
	"/assets/ProfileView-Cclcczbd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2e61-UCN7aCmdH4qAu1+1Hb7mRpLrnX8\"",
		"mtime": "2026-09-07T14:12:54.853Z",
		"size": 11873,
		"path": "../public/assets/ProfileView-Cclcczbd.js"
	},
	"/assets/_username-B-trvmhk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8d1-qXrDkXSNQd073Nn9XC/u6ov7O/U\"",
		"mtime": "2026-09-07T14:12:54.853Z",
		"size": 2257,
		"path": "../public/assets/_username-B-trvmhk.js"
	},
	"/assets/_username-DuxoA5zC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"48f-Es6N/JROTI8WJ2BbJAfkgAJ35rs\"",
		"mtime": "2026-09-07T14:12:54.853Z",
		"size": 1167,
		"path": "../public/assets/_username-DuxoA5zC.js"
	},
	"/assets/admin-9paFNKSM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3818-N/8VdEUPYqlLlyRCyD/9i5g0zIE\"",
		"mtime": "2026-09-07T14:12:54.853Z",
		"size": 14360,
		"path": "../public/assets/admin-9paFNKSM.js"
	},
	"/assets/arrow-left-CPgG5JG5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a5-1KeYfbVy2n4VL5+J8T10YK9mw7I\"",
		"mtime": "2026-09-07T14:12:54.853Z",
		"size": 165,
		"path": "../public/assets/arrow-left-CPgG5JG5.js"
	},
	"/assets/bio-CZe4nqJj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a327-k1BkgHyg344EzxvtNrt0csNZMgI\"",
		"mtime": "2026-09-07T14:12:54.853Z",
		"size": 41767,
		"path": "../public/assets/bio-CZe4nqJj.js"
	},
	"/assets/auth-DeLIAzoJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2d86-vH5luZ2rSTDJHLWuScv7badUzxM\"",
		"mtime": "2026-09-07T14:12:54.853Z",
		"size": 11654,
		"path": "../public/assets/auth-DeLIAzoJ.js"
	},
	"/assets/check-DrUKdnWS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7c-gsGR7MjC71UkbNRvUMr9CND4dRM\"",
		"mtime": "2026-09-07T14:12:54.853Z",
		"size": 124,
		"path": "../public/assets/check-DrUKdnWS.js"
	},
	"/assets/claim-BlRrUyYJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"141d-8F07YdZq61Ooy2Wg0gEeo50XsO0\"",
		"mtime": "2026-09-07T14:12:54.853Z",
		"size": 5149,
		"path": "../public/assets/claim-BlRrUyYJ.js"
	},
	"/assets/createLucideIcon-Z8DE-4Yw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4a3-Lbz5BG2byCFkEJtXL76/7NDm7RA\"",
		"mtime": "2026-09-07T14:12:54.853Z",
		"size": 1187,
		"path": "../public/assets/createLucideIcon-Z8DE-4Yw.js"
	},
	"/assets/dashboard-DDos0WR1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"99bb-RqGHvRPYzQyh1Gn3eDxTQueDVq8\"",
		"mtime": "2026-09-07T14:12:54.853Z",
		"size": 39355,
		"path": "../public/assets/dashboard-DDos0WR1.js"
	},
	"/assets/dist-Bf7s10Xz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a73e-trh29HRiSjn7FQmMEfVGc+kr6hM\"",
		"mtime": "2026-09-07T14:12:54.853Z",
		"size": 42814,
		"path": "../public/assets/dist-Bf7s10Xz.js"
	},
	"/assets/external-link-sLCbpq09.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fb-rSLnDCLO1Ao6RDkzlY+oD0uH1e4\"",
		"mtime": "2026-09-07T14:12:54.854Z",
		"size": 251,
		"path": "../public/assets/external-link-sLCbpq09.js"
	},
	"/assets/eye-DK2m2cXY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"100-1bi6mbBuAEaCiyv5PbbtkycWSkE\"",
		"mtime": "2026-09-07T14:12:54.854Z",
		"size": 256,
		"path": "../public/assets/eye-DK2m2cXY.js"
	},
	"/assets/firebase-jl3kLa1s.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"259-141fNaYwiqWlKYcUGbbWx6VlBkw\"",
		"mtime": "2026-09-07T14:12:54.854Z",
		"size": 601,
		"path": "../public/assets/firebase-jl3kLa1s.js"
	},
	"/assets/index-B0JrsGLm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7a047-Dp7/0fsK7+DdpduuetNHF2+cxv8\"",
		"mtime": "2026-09-07T14:12:54.853Z",
		"size": 499783,
		"path": "../public/assets/index-B0JrsGLm.js"
	},
	"/assets/index.esm-Bbn-eKCa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"176da-wglRn5zAqPW2F93K1u2GyB7uuAc\"",
		"mtime": "2026-09-07T14:12:54.854Z",
		"size": 95962,
		"path": "../public/assets/index.esm-Bbn-eKCa.js"
	},
	"/assets/lazyRouteComponent-DfKQEb07.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1344-udJBG8q0qXhGa6NJQ6lomHNWIGk\"",
		"mtime": "2026-09-07T14:12:54.854Z",
		"size": 4932,
		"path": "../public/assets/lazyRouteComponent-DfKQEb07.js"
	},
	"/assets/routes-Cr7ZnPbV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1837-5Ln6k9DIKWIy+GLrkjhg3yB+2AQ\"",
		"mtime": "2026-09-07T14:12:54.854Z",
		"size": 6199,
		"path": "../public/assets/routes-Cr7ZnPbV.js"
	},
	"/assets/shield-check-DE6C71eF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"140-QndKCO/BJ3Oq6IPIKSW+01kUasE\"",
		"mtime": "2026-09-07T14:12:54.854Z",
		"size": 320,
		"path": "../public/assets/shield-check-DE6C71eF.js"
	},
	"/assets/sparkles-BAdXaGii.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"47b-pvAJ7XRSKHgs68St3nYUYnnh2AY\"",
		"mtime": "2026-09-07T14:12:54.854Z",
		"size": 1147,
		"path": "../public/assets/sparkles-BAdXaGii.js"
	},
	"/assets/styles-F9SRBI-7.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"16871-qWehYidYTqzM8AXfweKsw2OX1Pg\"",
		"mtime": "2026-09-07T14:12:54.854Z",
		"size": 92273,
		"path": "../public/assets/styles-F9SRBI-7.css"
	},
	"/assets/link-ZLkXNGqi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7745-cYOKONirfoiSp/3SRbi/7ylgnv0\"",
		"mtime": "2026-09-07T14:12:54.854Z",
		"size": 30533,
		"path": "../public/assets/link-ZLkXNGqi.js"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-09-07T14:12:56.000Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-09-07T14:12:56.000Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/trash-2-BPy9_1Dh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"364-OVxmT41h+Jg/lpik1288zwydvLc\"",
		"mtime": "2026-09-07T14:12:54.854Z",
		"size": 868,
		"path": "../public/assets/trash-2-BPy9_1Dh.js"
	},
	"/assets/useAuth-LbtHpzHi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"441-6Dq2ZdQKsLl0SSnu88a+8nBXPXU\"",
		"mtime": "2026-09-07T14:12:54.854Z",
		"size": 1089,
		"path": "../public/assets/useAuth-LbtHpzHi.js"
	},
	"/assets/x-DR998viM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f5-uMdgB0R4bFbdA5j8Y11tK6q82V0\"",
		"mtime": "2026-09-07T14:12:54.854Z",
		"size": 245,
		"path": "../public/assets/x-DR998viM.js"
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
