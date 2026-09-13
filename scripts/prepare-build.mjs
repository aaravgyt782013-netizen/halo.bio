import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dashboardPath = path.join(root, "src/routes/dashboard.tsx");
let dashboard = fs.readFileSync(dashboardPath, "utf8");

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
  { name: "Card Mode", bgType: "color" as const, bgValue: "#090d16", accent: "#6366f1", opacity: 0.68, blur: 24, radius: 24 },
  { name: "Background Typewriter", bgType: "color" as const, bgValue: "#090d16", accent: "#6366f1", opacity: 0.68, blur: 24, radius: 24 },
];`;
    dashboard = dashboard.slice(0, themeStart) + themes + dashboard.slice(themeEnd + 2);
  }
}

dashboard = dashboard.replace(
  /const applyTheme = \(preset: \(typeof PRESET_THEMES\)\[number\]\) => \{[\s\S]*?\n  \};/,
  `const applyTheme = (preset: (typeof PRESET_THEMES)[number]) => {
    const presentation = preset.name === "Background Typewriter" ? "background" : "card";
    patch({ profile_layout: presentation, accent_color: preset.accent, card_opacity: preset.opacity, card_blur: preset.blur, card_radius: preset.radius, background_type: preset.bgType, background_value: preset.bgValue } as any);
    toast.success(presentation === "background" ? "Background Typewriter mode enabled!" : \`Applied \${preset.name} theme!\`);
  };`,
);

dashboard = dashboard.replace(
  '          enter_text: profile.enter_text,',
  '          enter_text: profile.enter_text,\n          profile_layout: (profile as any).profile_layout || "card",',
);

// Mount the badge tab portal inside Dashboard itself. The portal watches the
// real four-tab editor bar and inserts Badges immediately after Media & FX.
if (!dashboard.includes("<DashboardBadgesPortal profile={profile} />")) {
  dashboard = dashboard.replace(
    'import { SocialLinksEditor } from "@/components/SocialLinksEditor";',
    'import { SocialLinksEditor } from "@/components/SocialLinksEditor";\nimport { DashboardBadgesPortal } from "@/components/DashboardBadgesPortal";',
  );
  const dashboardStart = dashboard.indexOf("function Dashboard()");
  const returnIndex = dashboard.indexOf("  return (", dashboardStart);
  if (dashboardStart >= 0 && returnIndex >= 0) {
    dashboard = dashboard.slice(0, returnIndex) + "  const badgePortal = <DashboardBadgesPortal profile={profile} />;\n\n" + dashboard.slice(returnIndex);
    dashboard = dashboard.replace("  return (", "  return (\n    <>\n      {badgePortal}", 1);
    // Close the fragment immediately before Dashboard's final return element.
    const endMarker = "\n  );\n}\n";
    const endIndex = dashboard.lastIndexOf(endMarker);
    if (endIndex >= 0) {
      dashboard = dashboard.slice(0, endIndex) + "\n    </>" + dashboard.slice(endIndex);
    }
  }
}

fs.writeFileSync(dashboardPath, dashboard, "utf8");
console.log("Spider Wensors build preparation complete (themes + dashboard badges)");
