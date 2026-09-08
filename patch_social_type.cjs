const fs = require("fs");
let code = fs.readFileSync("src/lib/bio.ts", "utf8");

const regex = /export type SocialLink = \{[\s\S]*?\n\};/m;
const replacement = `export type SocialLink = {
  id: string;
  platform: string;
  url: string;
  title?: string;
  icon_url?: string;
  active?: boolean;
  full_cover?: boolean;
  remove_bg?: boolean;
};`;

code = code.replace(regex, replacement);
fs.writeFileSync("src/lib/bio.ts", code);
