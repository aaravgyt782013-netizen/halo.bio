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

// Use the URL itself to detect the service, so custom URL slots still receive
// a recognizable app/site icon without requiring the creator to choose one.
source = source.replace(
  'const safeUrl = ensureProtocol(link.url); const platform = getDomainPlatform(link.url); const cfg = getPlatformConfig(platform); const Icon = cfg.icon; const iconColor = readableColor(cfg.color, surfaceSoft, readableAccent);',
  'const safeUrl = ensureProtocol(link.url); const platform = detectPlatformFromUrl(link.url); const cfg = getPlatformConfig(platform); const Icon = cfg.icon; const iconColor = readableColor(cfg.color, surfaceSoft, readableAccent); const iconUrl = getLinkIconUrl(link.url, platform);'
);

source = source.replace(
  'className="group relative flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 active:scale-[0.98]"',
  'className="group relative flex items-center gap-3 w-full px-3.5 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] active:scale-[0.98] overflow-hidden"'
);

source = source.replace(
  'style={{ backgroundColor: `color-mix(in oklab, ${surfaceSoft} 92%, transparent)`, color: primaryText, border: `1px solid color-mix(in oklab, ${readableAccent} 22%, transparent)`, borderRadius: `${Math.max(10, profile.card_radius - 8)}px`, boxShadow: `0 8px 22px color-mix(in oklab, ${accent} 15%, transparent)` }}',
  'style={{ backgroundColor: `color-mix(in oklab, ${surfaceSoft} 84%, transparent)`, color: primaryText, border: `1px solid color-mix(in oklab, ${readableAccent} 26%, transparent)`, borderRadius: `${Math.max(12, profile.card_radius - 8)}px`, boxShadow: `0 10px 26px color-mix(in oklab, ${accent} 16%, transparent), inset 0 1px 0 rgba(255,255,255,.07)`, backdropFilter: `blur(${Math.max(8, profile.card_blur / 2)}px) saturate(155%)` }}'
);

source = source.replace(
  '<span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg" style={{ backgroundColor: `color-mix(in oklab, ${readableAccent} 13%, transparent)`, color: iconColor }}><Icon className="h-4 w-4" style={{ color: iconColor }} /></span>',
  '<span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl border overflow-hidden" style={{ backgroundColor: `color-mix(in oklab, ${iconColor} 10%, transparent)`, borderColor: `color-mix(in oklab, ${iconColor} 30%, transparent)`, color: iconColor, boxShadow: `0 0 18px color-mix(in oklab, ${iconColor} 22%, transparent)` }}>{iconUrl ? <img src={iconUrl} alt="" className="h-5 w-5 object-contain transition-transform duration-300 group-hover:scale-110" onError={(e) => { e.currentTarget.style.display = "none"; }} /> : <Icon className="h-5 w-5" style={{ color: iconColor }} />}<span className="pointer-events-none absolute inset-0 rounded-xl bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" /></span>'
);

fs.writeFileSync(file, source, "utf8");
console.log("Spider Wensors profile URL/app-icon enhancement applied");
