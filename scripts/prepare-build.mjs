import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const write = (p, s) => fs.writeFileSync(path.join(root, p), s, "utf8");

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
    patch({
      profile_layout: presentation,
      accent_color: preset.accent,
      card_opacity: preset.opacity,
      card_blur: preset.blur,
      card_radius: preset.radius,
    } as any);
    toast.success(presentation === "background" ? "Background Typewriter mode enabled!" : \`Applied \${preset.name} card theme!\`);
  };`,
);

// The editor's explicit save payload must include the presentation setting.
dashboard = dashboard.replace(
  '          enter_text: profile.enter_text,',
  '          enter_text: profile.enter_text,\n          profile_layout: (profile as any).profile_layout || "card",',
);
write(dashboardPath, dashboard);

const profileViewPath = "src/components/ProfileView.tsx";
let profileView = read(profileViewPath);
const oldLight = '  const isLightTheme = profile.background_type === "color" && luminance(themeBackground) > 0.58;';
const newLight = `  const themeSignature = [String(profile.accent_color || "").toLowerCase(), Number(profile.card_opacity || 0).toFixed(2), String(profile.card_blur ?? ""), String(profile.card_radius ?? "")].join("|");
  const isLightTheme = new Set(["#2563eb|0.86|18|24", "#dc2626|0.90|14|20", "#334155|0.84|18|22"]).has(themeSignature);`;
if (profileView.includes(oldLight)) profileView = profileView.replace(oldLight, newLight);

if (!profileView.includes("SPIDER_BACKGROUND_PRESENTATION")) {
  const marker = '  const badges = extractBadges(profile.social_links);';
  const injected = `${marker}\n  const isBackgroundMode = (profile as any).profile_layout === "background";\n  const typewriterText = [profile.display_name || profile.username || "", profile.username ? \`@\${profile.username}\` : "", profile.bio || ""].filter(Boolean).join("\\n");\n  const [typedLength, setTypedLength] = useState(isBackgroundMode ? 0 : typewriterText.length);\n  useEffect(() => {\n    if (!isBackgroundMode) { setTypedLength(typewriterText.length); return; }\n    setTypedLength(0);\n    const timer = window.setInterval(() => setTypedLength((n) => Math.min(n + 1, typewriterText.length)), 38);\n    return () => window.clearInterval(timer);\n  }, [isBackgroundMode, typewriterText]);\n  const typedText = typewriterText.slice(0, typedLength);\n  const typingDone = typedLength >= typewriterText.length;\n  const [typedName, typedHandle, typedBio] = typedText.split("\\n");\n  const backgroundPresentation = isBackgroundMode ? <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-y-auto px-5 py-12 text-center">\n    <div className="pointer-events-auto w-full max-w-xl rounded-3xl px-5 py-8" style={{ color: primaryText, textShadow: isLightTheme ? "0 2px 14px rgba(255,255,255,.75)" : "0 2px 18px rgba(0,0,0,.65)" }}>\n      {profile.avatar_url && <img src={profile.avatar_url} alt="" className="mx-auto mb-5 h-20 w-20 rounded-full object-cover" style={{ border: \`2px solid color-mix(in oklab, \${readableAccent} 70%, transparent)\`, boxShadow: \`0 0 32px color-mix(in oklab, \${accent} 25%, transparent)\` }} />}\n      <h1 className="font-display text-3xl font-black tracking-tight sm:text-5xl" style={{ color: primaryText }}>{typedName}<span className="animate-pulse">{typedLength < typewriterText.length ? "|" : ""}</span></h1>\n      {typedHandle && <p className="mt-1 text-sm font-semibold opacity-75">{typedHandle}</p>}\n      {typedBio && <p className="mx-auto mt-4 max-w-lg whitespace-pre-line text-sm leading-7 opacity-90 sm:text-base">{typedBio}</p>}\n      {typingDone && <div className="mt-6 animate-float-in">\n        {badges.length > 0 && <ProfileBadges badges={badges} />}\n        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">\n          {(profile.social_links || []).filter((s) => s.active !== false && !s.platform.startsWith("__spider_")).map((soc) => { const cfg = getPlatformConfig(soc.platform); const Icon = cfg.icon; return <a key={soc.id} href={ensureProtocol(soc.url)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold backdrop-blur-md transition-transform hover:scale-105" style={{ borderColor: \`color-mix(in oklab, \${readableAccent} 35%, transparent)\`, backgroundColor: isLightTheme ? "rgba(255,255,255,.60)" : "rgba(0,0,0,.28)", color: primaryText }}><Icon className="h-3.5 w-3.5" />{soc.title || cfg.label}</a>; })}\n        </div>\n        <div className="mx-auto mt-3 grid w-full max-w-md gap-2">\n          {links.map((link) => <a key={link.id} href={ensureProtocol(link.url)} target="_blank" rel="noreferrer" onClick={() => onLinkClick?.(link)} className="block rounded-2xl border px-4 py-3 text-sm font-semibold backdrop-blur-md transition-all hover:scale-[1.02]" style={{ borderColor: \`color-mix(in oklab, \${readableAccent} 32%, transparent)\`, backgroundColor: isLightTheme ? "rgba(255,255,255,.68)" : "rgba(0,0,0,.30)", color: primaryText }}>{link.title}</a>)}\n        </div>\n      </div>}\n    </div>\n  </div> : null;\n  /* SPIDER_BACKGROUND_PRESENTATION */`;
  profileView = profileView.replace(marker, injected);
  const cardStart = '<div className="w-full max-w-sm p-6 text-center shadow-glass relative" style={cardStyle}>';
  if (profileView.includes(cardStart)) profileView = profileView.replace(cardStart, '<div style={{ display: isBackgroundMode ? "none" : "block" }}>' + cardStart);
  const closing = '\n      </div>\n    </div>\n\n    {!preview';
  if (profileView.includes(closing)) profileView = profileView.replace(closing, '\n      </div>\n      </div>\n    </div>\n\n    {backgroundPresentation}\n\n    {!preview');
}
write(profileViewPath, profileView);

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

console.log("Spider Wensors build preparation complete");
