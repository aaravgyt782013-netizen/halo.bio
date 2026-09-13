import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const write = (p, s) => fs.writeFileSync(path.join(root, p), s, "utf8");

// Preserve the full editor while ensuring every preset changes only card styling.
const dashboardPath = "src/routes/dashboard.tsx";
let dashboard = read(dashboardPath);
const themeStart = dashboard.indexOf("const PRESET_THEMES = [");
if (themeStart >= 0) {
  const themeEnd = dashboard.indexOf("];", themeStart);
  if (themeEnd >= 0) {
    const themes = `const PRESET_THEMES = [
  { name: "Obsidian", bgType: "color" as const, bgValue: "#090d16", accent: "#6366f1", opacity: 0.68, blur: 24, radius: 24 },
  { name: "Midnight Black", bgType: "color" as const, bgValue: "#020204", accent: "#ef4444", opacity: 0.74, blur: 18, radius: 18 },
  { name: "Spider Red", bgType: "color" as const, bgValue: "#170609", accent: "#ef233c", opacity: 0.72, blur: 22, radius: 22 },
  { name: "Electric Blue", bgType: "color" as const, bgValue: "#06132a", accent: "#3b82f6", opacity: 0.70, blur: 24, radius: 24 },
  { name: "Black & Blue", bgType: "color" as const, bgValue: "#050a14", accent: "#22d3ee", opacity: 0.76, blur: 20, radius: 20 },
  { name: "Crimson Noir", bgType: "color" as const, bgValue: "#120509", accent: "#dc2626", opacity: 0.78, blur: 26, radius: 28 },
  { name: "Cyber Violet", bgType: "color" as const, bgValue: "#120820", accent: "#a855f7", opacity: 0.66, blur: 28, radius: 26 },
  { name: "Neon Purple", bgType: "color" as const, bgValue: "#0e0719", accent: "#c084fc", opacity: 0.72, blur: 30, radius: 30 },
  { name: "Ocean Mist", bgType: "color" as const, bgValue: "#061722", accent: "#06b6d4", opacity: 0.68, blur: 22, radius: 24 },
  { name: "Deep Ocean", bgType: "color" as const, bgValue: "#03101c", accent: "#0ea5e9", opacity: 0.78, blur: 18, radius: 18 },
  { name: "Emerald", bgType: "color" as const, bgValue: "#03150f", accent: "#10b981", opacity: 0.70, blur: 25, radius: 22 },
  { name: "Forest Glass", bgType: "color" as const, bgValue: "#07130e", accent: "#22c55e", opacity: 0.76, blur: 20, radius: 20 },
  { name: "Sunset Glow", bgType: "color" as const, bgValue: "#1e0905", accent: "#f97316", opacity: 0.70, blur: 22, radius: 20 },
  { name: "Golden Hour", bgType: "color" as const, bgValue: "#171005", accent: "#f59e0b", opacity: 0.74, blur: 24, radius: 26 },
  { name: "Rose Noir", bgType: "color" as const, bgValue: "#19070f", accent: "#fb7185", opacity: 0.72, blur: 26, radius: 28 },
  { name: "Ice Glass", bgType: "color" as const, bgValue: "#0b1420", accent: "#93c5fd", opacity: 0.58, blur: 30, radius: 30 },
  { name: "Pure Light", bgType: "color" as const, bgValue: "#f8fafc", accent: "#2563eb", opacity: 0.86, blur: 18, radius: 24 },
  { name: "White & Red", bgType: "color" as const, bgValue: "#ffffff", accent: "#dc2626", opacity: 0.90, blur: 14, radius: 20 },
  { name: "Silver Night", bgType: "color" as const, bgValue: "#dbe4ee", accent: "#334155", opacity: 0.84, blur: 18, radius: 22 },
  { name: "Black & White", bgType: "color" as const, bgValue: "#0a0a0a", accent: "#f8fafc", opacity: 0.82, blur: 16, radius: 18 },
  { name: "Red & Blue", bgType: "color" as const, bgValue: "#090b17", accent: "#3b82f6", opacity: 0.74, blur: 24, radius: 26 },
];`;
    dashboard = dashboard.slice(0, themeStart) + themes + dashboard.slice(themeEnd + 2);
  }
}

dashboard = dashboard.replace(
  /const applyTheme = \(preset: \(typeof PRESET_THEMES\)\[number\]\) => \{[\s\S]*?\n  \};/,
  `const applyTheme = (preset: (typeof PRESET_THEMES)[number]) => {
    patch({
      accent_color: preset.accent,
      card_opacity: preset.opacity,
      card_blur: preset.blur,
      card_radius: preset.radius,
    });
    toast.success(\`Applied \${preset.name} card theme! Wallpaper stays unchanged.\`);
  };`,
);
write(dashboardPath, dashboard);

// The wallpaper is independent from the card theme. Resolve light/dark from
// the selected theme's persisted card signature, so Pure Light stays light
// even when the user uses a dark image/video wallpaper.
const profileViewPath = "src/components/ProfileView.tsx";
let profileView = read(profileViewPath);
const oldLight = '  const isLightTheme = profile.background_type === "color" && luminance(themeBackground) > 0.58;';
const newLight = `  const themeSignature = [String(profile.accent_color || "").toLowerCase(), Number(profile.card_opacity || 0).toFixed(2), String(profile.card_blur ?? ""), String(profile.card_radius ?? "")].join("|");
  const isLightTheme = new Set(["#2563eb|0.86|18|24", "#dc2626|0.90|14|20", "#334155|0.84|18|22"]).has(themeSignature);`;
if (profileView.includes(oldLight)) profileView = profileView.replace(oldLight, newLight);
write(profileViewPath, profileView);

// Never hydrate a public profile from the editor's global localStorage keys.
// Those keys can belong to a different logged-in user and caused names/links
// to merge between profiles. Public URLs always read their own DB record.
const publicPath = "src/routes/$username.tsx";
let publicProfile = read(publicPath);
const effectStart = publicProfile.indexOf("  useEffect(() => {\n    const applyLocal");
const effectEndMarker = "\n\n  const handleEnter = async () => {";
const effectEnd = publicProfile.indexOf(effectEndMarker, effectStart);
if (effectStart >= 0 && effectEnd > effectStart) {
  const cleanEffect = `  useEffect(() => {
    let disposed = false;
    const refreshPublicProfile = async () => {
      try {
        const fresh = await fetchProfileByUsername(profile.username);
        if (!disposed && fresh?.profile) {
          setProfile(fresh.profile);
          setLinks(fresh.links);
        }
      } catch (err) {
        console.warn("Could not refresh public profile:", err);
      }
    };
    window.addEventListener("halo-store-updated", refreshPublicProfile);
    window.addEventListener("focus", refreshPublicProfile);
    void refreshPublicProfile();
    return () => {
      disposed = true;
      window.removeEventListener("halo-store-updated", refreshPublicProfile);
      window.removeEventListener("focus", refreshPublicProfile);
    };
  }, [profile.username]);`;
  publicProfile = publicProfile.slice(0, effectStart) + cleanEffect + publicProfile.slice(effectEnd);
}
write(publicPath, publicProfile);

console.log("Spider Wensors build preparation complete: themes are persistent and public profiles are isolated");
