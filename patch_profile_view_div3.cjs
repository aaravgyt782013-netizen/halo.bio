const fs = require("fs");
let code = fs.readFileSync("src/components/ProfileView.tsx", "utf8");

code = code.replace(
  /(\}\s*\)\s*\}[\s\n]*)<div className="mt-5 space-y-2\.5">/m,
  '$1  </div>\n          <div className="mt-5 space-y-2.5">',
);

fs.writeFileSync("src/components/ProfileView.tsx", code);
