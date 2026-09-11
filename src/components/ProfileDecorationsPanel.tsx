import { useEffect, useState } from "react";
import { Check, Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { auth, db, type Profile } from "@/lib/bio";
import { getProfileDecoration, PROFILE_DECORATIONS, type ProfileDecoration } from "@/lib/profile-decorations";

type DecorationProfile = Profile & { decoration?: ProfileDecoration };

export function ProfileDecorationsPanel() {
  const [profile, setProfile] = useState<DecorationProfile | null>(null);
  const [selected, setSelected] = useState<ProfileDecoration>(getProfileDecoration(null));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void auth.getSession().then(async ({ data }) => {
      if (!data.session || cancelled) return;
      const { data: loaded } = await db.from("profiles").select("*").eq("id", data.session.user.id).maybeSingle();
      if (cancelled) return;
      const current = (loaded ?? null) as DecorationProfile | null;
      setProfile(current);
      setSelected(getProfileDecoration(current?.decoration));
    });
    return () => { cancelled = true; };
  }, []);

  const apply = async (decoration: ProfileDecoration) => {
    if (!profile) { toast.error("Your profile is still loading"); return; }
    setSelected(decoration);
    setSaving(true);
    const { error } = await db.from("profiles").update({ decoration } as unknown as Partial<Profile>).eq("id", profile.id);
    setSaving(false);
    if (error) {
      toast.error(`Could not save decoration: ${error.message}`);
      return;
    }
    setProfile((current) => current ? { ...current, decoration } : current);
    window.dispatchEvent(new CustomEvent("halo-decoration-preview", { detail: decoration }));
    toast.success(`${decoration.name} applied`);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-border/80 bg-secondary/20 p-3.5 sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-primary" /><h3 className="text-sm font-bold text-foreground">Profile Decorations</h3></div>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">Add a visual layer around your profile card without replacing your theme, background, glass, or music settings.</p>
        </div>
        <span className="shrink-0 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">{selected.name}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {PROFILE_DECORATIONS.map((decoration) => {
          const active = selected.id === decoration.id;
          return (
            <button key={decoration.id} type="button" disabled={saving} onClick={() => void apply(decoration)} className={`relative overflow-hidden rounded-xl border p-2.5 text-left transition-all active:scale-[0.98] ${active ? "border-primary bg-primary/10 ring-2 ring-primary/20" : "border-border/80 bg-card hover:border-primary/40"}`}>
              <div className="relative h-14 overflow-hidden rounded-lg border" style={{ background: `radial-gradient(circle at 50% 50%, ${decoration.color}44 0%, transparent 60%), linear-gradient(135deg, ${decoration.secondaryColor}18, transparent 70%)`, borderColor: `${decoration.color}55` }}>
                {decoration.id !== "none" && <div className="absolute inset-2 rounded-lg border opacity-70" style={{ borderColor: decoration.color, boxShadow: `0 0 16px ${decoration.color}55` }} />}
                {decoration.id === "hearts" && <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg" style={{ color: decoration.color }}>♥</span>}
                {decoration.id === "snow" && <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg" style={{ color: decoration.color }}>✦</span>}
                {decoration.id === "sparkles" && <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg" style={{ color: decoration.color }}>✧</span>}
                {decoration.id === "orbit" && <div className="absolute inset-1/2 h-10 w-16 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border" style={{ borderColor: decoration.color }} />}
              </div>
              <span className="mt-1.5 block truncate text-[10px] font-semibold text-foreground">{decoration.name}</span>
              <span className="mt-0.5 block truncate text-[9px] text-muted-foreground">{decoration.description}</span>
              {active && <span className="absolute right-2 top-2 rounded-full bg-primary p-1 text-primary-foreground"><Check className="h-3 w-3" /></span>}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 rounded-lg bg-secondary/60 p-2.5 text-[10px] text-muted-foreground">
        <Lock className="h-3.5 w-3.5 shrink-0" />
        <span>Only the authenticated profile owner can save decoration settings. Decorations are stored on the profile record for public visitors.</span>
      </div>
    </div>
  );
}
