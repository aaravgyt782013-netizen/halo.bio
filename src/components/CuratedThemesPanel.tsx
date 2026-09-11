import { useEffect, useMemo, useState } from "react";
import { Check, Lock, Palette, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { auth, db, type Profile } from "@/lib/bio";
import {
  CURATED_PROFILE_THEMES,
  DEFAULT_PROFILE_THEME,
  getProfileTheme,
  type ProfileTheme,
} from "@/lib/profile-themes";

type Props = {
  onThemeSaved?: (theme: ProfileTheme) => void;
};

function isHex(value: string) {
  return /^#[0-9a-f]{3,8}$/i.test(value);
}

export function CuratedThemesPanel({ onThemeSaved }: Props) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selected, setSelected] = useState<ProfileTheme>(DEFAULT_PROFILE_THEME);
  const [customize, setCustomize] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void auth.getSession().then(async ({ data }) => {
      if (!data.session || cancelled) return;
      const { data: loaded } = await db
        .from("profiles")
        .select("*")
        .eq("id", data.session.user.id)
        .maybeSingle();
      if (cancelled) return;
      const current = (loaded ?? null) as Profile | null;
      setProfile(current);
      const currentTheme = getProfileTheme(
        (current as (Profile & { theme?: unknown }) | null)?.theme,
      );
      setSelected(currentTheme);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const previewStyle = useMemo(() => {
    const theme = selected;
    return {
      background:
        theme.card.mode === "solid"
          ? theme.card.background
          : theme.card.mode === "gradient"
            ? theme.card.background
            : theme.card.background,
      borderColor: theme.card.border,
      color: theme.text.primary,
    };
  }, [selected]);

  const persist = async (theme: ProfileTheme) => {
    if (!profile) {
      toast.error("Your profile is still loading");
      return;
    }
    setSaving(true);
    const payload = { theme } as unknown as Partial<Profile>;
    const { error } = await db.from("profiles").update(payload).eq("id", profile.id);
    setSaving(false);
    if (error) {
      toast.error(`Could not save theme: ${error.message}`);
      return;
    }
    setProfile((current) =>
      current ? ({ ...current, theme } as Profile) : current,
    );
    onThemeSaved?.(theme);
    toast.success(`${theme.name} applied`);
  };

  const applyPreset = async (theme: ProfileTheme) => {
    setSelected(theme);
    await persist(theme);
  };

  const updateCustom = async (patch: Partial<ProfileTheme>) => {
    const next = getProfileTheme({ ...selected, ...patch, customized: true });
    setSelected(next);
    await persist(next);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-border/80 bg-secondary/20 p-3.5 sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Themes</h3>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            Curated profile themes. Selecting one updates the live profile and
            stores the theme on your profile record.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCustomize((value) => !value)}
          className={`shrink-0 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
            customize
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-card text-muted-foreground hover:text-foreground"
          }`}
        >
          <Palette className="mr-1 inline h-3.5 w-3.5" />
          Customize
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {CURATED_PROFILE_THEMES.map((theme) => {
          const active = selected.id === theme.id && !selected.customized;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => void applyPreset(theme)}
              disabled={saving}
              className={`group relative overflow-hidden rounded-xl border p-2 text-left transition-all active:scale-[0.98] ${
                active
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border/80 hover:border-primary/50"
              }`}
            >
              <div
                className="h-16 rounded-lg border"
                style={{
                  background: theme.card.background,
                  borderColor: theme.card.border,
                }}
              >
                <div
                  className="m-2 h-2 w-2 rounded-full"
                  style={{ backgroundColor: theme.accent }}
                />
                <div className="mx-2 mt-5 h-1.5 w-2/3 rounded-full" style={{ backgroundColor: theme.text.primary, opacity: 0.85 }} />
                <div className="mx-2 mt-1 h-1 w-1/2 rounded-full" style={{ backgroundColor: theme.text.secondary, opacity: 0.7 }} />
              </div>
              <span className="mt-1.5 block truncate text-[10px] font-semibold text-foreground">
                {theme.name}
              </span>
              {active && (
                <span className="absolute right-2 top-2 rounded-full bg-primary p-1 text-primary-foreground shadow">
                  <Check className="h-3 w-3" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div
        className="rounded-xl border p-4 transition-colors"
        style={previewStyle}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold" style={{ color: selected.text.primary }}>
              {selected.name}
            </p>
            <p className="mt-1 text-[10px]" style={{ color: selected.text.secondary }}>
              Live theme preview
            </p>
          </div>
          <div className="h-8 w-8 rounded-full" style={{ backgroundColor: selected.accent }} />
        </div>
      </div>

      {customize && (
        <div className="space-y-3 rounded-xl border border-border/80 bg-card/60 p-3">
          <div className="flex items-center gap-1.5">
            <Palette className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-bold">Manual colors</span>
          </div>
          <p className="text-[10px] text-muted-foreground">
            These values start from the selected preset. Customizing does not
            remove the preset; it turns it into your own variant.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ["Card background", selected.card.background, (value: string) => updateCustom({ card: { ...selected.card, background: value } })],
                ["Card border", selected.card.border, (value: string) => updateCustom({ card: { ...selected.card, border: value } })],
                ["Primary text", selected.text.primary, (value: string) => updateCustom({ text: { ...selected.text, primary: value } })],
                ["Secondary text", selected.text.secondary, (value: string) => updateCustom({ text: { ...selected.text, secondary: value } })],
                ["Accent", selected.accent, (value: string) => updateCustom({ accent: value })],
              ] as const
            ).map(([label, value, update]) => (
              <label key={label} className="block">
                <span className="mb-1 block text-[10px] font-semibold text-muted-foreground">{label}</span>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={isHex(value) ? value : "#6366f1"}
                    onChange={(event) => update(event.target.value)}
                    className="h-9 w-10 cursor-pointer rounded border border-border bg-transparent p-1"
                  />
                  <input
                    value={value}
                    onChange={(event) => update(event.target.value)}
                    className="field min-w-0 flex-1 font-mono text-[11px]"
                  />
                </div>
              </label>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-secondary/60 p-2.5 text-[10px] text-muted-foreground">
            <Lock className="h-3.5 w-3.5 shrink-0" />
            Theme writes go through the existing authenticated profile sync,
            so another user cannot update your profile by changing the client ID.
          </div>
        </div>
      )}
    </div>
  );
}
