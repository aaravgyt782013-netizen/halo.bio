const fs = require("fs");
let code = fs.readFileSync("src/server/storage.ts", "utf8");

// Remove fs and path imports
code = code.replace(/import path from "node:path";/g, "");
code = code.replace(/import fs from "node:fs";/g, "");

// Replace the try/catch reading block with a direct import
code = code.replace(
  /let firebaseConfig;[\s\S]*?console\.warn\("Could not load firebase-applet-config\.json", e\);\n\}/,
  `import firebaseConfig from "../../firebase-applet-config.json";`,
);

fs.writeFileSync("src/server/storage.ts", code);
