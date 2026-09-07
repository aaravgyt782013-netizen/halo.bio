import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
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
        content: "Log in or create a Halo account to build your media-rich link-in-bio page.",
      },
      { property: "og:title", content: "Sign in — Halo bio pages" },
      {
        property: "og:description",
        content: "Create your Halo account with email or Google and claim your username.",
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [sentConfirm, setSentConfirm] = useState(false);

  useEffect(() => {
    if (session) navigate({ to: "/dashboard" });
  }, [session, navigate]);

  useEffect(() => {
    if (u) sessionStorage.setItem("halo:desired-username", u);
  }, [u]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (!data.session) {
          setSentConfirm(true);
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-5 py-12">
      <div className="aura pointer-events-none absolute inset-0 -z-10" />

      <div className="glass-panel w-full max-w-md animate-float-in p-8">
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> back home
        </button>

        <h1 className="font-display text-2xl font-bold">
          {isSignup ? "Create your page" : "Welcome back"}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {isSignup ? "Claim your username right after signing up." : "Log in to your builder."}
        </p>

        {sentConfirm ? (
          <div className="mt-6 rounded-xl bg-secondary p-4 text-sm text-secondary-foreground">
            Check your inbox — we sent a confirmation link to <strong>{email}</strong>. Your account
            activates as soon as you click it.
          </div>
        ) : (
          <>
            <button type="button" onClick={google} disabled={busy} className="btn-ghost mt-6 w-full">
              Continue with Google
            </button>

            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={submit} className="space-y-3">
              <label className="block">
                <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" /> Email
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="field"
                  placeholder="you@example.com"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <Lock className="h-3.5 w-3.5" /> Password
                </span>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="field"
                  placeholder="••••••••"
                />
              </label>
              <button type="submit" disabled={busy} className="btn-primary w-full">
                {isSignup ? "Create account" : "Log in"}
              </button>
            </form>

            <button
              type="button"
              onClick={() => setIsSignup((v) => !v)}
              className="mt-5 w-full text-center text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              {isSignup ? "Already have an account? Log in" : "New here? Create an account"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
