export type ThemeCardMode = "solid" | "gradient" | "glass";
export type ThemePageMode = "solid" | "gradient" | "image" | "video";

export type ProfileTheme = {
  id: string;
  name: string;
  card: {
    mode: ThemeCardMode;
    background: string;
    border: string;
  };
  page: {
    mode: ThemePageMode;
    value: string;
  };
  text: {
    primary: string;
    secondary: string;
  };
  accent: string;
  customized?: boolean;
};

export const DEFAULT_PROFILE_THEME: ProfileTheme = {
  id: "obsidian",
  name: "Obsidian",
  card: { mode: "glass", background: "rgba(17, 24, 39, 0.68)", border: "rgba(255,255,255,0.16)" },
  page: { mode: "solid", value: "#090d16" },
  text: { primary: "#f8fafc", secondary: "#94a3b8" },
  accent: "#6366f1",
};

export const CURATED_PROFILE_THEMES: ProfileTheme[] = [
  DEFAULT_PROFILE_THEME,
  { id: "midnight-blue", name: "Midnight Blue", card: { mode: "glass", background: "rgba(8,20,40,0.70)", border: "#244c7a" }, page: { mode: "gradient", value: "linear-gradient(145deg,#050b16 0%,#0b2340 100%)" }, text: { primary: "#eff6ff", secondary: "#93c5fd" }, accent: "#3b82f6" },
  { id: "cyber-violet", name: "Cyber Violet", card: { mode: "gradient", background: "linear-gradient(135deg,rgba(45,20,78,.88),rgba(20,12,40,.78))", border: "#8b5cf6" }, page: { mode: "gradient", value: "linear-gradient(135deg,#10071f 0%,#2e1065 100%)" }, text: { primary: "#faf5ff", secondary: "#c4b5fd" }, accent: "#a855f7" },
  { id: "crimson-night", name: "Crimson Night", card: { mode: "solid", background: "#1b0b12", border: "#7f1d1d" }, page: { mode: "gradient", value: "linear-gradient(150deg,#09090b 0%,#3f0d19 100%)" }, text: { primary: "#fff1f2", secondary: "#fda4af" }, accent: "#ef4444" },
  { id: "emerald", name: "Emerald", card: { mode: "glass", background: "rgba(5,40,29,.72)", border: "#17634b" }, page: { mode: "gradient", value: "linear-gradient(145deg,#03120e 0%,#063c2b 100%)" }, text: { primary: "#ecfdf5", secondary: "#86efac" }, accent: "#10b981" },
  { id: "ocean", name: "Ocean", card: { mode: "gradient", background: "linear-gradient(135deg,rgba(7,45,61,.9),rgba(7,27,43,.78))", border: "#155e75" }, page: { mode: "gradient", value: "linear-gradient(145deg,#03131d 0%,#083344 100%)" }, text: { primary: "#ecfeff", secondary: "#67e8f9" }, accent: "#06b6d4" },
  { id: "sunset", name: "Sunset", card: { mode: "gradient", background: "linear-gradient(135deg,rgba(72,25,10,.9),rgba(50,15,15,.78))", border: "#c2410c" }, page: { mode: "gradient", value: "linear-gradient(145deg,#1c0a05 0%,#7c2d12 100%)" }, text: { primary: "#fff7ed", secondary: "#fdba74" }, accent: "#f97316" },
  { id: "rose", name: "Rose", card: { mode: "glass", background: "rgba(61,14,40,.72)", border: "#9d174d" }, page: { mode: "gradient", value: "linear-gradient(145deg,#180711 0%,#500724 100%)" }, text: { primary: "#fff1f2", secondary: "#f9a8d4" }, accent: "#ec4899" },
  { id: "arctic", name: "Arctic", card: { mode: "glass", background: "rgba(226,242,255,.55)", border: "rgba(255,255,255,.75)" }, page: { mode: "gradient", value: "linear-gradient(145deg,#dbeafe 0%,#f0f9ff 100%)" }, text: { primary: "#0f172a", secondary: "#475569" }, accent: "#2563eb" },
  { id: "mono", name: "Monochrome", card: { mode: "solid", background: "#171717", border: "#525252" }, page: { mode: "gradient", value: "linear-gradient(145deg,#050505 0%,#262626 100%)" }, text: { primary: "#fafafa", secondary: "#a3a3a3" }, accent: "#ffffff" },
  { id: "lavender", name: "Lavender", card: { mode: "glass", background: "rgba(45,31,73,.66)", border: "#7c3aed" }, page: { mode: "gradient", value: "linear-gradient(145deg,#120b20 0%,#4c1d95 100%)" }, text: { primary: "#faf5ff", secondary: "#d8b4fe" }, accent: "#c084fc" },
  { id: "forest", name: "Forest", card: { mode: "solid", background: "#0b2117", border: "#166534" }, page: { mode: "gradient", value: "linear-gradient(145deg,#020c07 0%,#14532d 100%)" }, text: { primary: "#f0fdf4", secondary: "#86efac" }, accent: "#22c55e" },
  { id: "aqua-glass", name: "Aqua Glass", card: { mode: "glass", background: "rgba(9,44,48,.56)", border: "rgba(103,232,249,.42)" }, page: { mode: "gradient", value: "linear-gradient(145deg,#021518 0%,#164e63 100%)" }, text: { primary: "#ecfeff", secondary: "#a5f3fc" }, accent: "#22d3ee" },
  { id: "golden-hour", name: "Golden Hour", card: { mode: "gradient", background: "linear-gradient(135deg,rgba(61,45,9,.9),rgba(42,28,8,.82))", border: "#a16207" }, page: { mode: "gradient", value: "linear-gradient(145deg,#171006 0%,#713f12 100%)" }, text: { primary: "#fffbeb", secondary: "#fcd34d" }, accent: "#f59e0b" },
  { id: "neon-green", name: "Neon Green", card: { mode: "glass", background: "rgba(4,35,22,.66)", border: "#22c55e" }, page: { mode: "gradient", value: "linear-gradient(145deg,#020b06 0%,#052e16 100%)" }, text: { primary: "#f0fdf4", secondary: "#86efac" }, accent: "#4ade80" },
  { id: "amethyst", name: "Amethyst", card: { mode: "gradient", background: "linear-gradient(135deg,#21113d,#35146b)", border: "#a78bfa" }, page: { mode: "gradient", value: "linear-gradient(145deg,#0d0718,#3b1d6b)" }, text: { primary: "#faf5ff", secondary: "#c4b5fd" }, accent: "#8b5cf6" },
  { id: "graphite", name: "Graphite", card: { mode: "glass", background: "rgba(39,39,42,.78)", border: "#71717a" }, page: { mode: "gradient", value: "linear-gradient(145deg,#09090b,#27272a)" }, text: { primary: "#f4f4f5", secondary: "#a1a1aa" }, accent: "#d4d4d8" },
  { id: "aurora", name: "Aurora", card: { mode: "gradient", background: "linear-gradient(135deg,rgba(7,35,42,.92),rgba(28,15,61,.88),rgba(7,42,32,.86))", border: "#2dd4bf" }, page: { mode: "gradient", value: "linear-gradient(135deg,#031318 0%,#1e1640 52%,#04251b 100%)" }, text: { primary: "#ecfeff", secondary: "#99f6e4" }, accent: "#2dd4bf" },
  { id: "cherry", name: "Cherry", card: { mode: "glass", background: "rgba(69,10,30,.78)", border: "#be123c" }, page: { mode: "gradient", value: "linear-gradient(145deg,#18050c,#4c0519)" }, text: { primary: "#fff1f2", secondary: "#fda4af" }, accent: "#fb7185" },
  { id: "sandstone", name: "Sandstone", card: { mode: "solid", background: "#292015", border: "#a16207" }, page: { mode: "gradient", value: "linear-gradient(145deg,#17120b,#57401b)" }, text: { primary: "#fffaf0", secondary: "#d6b979" }, accent: "#eab308" },
  { id: "iceberg", name: "Iceberg", card: { mode: "glass", background: "rgba(15,45,64,.58)", border: "#7dd3fc" }, page: { mode: "gradient", value: "linear-gradient(145deg,#06131d,#164e63)" }, text: { primary: "#f0f9ff", secondary: "#bae6fd" }, accent: "#38bdf8" },
  { id: "plasma", name: "Plasma", card: { mode: "gradient", background: "linear-gradient(135deg,#35105d,#6d174e)", border: "#e879f9" }, page: { mode: "gradient", value: "linear-gradient(135deg,#12051f,#581c87,#4a044e)" }, text: { primary: "#fdf4ff", secondary: "#f0abfc" }, accent: "#e879f9" },
  { id: "coffee", name: "Coffee", card: { mode: "solid", background: "#241812", border: "#92400e" }, page: { mode: "gradient", value: "linear-gradient(145deg,#100a07,#3f2415)" }, text: { primary: "#fff7ed", secondary: "#d6a77a" }, accent: "#c08457" },
  { id: "royal", name: "Royal", card: { mode: "glass", background: "rgba(20,24,62,.72)", border: "#6366f1" }, page: { mode: "gradient", value: "linear-gradient(145deg,#060817,#1e1b4b)" }, text: { primary: "#eef2ff", secondary: "#a5b4fc" }, accent: "#818cf8" },
];

export function getProfileTheme(theme: unknown): ProfileTheme {
  if (!theme || typeof theme !== "object") return DEFAULT_PROFILE_THEME;
  const candidate = theme as Partial<ProfileTheme>;
  const preset = CURATED_PROFILE_THEMES.find((item) => item.id === candidate.id);
  const base = preset ?? DEFAULT_PROFILE_THEME;
  return {
    ...base,
    ...candidate,
    card: { ...base.card, ...(candidate.card ?? {}) },
    page: { ...base.page, ...(candidate.page ?? {}) },
    text: { ...base.text, ...(candidate.text ?? {}) },
  };
}
