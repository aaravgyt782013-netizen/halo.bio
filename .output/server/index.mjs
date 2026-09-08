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
		"mtime": "2026-09-08T03:05:19.311Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-09-08T03:05:19.311Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/ProfileView-C5Oyyf2Q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"537b-iWg2JO8wUKTIvEckQDCgEcoXu3g\"",
		"mtime": "2026-09-08T03:05:18.244Z",
		"size": 21371,
		"path": "../public/assets/ProfileView-C5Oyyf2Q.js"
	},
	"/assets/_username-PC86rlfj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"48a-4iAief6jl5w3q4coWmZM8L35JM4\"",
		"mtime": "2026-09-08T03:05:18.244Z",
		"size": 1162,
		"path": "../public/assets/_username-PC86rlfj.js"
	},
	"/assets/_username-qtev5CjY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8cc-d3Obhv1v4pWlpT0hZJ6lYBxHrzA\"",
		"mtime": "2026-09-08T03:05:18.244Z",
		"size": 2252,
		"path": "../public/assets/_username-qtev5CjY.js"
	},
	"/assets/admin-CILdKXec.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"381d-oLosUh1RSAiKWIq/BEN3ruqA/Io\"",
		"mtime": "2026-09-08T03:05:18.244Z",
		"size": 14365,
		"path": "../public/assets/admin-CILdKXec.js"
	},
	"/assets/arrow-left-CY_tGjwl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a5-DyGYxZx3lS0CWCux40uWYd2CWCY\"",
		"mtime": "2026-09-08T03:05:18.244Z",
		"size": 165,
		"path": "../public/assets/arrow-left-CY_tGjwl.js"
	},
	"/assets/bio-CrV0w-MS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b1d8-PaLncZH3lrYkZrpxd5qzRW+nKqg\"",
		"mtime": "2026-09-08T03:05:18.244Z",
		"size": 45528,
		"path": "../public/assets/bio-CrV0w-MS.js"
	},
	"/assets/check-CVx0sMb9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7c-Ie0jEXZBSd7pgUWpXED60XeRxck\"",
		"mtime": "2026-09-08T03:05:18.244Z",
		"size": 124,
		"path": "../public/assets/check-CVx0sMb9.js"
	},
	"/assets/claim-EYjvyr4k.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1418-r4d9sb6ZE9yCRGbkBJhXH3/BFvU\"",
		"mtime": "2026-09-08T03:05:18.244Z",
		"size": 5144,
		"path": "../public/assets/claim-EYjvyr4k.js"
	},
	"/assets/createLucideIcon-CZrAUrvr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4a3-wNIxZUGV6BGs8S8FvdhquJNSs5M\"",
		"mtime": "2026-09-08T03:05:18.244Z",
		"size": 1187,
		"path": "../public/assets/createLucideIcon-CZrAUrvr.js"
	},
	"/assets/dashboard-CxPMMTb-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"16d21-cP/lRg0d4rQFlLRQtfOfGLSlVEk\"",
		"mtime": "2026-09-08T03:05:18.244Z",
		"size": 93473,
		"path": "../public/assets/dashboard-CxPMMTb-.js"
	},
	"/assets/dist-BglLutSP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a73e-u/iE9hf4tz+xj86fqIwA4Iq70vw\"",
		"mtime": "2026-09-08T03:05:18.244Z",
		"size": 42814,
		"path": "../public/assets/dist-BglLutSP.js"
	},
	"/assets/external-link-DtUkq4Y-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fb-2AW1NYwm85t+aeFxTQY+Fdokbak\"",
		"mtime": "2026-09-08T03:05:18.244Z",
		"size": 251,
		"path": "../public/assets/external-link-DtUkq4Y-.js"
	},
	"/assets/eye-gknBF84S.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"100-4UvIUdOf0WhNYt/OZxPrCidbKi4\"",
		"mtime": "2026-09-08T03:05:18.244Z",
		"size": 256,
		"path": "../public/assets/eye-gknBF84S.js"
	},
	"/assets/eye-off-Bp2-hWpb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ae-m3bWcrfYxYzWPMY9Jmt2VKOh3WE\"",
		"mtime": "2026-09-08T03:05:18.244Z",
		"size": 430,
		"path": "../public/assets/eye-off-Bp2-hWpb.js"
	},
	"/assets/firebase-YcBGtlfe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c7-3vKhGbLQwzjIfMpHUuoXbiFZriY\"",
		"mtime": "2026-09-08T03:05:18.244Z",
		"size": 711,
		"path": "../public/assets/firebase-YcBGtlfe.js"
	},
	"/assets/index-Oizd9RUa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7a0b7-XyaAi++/DcNkdkXrczZOGqSTgos\"",
		"mtime": "2026-09-08T03:05:18.243Z",
		"size": 499895,
		"path": "../public/assets/index-Oizd9RUa.js"
	},
	"/assets/index.esm-D6SvSQU-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"780e-nsnBDeRr5dGEb8GCWyoIBGYSfUs\"",
		"mtime": "2026-09-08T03:05:18.244Z",
		"size": 30734,
		"path": "../public/assets/index.esm-D6SvSQU-.js"
	},
	"/assets/index.esm-DUHArpI9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10f9d-rxLyV1z6apH/K7HJu1V6xqSqeG8\"",
		"mtime": "2026-09-08T03:05:18.245Z",
		"size": 69533,
		"path": "../public/assets/index.esm-DUHArpI9.js"
	},
	"/assets/index.esm-DksUa08Z.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6c9c-XSlXt3ed787FDOmIO68yF8+qYrA\"",
		"mtime": "2026-09-08T03:05:18.245Z",
		"size": 27804,
		"path": "../public/assets/index.esm-DksUa08Z.js"
	},
	"/assets/lazyRouteComponent-BKW7eFrZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1344-LfLE30QU6nKtGGQiSffKWnk/CkU\"",
		"mtime": "2026-09-08T03:05:18.245Z",
		"size": 4932,
		"path": "../public/assets/lazyRouteComponent-BKW7eFrZ.js"
	},
	"/assets/mail-BJyzSeot.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d5-R6QYf/cG48o29vVweXV1VJoAJcE\"",
		"mtime": "2026-09-08T03:05:18.245Z",
		"size": 213,
		"path": "../public/assets/mail-BJyzSeot.js"
	},
	"/assets/auth-DwaTUZvE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2363-EmAysg7Yb2XlhTwsC7ly9mDdcM4\"",
		"mtime": "2026-09-08T03:05:18.244Z",
		"size": 9059,
		"path": "../public/assets/auth-DwaTUZvE.js"
	},
	"/assets/link-utz1dhOz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7745-fibQdFw23P5XNp4FEyMmuBsgGZ8\"",
		"mtime": "2026-09-08T03:05:18.245Z",
		"size": 30533,
		"path": "../public/assets/link-utz1dhOz.js"
	},
	"/assets/shield-check-1vZlw9bx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"140-xraoaMBYDU5KJn8PDxiCGjpC6r4\"",
		"mtime": "2026-09-08T03:05:18.245Z",
		"size": 320,
		"path": "../public/assets/shield-check-1vZlw9bx.js"
	},
	"/assets/sparkles-u5uR-kMP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ee-95WiLXFUkJXM+0uLllR40qtEK1k\"",
		"mtime": "2026-09-08T03:05:18.245Z",
		"size": 494,
		"path": "../public/assets/sparkles-u5uR-kMP.js"
	},
	"/assets/styles-SnNZEHWD.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"197ee-K4DLaez+qcVPyZH9lI2hmPeMezg\"",
		"mtime": "2026-09-08T03:05:18.245Z",
		"size": 104430,
		"path": "../public/assets/styles-SnNZEHWD.css"
	},
	"/assets/trash-2-Dkf_xfHk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"364-nPPTLaoaxt3bmDI1BTkcm3C3qig\"",
		"mtime": "2026-09-08T03:05:18.245Z",
		"size": 868,
		"path": "../public/assets/trash-2-Dkf_xfHk.js"
	},
	"/assets/useAuth-BIZr32y5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"446-SlJFbCgMyOuaD8wFEL5wVsj3mGc\"",
		"mtime": "2026-09-08T03:05:18.245Z",
		"size": 1094,
		"path": "../public/assets/useAuth-BIZr32y5.js"
	},
	"/assets/video-By3EkBuk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"385-cI9V99AKUdmdevuOajZlyeBpL7A\"",
		"mtime": "2026-09-08T03:05:18.245Z",
		"size": 901,
		"path": "../public/assets/video-By3EkBuk.js"
	},
	"/assets/x-Dqf2MYdF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f5-ZvxcEezfwReXelS8BdwesjZRt0M\"",
		"mtime": "2026-09-08T03:05:18.245Z",
		"size": 245,
		"path": "../public/assets/x-Dqf2MYdF.js"
	},
	"/uploads/1788826171730-kztdowlz.json": {
		"type": "application/json",
		"etag": "\"c33-eQ55kgr8/R8yyoDpozJNxDytuSk\"",
		"mtime": "2026-09-08T03:05:19.306Z",
		"size": 3123,
		"path": "../public/uploads/1788826171730-kztdowlz.json"
	},
	"/assets/routes-JNEx2Lj9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"17a8-dvDRv9IJri0BYSqpFuO9wY8vcXM\"",
		"mtime": "2026-09-08T03:05:18.245Z",
		"size": 6056,
		"path": "../public/assets/routes-JNEx2Lj9.js"
	},
	"/uploads/1788835669344-2ht5czgv.mp4": {
		"type": "video/mp4",
		"etag": "\"2800-NffqdYRfTuVUQLLpSJcCiCp89Fg\"",
		"mtime": "2026-09-08T03:05:19.310Z",
		"size": 10240,
		"path": "../public/uploads/1788835669344-2ht5czgv.mp4"
	},
	"/uploads/test.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"11-JSe3018nxyiHwLxBeJ4XYPW/gRQ\"",
		"mtime": "2026-09-08T03:05:19.310Z",
		"size": 17,
		"path": "../public/uploads/test.txt"
	},
	"/videos/neon-tunnel.mp4": {
		"type": "video/mp4",
		"etag": "\"14e1d-O6UUFN0MLHtJeUYbD7uVKPp3s3o\"",
		"mtime": "2026-09-08T03:05:19.310Z",
		"size": 85533,
		"path": "../public/videos/neon-tunnel.mp4"
	},
	"/videos/gold-particles.mp4": {
		"type": "video/mp4",
		"etag": "\"210b1-QPiOc2Z3jpzZ+931shHOz6CwQT8\"",
		"mtime": "2026-09-08T03:05:19.306Z",
		"size": 135345,
		"path": "../public/videos/gold-particles.mp4"
	},
	"/videos/starry-night.mp4": {
		"type": "video/mp4",
		"etag": "\"16caf-bbQh1WlQD8HfK+zdKe5bg5jUDUw\"",
		"mtime": "2026-09-08T03:05:19.311Z",
		"size": 93359,
		"path": "../public/videos/starry-night.mp4"
	},
	"/uploads/1788835597008-test-124.mp4": {
		"type": "video/mp4",
		"etag": "\"2800-NffqdYRfTuVUQLLpSJcCiCp89Fg\"",
		"mtime": "2026-09-08T03:05:19.310Z",
		"size": 10240,
		"path": "../public/uploads/1788835597008-test-124.mp4"
	},
	"/videos/ocean-waves.mp4": {
		"type": "video/mp4",
		"etag": "\"17da4-DdfT6rXHrB7FW7TSq4rsBhChJLg\"",
		"mtime": "2026-09-08T03:05:19.310Z",
		"size": 97700,
		"path": "../public/videos/ocean-waves.mp4"
	},
	"/uploads/1788826273694-me26yjft.mp4": {
		"type": "video/mp4",
		"etag": "\"200000-uEt7d1QwIywu5OIhbbGlkdl7LbA\"",
		"mtime": "2026-09-08T03:05:19.310Z",
		"size": 2097152,
		"path": "../public/uploads/1788826273694-me26yjft.mp4"
	},
	"/uploads/1788835468415-test-123.mp4": {
		"type": "video/mp4",
		"etag": "\"190000-vvx1dwelLhWBOCQgZSnQZ0y5B/g\"",
		"mtime": "2026-09-08T03:05:19.310Z",
		"size": 1638400,
		"path": "../public/uploads/1788835468415-test-123.mp4"
	},
	"/uploads/1788835612020-test-125.mp4": {
		"type": "video/mp4",
		"etag": "\"258000-16WtxiJoHSytNFgQK8cO8vknJnc\"",
		"mtime": "2026-09-08T03:05:19.316Z",
		"size": 2457600,
		"path": "../public/uploads/1788835612020-test-125.mp4"
	},
	"/uploads/1788826278567-0a3pjd57.mp4": {
		"type": "video/mp4",
		"etag": "\"f00000-c7RYTbYLFhE6I5ZleJug/rxwfQM\"",
		"mtime": "2026-09-08T03:05:19.332Z",
		"size": 15728640,
		"path": "../public/uploads/1788826278567-0a3pjd57.mp4"
	},
	"/uploads/1788834527007-ovkfc54v.mp4": {
		"type": "video/mp4",
		"etag": "\"f00000-c7RYTbYLFhE6I5ZleJug/rxwfQM\"",
		"mtime": "2026-09-08T03:05:19.329Z",
		"size": 15728640,
		"path": "../public/uploads/1788834527007-ovkfc54v.mp4"
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
