import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const file = path.join(root, "src/components/ProfileView.tsx");
let source = fs.readFileSync(file, "utf8");

source = source.replace(
  'import { getPlatformConfig } from "@/lib/socials";',
  'import { getPlatformConfig, getPlatformIconUrl, detectPlatformFromUrl } from "@/lib/socials";'
);

const helperMarker = 'function hexToRgb(hex: string) {';
if (!source.includes("function getLinkIconUrl(")) {
  const helper = `function getLinkIconUrl(url: string, platform: string) {
  const known = getPlatformIconUrl(platform);
  if (known) return known;
  try {
    const host = new URL(ensureProtocol(url)).hostname.replace(/^www\\./, "");
    return host ? \`https://www.google.com/s2/favicons?domain=\${encodeURIComponent(host)}&sz=64\` : undefined;
  } catch { return undefined; }
}

`;
  source = source.replace(helperMarker, helper + helperMarker);
}

const oldLink = `          {links.map((link) => {
            const safeUrl = ensureProtocol(link.url); const platform = getDomainPlatform(link.url); const cfg = getPlatformConfig(platform); const Icon = cfg.icon; const iconColor = readableColor(cfg.color, surfaceSoft, readableAccent);
            return <a key={link.id} href={preview ? undefined : safeUrl || "#"} target={preview ? undefined : "_blank"} rel={preview ? undefined : "noreferrer noopener"} onClick={(e) => { if (preview) e.preventDefault(); else onLinkClick?.(link); }} className="group relative flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 active:scale-[0.98]" style={{ backgroundColor: \`color-mix(in oklab, \${surfaceSoft} 92%, transparent)\`, color: primaryText, border: \`1px solid color-mix(in oklab, \${readableAccent} 22%, transparent)\`, borderRadius: \`\${Math.max(10, profile.card_radius - 8)}px\`, boxShadow: \`0 8px 22px color-mix(in oklab, \${accent} 15%, transparent)\` }}>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg" style={{ backgroundColor: \`color-mix(in oklab, \${readableAccent} 13%, transparent)\`, color: iconColor }}><Icon className="h-4 w-4" style={{ color: iconColor }} /></span>
              <span className="min-w-0 flex-1 truncate pr-2 text-left">{link.title}</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" style={{ color: secondaryText }} />
            </a>;
          })}`;

const newLink = `          {links.map((link) => {
            const safeUrl = ensureProtocol(link.url); const platform = detectPlatformFromUrl(link.url); const cfg = getPlatformConfig(platform); const Icon = cfg.icon; const iconColor = readableColor(cfg.color, surfaceSoft, readableAccent); const iconUrl = getLinkIconUrl(link.url, platform);
            let hostname = ""; try { hostname = new URL(safeUrl).hostname.replace(/^www\\./, ""); } catch {}
            return <a key={link.id} href={preview ? undefined : safeUrl || "#"} target={preview ? undefined : "_blank"} rel={preview ? undefined : "noreferrer noopener"} onClick={(e) => { if (preview) e.preventDefault(); else onLinkClick?.(link); }} className="group relative flex items-center gap-3 w-full overflow-hidden px-3.5 py-3.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.985]" style={{ background: \`linear-gradient(135deg, color-mix(in oklab, \${surfaceSoft} 94%, transparent), color-mix(in oklab, \${accent} 7%, transparent))\`, color: primaryText, border: \`1px solid color-mix(in oklab, \${readableAccent} 24%, transparent)\`, borderRadius: \`\${Math.max(12, profile.card_radius - 7)}px\`, boxShadow: \`0 8px 24px color-mix(in oklab, \${accent} 13%, transparent), inset 0 1px 0 rgba(255,255,255,.06)\` }}>
              <span className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl border" style={{ backgroundColor: \`color-mix(in oklab, \${readableAccent} 10%, transparent)\`, borderColor: \`color-mix(in oklab, \${iconColor} 28%, transparent)\`, boxShadow: \`0 0 18px color-mix(in oklab, \${iconColor} 18%, transparent)\` }}>
                {iconUrl ? <img src={iconUrl} alt="" className="h-5 w-5 object-contain transition-transform duration-300 group-hover:scale-110" onError={(e) => { e.currentTarget.style.display = "none"; }} /> : <Icon className="h-5 w-5" style={{ color: iconColor }} />}
              </span>
              <span className="min-w-0 flex-1 text-left"><span className="block truncate">{link.title}</span>{hostname && <span className="mt-0.5 block truncate text-[10px] font-medium opacity-45">{hostname}</span>}</span>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full opacity-50 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" style={{ backgroundColor: \`color-mix(in oklab, \${readableAccent} 8%, transparent)\` }}><ExternalLink className="h-3.5 w-3.5" style={{ color: secondaryText }} /></span>
            </a>;
          })}`;

if (source.includes(oldLink)) source = source.replace(oldLink, newLink);

const oldSocial = `const cfg = getPlatformConfig(soc.platform); const Icon = cfg.icon; const safeSocUrl = ensureProtocol(soc.url); const label = soc.title || cfg.label;`;
const newSocial = `const cfg = getPlatformConfig(soc.platform); const Icon = cfg.icon; const safeSocUrl = ensureProtocol(soc.url); const label = soc.title || cfg.label; const brandIconUrl = getPlatformIconUrl(soc.platform);`;
source = source.replace(oldSocial, newSocial);
source = source.replace(
  /\{soc\.icon_url \? <img src=\{soc\.icon_url\} alt=\{label\} className="h-full w-full object-cover transition-transform group-hover:scale-110" \/> : <Icon className="h-4 w-4 transition-colors" style=\{\{ color: iconColor \}\} \/>\}/,
  '{soc.icon_url || brandIconUrl ? <img src={soc.icon_url || brandIconUrl} alt={label} className="h-4.5 w-4.5 object-contain transition-transform group-hover:scale-110" /> : <Icon className="h-4 w-4 transition-colors" style={{ color: iconColor }} />}'
);

fs.writeFileSync(file, source, "utf8");
console.log("Spider Wensors profile UI enhancements applied");
