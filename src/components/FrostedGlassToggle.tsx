import { Sparkles, Layers, Sliders, Shield } from "lucide-react";
import type { GlassIntensity } from "@/lib/bio";

type Props = {
  intensity: GlassIntensity;
  currentOpacity: number;
  currentBlur: number;
  onChange: (preset: {
    intensity: GlassIntensity;
    opacity: number;
    blur: number;
  }) => void;
};

interface PresetDefinition {
  id: GlassIntensity;
  label: string;
  tagline: string;
  opacity: number;
  blur: number;
  icon: typeof Sparkles;
  previewBg: string;
}

const GLASS_PRESETS: PresetDefinition[] = [
  {
    id: "subtle",
    label: "Subtle",
    tagline: "High clarity, soft sheen",
    opacity: 0.28,
    blur: 8,
    icon: Sparkles,
    previewBg: "rgba(255, 255, 255, 0.22)",
  },
  {
    id: "medium",
    label: "Medium",
    tagline: "Classic frosted acrylic",
    opacity: 0.52,
    blur: 18,
    icon: Layers,
    previewBg: "rgba(255, 255, 255, 0.48)",
  },
  {
    id: "heavy",
    label: "Heavy",
    tagline: "Deep velvety milk glass",
    opacity: 0.74,
    blur: 30,
    icon: Sliders,
    previewBg: "rgba(255, 255, 255, 0.72)",
  },
  {
    id: "ultra",
    label: "Ultra",
    tagline: "Crystallized dense acrylic",
    opacity: 0.88,
    blur: 44,
    icon: Shield,
    previewBg: "rgba(255, 255, 255, 0.90)",
  },
];

export function FrostedGlassToggle({
  intensity = "medium",
  currentOpacity,
  currentBlur,
  onChange,
}: Props) {
  // Determine if active preset matches current slider values or is custom
  const matchedPreset = GLASS_PRESETS.find(
    (p) =>
      p.id === intensity ||
      (Math.abs(p.opacity - currentOpacity) < 0.05 &&
        Math.abs(p.blur - currentBlur) <= 3),
  );

  const activeId = intensity || matchedPreset?.id || "medium";

  return (
    <div className="space-y-2.5 w-full min-w-0">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Frosted Glass Intensity Toggle</span>
        </label>
        <span className="text-[10px] font-semibold text-primary uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10">
          {activeId} Intensity
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full min-w-0">
        {GLASS_PRESETS.map((preset) => {
          const isSelected = activeId === preset.id;
          const Icon = preset.icon;

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() =>
                onChange({
                  intensity: preset.id,
                  opacity: preset.opacity,
                  blur: preset.blur,
                })
              }
              className={`relative flex flex-col items-start p-3 rounded-xl border text-left transition-all active:scale-[0.98] overflow-hidden ${
                isSelected
                  ? "border-primary bg-primary/10 shadow-sm ring-2 ring-primary/20"
                  : "border-border/80 bg-secondary/40 hover:bg-secondary hover:border-primary/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              {/* Subtle glass refraction swatch simulation */}
              <div
                className="w-full h-3 rounded-md mb-2 border border-white/20 shadow-inner"
                style={{
                  backgroundColor: preset.previewBg,
                  backdropFilter: `blur(${preset.blur / 2}px)`,
                }}
              />

              <div className="flex items-center gap-1.5 w-full">
                <Icon
                  className={`h-3.5 w-3.5 shrink-0 ${
                    isSelected ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <span
                  className={`text-xs font-bold truncate ${
                    isSelected ? "text-foreground" : "text-foreground/80"
                  }`}
                >
                  {preset.label}
                </span>
              </div>

              <p className="text-[10px] text-muted-foreground leading-tight mt-1 line-clamp-1">
                {preset.tagline}
              </p>

              <div className="mt-2 flex items-center gap-2 text-[9px] font-mono text-muted-foreground">
                <span>{Math.round(preset.opacity * 100)}% opac</span>
                <span>·</span>
                <span>{preset.blur}px blur</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
