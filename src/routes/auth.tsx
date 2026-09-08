import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { firebaseAuth } from "../lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuth } from "../hooks/useAuth";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      mode: (search.mode as string) || "login",
      u: search.u as string | undefined,
    };
  },
  meta: () => ({
    title: "Sign in — Halo bio pages",
    meta: [
      {
        name: "description",
        content:
          "Log in or create a Halo account to build your media-rich link-in-bio page.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { u } = Route.useSearch();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session) navigate({ to: "/dashboard" });
  }, [session, navigate]);

  useEffect(() => {
    if (u) sessionStorage.setItem("halo:desired-username", u);
  }, [u]);

  const handleGoogleSignIn = async () => {
    setBusy(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(firebaseAuth, provider);

      const desired = sessionStorage.getItem("halo:desired-username");
      if (desired) {
        toast.success("Authentication successful!");
        navigate({ to: "/claim", search: { u: desired } });
      } else {
        toast.success("Welcome!");
        navigate({ to: "/dashboard" });
      }
    } catch (err: unknown) {
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

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">
              Welcome to Halo
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Sign in with your Google account to continue.
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <KeyRound className="h-5 w-5" />
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={busy}
          className="btn-primary w-full shadow-md flex items-center justify-center gap-2 h-11"
        >
          {busy ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              Authenticating…
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  d="M12.0003 4.75C13.7703 4.75 15.3553 5.36 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86 8.87028 4.75 12.0003 4.75Z"
                  fill="#EA4335"
                />
                <path
                  d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                  fill="#4285F4"
                />
                <path
                  d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                  fill="#FBBC05"
                />
                <path
                  d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                  fill="#34A853"
                />
              </svg>
              Continue with Google
            </>
          )}
        </button>

        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          <span>Secure authentication with Google Identity</span>
        </div>
      </div>
    </div>
  );
}
