import fs from "node:fs";
import path from "node:path";

const file = path.join(process.cwd(), "src/components/ProfileView.tsx");
let source = fs.readFileSync(file, "utf8");

source = source.replace(
  'import { getPlatformConfig } from "@/lib/socials";',
  'import { getPlatformConfig, getPlatformIconUrl, detectPlatformFromUrl } from "@/lib/socials";'
);

if (!source.includes("function getLinkIconUrl(")) {
  source = source.replace(
    'function hexToRgb(hex: string) {',
    `function getLinkIconUrl(url: string, platform: string) {
  const known = getPlatformIconUrl(platform);
  if (known) return known;
  try {
    const host = new URL(ensureProtocol(url)).hostname.replace(/^www\\./, "");
    return host ? \`https://www.google.com/s2/favicons?domain=\${encodeURIComponent(host)}&sz=64\` : undefined;
  } catch { return undefined; }
}

function hexToRgb(hex: string) {`
  );
}

// Upgrade only the existing link-card internals. Keeping the original JSX
// structure avoids fragile large JSX replacements during Vercel builds.
source = source.replace(
  'const safeUrl = ensureProtocol(link.url); const platform = getDomainPlatform(link.url); const cfg = getPlatformConfig(platform); const Icon = cfg.icon; const iconColor = readableColor(cfg.color, surfaceSoft, readableAccent);',
  'const safeUrl = ensureProtocol(link.url); const platform = detectPlatformFromUrl(link.url); const cfg = getPlatformConfig(platform); const Icon = cfg.icon; const iconColor = readableColor(cfg.color, surfaceSoft, readableAccent); const iconUrl = getLinkIconUrl(link.url, platform);'
);

source = source.replace(
  '<span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg" style={{ backgroundColor: `color-mix(in oklab, ${readableAccent} 13%, transparent)`, color: iconColor }}><Icon className="h-4 w-4" style={{ color: iconColor }} /></span>',
  '<span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border" style={{ backgroundColor: `color-mix(in oklab, ${readableAccent} 10%, transparent)`, borderColor: `color-mix(in oklab, ${iconColor} 28%, transparent)`, color: iconColor, boxShadow: `0 0 18px color-mix(in oklab, ${iconColor} 18%, transparent)` }}>{iconUrl ? <img src={iconUrl} alt="" className="h-5 w-5 object-contain transition-transform group-hover:scale-110" onError={(e) => { e.currentTarget.style.display = "none"; }} /> : <Icon className="h-5 w-5" style={{ color: iconColor }} />}</span>'
);

source = source.replace(
  '<span className="min-w-0 flex-1 truncate pr-2 text-left">{link.title}</span>',
  '<span className="min-w-0 flex-1 truncate pr-2 text-left">{link.title}</span>'
);

fs.writeFileSync(file, source, "utf8");
console.log("Spider Wensors build-safe profile UI enhancement applied");
