import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}
function write(rel, value) {
  fs.writeFileSync(path.join(root, rel), value, "utf8");
}

// Keep the existing dashboard source intact while upgrading the preset theme
// catalogue. Themes intentionally change the profile-card treatment only;
// wallpaper/background remains controlled by the Background Wallpaper editor.
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

// Theme selection must not overwrite the user's chosen wallpaper.
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

// Make social changes durable immediately, while keeping the dashboard's
// optimistic update/preview behavior. This fixes mobile users losing a newly
// added social link before the dashboard autosave fires.
const socialPath = "src/components/SocialLinksEditor.tsx";
let social = read(socialPath);
social = social.replace(
  'import { uploadMedia, type SocialLink, type SocialPlatform } from "@/lib/bio";',
  'import { db, uploadMedia, type SocialLink, type SocialPlatform } from "@/lib/bio";',
);
social = social.replace(
  '  getPlatformConfig,\n  formatSocialUrl,',
  '  getPlatformConfig,\n  getPlatformIconUrl,\n  formatSocialUrl,',
);
social = social.replace(
  '  onChange: (links: SocialLink[]) => void;',
  '  onChange: (links: SocialLink[]) => void;',
);
social = social.replace(
  '  onChange,\n  accentColor = "#3b82f6",',
  '  onChange: parentOnChange,\n  accentColor = "#3b82f6",',
);
const anchor = '  const currentPlatformConfig = getPlatformConfig(selectedPlatform);';
if (!social.includes('const commitSocialLinks = async')) {
  social = social.replace(
    anchor,
    `${anchor}\n\n  const commitSocialLinks = async (updated: SocialLink[]) => {\n    parentOnChange(updated);\n    if (!userId || userId === "default") return;\n    try {\n      const { error } = await db.from("profiles").update({ social_links: updated }).eq("id", userId);\n      if (error) toast.error("Social link could not be saved: " + (error.message || "database error"));\n      else {\n        window.dispatchEvent(new CustomEvent("halo-store-updated"));\n        try { localStorage.setItem("halo_sync_tick", String(Date.now())); } catch {}\n      }\n    } catch (error) {\n      toast.error(error instanceof Error ? "Social link could not be saved: " + error.message : "Social link could not be saved");\n    }\n  };`,
  );
}
social = social.replace(/onChange\(/g, 'commitSocialLinks(');
social = social.replace(
  '    parentOnChange(updated);',
  '    parentOnChange(updated);',
);
// The global replacement above also touches the helper name only if it matched
// its call syntax; keep the helper declaration stable.
social = social.replace('const commitSocialLinks = async (updated: SocialLink[]) => {\n    parentOnChange(updated);', 'const commitSocialLinks = async (updated: SocialLink[]) => {\n    parentOnChange(updated);');
// Standard platform entries get a real brand icon URL; existing custom icons
// remain untouched.
social = social.replace(
  '      platform: selectedPlatform,\n      url: formatted,\n      active: true,',
  '      platform: selectedPlatform,\n      url: formatted,\n      icon_url: getPlatformIconUrl(selectedPlatform),\n      active: true,',
);
write(socialPath, social);

console.log("Spider Wensors build preparation complete");
