import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Eye, EyeOff, LockKeyhole, Save, Settings2 } from "lucide-react";
import { toast } from "sonner";
import { db, type Profile } from "@/lib/bio";
import { useAuth, useMyProfile } from "@/hooks/useAuth";
import { DEFAULT_PROFILE_CUSTOMIZATION, normalizeProfileCustomization, type ProfileCustomization } from "@/lib/profileCustomization";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Spider Website" }, { name: "robots", content: "noindex" }] }),
  component: MemberSettings,
});

type Section = "layout" | "appearance" | "effects" | "widgets" | "typography" | "seo" | "account";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-xs font-medium text-white/60"><span className="mb-1.5 block">{label}</span>{children}</label>;
}

const inputClass = "w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 text-sm text-white outline-none focus:border-red-500/50";

function MemberSettings() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { profile, loading: profileLoading } = useMyProfile(user?.id);
  const [section, setSection] = useState<Section>("layout");
  const [config, setConfig] = useState<ProfileCustomization>(DEFAULT_PROFILE_CUSTOMIZATION);
  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (profile) {
      setConfig(normalizeProfileCustomization((profile as Profile & { profile_settings?: unknown }).profile_settings));
    }
  }, [profile]);

  const update = <K extends keyof ProfileCustomization>(key: K, value: ProfileCustomization[K]) => {
    setConfig((c) => ({ ...c, [key]: value }));
  };

  const save = async () => {
    if (!profile) return;
    setSaving(true);
    const { error } = await db.from("profiles").update({ profile_settings: config } as any).eq("id", profile.id);
    setSaving(false);
    if (error) toast.error(error.message || "Could not save settings");
    else toast.success("Profile settings saved");
  };

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

  const nav: Array<[Section, string]> = [
    ["layout", "Layout"], ["appearance", "Appearance"], ["effects", "Effects"], ["widgets", "Widgets"], ["typography", "Typography"], ["seo", "SEO & Sharing"], ["account", "Account"],
  ];

  const widgetTypes = useMemo(() => ["Discord Presence", "Now Playing", "YouTube", "GitHub", "Weather", "Timezone", "Profile Stats", "Music Player", "About Me", "Projects", "Skills"], []);

  if (loading || profileLoading) return <div className="min-h-screen grid place-items-center bg-[#070707] text-white">Loading…</div>;

  return <div className="min-h-screen bg-[#070707] text-white">
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <header className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3"><Link to="/dashboard" className="rounded-xl border border-white/10 p-2.5 hover:bg-white/5"><ArrowLeft className="h-4 w-4" /></Link><div><h1 className="text-xl font-bold"><span className="text-red-500">Spider</span> Website Settings</h1><p className="text-xs text-white/45">Everything here controls your member profile.</p></div></div>
        <button onClick={() => void save()} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold hover:bg-red-400 disabled:opacity-50"><Save className="h-4 w-4" />{saving ? "Saving…" : "Save"}</button>
      </header>

      <div className="grid gap-5 lg:grid-cols-[190px_1fr]">
        <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.025] p-2">
          {nav.map(([id, label]) => <button key={id} onClick={() => setSection(id)} className={`mb-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm ${section === id ? "bg-red-500/10 text-red-300" : "text-white/60 hover:bg-white/5 hover:text-white"}`}><Settings2 className="h-4 w-4" />{label}</button>)}
        </aside>

        <main className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-7">
          {section === "layout" && <div className="space-y-6"><div><h2 className="text-lg font-bold">Profile layout</h2><p className="text-sm text-white/45">Choose the structure of your public profile.</p></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{(["default", "modern", "minimal", "sleek", "portfolio"] as const).map((layout) => <button key={layout} onClick={() => update("layout", layout)} className={`rounded-2xl border p-4 text-left capitalize ${config.layout === layout ? "border-red-500/50 bg-red-500/10" : "border-white/10 bg-black/20"}`}><div className="font-semibold">{layout}</div><div className="mt-1 text-xs text-white/40">{layout === "portfolio" ? "About, projects and skills" : "Custom profile presentation"}</div>{config.layout === layout && <Check className="mt-3 h-4 w-4 text-red-400" />}</button>)}</div><div className="grid gap-4 sm:grid-cols-2"><Field label="Banner URL"><input className={inputClass} value={config.bannerUrl} onChange={e => update("bannerUrl", e.target.value)} placeholder="https://…" /></Field><Field label="Location"><input className={inputClass} value={config.location} onChange={e => update("location", e.target.value)} placeholder="Your location" /></Field></div><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={config.showLocation} onChange={e => update("showLocation", e.target.checked)} /> Show location on profile</label></div>}

          {section === "appearance" && <div className="space-y-6"><div><h2 className="text-lg font-bold">Advanced appearance</h2><p className="text-sm text-white/45">Fine-tune the card, borders, colors and glow.</p></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><Field label="Border color"><input type="color" className="h-11 w-full rounded-xl bg-black/20" value={config.borderColor} onChange={e => update("borderColor", e.target.value)} /></Field><Field label="Text color"><input type="color" className="h-11 w-full rounded-xl bg-black/20" value={config.textColor} onChange={e => update("textColor", e.target.value)} /></Field><Field label="Icon color"><input type="color" className="h-11 w-full rounded-xl bg-black/20" value={config.iconColor} onChange={e => update("iconColor", e.target.value)} /></Field><Field label="Border width"><input type="range" min="0" max="8" value={config.borderWidth} onChange={e => update("borderWidth", +e.target.value)} className="w-full" /></Field><Field label="Border opacity"><input type="range" min="0" max="1" step="0.01" value={config.borderOpacity} onChange={e => update("borderOpacity", +e.target.value)} className="w-full" /></Field><Field label="Avatar radius"><input type="range" min="0" max="999" value={config.avatarRadius} onChange={e => update("avatarRadius", +e.target.value)} className="w-full" /></Field><Field label="Border radius"><input type="range" min="0" max="60" value={config.borderRadius} onChange={e => update("borderRadius", +e.target.value)} className="w-full" /></Field><Field label="Glow size"><input type="range" min="0" max="80" value={config.profileGlowSize} onChange={e => update("profileGlowSize", +e.target.value)} className="w-full" /></Field><Field label="Card gradient color"><input type="color" className="h-11 w-full rounded-xl bg-black/20" value={config.cardGradientColor} onChange={e => update("cardGradientColor", e.target.value)} /></Field></div><div className="grid gap-3 sm:grid-cols-2"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={config.borderGlow} onChange={e => update("borderGlow", e.target.checked)} /> Border glow</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={config.profileGlow} onChange={e => update("profileGlow", e.target.checked)} /> Profile glow</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={config.cardGradientEnabled} onChange={e => update("cardGradientEnabled", e.target.checked)} /> Card gradient</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={config.monochromeIcons} onChange={e => update("monochromeIcons", e.target.checked)} /> Monochrome icons</label></div></div>}

          {section === "effects" && <div className="space-y-5"><h2 className="text-lg font-bold">Effects</h2><div className="grid gap-4 sm:grid-cols-2"><Field label="Username effect"><select className={inputClass} value={config.usernameEffect} onChange={e => update("usernameEffect", e.target.value as ProfileCustomization["usernameEffect"])}>{["none", "glow", "pulse", "gradient", "typing"].map(x => <option key={x}>{x}</option>)}</select></Field><Field label="Background effect"><select className={inputClass} value={config.backgroundEffect} onChange={e => update("backgroundEffect", e.target.value as ProfileCustomization["backgroundEffect"])}>{["none", "particles", "stars", "aurora", "grid", "scanlines"].map(x => <option key={x}>{x}</option>)}</select></Field><Field label="Cursor effect"><select className={inputClass} value={config.cursorEffect} onChange={e => update("cursorEffect", e.target.value as ProfileCustomization["cursorEffect"])}>{["none", "glow", "spark"].map(x => <option key={x}>{x}</option>)}</select></Field><Field label="Social alignment"><select className={inputClass} value={config.socialAlignment} onChange={e => update("socialAlignment", e.target.value as ProfileCustomization["socialAlignment"])}>{["left", "center", "right"].map(x => <option key={x}>{x}</option>)}</select></Field></div><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={config.animatedTitle} onChange={e => update("animatedTitle", e.target.checked)} /> Animated page title</label></div>}

          {section === "widgets" && <div className="space-y-5"><div><h2 className="text-lg font-bold">Widgets & sections</h2><p className="text-sm text-white/45">Pick modules that can appear on your profile.</p></div><div className="grid gap-2 sm:grid-cols-2">{widgetTypes.map(type => { const id = type.toLowerCase().replace(/[^a-z0-9]+/g, "-"); const active = config.widgets.some(w => w.id === id && w.enabled); return <button key={id} onClick={() => { const next = active ? config.widgets.filter(w => w.id !== id) : [...config.widgets, { id, type, enabled: true }]; update("widgets", next); }} className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left ${active ? "border-red-500/40 bg-red-500/10" : "border-white/10 bg-black/20"}`}><span>{type}</span>{active && <Check className="h-4 w-4 text-red-400" />}</button>; })}</div><div className="grid gap-4 sm:grid-cols-2"><Field label="About Me"><textarea className={`${inputClass} min-h-28`} value={config.aboutMe} onChange={e => update("aboutMe", e.target.value)} /></Field><Field label="Second tab content"><textarea className={`${inputClass} min-h-28`} value={config.secondTabContent} onChange={e => update("secondTabContent", e.target.value)} /></Field></div><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={config.secondTabEnabled} onChange={e => update("secondTabEnabled", e.target.checked)} /> Enable second profile tab</label></div>}

          {section === "typography" && <div className="space-y-5"><h2 className="text-lg font-bold">Typography</h2><div className="grid gap-4 sm:grid-cols-2"><Field label="Font family"><input className={inputClass} value={config.customFont} onChange={e => update("customFont", e.target.value)} placeholder="Inter, Poppins, …" /></Field><Field label="Typewriter speed"><input type="range" min="20" max="200" value={config.typewriterSpeed} onChange={e => update("typewriterSpeed", +e.target.value)} className="w-full" /></Field></div><Field label="Typewriter lines (one per line)"><textarea className={`${inputClass} min-h-32`} value={config.typewriterTexts.join("\n")} onChange={e => update("typewriterTexts", e.target.value.split("\n").map(x => x.trim()).filter(Boolean).slice(0, 10))} placeholder="Developer\nCreator\nMinecraft player" /></Field></div>}

          {section === "seo" && <div className="space-y-5"><h2 className="text-lg font-bold">SEO & sharing</h2><div className="grid gap-4"><Field label="Browser/page title"><input className={inputClass} value={config.seoTitle} onChange={e => update("seoTitle", e.target.value)} /></Field><Field label="Description"><textarea className={`${inputClass} min-h-24`} value={config.seoDescription} onChange={e => update("seoDescription", e.target.value)} /></Field><Field label="Social preview image"><input className={inputClass} value={config.seoImage} onChange={e => update("seoImage", e.target.value)} placeholder="https://…" /></Field><Field label="Favicon URL"><input className={inputClass} value={config.faviconUrl} onChange={e => update("faviconUrl", e.target.value)} placeholder="https://…" /></Field><Field label="Page alias"><input className={inputClass} value={config.pageAlias} onChange={e => update("pageAlias", e.target.value)} placeholder="my-page" /></Field></div></div>}

          {section === "account" && <div className="space-y-6"><div><h2 className="text-lg font-bold">Account & security</h2><p className="text-sm text-white/45">Change your profile login password. Your current password is verified on the server.</p></div><div className="max-w-lg space-y-4 rounded-2xl border border-white/10 bg-black/20 p-5"><Field label="Current password"><div className="relative"><input type={showPasswords ? "text" : "password"} className={`${inputClass} pr-11`} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} autoComplete="current-password" /> <button type="button" onClick={() => setShowPasswords(v => !v)} className="absolute right-2 top-2.5 p-1.5 text-white/45">{showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></Field><Field label="New password"><input type={showPasswords ? "text" : "password"} className={inputClass} value={newPassword} onChange={e => setNewPassword(e.target.value)} autoComplete="new-password" /></Field><Field label="Confirm new password"><input type={showPasswords ? "text" : "password"} className={inputClass} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} autoComplete="new-password" /></Field><button onClick={() => void changePassword()} disabled={changingPassword} className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold disabled:opacity-50"><LockKeyhole className="h-4 w-4" />{changingPassword ? "Changing…" : "Change password"}</button></div></div>}
        </main>
      </div>
    </div>
  </div>;
}
