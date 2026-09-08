const fs = require("fs");
let code = fs.readFileSync("src/components/ProfileView.tsx", "utf8");

const styleRegex =
  /backgroundColor: soc\.icon_url[\s\S]*?\? "transparent"[\s\S]*?: "color-mix\(in oklab, white 68%, transparent\)",[\s\S]*?backdropFilter: soc\.icon_url[\s\S]*?\? "none"[\s\S]*?: \`blur\(\\\$\{Math\.max\(6, profile\.card_blur \/ 2\)\\}px\)\`,/m;

const newStyle = `backgroundColor: soc.remove_bg || soc.icon_url
                            ? "transparent"
                            : "color-mix(in oklab, white 68%, transparent)",
                          backdropFilter: soc.remove_bg || soc.icon_url
                            ? "none"
                            : \`blur(\${Math.max(6, profile.card_blur / 2)}px)\`,`;

code = code.replace(styleRegex, newStyle);

const imgRegex =
  /<img[\s\S]*?src=\{soc\.icon_url\}[\s\S]*?alt=\{label\}[\s\S]*?className="h-full w-full object-cover transition-transform group-hover:scale-110"[\s\S]*?\/>/m;

const newImg = `<img
                            src={soc.icon_url}
                            alt={label}
                            className={\`h-full w-full object-cover transition-transform group-hover:scale-110 \${soc.full_cover ? 'rounded-full scale-110' : 'p-[6px]'}\`}
                          />`;

code = code.replace(imgRegex, newImg);

fs.writeFileSync("src/components/ProfileView.tsx", code);
