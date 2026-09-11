import { useEffect, useMemo, useState } from "react";
import { Check, Lock, Palette, Save, Sparkles, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { auth, db, type Profile } from "@/lib/bio";
import { CURATED_PROFILE_THEMES, DEFAULT_PROFILE_THEME, getProfileTheme, type ProfileTheme } from "@/lib/profile-themes";

type Props = { onThemeSaved?: (theme: ProfileTheme) => void };
function isHex(value: string) { return /^#[0-9a-f]{3,8}$/i.test(value); }
function themesEqual(a: ProfileTheme, b: ProfileTheme) { return JSON.stringify(a) === JSON.stringify(b); }
function previewTheme(theme: ProfileTheme) { if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("halo-theme-preview", { detail: theme })); }

export function CuratedThemesPanel({ onThemeSaved }: Props) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [savedTheme, setSavedTheme] = useState(DEFAULT_PROFILE_THEME);
  const [draftTheme, setDraftTheme] = useState(DEFAULT_PROFILE_THEME);
  const [customize, setCustomize] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void auth.getSession().then(async ({ data }) => {
      if (!data.session || cancelled) return;
      const { data: loaded } = await db.from("profiles").select("*").eq("id", data.session.user.id).maybeSingle();
      if (cancelled) return;
      const current = (loaded ?? null) as Profile | null;
      const theme = getProfileTheme(current?.theme);
      setProfile(current); setSavedTheme(theme); setDraftTheme(theme); previewTheme(theme);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => { previewTheme(draftTheme); }, [draftTheme]);
  const hasChanges = useMemo(() => !themesEqual(savedTheme, draftTheme), [savedTheme, draftTheme]);
  const previewStyle = useMemo(() => ({ background: draftTheme.card.background, borderColor: draftTheme.card.border, color: draftTheme.text.primary }), [draftTheme]);

  const persist = async (theme: ProfileTheme) => {
    if (!profile) { toast.error("Your profile is still loading"); return; }
    setSaving(true);
    const { error } = await db.from("profiles").update({ theme }).eq("id", profile.id);
    setSaving(false);
    if (error) { toast.error(`Could not save theme: ${error.message}`); return; }
    setSavedTheme(theme); setDraftTheme(theme);
    setProfile((current) => current ? ({ ...current, theme } as Profile) : current);
    onThemeSaved?.(theme); toast.success(`${theme.name} saved`);
  };

  const applyPreset = (theme: ProfileTheme) => setDraftTheme({ ...theme, customized: false });
  const updateCustom = (patch: Partial<ProfileTheme>) => setDraftTheme((current) => getProfileTheme({ ...current, ...patch, customized: true }));
  const discardChanges = () => setDraftTheme(savedTheme);

  return <div className="space-y-4 rounded-2xl border border-border/80 bg-secondary/20 p-3.5 sm:p-4">
    <div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-primary" /><h3 className="text-sm font-bold text-foreground">Themes</h3></div><p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">Pick or customize a theme. Changes appear in the live preview immediately and are only stored when you press Save theme.</p></div><button type="button" onClick={() => setCustomize(v => !v)} className={`shrink-0 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold ${customize ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground"}`}><Palette className="mr-1 inline h-3.5 w-3.5" />Customize</button></div>
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{CURATED_PROFILE_THEMES.map(theme => { const active = draftTheme.id === theme.id && !draftTheme.customized; return <button key={theme.id} type="button" onClick={() => applyPreset(theme)} disabled={saving} className={`group relative overflow-hidden rounded-xl border p-2 text-left transition-all ${active ? "border-primary ring-2 ring-primary/20" : "border-border/80 hover:border-primary/50"}`}><div className="h-16 rounded-lg border" style={{ background: theme.card.background, borderColor: theme.card.border }}><div className="m-2 h-2 w-2 rounded-full" style={{ backgroundColor: theme.accent }} /><div className="mx-2 mt-5 h-1.5 w-2/3 rounded-full" style={{ backgroundColor: theme.text.primary, opacity: .85 }} /><div className="mx-2 mt-1 h-1 w-1/2 rounded-full" style={{ backgroundColor: theme.text.secondary, opacity: .7 }} /></div><span className="mt-1.5 block truncate text-[10px] font-semibold text-foreground">{theme.name}</span>{active && <span className="absolute right-2 top-2 rounded-full bg-primary p-1 text-primary-foreground shadow"><Check className="h-3 w-3" /></span>}</button>; })}</div>
    <div className="rounded-xl border p-4" style={previewStyle}><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold" style={{ color: draftTheme.text.primary }}>{draftTheme.name}</p><p className="mt-1 text-[10px]" style={{ color: draftTheme.text.secondary }}>Live theme preview</p></div><div className="h-8 w-8 rounded-full" style={{ backgroundColor: draftTheme.accent }} /></div></div>
    {customize && <div className="space-y-3 rounded-xl border border-border/80 bg-card/60 p-3"><div className="flex items-center gap-1.5"><Palette className="h-3.5 w-3.5 text-primary" /><span className="text-xs font-bold">Manual colors</span></div><p className="text-[10px] text-muted-foreground">Edit the draft freely. Nothing is persisted until Save theme is pressed.</p><div className="grid gap-3 sm:grid-cols-2">{([ ["Card background", draftTheme.card.background, (v: string) => updateCustom({ card: { ...draftTheme.card, background: v } })], ["Card border", draftTheme.card.border, (v: string) => updateCustom({ card: { ...draftTheme.card, border: v } })], ["Primary text", draftTheme.text.primary, (v: string) => updateCustom({ text: { ...draftTheme.text, primary: v } })], ["Secondary text", draftTheme.text.secondary, (v: string) => updateCustom({ text: { ...draftTheme.text, secondary: v } })], ["Accent", draftTheme.accent, (v: string) => updateCustom({ accent: v })] ] as const).map(([label,value,update]) => <label key={label} className="block"><span className="mb-1 block text-[10px] font-semibold text-muted-foreground">{label}</span><div className="flex gap-2"><input type="color" value={isHex(value) ? value : "#6366f1"} onChange={e => update(e.target.value)} className="h-9 w-10 cursor-pointer rounded border border-border bg-transparent p-1" /><input value={value} onChange={e => update(e.target.value)} className="field min-w-0 flex-1 font-mono text-[11px]" /></div></label>)}</div><div className="flex items-center gap-2 rounded-lg bg-secondary/60 p-2.5 text-[10px] text-muted-foreground"><Lock className="h-3.5 w-3.5 shrink-0" />Theme writes use the authenticated profile sync. Save theme is the only write action in this panel.</div></div>}
    <div className="flex justify-end gap-2 border-t border-border/60 pt-3">{hasChanges && <button type="button" onClick={discardChanges} disabled={saving} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-[11px] font-semibold text-muted-foreground"><Undo2 className="h-3.5 w-3.5" />Discard</button>}<button type="button" onClick={() => void persist(draftTheme)} disabled={!profile || !hasChanges || saving} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-[11px] font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"><Save className="h-3.5 w-3.5" />{saving ? "Saving…" : "Save theme"}</button></div>
  </div>;
}
