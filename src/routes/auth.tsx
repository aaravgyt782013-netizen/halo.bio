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
      { title: "Sign in — Halo bio pages" },
      {
        name: "description",
        content:
          "Log in or create a Halo account to build your media-rich link-in-bio page.",
      },
      { property: "og:title", content: "Sign in — Halo bio pages" },
      {
        property: "og:description",
        content:
          "Create your Halo account with email & password and claim your username.",
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

        {/* Mode switcher tabs */}
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

        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              const { data, error } = await auth.signInWithGoogle();
              if (error) throw error;
              toast.success("Welcome!");
              navigate({ to: "/dashboard" });
            } catch (err: any) {
              toast.error(err.message || "Google authentication failed");
            } finally {
              setBusy(false);
            }
          }}
          className="btn-outline w-full mb-6 flex items-center justify-center gap-2"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
        </button>

        <form
 onSubmit={submit} className="space-y-4">
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
