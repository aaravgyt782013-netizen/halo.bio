import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Mail,
  Lock,
  User,
  ArrowLeft,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { auth } from "@/lib/bio";
import { useAuth } from "@/hooks/useAuth";

type Search = { mode?: "signup" | "login" | undefined; u?: string | undefined };

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    mode: search["mode"] === "signup" ? "signup" : "login",
    u: typeof search["u"] === "string" ? (search["u"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — SpiderWensors bio pages" },
      {
        name: "description",
        content:
          "Log in or create a SpiderWensors account to build your media-rich link-in-bio page.",
      },
      { property: "og:title", content: "Sign in — SpiderWensors bio pages" },
      {
        property: "og:description",
        content:
          "Create your SpiderWensors account with email & password and claim your username.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode, u } = Route.useSearch();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [isSignup, setIsSignup] = useState(mode === "signup");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session) navigate({ to: "/dashboard" });
  }, [session, navigate]);

  useEffect(() => {
    if (u) sessionStorage.setItem("halo:desired-username", u);
  }, [u]);

  const submit = async (e: React.FormEvent) => {
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
          options: {
            data: { full_name: fullName.trim() || undefined },
          },
        });
        if (error) throw error;
        if (data.session) {
          toast.success("Account created successfully!");
          const desired = sessionStorage.getItem("halo:desired-username");
          if (desired) {
            navigate({ to: "/claim" });
          } else {
            navigate({ to: "/claim" });
          }
        }
      } else {
        const { error } = await auth.signInWithPassword({
          email,
          password,
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

  return (
    <div className="relative flex min-h-screen items-center justify-center px-5 py-12">
      <div className="aura pointer-events-none absolute inset-0 -z-10" />

      <div className="glass-panel w-full max-w-md animate-float-in p-8 shadow-lift">
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to home
        </button>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">
              {isSignup ? "Create your page" : "Welcome back"}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {isSignup
                ? "Sign up with email to claim your custom bio handle."
                : "Log in with your credentials to manage your links."}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <KeyRound className="h-5 w-5" />
          </div>
        </div>

        <div className="mb-6 flex rounded-xl bg-secondary/80 p-1">
          <button
            type="button"
            onClick={() => setIsSignup(false)}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              !isSignup
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => setIsSignup(true)}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              isSignup
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Create account
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {isSignup && (
            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <User className="h-3.5 w-3.5" /> Full Name (optional)
              </span>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="field"
                placeholder="Alex Rivera"
                autoComplete="name"
              />
            </label>
          )}

          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <Mail className="h-3.5 w-3.5" /> Email address
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 flex items-center justify-between text-xs font-semibold text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" /> Password
              </span>
              {isSignup && password.length > 0 && (
                <span
                  className={`text-[11px] ${
                    password.length >= 6 ? "text-success" : "text-destructive"
                  }`}
                >
                  {password.length >= 6 ? "Strong length" : "Min 6 chars"}
                </span>
              )}
            </span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field pr-10"
                placeholder="At least 6 characters"
                autoComplete={isSignup ? "new-password" : "current-password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </label>

          <div className="pt-1">
            <button
              type="submit"
              disabled={busy}
              className="btn-primary w-full shadow-md"
            >
              {busy ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Authenticating…
                </span>
              ) : isSignup ? (
                "Create account"
              ) : (
                "Log in"
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          <span>Secure authentication with encrypted credentials</span>
        </div>

        <button
          type="button"
          onClick={() => setIsSignup((v) => !v)}
          className="mt-5 w-full text-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          {isSignup
            ? "Already have an account? Log in"
            : "Need an account? Create one"}
        </button>
      </div>
    </div>
  );
}
