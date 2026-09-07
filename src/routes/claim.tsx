import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, X, Loader2, ShieldCheck, ShieldAlert } from "lucide-react";
import { db, normalizeUsername, USERNAME_RE } from "@/lib/bio";
import { useAuth, useMyProfile } from "@/hooks/useAuth";

export const Route = createFileRoute("/claim")({
  head: () => ({
    meta: [
      { title: "Claim your username — Halo" },
      {
        name: "description",
        content: "Pick the handle that becomes your public Halo bio page URL.",
      },
      { property: "og:title", content: "Claim your username — Halo" },
      {
        property: "og:description",
        content:
          "Check availability in real time and lock in your Halo bio page handle.",
      },
    ],
  }),
  component: ClaimPage,
});

function ClaimPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { profile, loading: profileLoading } = useMyProfile(user?.id);
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<
    "idle" | "checking" | "free" | "taken" | "invalid"
  >("idle");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  useEffect(() => {
    const desired =
      typeof window !== "undefined"
        ? sessionStorage.getItem("halo:desired-username")
        : null;
    if (desired) setValue(normalizeUsername(desired));
  }, []);

  useEffect(() => {
    if (profile?.username) navigate({ to: "/dashboard" });
  }, [profile, navigate]);

  const valid = useMemo(() => USERNAME_RE.test(value), [value]);

  useEffect(() => {
    if (!value) return setStatus("idle");
    if (!valid) return setStatus("invalid");
    setStatus("checking");
    const t = window.setTimeout(async () => {
      const { data, error } = await db.rpc("username_available", {
        _username: value,
        _user_id: user?.id,
      });
      if (error) return setStatus("idle");
      setStatus(data ? "free" : "taken");
    }, 300);
    return () => window.clearTimeout(t);
  }, [value, valid, user?.id]);

  const save = async () => {
    if (!user || status !== "free") return;
    setSaving(true);
    const { error } = await db.rpc("claim_username", {
      _username: value,
      _user_id: user.id,
    });
    setSaving(false);
    if (error) {
      toast.error(
        error.message ||
          "This username is already reserved by another user. Try another.",
      );
      setStatus("taken");
      return;
    }
    sessionStorage.removeItem("halo:desired-username");
    toast.success(`halo.bio/${value} is now reserved exclusively for you!`);
    navigate({ to: "/dashboard" });
  };

  if (loading || profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-5 py-12">
      <div className="aura pointer-events-none absolute inset-0 -z-10" />
      <div className="glass-panel w-full max-w-md animate-float-in p-8">
        <h1 className="font-display text-2xl font-bold">Claim your username</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          This becomes your permanent public page: halo.bio/username
        </p>

        <div className="mt-6 flex items-center gap-2 rounded-full border border-input bg-card px-4 py-2.5">
          <span className="text-sm text-muted-foreground">halo.bio/</span>
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(normalizeUsername(e.target.value))}
            placeholder="yourname"
            aria-label="Username"
            className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none"
          />
          {status === "checking" && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
          {status === "free" && <Check className="h-4 w-4 text-emerald-500" />}
          {(status === "taken" || status === "invalid") && (
            <X className="h-4 w-4 text-destructive" />
          )}
        </div>

        <div className="mt-2.5 min-h-6 text-xs">
          {status === "invalid" && (
            <p className="text-destructive">
              3–20 characters: lowercase letters, numbers, dot or underscore.
            </p>
          )}
          {status === "taken" && (
            <p className="text-destructive font-medium flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5 inline shrink-0" />
              Reserved: Another user has already claimed this username.
            </p>
          )}
          {status === "free" && (
            <p className="text-emerald-500 font-medium flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 inline shrink-0" />
              Available! Will be permanently locked to your account.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={save}
          disabled={status !== "free" || saving}
          className="btn-primary mt-4 w-full"
        >
          {saving ? "Reserving Handle…" : "Claim username"}
        </button>
      </div>
    </div>
  );
}
