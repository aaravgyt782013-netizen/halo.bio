import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Palette } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Spider Website" }, { name: "robots", content: "noindex" }] }),
  component: MemberSettings,
});

const inputClass = "w-full rounded-xl border border-white/10 bg-white/[0.035] px-3.5 py-3 text-sm text-white outline-none transition focus:border-red-500/50 focus:bg-white/[0.05]";

function MemberSettings() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  const changePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) return toast.error("Fill all password fields");
    if (newPassword.length < 6) return toast.error("New password must be at least 6 characters");
    if (newPassword.length > 128) return toast.error("New password is too long");
    if (newPassword !== confirmPassword) return toast.error("New passwords do not match");
    setChangingPassword(true);
    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json", "X-Requested-With": "halo-app" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not change password");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      toast.success("Password changed successfully");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not change password");
    } finally { setChangingPassword(false); }
  };

  if (loading) return <div className="min-h-screen grid place-items-center bg-[#070707] text-white/60">Loading…</div>;

  return <div className="min-h-screen bg-[#070707] text-white">
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-8">
      <header className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="rounded-xl border border-white/10 bg-white/[0.025] p-2.5 text-white/60 transition hover:bg-white/[0.06] hover:text-white"><ArrowLeft className="h-4 w-4" /></Link>
          <div><h1 className="text-xl font-bold tracking-tight"><span className="text-red-500">Spider</span> Website Settings</h1><p className="mt-0.5 text-xs text-white/40">Account security and profile preferences.</p></div>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.025] p-2">
          <Link to="/customization" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"><Palette className="h-4 w-4" />Profile customization</Link>
          <div className="mt-1 flex items-center gap-2 rounded-xl bg-red-500/10 px-3 py-2.5 text-sm text-red-300"><LockKeyhole className="h-4 w-4" />Password</div>
        </aside>

        <main className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-7">
          <div className="mb-6"><h2 className="text-lg font-bold tracking-tight">Change password</h2><p className="mt-1 text-sm text-white/45">Use your current password to set a new password for your profile account.</p></div>
          <div className="max-w-xl rounded-2xl border border-white/10 bg-black/20 p-5 sm:p-6">
            <div className="space-y-4">
              {[{ label: "Current password", value: currentPassword, set: setCurrentPassword, auto: "current-password" }, { label: "New password", value: newPassword, set: setNewPassword, auto: "new-password" }, { label: "Confirm new password", value: confirmPassword, set: setConfirmPassword, auto: "new-password" }].map((field, index) => <label key={field.label} className="block text-xs font-medium text-white/60"><span className="mb-1.5 block">{field.label}</span><div className="relative"><input type={showPasswords ? "text" : "password"} className={`${inputClass} ${index === 0 ? "pr-11" : ""}`} value={field.value} onChange={e => field.set(e.target.value)} autoComplete={field.auto} />{index === 0 && <button type="button" onClick={() => setShowPasswords(v => !v)} className="absolute right-2 top-2.5 rounded-lg p-1.5 text-white/40 hover:bg-white/5 hover:text-white">{showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}</div></label>)}
            </div>
            <button onClick={() => void changePassword()} disabled={changingPassword} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"><LockKeyhole className="h-4 w-4" />{changingPassword ? "Changing…" : "Change password"}</button>
          </div>
        </main>
      </div>
    </div>
  </div>;
}
