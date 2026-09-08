const fs = require("fs");
let code = fs.readFileSync("src/components/ProfileView.tsx", "utf8");

const regex = /<img[\s\n]*src=\{soc\.icon_url\}[\s\n]*alt=\{label\}/;

const toInsert = `<img
            src={resolvedBgValue}
            alt="Background"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : profile.background_type === "color" && resolvedBgValue ? (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: resolvedBgValue }}
          />
        ) : null}
      </div>

      <div className="relative z-10 flex min-h-full flex-col items-center justify-start p-4 sm:p-8">
        <div
          className="w-full max-w-[480px] animate-float-in pb-16"
          style={{
            backgroundColor: \`rgba(255, 255, 255, \${profile.card_opacity / 100 * 0.1})\`,
            backdropFilter: \`blur(\${profile.card_blur}px)\`,
            borderRadius: \`\${profile.card_radius}px\`,
            border: "1px solid color-mix(in oklab, white 20%, transparent)"
          }}
        >
          <div className="flex flex-col items-center p-6 text-center">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name || profile.username || "Avatar"}
                className="mb-4 h-24 w-24 rounded-full object-cover shadow-md"
              />
            ) : (
              <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/20 text-3xl text-primary shadow-md">
                {(profile.display_name || profile.username || "?").charAt(0).toUpperCase()}
              </div>
            )}
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              {profile.display_name || \`@\${profile.username}\`}
            </h1>
            {profile.bio && (
              <p className="mt-2 text-sm text-foreground/90 whitespace-pre-wrap">
                {profile.bio}
              </p>
            )}

            {profile.social_links && profile.social_links.filter((s) => s.active !== false).length > 0 && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                {profile.social_links
                  .filter((s) => s.active !== false)
                  .map((soc) => {
                    const cfg = getPlatformConfig(soc.platform);
                    const Icon = cfg.icon;
                    const safeSocUrl = ensureProtocol(soc.url);
                    const label = soc.title || cfg.label;

                    return (
                      <a
                        key={soc.id}
                        href={preview ? undefined : safeSocUrl || "#"}
                        target={preview ? undefined : "_blank"}
                        rel={preview ? undefined : "noreferrer noopener"}
                        onClick={(e) => {
                          if (preview) {
                            e.preventDefault();
                            toast.info(\`Preview: \${label} link\`);
                          }
                        }}
                        className={\`group relative flex h-9 w-9 items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95 shadow-sm overflow-hidden \${
                          soc.icon_url
                            ? "border-transparent"
                            : "border border-glass-border"
                        }\`}
                        style={{
                          backgroundColor: soc.remove_bg || soc.icon_url
                            ? "transparent"
                            : "color-mix(in oklab, white 68%, transparent)",
                          backdropFilter: soc.remove_bg || soc.icon_url
                            ? "none"
                            : \`blur(\${Math.max(6, profile.card_blur / 2)}px)\`,
                        }}
                        title={label}
                        aria-label={label}
                      >
                        {soc.icon_url ? (
                          <img
                            src={soc.icon_url}
                            alt={label}`;

code = code.replace(regex, toInsert);

fs.writeFileSync("src/components/ProfileView.tsx", code);
