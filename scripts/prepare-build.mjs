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

fs.writeFileSync(dashboardPath, dashboard, "utf8");

// Media: allow image/video selections up to 10MB in the app. Vercel's
// function ingress still has a 4.5MB request-body ceiling, so deployments
// should use direct object storage for files above that platform ceiling.
const bioPath = path.join(root, "src/lib/bio.ts");
let bio = fs.readFileSync(bioPath, "utf8");
bio = bio.replace(
  'if (file.type.startsWith("video/") && file.size > 1 * 1024 * 1024) throw new Error("Uploaded video clip exceeds 1MB. Please select a video file under 1MB.");',
  'if ((file.type.startsWith("video/") || file.type.startsWith("image/")) && file.size > 10 * 1024 * 1024) throw new Error("Background image/video exceeds the 10MB upload limit.");',
);
fs.writeFileSync(bioPath, bio, "utf8");

const serverPath = path.join(root, "src/server.ts");
let server = fs.readFileSync(serverPath, "utf8");
server = server.replace(
  'if (file.type.startsWith("video/") && file.size > 1 * 1024 * 1024) {\n              return jsonResponse({ error: "Video exceeds 1MB limit" }, 413);\n            }',
  'if ((file.type.startsWith("video/") || file.type.startsWith("image/")) && file.size > 10 * 1024 * 1024) {\n              return jsonResponse({ error: "Image/video exceeds 10MB limit" }, 413);\n            }',
);
server = server.replace(
  'MEDIA UPLOAD ROUTE (Supports videos up to 1MB and custom icons)',
  'MEDIA UPLOAD ROUTE (Supports images/videos up to 10MB and custom icons)',
);
fs.writeFileSync(serverPath, server, "utf8");

// Badge deletion: staff/admin can remove any badge, including built-ins.
// A tombstone definition keeps a deleted built-in from being recreated by
// mergeDefinitions, while the editor removes the badge from every profile.
const badgeEditorPath = path.join(root, "src/routes/admin-badges/$badgeId.tsx");
let badgeEditor = fs.readFileSync(badgeEditorPath, "utf8");
badgeEditor = badgeEditor.replace(
  'import { ArrowLeft, Award, Check, Loader2, Save, Search } from "lucide-react";',
  'import { ArrowLeft, Award, Check, Loader2, Save, Search, Trash2 } from "lucide-react";',
);
badgeEditor = badgeEditor.replace(
  '  saved.forEach((badge) => map.set(badge.id, badge));\n  return [...map.values()];',
  '  const deleted = new Set(saved.filter((badge) => (badge as ProfileBadge & { deleted?: boolean }).deleted).map((badge) => badge.id));\n  deleted.forEach((id) => map.delete(id));\n  saved.filter((badge) => !(badge as ProfileBadge & { deleted?: boolean }).deleted).forEach((badge) => map.set(badge.id, badge));\n  return [...map.values()];',
);
const deleteFn = `\n  const deleteBadge = async () => {\n    if (!user || !owner || !badge) return;\n    if (!window.confirm(\`Delete the badge "\${badge.name}"? It will be removed from every player.\`)) return;\n    setSaving(true);\n    try {\n      const definitions = mergeDefinitions(readDefinitions(owner.social_links)).filter((item) => item.id !== badge.id);\n      const tombstone = { ...badge, deleted: true } as ProfileBadge & { deleted: boolean };\n      await adminMutateProfile(owner.id, { social_links: definitionLinks(owner.social_links, [...definitions, tombstone]) });\n      await Promise.all(profiles.map((profile) => {\n        const current = extractBadges(profile.social_links);\n        if (!current.some((item) => item.id === badge.id)) return Promise.resolve();\n        return adminMutateProfile(profile.id, { social_links: mergeBadges(profile.social_links, current.filter((item) => item.id !== badge.id)) });\n      }));\n      toast.success(\`Deleted \${badge.name} from all players\`);\n      navigate({ to: "/admin-badges" });\n    } catch (error) {\n      toast.error(error instanceof Error ? error.message : "Could not delete badge");\n    } finally { setSaving(false); }\n  };\n`;
badgeEditor = badgeEditor.replace('  const togglePlayer = async (profile: Profile) => {', deleteFn + '\n  const togglePlayer = async (profile: Profile) => {');
badgeEditor = badgeEditor.replace(
  '<button type="button" onClick={() => void saveBadge()} disabled={saving} className="btn-primary"><Save className="h-4 w-4" /> {saving ? "Saving…" : "Save"}</button>',
  '<div className="flex items-center gap-2"><button type="button" onClick={() => void deleteBadge()} disabled={saving} className="btn-ghost border border-red-500/30 text-red-300"><Trash2 className="h-4 w-4" /> Delete</button><button type="button" onClick={() => void saveBadge()} disabled={saving} className="btn-primary"><Save className="h-4 w-4" /> {saving ? "Saving…" : "Save"}</button></div>',
);
fs.writeFileSync(badgeEditorPath, badgeEditor, "utf8");

const badgeListPath = path.join(root, "src/routes/admin-badges.tsx");
let badgeList = fs.readFileSync(badgeListPath, "utf8");
badgeList = badgeList.replace(
  '  saved.forEach((b) => map.set(b.id, b));\n  return [...map.values()];',
  '  const deleted = new Set(saved.filter((b) => (b as ProfileBadge & { deleted?: boolean }).deleted).map((b) => b.id));\n  deleted.forEach((id) => map.delete(id));\n  saved.filter((b) => !(b as ProfileBadge & { deleted?: boolean }).deleted).forEach((b) => map.set(b.id, b));\n  return [...map.values()];',
);
fs.writeFileSync(badgeListPath, badgeList, "utf8");

console.log("Spider Wensors build preparation complete (themes, 10MB media validation, badge deletion)");