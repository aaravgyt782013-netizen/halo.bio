import { r as __toESM } from "../_runtime.mjs";
import { n as auth } from "./bio-NPPVUTaD.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { n as Route$2 } from "./router-O6Q8y8-a.mjs";
import { L as Mail, Q as EyeOff, W as KeyRound, Z as Eye, c as User, lt as ArrowLeft, y as ShieldCheck, z as Lock } from "../_libs/lucide-react.mjs";
import { t as useAuth } from "./useAuth-CCjzNA5i.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-Hr5oYZBI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/auth.tsx?tsr-split=component";
function AuthPage() {
	const { mode, u } = Route$2.useSearch();
	const navigate = useNavigate();
	const { session } = useAuth();
	const [isSignup, setIsSignup] = (0, import_react.useState)(mode === "signup");
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (session) navigate({ to: "/dashboard" });
	}, [session, navigate]);
	(0, import_react.useEffect)(() => {
		if (u) sessionStorage.setItem("halo:desired-username", u);
	}, [u]);
	const submit = async (e) => {
		e.preventDefault();
		if (!email.trim() || !password.trim()) {
			toast.error("Please fill in both email and password.");
			return;
		}
		if (password.length < 6) {
			toast.error("Password must be at least 6 characters long.");
			return;
		}
		setBusy(true);
		try {
			if (isSignup) {
				const { data, error } = await auth.signUp({
					email,
					password,
					options: { data: { full_name: fullName.trim() || void 0 } }
				});
				if (error) throw error;
				if (data.session) {
					toast.success("Account created successfully!");
					if (sessionStorage.getItem("halo:desired-username")) navigate({ to: "/claim" });
					else navigate({ to: "/claim" });
				}
			} else {
				const { error } = await auth.signInWithPassword({
					email,
					password
				});
				if (error) throw error;
				toast.success("Welcome back!");
				navigate({ to: "/dashboard" });
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Authentication failed");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "relative flex min-h-screen items-center justify-center px-5 py-12",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "aura pointer-events-none absolute inset-0 -z-10" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 94,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "glass-panel w-full max-w-md animate-float-in p-8 shadow-lift",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					type: "button",
					onClick: () => navigate({ to: "/" }),
					className: "mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowLeft, { className: "h-3.5 w-3.5" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 100,
						columnNumber: 11
					}, this), " Back to home"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 97,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mb-6 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
						className: "font-display text-2xl font-bold tracking-tight",
						children: isSignup ? "Create your page" : "Welcome back"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 105,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-1.5 text-sm text-muted-foreground",
						children: isSignup ? "Sign up with email to claim your custom bio handle." : "Log in with your credentials to manage your links."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 108,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 104,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(KeyRound, { className: "h-5 w-5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 113,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 112,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 103,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mb-6 flex rounded-xl bg-secondary/80 p-1",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						type: "button",
						onClick: () => setIsSignup(false),
						className: `flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${!isSignup ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
						children: "Log in"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 119,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						type: "button",
						onClick: () => setIsSignup(true),
						className: `flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${isSignup ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
						children: "Create account"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 122,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 118,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
					onSubmit: submit,
					className: "space-y-4",
					children: [
						isSignup && /* @__PURE__ */ (void 0)("label", {
							className: "block",
							children: [/* @__PURE__ */ (void 0)("span", {
								className: "mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground",
								children: [/* @__PURE__ */ (void 0)(User, { className: "h-3.5 w-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 130,
									columnNumber: 17
								}, this), " Full Name (optional)"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 129,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("input", {
								type: "text",
								value: fullName,
								onChange: (e) => setFullName(e.target.value),
								className: "field",
								placeholder: "Alex Rivera",
								autoComplete: "name"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 132,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 128,
							columnNumber: 24
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Mail, { className: "h-3.5 w-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 137,
									columnNumber: 15
								}, this), " Email address"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 136,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
								type: "email",
								required: true,
								value: email,
								onChange: (e) => setEmail(e.target.value),
								className: "field",
								placeholder: "you@example.com",
								autoComplete: "email"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 139,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 135,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "mb-1.5 flex items-center justify-between text-xs font-semibold text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Lock, { className: "h-3.5 w-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 145,
										columnNumber: 17
									}, this), " Password"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 144,
									columnNumber: 15
								}, this), isSignup && password.length > 0 && /* @__PURE__ */ (void 0)("span", {
									className: `text-[11px] ${password.length >= 6 ? "text-success" : "text-destructive"}`,
									children: password.length >= 6 ? "Strong length" : "Min 6 chars"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 147,
									columnNumber: 51
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 143,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
									type: showPassword ? "text" : "password",
									required: true,
									minLength: 6,
									value: password,
									onChange: (e) => setPassword(e.target.value),
									className: "field pr-10",
									placeholder: "At least 6 characters",
									autoComplete: isSignup ? "new-password" : "current-password"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 152,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
									type: "button",
									onClick: () => setShowPassword((prev) => !prev),
									className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none",
									title: showPassword ? "Hide password" : "Show password",
									children: showPassword ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(EyeOff, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 154,
										columnNumber: 33
									}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 154,
										columnNumber: 66
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 153,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 151,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 142,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "pt-1",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "submit",
								disabled: busy,
								className: "btn-primary w-full shadow-md",
								children: busy ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "inline-flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 162,
										columnNumber: 19
									}, this), "Authenticating…"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 161,
									columnNumber: 23
								}, this) : isSignup ? "Create account" : "Log in"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 160,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 159,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 127,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldCheck, { className: "h-3.5 w-3.5 text-primary" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 170,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Secure authentication with encrypted credentials" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 171,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 169,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					type: "button",
					onClick: () => setIsSignup((v) => !v),
					className: "mt-5 w-full text-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors",
					children: isSignup ? "Already have an account? Log in" : "Need an account? Create one"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 174,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 96,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 93,
		columnNumber: 10
	}, this);
}
//#endregion
export { AuthPage as component };
