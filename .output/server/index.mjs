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
		"mtime": "2026-09-08T04:58:44.419Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-09-08T04:58:44.419Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/ProfileView-Cm7A31B-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4721-2cDNPIbwu/Ih/pTupThdAFAEc/4\"",
		"mtime": "2026-09-08T04:58:43.249Z",
		"size": 18209,
		"path": "../public/assets/ProfileView-Cm7A31B-.js"
	},
	"/assets/_username-D-Y5G6uk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"635-rMxCczp42/7pi+s+Dpi1ot5jjoM\"",
		"mtime": "2026-09-08T04:58:43.249Z",
		"size": 1589,
		"path": "../public/assets/_username-D-Y5G6uk.js"
	},
	"/assets/_username-DZm9hLMl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"592-/Pw7o60e+xQ/eVnA257OlMNLNUk\"",
		"mtime": "2026-09-08T04:58:43.249Z",
		"size": 1426,
		"path": "../public/assets/_username-DZm9hLMl.js"
	},
	"/assets/admin-D_fDerTp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"27de-x65so5iktahwnWm6rtWHTqK/4Ps\"",
		"mtime": "2026-09-08T04:58:43.249Z",
		"size": 10206,
		"path": "../public/assets/admin-D_fDerTp.js"
	},
	"/assets/arrow-left-Cb_0TDo-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a5-i1UzFeyNpfrm+yZy70RHqETAj5w\"",
		"mtime": "2026-09-08T04:58:43.249Z",
		"size": 165,
		"path": "../public/assets/arrow-left-Cb_0TDo-.js"
	},
	"/assets/auth-Daljff8a.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1955-RzRwVc1UtZ7FbnyaePHrbypfP04\"",
		"mtime": "2026-09-08T04:58:43.249Z",
		"size": 6485,
		"path": "../public/assets/auth-Daljff8a.js"
	},
	"/assets/bio-DYQsSPEv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6bd2-VpjMdaLdR1BnHBHbxD/KMluxGw4\"",
		"mtime": "2026-09-08T04:58:43.249Z",
		"size": 27602,
		"path": "../public/assets/bio-DYQsSPEv.js"
	},
	"/assets/check-C8wfQc4b.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7c-YOTT7I4JeejrCT29HZYqOE/v+xI\"",
		"mtime": "2026-09-08T04:58:43.249Z",
		"size": 124,
		"path": "../public/assets/check-C8wfQc4b.js"
	},
	"/assets/claim-Dbt05pHC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f2b-aG2TTfrlmU5NEoyh7On2KweuXaM\"",
		"mtime": "2026-09-08T04:58:43.249Z",
		"size": 3883,
		"path": "../public/assets/claim-Dbt05pHC.js"
	},
	"/assets/createLucideIcon-CLtu_FA0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4a3-Xm3Xakd3XaQObe14RqHpXc58Xrg\"",
		"mtime": "2026-09-08T04:58:43.249Z",
		"size": 1187,
		"path": "../public/assets/createLucideIcon-CLtu_FA0.js"
	},
	"/assets/dashboard-ByFVfjvb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10aa0-crNzaBMX/7WlF/TjYMGbMuBNv2g\"",
		"mtime": "2026-09-08T04:58:43.249Z",
		"size": 68256,
		"path": "../public/assets/dashboard-ByFVfjvb.js"
	},
	"/assets/external-link-D5FycwH4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fb-3xEMk1NugU0C7+FJZnK4PiV0Bo4\"",
		"mtime": "2026-09-08T04:58:43.249Z",
		"size": 251,
		"path": "../public/assets/external-link-D5FycwH4.js"
	},
	"/assets/eye-BmKufrtm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"100-qdtWQVCJc4DRhpgq5m0jp0N0MNQ\"",
		"mtime": "2026-09-08T04:58:43.249Z",
		"size": 256,
		"path": "../public/assets/eye-BmKufrtm.js"
	},
	"/assets/eye-off-Bs6SNDU-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ae-ry+xH0lZwxPS28KNXARpZmD+h94\"",
		"mtime": "2026-09-08T04:58:43.249Z",
		"size": 430,
		"path": "../public/assets/eye-off-Bs6SNDU-.js"
	},
	"/assets/firebase-jl3kLa1s.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"259-141fNaYwiqWlKYcUGbbWx6VlBkw\"",
		"mtime": "2026-09-08T04:58:43.249Z",
		"size": 601,
		"path": "../public/assets/firebase-jl3kLa1s.js"
	},
	"/assets/dist-P3tAEIXp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"90fa-DfAZ7K5ndK11/3GOGC+dP83GtEQ\"",
		"mtime": "2026-09-08T04:58:43.249Z",
		"size": 37114,
		"path": "../public/assets/dist-P3tAEIXp.js"
	},
	"/assets/index.esm-Bbn-eKCa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"176da-wglRn5zAqPW2F93K1u2GyB7uuAc\"",
		"mtime": "2026-09-08T04:58:43.250Z",
		"size": 95962,
		"path": "../public/assets/index.esm-Bbn-eKCa.js"
	},
	"/assets/lazyRouteComponent-DeV04ETH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"114c-7MnQMA+g55T7mED0Ihxkf72zP2s\"",
		"mtime": "2026-09-08T04:58:43.250Z",
		"size": 4428,
		"path": "../public/assets/lazyRouteComponent-DeV04ETH.js"
	},
	"/assets/link-Q9W292Qu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"538f-ES9E0ubO3JQ6+eLR+8O5ZtyoTDY\"",
		"mtime": "2026-09-08T04:58:43.250Z",
		"size": 21391,
		"path": "../public/assets/link-Q9W292Qu.js"
	},
	"/assets/mail-DtF8I96p.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d5-9QqW7yzTC5sZ0OrRBjpwK/9G9f8\"",
		"mtime": "2026-09-08T04:58:43.250Z",
		"size": 213,
		"path": "../public/assets/mail-DtF8I96p.js"
	},
	"/assets/routes-DkYCi2Yw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"109d-TcoTj9RY1mXF3JrxBfr3A0doLLU\"",
		"mtime": "2026-09-08T04:58:43.250Z",
		"size": 4253,
		"path": "../public/assets/routes-DkYCi2Yw.js"
	},
	"/assets/shield-check-nvbdJlKQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"140-CYvjzuf/rcHvoVRaw5xNOYjlZxU\"",
		"mtime": "2026-09-08T04:58:43.250Z",
		"size": 320,
		"path": "../public/assets/shield-check-nvbdJlKQ.js"
	},
	"/assets/index-CtLTJTx4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4b077-3FIRLJuVmgrZfg6ZQBvZyb9MNG4\"",
		"mtime": "2026-09-08T04:58:43.249Z",
		"size": 307319,
		"path": "../public/assets/index-CtLTJTx4.js"
	},
	"/assets/sparkles-DMT1s1oB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ee-n/kZW6l9hXtJNqxCm8m9vWU07ac\"",
		"mtime": "2026-09-08T04:58:43.250Z",
		"size": 494,
		"path": "../public/assets/sparkles-DMT1s1oB.js"
	},
	"/assets/styles-H2GW9vM7.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"197d9-GhIInAnaE9T2rTwfrrc/gthrMbk\"",
		"mtime": "2026-09-08T04:58:43.250Z",
		"size": 104409,
		"path": "../public/assets/styles-H2GW9vM7.css"
	},
	"/assets/trash-2-gm2XKI3B.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"364-2ZQgs3X6T+c8PDFS+xwz8y6EcMU\"",
		"mtime": "2026-09-08T04:58:43.250Z",
		"size": 868,
		"path": "../public/assets/trash-2-gm2XKI3B.js"
	},
	"/assets/useAuth-DYrPy7qZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"446-QJlCztFuY77FrxvbxMohfpelZAs\"",
		"mtime": "2026-09-08T04:58:43.250Z",
		"size": 1094,
		"path": "../public/assets/useAuth-DYrPy7qZ.js"
	},
	"/assets/x-CnJuOUNr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f5-Uq7+4S+wzECryeJ/xLKR9qBhLAg\"",
		"mtime": "2026-09-08T04:58:43.250Z",
		"size": 245,
		"path": "../public/assets/x-CnJuOUNr.js"
	},
	"/videos/gold-particles.mp4": {
		"type": "video/mp4",
		"etag": "\"210b1-QPiOc2Z3jpzZ+931shHOz6CwQT8\"",
		"mtime": "2026-09-08T04:58:44.418Z",
		"size": 135345,
		"path": "../public/videos/gold-particles.mp4"
	},
	"/assets/video-DLdbunrU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"385-J2ZMOr2vwSJEB0gwcEAy+gzW/jw\"",
		"mtime": "2026-09-08T04:58:43.250Z",
		"size": 901,
		"path": "../public/assets/video-DLdbunrU.js"
	},
	"/videos/neon-tunnel.mp4": {
		"type": "video/mp4",
		"etag": "\"14e1d-O6UUFN0MLHtJeUYbD7uVKPp3s3o\"",
		"mtime": "2026-09-08T04:58:44.419Z",
		"size": 85533,
		"path": "../public/videos/neon-tunnel.mp4"
	},
	"/videos/ocean-waves.mp4": {
		"type": "video/mp4",
		"etag": "\"17da4-DdfT6rXHrB7FW7TSq4rsBhChJLg\"",
		"mtime": "2026-09-08T04:58:44.419Z",
		"size": 97700,
		"path": "../public/videos/ocean-waves.mp4"
	},
	"/uploads/test.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"11-JSe3018nxyiHwLxBeJ4XYPW/gRQ\"",
		"mtime": "2026-09-08T04:58:44.418Z",
		"size": 17,
		"path": "../public/uploads/test.txt"
	},
	"/videos/starry-night.mp4": {
		"type": "video/mp4",
		"etag": "\"16caf-bbQh1WlQD8HfK+zdKe5bg5jUDUw\"",
		"mtime": "2026-09-08T04:58:44.419Z",
		"size": 93359,
		"path": "../public/videos/starry-night.mp4"
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
